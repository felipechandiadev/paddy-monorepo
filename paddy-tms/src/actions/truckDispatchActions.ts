'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import type { CreateTruckWithGrossWeightPayload, TruckReceptionProducerRef } from '@/actions/truckReceptionActions';
import type { LogisticsProductCode } from '@/lib/logisticsProduct';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/** Misma forma que recepción; persiste en `truck_dispatches`. */
export interface TruckDispatch {
  id: number;
  numero_turno: number | null;
  status: 'ESPERA' | 'FINISHED';
  producer_id: number;
  product?: LogisticsProductCode;
  producer?: TruckReceptionProducerRef;
  license_plate: string;
  driver_name?: string | null;
  carrier_company?: string;
  dispatch_guide?: string;
  gross_weight?: number;
  tare_weight?: number;
  net_weight?: number;
  entry_at: Date;
  finished_at?: Date;
  created_by?: string;
}

export interface RegisterDispatchTarePayload {
  truck_dispatch_id: number;
  tare_weight: number;
  status: 'FINISHED';
  created_by?: string;
}

export async function createTruckDispatchAction(
  payload: CreateTruckWithGrossWeightPayload,
): Promise<TruckDispatch> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/logistics/truck-dispatches/with-gross-weight`, {
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
      // ignore
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.data as TruckDispatch;
}

export async function recordDispatchTareWeightAction(
  payload: RegisterDispatchTarePayload,
): Promise<TruckDispatch> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error('No autenticado');
  }

  const body = {
    truck_dispatch_id: payload.truck_dispatch_id,
    tare_weight: payload.tare_weight,
    status: 'FINISHED' as const,
    created_by: payload.created_by,
  };

  const response = await fetch(`${API_URL}/logistics/weighings/dispatch-tare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.data as TruckDispatch;
}
