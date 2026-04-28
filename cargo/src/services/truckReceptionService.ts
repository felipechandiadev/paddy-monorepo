'use client';

import { localStorageService } from '@/services/localStorage.service';
import { getAuthTokenAction } from '@/actions/authActions';
import type {
  CreateTruckWithGrossWeightPayload,
  RegisterTareWeightPayload,
  TruckReception,
} from '@/actions/truckReceptionActions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export type { CreateTruckWithGrossWeightPayload, RegisterTareWeightPayload, TruckReception };

/**
 * Servicio para gestionar recepciones de camiones con sincronización offline
 */
export class TruckReceptionService {
  /**
   * Crear recepción con peso bruto y asignar turno
   */
  async createWithGrossWeight(
    payload: CreateTruckWithGrossWeightPayload,
  ): Promise<TruckReception> {
    try {
      // Obtener el token del servidor usando Server Action
      const token = await getAuthTokenAction();

      // Crear en el backend
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/logistics/truck-receptions/with-gross-weight`,
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const truck = result.data as TruckReception;

      // Guardar en localStorage
      localStorageService.saveTruckReception(truck);

      const today = new Date();
      if (truck.numero_turno != null) {
        localStorageService.addTurno(today, {
          numero: truck.numero_turno,
          truck_id: truck.id,
          status: truck.status as 'ESPERA' | 'FINISHED',
          patente: truck.license_plate,
        });
      }

      // Agregar a cola de sincronización como respaldo
      localStorageService.addToSyncQueue('create', truck, truck.id);

      return truck;
    } catch (error) {
      console.error('Error creando recepción:', error);

      // Fallback: crear localmente si falla el backend
      const today = new Date();
      const localTruck: TruckReception = {
        id: Date.now(), // ID temporal
        numero_turno: payload.numero_turno ?? null,
        status: 'ESPERA',
        producer_id: payload.producer_id,
        product: payload.product,
        license_plate: payload.license_plate,
        driver_name: payload.driver_name ?? '',
        carrier_company: payload.carrier_company,
        dispatch_guide: payload.dispatch_guide,
        notes: payload.notes ?? null,
        gross_weight: payload.gross_weight,
        created_by: payload.created_by,
        entry_at: new Date(),
      };

      // Guardar localmente
      localStorageService.saveTruckReception(localTruck);
      if (payload.numero_turno != null) {
        localStorageService.addTurno(today, {
          numero: payload.numero_turno,
          truck_id: localTruck.id,
          status: 'ESPERA',
          patente: localTruck.license_plate,
        });
      }

      // Agregar a cola de sincronización
      localStorageService.addToSyncQueue('create', localTruck, localTruck.id);

      return localTruck;
    }
  }

  /**
   * Registrar peso tara y finalizar recepción
   */
  async recordTareWeight(
    payload: RegisterTareWeightPayload,
  ): Promise<TruckReception> {
    try {
      // Obtener el token del servidor usando Server Action
      const token = await getAuthTokenAction();

      // Registrar en backend
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/logistics/weighings/tare`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          truck_reception_id: payload.truck_reception_id,
          tare_weight: payload.tare_weight,
          status: payload.status ?? 'FINISHED',
          created_by: payload.created_by,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const truck = result.data as TruckReception;

      // Actualizar en localStorage
      localStorageService.saveTruckReception(truck);

      const today = new Date();
      if (truck.numero_turno != null) {
        localStorageService.updateTurno(today, truck.numero_turno, 'FINISHED');
      }

      // Agregar a cola de sincronización
      localStorageService.addToSyncQueue('update', truck, truck.id);

      return truck;
    } catch (error) {
      console.error('Error registrando peso tara:', error);

      // Fallback: actualizar localmente
      const cache = localStorageService.getTruckReceptionsCache();
      const truck = cache[payload.truck_reception_id];

      if (truck) {
        truck.tare_weight = payload.tare_weight;
        truck.net_weight = truck.gross_weight - payload.tare_weight;
        truck.status = 'FINISHED';
        truck.finished_at = new Date();

        localStorageService.saveTruckReception(truck);

        const today = new Date();
        if (truck.numero_turno != null) {
          localStorageService.updateTurno(today, truck.numero_turno, 'FINISHED');
        }

        localStorageService.addToSyncQueue('update', truck, truck.id);

        return truck;
      }

      throw error;
    }
  }

  /**
   * Obtener próximo turno para hoy
   */
  async getNextTurnoForToday(): Promise<number> {
    try {
      // Obtener el token del servidor usando Server Action
      const token = await getAuthTokenAction();

      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/logistics/turnos/next-today`, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data.numero_turno;
    } catch (error) {
      console.warn('Error obteniendo turno del backend, usando local:', error);

      // Fallback a localStorage
      const today = new Date();
      return localStorageService.getNextTurno(today);
    }
  }

  /**
   * Obtener todos los turnos de hoy
   */
  async getTurnosToday(): Promise<TruckReception[]> {
    try {
      // Obtener el token del servidor usando Server Action
      const token = await getAuthTokenAction();

      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/logistics/turnos/today`, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Asegurar que result.data es un array
      if (!Array.isArray(result.data)) {
        console.warn('Backend response data is not an array:', result.data);
        throw new Error('Invalid response format from backend');
      }

      const trucks = result.data as TruckReception[];

      // Actualizar cache local
      trucks.forEach(truck => {
        localStorageService.saveTruckReception(truck);
      });

      return trucks;
    } catch (error) {
      console.warn('Error obteniendo turnos del backend, usando cache local:', error);

      // Fallback a localStorage
      const today = new Date();
      const session = localStorageService.getTurnoSession(today);
      if (!session) {
        return [];
      }

      const cache = localStorageService.getTruckReceptionsCache();
      return session.turnos
        .map(turno => cache[turno.truck_id])
        .filter(Boolean);
    }
  }

  /**
   * Obtener recepción por ID
   */
  async getTruckReceptionById(id: number): Promise<TruckReception | null> {
    // Primero intenta desde cache local
    const cache = localStorageService.getTruckReceptionsCache();
    if (cache[id]) {
      return cache[id];
    }

    try {
      // Obtener el token del servidor usando Server Action
      const token = await getAuthTokenAction();

      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/logistics/truck-receptions/${id}`, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const truck = result.data as TruckReception;

      // Guardar en cache
      localStorageService.saveTruckReception(truck);

      return truck;
    } catch (error) {
      console.warn('Error obteniendo recepción del backend:', error);
      return null;
    }
  }

  /**
   * Sincronizar cola pendiente con backend
   */
  async syncPendingQueue(): Promise<boolean> {
    const queue = localStorageService.getSyncQueue();

    if (queue.length === 0) {
      return true;
    }

    // Obtener el token una sola vez usando Server Action
    const token = await getAuthTokenAction();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let successCount = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];

      try {
        if (item.action === 'create') {
          const response = await fetch(
            `${API_URL}/logistics/truck-receptions/with-gross-weight`,
            {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify(item.data),
            },
          );

          if (response.ok) {
            localStorageService.removeFromSyncQueue(i - successCount);
            successCount++;
          }
        } else if (item.action === 'update') {
          // Actualizar peso tara
          if (item.data.tare_weight) {
            const response = await fetch(`${API_URL}/logistics/weighings/tare`, {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify({
                truck_reception_id: item.id,
                tare_weight: item.data.tare_weight,
                status: 'FINISHED',
              }),
            });

            if (response.ok) {
              localStorageService.removeFromSyncQueue(i - successCount);
              successCount++;
            }
          }
        }
      } catch (error) {
        console.warn(`Error sincronizando item ${i}:`, error);
      }
    }

    return successCount === queue.length;
  }
}

// Exportar instancia singleton
export const truckReceptionService = new TruckReceptionService();
