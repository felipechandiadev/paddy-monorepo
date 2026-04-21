import { Truck, TruckReception } from '../types/logistics.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const fetchTrucks = async (): Promise<Truck[]> => {
  const response = await fetch(`${API_URL}/trucks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trucks: ${response.statusText}`);
  }

  return response.json();
};

export const fetchTruckById = async (id: string): Promise<Truck> => {
  const response = await fetch(`${API_URL}/trucks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch truck: ${response.statusText}`);
  }

  return response.json();
};

export const fetchReceptions = async (): Promise<TruckReception[]> => {
  const response = await fetch(`${API_URL}/receptions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch receptions: ${response.statusText}`);
  }

  return response.json();
};

export const createTruckRequest = async (truck: Partial<Truck>): Promise<Truck> => {
  const response = await fetch(`${API_URL}/trucks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(truck),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to create truck: ${response.statusText}`);
  }

  return response.json();
};

export const updateTruckRequest = async (id: string, truck: Partial<Truck>): Promise<Truck> => {
  const response = await fetch(`${API_URL}/trucks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(truck),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to update truck: ${response.statusText}`);
  }

  return response.json();
};
