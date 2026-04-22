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
    
    console.log('Response from createTruckReceptionAction:', result);
    
    const truckData: TruckReception = result.data;
    
    if (!truckData.numero_turno) {
      console.warn('Warning: numero_turno no definido en respuesta:', truckData);
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
    
    console.log('Response from getTurnosTodayAction:', result);

    // El backend ahora retorna: { success, data: [...], timestamp }
    // Donde data es directamente el array de turnos
    const dataArray = (result.data || []) as TruckReception[];

    console.log('Extracted turnos:', dataArray);
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
