'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import type { LogisticsProductCode } from '@/lib/logisticsProduct';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface TruckDispatchProducerRef {
  id?: number;
  rut: string;
  name: string;
}

export interface TruckDispatch {
  id: number;
  numero_turno: number | null;
  status: 'ESPERA' | 'FINISHED';
  producer_id: number;
  product?: LogisticsProductCode;
  producer?: TruckDispatchProducerRef;
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

export interface CreateTruckDispatchWithTarePayload {
  producer_id: number;
  license_plate: string;
  driver_name?: string;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string;
  tare_weight: number;
  product: LogisticsProductCode;
  created_by?: string;
}

export interface RegisterDispatchGrossWeightPayload {
  truck_dispatch_id: number;
  gross_weight: number;
  status?: 'FINISHED';
  created_by?: string;
}

function parseDispatchFromApi(raw: Record<string, unknown>): TruckDispatch {
  const producer = raw.producer as TruckDispatchProducerRef | undefined;
  const st = String(raw.status ?? '').trim().toUpperCase();
  const status: TruckDispatch['status'] = st === 'FINISHED' ? 'FINISHED' : 'ESPERA';
  const product = raw.product != null ? String(raw.product) : undefined;
  const p =
    product === 'CASCARILLA' || product === 'ARROZ_PADDY'
      ? (product as LogisticsProductCode)
      : undefined;

  return {
    id: Number(raw.id),
    numero_turno:
      raw.numero_turno != null && !Number.isNaN(Number(raw.numero_turno))
        ? Number(raw.numero_turno)
        : null,
    status,
    producer_id: Number(raw.producer_id ?? 0),
    product: p,
    producer,
    license_plate: String(raw.license_plate ?? ''),
    driver_name: raw.driver_name != null ? String(raw.driver_name) : null,
    carrier_company:
      raw.carrier_company != null ? String(raw.carrier_company) : undefined,
    dispatch_guide:
      raw.dispatch_guide != null ? String(raw.dispatch_guide) : undefined,
    notes: raw.notes != null ? String(raw.notes) : null,
    gross_weight:
      raw.gross_weight != null ? Number(raw.gross_weight) : undefined,
    tare_weight: raw.tare_weight != null ? Number(raw.tare_weight) : undefined,
    net_weight: raw.net_weight != null ? Number(raw.net_weight) : undefined,
    entry_at: new Date(String(raw.entry_at ?? Date.now())),
    finished_at: raw.finished_at ? new Date(String(raw.finished_at)) : undefined,
    created_by: raw.created_by != null ? String(raw.created_by) : undefined,
  };
}

/** Cola de pesaje: ESPERA con tara y sin bruto (hoy). */
export async function getDispatchesWeighingQueueTodayAction(): Promise<
  TruckDispatch[]
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      return [];
    }

    const response = await fetch(`${API_URL}/logistics/turnos/dispatches/today`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const dataArray = (result.data || []) as Record<string, unknown>[];
    return dataArray.map(parseDispatchFromApi);
  } catch (error) {
    console.error('Error obteniendo cola despacho:', error);
    return [];
  }
}

export async function createTruckDispatchWithTareAction(
  payload: CreateTruckDispatchWithTarePayload,
): Promise<TruckDispatch> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/logistics/truck-dispatches/with-tare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify({
      producer_id: payload.producer_id,
      license_plate: payload.license_plate,
      driver_name: payload.driver_name,
      carrier_company: payload.carrier_company,
      dispatch_guide: payload.dispatch_guide,
      notes: payload.notes,
      tare_weight: payload.tare_weight,
      product: payload.product,
      created_by: payload.created_by,
    }),
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (typeof err?.message === 'string') msg = err.message;
      else if (Array.isArray(err?.message)) msg = err.message.join('. ');
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const result = await response.json();
  return parseDispatchFromApi(result.data as Record<string, unknown>);
}

export async function registerDispatchGrossWeightAction(
  payload: RegisterDispatchGrossWeightPayload,
): Promise<TruckDispatch> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/logistics/weighings/dispatch-gross`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify({
      truck_dispatch_id: payload.truck_dispatch_id,
      gross_weight: payload.gross_weight,
      status: payload.status ?? 'FINISHED',
      created_by: payload.created_by,
    }),
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (typeof err?.message === 'string') msg = err.message;
      else if (Array.isArray(err?.message)) msg = err.message.join('. ');
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const result = await response.json();
  return parseDispatchFromApi(result.data as Record<string, unknown>);
}

export interface UpdateTruckDispatchPayload {
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

export async function getTruckDispatchByIdAction(id: number): Promise<TruckDispatch | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_URL}/logistics/truck-dispatches/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return parseDispatchFromApi(result.data as Record<string, unknown>);
  } catch (error) {
    console.error('Error obteniendo despacho:', error);
    return null;
  }
}

export async function updateTruckDispatchAction(
  id: number,
  payload: UpdateTruckDispatchPayload,
): Promise<TruckDispatch> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error('No autenticado');
  }

  const body = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );

  const response = await fetch(`${API_URL}/logistics/truck-dispatches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (typeof err?.message === 'string') msg = err.message;
      else if (Array.isArray(err?.message)) msg = err.message.join('. ');
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const result = await response.json();
  return parseDispatchFromApi(result.data as Record<string, unknown>);
}

export async function deleteTruckDispatchAction(id: number): Promise<void> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/logistics/truck-dispatches/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  const responsePayload = await response.json().catch(() => null);

  if (!response.ok) {
    const raw = (responsePayload as { message?: unknown })?.message;
    const msg =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw.join('. ')
          : `HTTP ${response.status}`;
    throw new Error(msg);
  }
}

export interface TruckDispatchGridRow {
  id: number;
  status: string;
  product?: string;
  producer_id?: number;
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

export async function getTruckDispatchesGridAction(params: {
  limit?: number;
  offset?: number;
  search?: string;
  filters?: string;
  sort?: string;
  sortField?: string;
}): Promise<{ rows: TruckDispatchGridRow[]; total: number }> {
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
      `${API_URL}/logistics/truck-dispatches/grid?${qs.toString()}`,
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

    const rows: TruckDispatchGridRow[] = raw.map((r) => {
      const producer = r.producer as { name?: string; rut?: string } | undefined;
      return {
        id: Number(r.id),
        status: String(r.status ?? ''),
        product: r.product != null ? String(r.product) : undefined,
        producer_id:
          r.producer_id != null ? Number(r.producer_id) : undefined,
        license_plate: String(r.license_plate ?? ''),
        driver_name: String(r.driver_name ?? ''),
        carrier_company:
          r.carrier_company != null ? String(r.carrier_company) : null,
        dispatch_guide:
          r.dispatch_guide != null ? String(r.dispatch_guide) : null,
        gross_weight: r.gross_weight as string | number | null,
        tare_weight: r.tare_weight as string | number | null,
        net_weight: r.net_weight as string | number | null,
        entry_at: String(r.entry_at ?? ''),
        finished_at: r.finished_at != null ? String(r.finished_at) : null,
        producer_name: producer?.name ?? '',
        producer_rut: producer?.rut ?? '',
      };
    });

    return { rows, total };
  } catch (error) {
    console.error('Error grid despachos:', error);
    return { rows: [], total: 0 };
  }
}
