'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

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

/**
 * Server action para crear recepción con peso bruto
 */
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
        // Si no se puede parsear el error, usar el mensaje genérico
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data as TruckReception;
  } catch (error) {
    console.error('Error creando recepción:', error);
    throw error;
  }
}

/**
 * Server action para registrar peso tara
 */
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data as TruckReception;
  } catch (error) {
    console.error('Error registrando peso tara:', error);
    throw error;
  }
}

/**
 * Server action para obtener próximo turno
 */
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

/**
 * Server action para obtener turnos de hoy
 */
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

    // El backend devuelve: { success: true, data: { data: [], success: true, total: 0 } }
    // Necesitamos extraer el array correcto
    let dataArray: TruckReception[] = [];

    if (Array.isArray(result.data)) {
      // Si result.data es directamente un array
      dataArray = result.data as TruckReception[];
    } else if (result.data && Array.isArray(result.data.data)) {
      // Si result.data es un objeto con un campo 'data' que es un array
      dataArray = result.data.data as TruckReception[];
    } else if (result.data && result.data.length !== undefined) {
      // Si result.data tiene alguna estructura especial
      console.warn('Estructura de respuesta especial:', result);
    }

    return dataArray;
  } catch (error) {
    console.error('Error obteniendo turnos:', error);
    return [];
  }
}

/**
 * Server action para obtener recepción por ID
 */
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
    console.error('Error obteniendo recepción:', error);
    return null;
  }
}
