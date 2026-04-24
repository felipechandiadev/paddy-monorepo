'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/producers`;

export interface CreateProducerPayload {
  rut: string;
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  contactPerson: string;
  isActive?: boolean;
  bankAccounts?: unknown[];
}

export interface CreatedProducer {
  id: number;
  rut: string;
  name: string;
  address?: string;
  city?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  isActive?: boolean;
}

function extractBackendErrorMessage(errorData: unknown, fallback: string): string {
  const parseMessage = (value: unknown): string | null => {
    if (Array.isArray(value)) {
      const parsed = value
        .map((entry) => {
          if (typeof entry === 'string') return entry;
          if (entry && typeof entry === 'object' && 'message' in entry) {
            const nested = (entry as { message?: unknown }).message;
            return typeof nested === 'string' ? nested : String(nested);
          }
          return String(entry);
        })
        .filter((entry) => entry.trim().length > 0);
      return parsed.length > 0 ? parsed.join(', ') : null;
    }
    if (typeof value === 'string' && value.trim().length > 0) return value;
    return null;
  };

  if (!errorData || typeof errorData !== 'object') return fallback;
  const e = errorData as Record<string, unknown>;
  return (
    parseMessage(e.message) ||
    parseMessage((e.data as Record<string, unknown>)?.message) ||
    parseMessage(e.error) ||
    fallback
  );
}

export async function createProducerAction(
  data: CreateProducerPayload,
): Promise<{ success: boolean; data?: CreatedProducer; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    if (!token) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = extractBackendErrorMessage(
        errorData,
        `Error al crear productor (${response.status})`,
      );
      return { success: false, error: errorMessage };
    }

    const responseData = await response.json();
    const producerData = responseData.data ?? responseData;
    const id =
      typeof producerData.id === 'string' ? parseInt(producerData.id, 10) : Number(producerData.id);

    const normalized: CreatedProducer = {
      id,
      rut: String(producerData.rut ?? ''),
      name: String(producerData.name ?? ''),
      address: producerData.address != null ? String(producerData.address) : undefined,
      city: producerData.city != null ? String(producerData.city) : undefined,
      email: producerData.email != null ? String(producerData.email) : undefined,
      phone: producerData.phone != null ? String(producerData.phone) : undefined,
      contactPerson:
        producerData.contactPerson != null ? String(producerData.contactPerson) : undefined,
      isActive: Boolean(producerData.isActive),
    };

    return { success: true, data: normalized };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}
