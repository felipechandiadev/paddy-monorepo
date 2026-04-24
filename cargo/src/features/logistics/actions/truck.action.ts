'use server';

import { Truck, TruckReception, WeighingData } from '../types/logistics.types';

export async function createTruck(data: Partial<Truck>): Promise<{ success: boolean; truck?: Truck; error?: string }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    const response = await fetch(`${apiUrl}/trucks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: false, error: `Failed to create truck: ${response.statusText}` };
    }

    const truck = await response.json();
    return { success: true, truck };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function registerWeighing(data: WeighingData): Promise<{ success: boolean; reception?: TruckReception; error?: string }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    const response = await fetch(`${apiUrl}/receptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: false, error: `Failed to register weighing: ${response.statusText}` };
    }

    const reception = await response.json();
    return { success: true, reception };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function finalizeTruck(truckId: string): Promise<{ success: boolean; truck?: Truck; error?: string }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    const response = await fetch(`${apiUrl}/trucks/${truckId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'completed' }),
    });

    if (!response.ok) {
      return { success: false, error: `Failed to finalize truck: ${response.statusText}` };
    }

    const truck = await response.json();
    return { success: true, truck };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function fetchTruckReceptions(truckId: string): Promise<{ success: boolean; receptions?: TruckReception[]; error?: string }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    const response = await fetch(`${apiUrl}/trucks/${truckId}/receptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false, error: `Failed to fetch receptions: ${response.statusText}` };
    }

    const receptions = await response.json();
    return { success: true, receptions };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
