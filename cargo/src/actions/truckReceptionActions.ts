'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { formatChileanRut } from '@/lib/formatChileanRut';
import type { LogisticsProductCode } from '@/lib/logisticsProduct';
import { RECEPTION_TURNO_MAX, RECEPTION_TURNO_MIN } from '@/lib/receptionTurno';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface CreateTruckWithGrossWeightPayload {
  producer_id: number;
  license_plate: string;
  driver_name?: string;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string;
  gross_weight: number;
  /** Si se envía, menor que bruto; la recepción queda finalizada con neto calculado. */
  tare_weight?: number;
  /** Obligatorio en POST `/logistics/truck-receptions/with-gross-weight` (validación API). */
  product: LogisticsProductCode;
  /** Opcional en alta; asignar después vía tablero o PUT. Si se envía, 1–100 y libre en ESPERA. */
  numero_turno?: number;
  created_by?: string;
}

export interface RegisterTareWeightPayload {
  truck_reception_id: number;
  tare_weight: number;
  /** Requerido por la API (`RegisterWeighingDto`). */
  status: 'FINISHED';
  created_by?: string;
}

/** Productor embebido cuando el backend devuelve la relación (p. ej. turnos hoy, tara). */
export interface TruckReceptionProducerRef {
  id?: number;
  rut: string;
  name: string;
}

export interface TruckReception {
  id: number;
  numero_turno: number | null;
  status: 'ESPERA' | 'FINISHED';
  producer_id: number;
  product?: LogisticsProductCode;
  /** Presente cuando la API incluye `relations: ['producer']`. */
  producer?: TruckReceptionProducerRef;
  license_plate: string;
  driver_name?: string | null;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string | null;
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
      body: JSON.stringify({
        truck_reception_id: payload.truck_reception_id,
        tare_weight: payload.tare_weight,
        status: payload.status ?? 'FINISHED',
        created_by: payload.created_by,
      }),
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
  product?: string;
  producer_id?: number;
  numero_turno?: number | null;
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

export interface UpdateTruckReceptionPayload {
  numero_turno?: number;
  producer_id?: number;
  license_plate?: string;
  driver_name?: string | null;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string | null;
  gross_weight?: number;
  tare_weight?: number;
  product?: LogisticsProductCode;
}

function parseTruckReceptionApiError(
  payload: unknown,
  fallback: string,
): string {
  const raw = (payload as { message?: unknown })?.message;
  if (typeof raw === 'string') {
    return raw;
  }
  if (Array.isArray(raw)) {
    return raw.join('. ');
  }
  return fallback;
}

/**
 * Listado paginado para el grid del TMS (endpoint autenticado /truck-receptions/grid).
 * Alineado con los query params del DataGrid: search, filters, sort, sortField, limit, offset.
 */
export async function getTruckReceptionsGridAction(params: {
  limit?: number;
  offset?: number;
  search?: string;
  filters?: string;
  sort?: string;
  sortField?: string;
}): Promise<{ rows: TruckReceptionGridRow[]; total: number }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      return { rows: [], total: 0 };
    }

    const limit = Math.min(Math.max(params.limit ?? 25, 1), 500);
    const offset = Math.max(params.offset ?? 0, 0);

    const qs = new URLSearchParams();
    qs.set('limit', String(limit));
    qs.set('offset', String(offset));
    if (params.search?.trim()) {
      qs.set('search', params.search.trim());
    }
    if (params.filters?.trim()) {
      qs.set('filters', params.filters.trim());
    }
    if (params.sort?.trim()) {
      qs.set('sort', params.sort.trim());
    }
    if (params.sortField?.trim()) {
      qs.set('sortField', params.sortField.trim());
    }

    const response = await fetch(
      `${API_URL}/logistics/truck-receptions/grid?${qs.toString()}`,
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
        product: r.product != null ? String(r.product) : undefined,
        producer_id:
          r.producer_id != null ? Number(r.producer_id) : undefined,
        numero_turno:
          r.numero_turno != null && !Number.isNaN(Number(r.numero_turno))
            ? Number(r.numero_turno)
            : null,
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

export async function updateTruckReceptionAction(
  id: number,
  payload: UpdateTruckReceptionPayload,
): Promise<TruckReception> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const body = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const responsePayload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        parseTruckReceptionApiError(
          responsePayload,
          `HTTP ${response.status}: ${response.statusText}`,
        ),
      );
    }

    return responsePayload.data as TruckReception;
  } catch (error) {
    console.error('Error actualizando recepción:', error);
    throw error;
  }
}

export async function updateTruckTurnoAction(
  id: number,
  numeroTurno: number,
): Promise<TruckReception> {
  const slot = Math.round(Number(numeroTurno));
  if (
    !Number.isFinite(slot) ||
    slot < RECEPTION_TURNO_MIN ||
    slot > RECEPTION_TURNO_MAX
  ) {
    throw new Error(
      `Turno inválido: debe ser un entero entre ${RECEPTION_TURNO_MIN} y ${RECEPTION_TURNO_MAX}`,
    );
  }
  return updateTruckReceptionAction(id, { numero_turno: slot });
}

export async function deleteTruckReceptionAction(id: number): Promise<void> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const responsePayload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        parseTruckReceptionApiError(
          responsePayload,
          `HTTP ${response.status}: ${response.statusText}`,
        ),
      );
    }
  } catch (error) {
    console.error('Error eliminando recepción:', error);
    throw error;
  }
}
