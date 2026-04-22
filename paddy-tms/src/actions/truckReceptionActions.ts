'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { formatChileanRut } from '@/lib/formatChileanRut';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface CreateTruckWithGrossWeightPayload {
  producer_id: number;
  license_plate: string;
  driver_name: string;
  carrier_company?: string;
  dispatch_guide?: string;
  gross_weight: number;
  created_by?: string;
}

export interface RegisterTareWeightPayload {
  truck_reception_id: number;
  tare_weight: number;
  status?: 'FINISHED';
  created_by?: string;
}

export interface TruckReception {
  id: number;
  numero_turno: number;
  status: 'ESPERA' | 'FINISHED';
  producer_id: number;
  license_plate: string;
  driver_name: string;
  carrier_company?: string;
  dispatch_guide?: string;
  gross_weight?: number;
  tare_weight?: number;
  net_weight?: number;
  entry_at: Date;
  finished_at?: Date;
  created_by?: string;
}

export async function createTruckReceptionAction(
  payload: CreateTruckWithGrossWeightPayload,
): Promise<TruckReception> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(
      `${API_URL}/logistics/truck-receptions/with-gross-weight`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Si no se puede parsear el error, usar el mensaje generico
      }
      throw new Error(errorMessage);
    }

      const result = await response.json();
    
      const truckData: TruckReception = result.data;
    
      if (!truckData.numero_turno) {
        // numero_turno no definido en respuesta
      }
    
      return truckData;
  } catch (error) {
    console.error('Error creando recepcion:', error);
    throw error;
  }
}

export async function recordTareWeightAction(
  payload: RegisterTareWeightPayload,
): Promise<TruckReception> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/weighings/tare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Si no se puede parsear el error, usar el mensaje generico
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data as TruckReception;
  } catch (error) {
    console.error('Error registrando peso tara:', error);
    throw error;
  }
}

export async function getNextTurnoAction(): Promise<number> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/turnos/next-today`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data.numero_turno;
  } catch (error) {
    console.error('Error obteniendo turno:', error);
    throw error;
  }
}

/** Fila serializable para el DataGrid de recepciones */
export interface TruckReceptionGridRow {
  id: number;
  status: string;
  license_plate: string;
  driver_name: string;
  carrier_company?: string | null;
  dispatch_guide?: string | null;
  gross_weight: string | number | null;
  tare_weight: string | number | null;
  net_weight: string | number | null;
  entry_at: string;
  finished_at?: string | null;
  producer_name: string;
  producer_rut: string;
}

/**
 * Listado paginado para el grid del TMS (endpoint autenticado /truck-receptions/grid).
 */
export async function getTruckReceptionsGridAction(params: {
  limit?: number;
  offset?: number;
}): Promise<{ rows: TruckReceptionGridRow[]; total: number }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      return { rows: [], total: 0 };
    }

    const limit = Math.min(Math.max(params.limit ?? 25, 1), 500);
    const offset = Math.max(params.offset ?? 0, 0);

    const response = await fetch(
      `${API_URL}/logistics/truck-receptions/grid?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return { rows: [], total: 0 };
    }

    const result = await response.json();
    const payload = result.data as { data: unknown[]; total: number } | undefined;
    const raw = (payload?.data ?? []) as Record<string, unknown>[];
    const total = typeof payload?.total === 'number' ? payload.total : raw.length;

    const rows: TruckReceptionGridRow[] = raw.map((r) => {
      const producer = r.producer as { name?: string; rut?: string } | undefined;
      return {
        id: Number(r.id),
        status: String(r.status ?? ''),
        license_plate: String(r.license_plate ?? ''),
        driver_name: String(r.driver_name ?? ''),
        carrier_company: r.carrier_company != null ? String(r.carrier_company) : null,
        dispatch_guide: r.dispatch_guide != null ? String(r.dispatch_guide) : null,
        gross_weight: r.gross_weight as string | number | null,
        tare_weight: r.tare_weight as string | number | null,
        net_weight: r.net_weight as string | number | null,
        entry_at: r.entry_at != null ? String(r.entry_at) : '',
        finished_at: r.finished_at != null ? String(r.finished_at) : null,
        producer_name: producer?.name ?? '',
        producer_rut:
          producer?.rut != null ? formatChileanRut(String(producer.rut)) : '',
      };
    });

    return { rows, total };
  } catch {
    return { rows: [], total: 0 };
  }
}

export async function getTurnosTodayAction(): Promise<TruckReception[]> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      console.warn('No autenticado para obtener turnos');
      return [];
    }

    const response = await fetch(`${API_URL}/logistics/turnos/today`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      console.warn(`Error ${response.status} obteniendo turnos del backend`);
      return [];
    }

    const result = await response.json();
    
    // El backend ahora retorna: { success, data: [...], timestamp }
    // Donde data es directamente el array de turnos
    const dataArray = (result.data || []) as TruckReception[];

    return dataArray;
  } catch (error) {
    console.error('Error obteniendo turnos:', error);
    return [];
  }
}

export async function getTruckReceptionByIdAction(id: number): Promise<TruckReception | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data as TruckReception;
  } catch (error) {
    console.error('Error obteniendo recepcion:', error);
    return null;
  }
}

export async function updateTruckStatusAction(
  id: number,
  status: 'ESPERA' | 'FINISHED',
): Promise<TruckReception> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data as TruckReception;
  } catch (error) {
    console.error('Error actualizando estado del camion:', error);
    throw error;
  }
}

export async function updateTruckTurnoAction(
  id: number,
  numeroTurno: number,
): Promise<TruckReception> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({ numero_turno: numeroTurno }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data as TruckReception;
  } catch (error) {
    console.error('Error actualizando turno del camion:', error);
    throw error;
  }
}
