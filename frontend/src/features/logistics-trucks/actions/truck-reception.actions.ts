'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { getAuditHeaders } from '@/lib/audit-headers';
import type {
  CreateTruckWithGrossWeightPayload,
  TruckReception,
  UpdateTruckReceptionPayload,
} from '../types';

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

function parseTruckReceptionApiError(payload: unknown, fallback: string): string {
  const raw = (payload as { message?: unknown })?.message;
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) return raw.join('. ');
  return fallback;
}

function normalizeTruckReception(raw: TruckReception): TruckReception {
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

export async function createTruckReceptionAction(
  payload: CreateTruckWithGrossWeightPayload,
): Promise<TruckReception> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(
    `${apiBaseUrl()}/logistics/truck-receptions/with-gross-weight`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    let msg = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errBody = await response.json();
      msg = parseTruckReceptionApiError(errBody, msg);
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const result = await response.json();
  return normalizeTruckReception(result.data as TruckReception);
}

export async function getTruckReceptionByIdAction(
  id: number,
): Promise<TruckReception | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${apiBaseUrl()}/logistics/truck-receptions/${id}`, {
      headers: authHeaders(token),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return normalizeTruckReception(result.data as TruckReception);
  } catch {
    return null;
  }
}

export async function updateTruckReceptionAction(
  id: number,
  payload: UpdateTruckReceptionPayload,
): Promise<TruckReception> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  if (!token) {
    throw new Error('No autenticado');
  }

  const body = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );

  const response = await fetch(`${apiBaseUrl()}/logistics/truck-receptions/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
    cache: 'no-store',
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

  return normalizeTruckReception(responsePayload.data as TruckReception);
}

export async function deleteTruckReceptionAction(id: number): Promise<void> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${apiBaseUrl()}/logistics/truck-receptions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    cache: 'no-store',
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
}
