'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { getAuditHeaders } from '@/lib/audit-headers';
import type { TruckDispatch } from '../types';

function apiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ||
    'http://localhost:3000/api/v1'
  );
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    ...getAuditHeaders(),
  };
}

function normalizeTruckDispatch(raw: TruckDispatch): TruckDispatch {
  const finished = raw.finished_at;
  return {
    ...raw,
    entry_at:
      raw.entry_at instanceof Date ? raw.entry_at : new Date(String(raw.entry_at)),
    finished_at:
      finished != null
        ? finished instanceof Date
          ? finished
          : new Date(String(finished))
        : undefined,
  };
}

export async function getTruckDispatchByIdAction(id: number): Promise<TruckDispatch | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${apiBaseUrl()}/logistics/truck-dispatches/${id}`, {
      headers: authHeaders(token),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return normalizeTruckDispatch(result.data as TruckDispatch);
  } catch {
    return null;
  }
}
