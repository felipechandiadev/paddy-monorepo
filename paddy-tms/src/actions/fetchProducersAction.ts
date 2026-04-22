'use server';

import { auth } from '@/auth.config';

export interface ProducerOption {
  id: number;
  name: string;
  rut: string;
  email?: string;
  city?: string;
}

interface FetchProducersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sort?: 'ASC' | 'DESC';
}

interface FetchProducersResult {
  data: ProducerOption[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Server action para cargar productores desde el backend
 * Similar a fetchProducersAction del frontend principal
 */
export async function fetchProducersAction(
  params?: FetchProducersParams,
): Promise<FetchProducersResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No autenticado');
    }

    const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/producers`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (session.user.accessToken) {
      headers['Authorization'] = `Bearer ${session.user.accessToken}`;
    }

    // Fetch desde el backend
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Normalizar datos
    const normalizedData = (result.data || result || []).map((producer: any) => ({
      id: producer.id,
      name: producer.name || '',
      rut: producer.rut || '',
      email: producer.email,
      city: producer.city,
    }));

    // Filtrado en cliente
    let filtered = normalizedData;

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter((p: ProducerOption) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.rut.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower) ||
        p.city?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenamiento
    if (params?.sortField) {
      const field = params.sortField as keyof ProducerOption;
      const isAsc = params.sort === 'ASC';
      filtered.sort((a: ProducerOption, b: ProducerOption) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        const comparison = String(aVal).localeCompare(String(bVal), 'es');
        return isAsc ? comparison : -comparison;
      });
    }

    // Paginación
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
    };
  } catch (error) {
    console.error('Error en fetchProducersAction:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };
  }
}
