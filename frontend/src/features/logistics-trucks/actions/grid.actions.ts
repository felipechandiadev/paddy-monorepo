'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { getAuditHeaders } from '@/lib/audit-headers';
import { formatChileanRut } from '@/shared/utils/chileanRutFormatter';
import type { TruckDispatchGridRow, TruckReceptionGridRow } from '../types';

function apiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ||
    'http://localhost:3000/api/v1';
  return base;
}

export async function fetchTruckReceptionsGrid(params: {
  limit?: number;
  offset?: number;
  search?: string;
  filters?: string;
  sort?: string;
  sortField?: string;
}): Promise<{ rows: TruckReceptionGridRow[]; total: number }> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;
    if (!token) {
      return { rows: [], total: 0 };
    }

    const limit = Math.min(Math.max(params.limit ?? 25, 1), 500);
    const offset = Math.max(params.offset ?? 0, 0);

    const qs = new URLSearchParams();
    qs.set('limit', String(limit));
    qs.set('offset', String(offset));
    if (params.search?.trim()) qs.set('search', params.search.trim());
    if (params.filters?.trim()) qs.set('filters', params.filters.trim());
    if (params.sort?.trim()) qs.set('sort', params.sort.trim());
    if (params.sortField?.trim()) qs.set('sortField', params.sortField.trim());

    const response = await fetch(
      `${apiBaseUrl()}/logistics/truck-receptions/grid?${qs.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...getAuditHeaders(),
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
        producer_id: r.producer_id != null ? Number(r.producer_id) : undefined,
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

export async function fetchTruckDispatchesGrid(params: {
  limit?: number;
  offset?: number;
  search?: string;
  filters?: string;
  sort?: string;
  sortField?: string;
}): Promise<{ rows: TruckDispatchGridRow[]; total: number }> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;
    if (!token) {
      return { rows: [], total: 0 };
    }

    const limit = Math.min(Math.max(params.limit ?? 25, 1), 500);
    const offset = Math.max(params.offset ?? 0, 0);

    const qs = new URLSearchParams();
    qs.set('limit', String(limit));
    qs.set('offset', String(offset));
    if (params.search?.trim()) qs.set('search', params.search.trim());
    if (params.filters?.trim()) qs.set('filters', params.filters.trim());
    if (params.sort?.trim()) qs.set('sort', params.sort.trim());
    if (params.sortField?.trim()) qs.set('sortField', params.sortField.trim());

    const response = await fetch(
      `${apiBaseUrl()}/logistics/truck-dispatches/grid?${qs.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...getAuditHeaders(),
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
        producer_id: r.producer_id != null ? Number(r.producer_id) : undefined,
        license_plate: String(r.license_plate ?? ''),
        driver_name: String(r.driver_name ?? ''),
        carrier_company: r.carrier_company != null ? String(r.carrier_company) : null,
        dispatch_guide: r.dispatch_guide != null ? String(r.dispatch_guide) : null,
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
  } catch {
    return { rows: [], total: 0 };
  }
}
