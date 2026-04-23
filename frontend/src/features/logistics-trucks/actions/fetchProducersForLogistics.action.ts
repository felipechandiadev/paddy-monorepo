'use server';

import { fetchProducers } from '@/features/producers/actions/producers.action';

export interface ProducerOption {
  id: number;
  name: string;
  rut: string;
  email?: string;
  city?: string;
}

export async function fetchProducersForLogisticsAction(): Promise<ProducerOption[]> {
  const result = await fetchProducers({
    page: 1,
    limit: 5000,
    sortField: 'name',
    sort: 'ASC',
  });
  return result.data.map((p) => ({
    id: p.id,
    name: p.name,
    rut: p.rut,
    email: p.email,
    city: p.city,
  }));
}
