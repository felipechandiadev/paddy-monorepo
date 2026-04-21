# 🚚 TRUCK MANAGEMENT SYSTEM - GUÍA DE IMPLEMENTACIÓN CON EJEMPLOS

**Companion Document al Documento Principal**  
**Fecha**: 21 de abril de 2026  
**Propósito**: Ejemplos detallados de código y guía paso a paso

---

## 📑 ÍNDICE

1. [Tipos TypeScript Completos](#tipos-typescript-completos)
2. [Context + Reducer Implementación](#context--reducer-implementación)
3. [Hooks Personalizados](#hooks-personalizados)
4. [Server Actions](#server-actions)
5. [Componentes React](#componentes-react)
6. [Backend Service (NestJS)](#backend-service-nestjs)
7. [Configuración y Setup](#configuración-y-setup)
8. [Ejemplos de Flujos](#ejemplos-de-flujos)

---

## 🔷 TIPOS TYPESCRIPT COMPLETOS

### `frontend/src/features/logistics/types/logistics.types.ts`

```typescript
/**
 * Tipos base del sistema de gestión de camiones
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum TruckState {
  ESPERA = 'ESPERA',                    // Esperando turno
  PESANDO_BRUTO = 'PESANDO_BRUTO',      // Pesaje inicial (con carga)
  DESCARGANDO = 'DESCARGANDO',          // En proceso de descarga
  PESANDO_TARA = 'PESANDO_TARA',        // Pesaje final (sin carga)
  FINALIZADO = 'FINALIZADO',            // Proceso completado
}

export enum WeighingType {
  BRUTO = 'bruto',
  TARA = 'tara',
}

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

export interface Truck {
  // Identificadores
  id: string;                           // UUID v4
  numero_turno: number;                 // Correlativo diario (1, 2, 3...)
  
  // Información del vehículo
  patente: string;                      // ABC-1234 (validar formato)
  transportista: string;                // Nombre empresa transporte
  chofer: string;                       // Nombre chofer
  rut_chofer?: string;                  // RUT chofer
  guia: string;                         // Número guía/comprobante
  
  // Pesajes (en kg)
  peso_bruto: number | null;            // Entrada (con carga)
  peso_tara: number | null;             // Salida (sin carga)
  peso_neto?: number;                   // Calculado: bruto - tara
  
  // Estado máquina
  estado: TruckState;
  
  // Timestamps (ISO 8601)
  fecha_hora_entrada: Date;
  fecha_hora_peso_bruto?: Date;
  fecha_hora_inicio_descarga?: Date;
  fecha_hora_peso_tara?: Date;
  fecha_hora_finalizacion?: Date;
  
  // Métricas calculadas (en minutos)
  tiempo_espera_minutos?: number;       // Entrada → Pesaje bruto
  tiempo_descarga_minutos?: number;     // Pesaje bruto → Pesaje tara
  tiempo_total_minutos?: number;        // Entrada → Salida
  
  // Ticket
  ticket_generado: boolean;
  numero_ticket?: string;               // Correlativo ticket
  pdf_url?: string;                     // URL del PDF generado
  
  // Auditoría
  created_at: Date;
  updated_at: Date;
  created_by: string;                   // Usuario que lo creó
  updated_by?: string;
  deleted_at?: Date;                    // Soft delete
}

export interface LogisticsQueueState {
  // Turno actual siendo procesado
  truck_actual: Truck | null;
  
  // Próximos en la cola (ordenados)
  truck_proximos: Truck[];
  
  // En proceso de descarga (pueden ser varios simultáneamente)
  truck_descargando: Truck[];
  
  // Finalizados en la sesión
  truck_finalizados: Truck[];
  
  // Métricas de la sesión
  sesion_fecha: Date;
  sesion_numero_turnos: number;
  sesion_peso_total_kg: number;
  sesion_tiempo_promedio_minutos: number;
  
  // Estado UI
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// INPUTS/DTOS
// ============================================================================

export interface CreateTruckInput {
  patente: string;
  transportista: string;
  chofer: string;
  rut_chofer?: string;
  guia: string;
}

export interface RegisterWeighingInput {
  truck_id: string;
  peso: number;                         // En kg
  tipo: WeighingType;
  timestamp?: Date;                     // Override si es necesario
}

export interface UpdateTruckStateInput {
  truck_id: string;
  nuevo_estado: TruckState;
}

// ============================================================================
// RESPONSES
// ============================================================================

export interface TruckResponse extends Truck {
  // Datos calculados para UI
  tiempo_espera_actual_minutos?: number;  // Calculado en tiempo real
  proximo_estado_permitido?: TruckState;
  puede_avanzar?: boolean;
}

export interface LogisticsSessionReport {
  fecha: Date;
  numero_turnos: number;
  peso_total_kg: number;
  tiempo_promedio_minutos: number;
  tiempo_minimo_minutos: number;
  tiempo_maximo_minutos: number;
  camiones: TruckResponse[];
}

// ============================================================================
// API RESPONSE WRAPPER
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// ============================================================================
// VALIDACIONES Y GUARDS
// ============================================================================

export const TRUCK_STATE_TRANSITIONS: Record<TruckState, TruckState[]> = {
  [TruckState.ESPERA]: [TruckState.PESANDO_BRUTO],
  [TruckState.PESANDO_BRUTO]: [TruckState.DESCARGANDO],
  [TruckState.DESCARGANDO]: [TruckState.PESANDO_TARA],
  [TruckState.PESANDO_TARA]: [TruckState.FINALIZADO],
  [TruckState.FINALIZADO]: [], // Terminal
};

export const STATE_GUARD_CONDITIONS: Record<
  TruckState,
  (truck: Truck) => boolean
> = {
  [TruckState.ESPERA]: (truck) => true, // Siempre válido

  [TruckState.PESANDO_BRUTO]: (truck) =>
    truck.patente.length > 0 &&
    truck.chofer.length > 0 &&
    truck.transportista.length > 0 &&
    truck.guia.length > 0,

  [TruckState.DESCARGANDO]: (truck) =>
    truck.peso_bruto !== null &&
    truck.peso_bruto > 0 &&
    truck.fecha_hora_peso_bruto !== null,

  [TruckState.PESANDO_TARA]: (truck) =>
    truck.peso_bruto !== null &&
    truck.peso_bruto > 0 &&
    truck.fecha_hora_peso_bruto !== null,

  [TruckState.FINALIZADO]: (truck) => {
    if (!truck.peso_bruto || !truck.peso_tara) return false;
    if (truck.peso_tara >= truck.peso_bruto) return false;
    const pesoNeto = truck.peso_bruto - truck.peso_tara;
    return pesoNeto > 0;
  },
};

// ============================================================================
// VALIDACIONES DE DATOS
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePatente(patente: string): ValidationResult {
  const errors: string[] = [];

  if (!patente || patente.trim().length === 0) {
    errors.push('Patente es requerida');
  }

  // Formato: ABC-1234 o ABCD-12 (flexibilidad)
  if (!/^[A-Z]{2,4}-\d{2,4}$/.test(patente.toUpperCase())) {
    errors.push('Patente debe tener formato ABC-1234');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePeso(peso: number, type: 'bruto' | 'tara', truck?: Truck): ValidationResult {
  const errors: string[] = [];

  if (typeof peso !== 'number' || isNaN(peso)) {
    errors.push('Peso debe ser un número válido');
  }

  if (peso <= 0) {
    errors.push('Peso debe ser mayor a 0');
  }

  if (type === 'tara' && truck?.peso_bruto) {
    if (peso >= truck.peso_bruto) {
      errors.push(`Peso tara (${peso}kg) no puede ser >= peso bruto (${truck.peso_bruto}kg)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTruckInput(input: CreateTruckInput): ValidationResult {
  const errors: string[] = [];

  if (!input.patente?.trim()) {
    errors.push('Patente es requerida');
  }

  if (!input.chofer?.trim()) {
    errors.push('Chofer es requerido');
  }

  if (!input.transportista?.trim()) {
    errors.push('Transportista es requerido');
  }

  if (!input.guia?.trim()) {
    errors.push('Guía es requerida');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

export function canTransition(
  currentState: TruckState,
  nextState: TruckState,
  truck?: Truck,
): boolean {
  const validNextStates = TRUCK_STATE_TRANSITIONS[currentState];

  if (!validNextStates.includes(nextState)) {
    return false;
  }

  if (truck) {
    const guardCondition = STATE_GUARD_CONDITIONS[nextState];
    return guardCondition(truck);
  }

  return true;
}

export function calculateTiempoEspera(
  fechaEntrada: Date,
  fechaPesoBruto?: Date,
): number | undefined {
  if (!fechaPesoBruto) return undefined;
  const diffMs = fechaPesoBruto.getTime() - fechaEntrada.getTime();
  return Math.round(diffMs / (1000 * 60)); // Minutos
}

export function calculatePesoNeto(
  pesoBruto: number | null,
  pesoTara: number | null,
): number | undefined {
  if (pesoBruto === null || pesoTara === null) return undefined;
  return pesoBruto - pesoTara;
}
```

---

## 🎛️ CONTEXT + REDUCER IMPLEMENTACIÓN

### `frontend/src/features/logistics/context/LogisticsContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { LogisticsQueueState, Truck, TruckState, LogisticsAction } from '../types';

// ============================================================================
// CONTEXTO
// ============================================================================

export interface LogisticsContextType {
  state: LogisticsQueueState;
  dispatch: React.Dispatch<LogisticsAction>;
  
  // Acciones
  registrarCamion: (data: CreateTruckInput) => Promise<void>;
  avanzarEstado: (truckId: string, nuevoEstado: TruckState) => Promise<void>;
  registrarPeso: (truckId: string, peso: number, tipo: 'bruto' | 'tara') => Promise<void>;
  liberarTurno: (truckId: string) => Promise<void>;
  
  // Estado UI
  loading: boolean;
  error: string | null;
}

const LogisticsContext = createContext<LogisticsContextType | null>(null);

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_STATE: LogisticsQueueState = {
  truck_actual: null,
  truck_proximos: [],
  truck_descargando: [],
  truck_finalizados: [],
  sesion_fecha: new Date(),
  sesion_numero_turnos: 0,
  sesion_peso_total_kg: 0,
  sesion_tiempo_promedio_minutos: 0,
};

// ============================================================================
// REDUCER
// ============================================================================

import { logisticsReducer } from './reducer';

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface LogisticsProviderProps {
  children: React.ReactNode;
  initialState?: Partial<LogisticsQueueState>;
}

export function LogisticsProvider({
  children,
  initialState = {},
}: LogisticsProviderProps) {
  const [state, dispatch] = useReducer(
    logisticsReducer,
    { ...INITIAL_STATE, ...initialState },
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ========== ACCIONES ==========

  const registrarCamion = useCallback(
    async (data: CreateTruckInput) => {
      setLoading(true);
      setError(null);

      try {
        const result = await createTruckAction(data);

        if (!result.success) {
          throw new Error(result.error || 'Error registrando camión');
        }

        dispatch({
          type: 'TRUCK_CREATED',
          payload: result.data!,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const avanzarEstado = useCallback(
    async (truckId: string, nuevoEstado: TruckState) => {
      setLoading(true);
      setError(null);

      try {
        const result = await updateTruckStateAction(truckId, nuevoEstado);

        if (!result.success) {
          throw new Error(result.error || 'Error actualizando estado');
        }

        dispatch({
          type: 'TRUCK_STATE_UPDATED',
          payload: result.data!,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const registrarPeso = useCallback(
    async (truckId: string, peso: number, tipo: 'bruto' | 'tara') => {
      setLoading(true);
      setError(null);

      try {
        const result = await registerWeighingAction(truckId, peso, tipo);

        if (!result.success) {
          throw new Error(result.error || 'Error registrando peso');
        }

        dispatch({
          type: 'TRUCK_WEIGHING_REGISTERED',
          payload: result.data!,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const liberarTurno = useCallback(
    async (truckId: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await releaseTruckAction(truckId);

        if (!result.success) {
          throw new Error(result.error || 'Error liberando turno');
        }

        dispatch({
          type: 'TRUCK_RELEASED',
          payload: result.data!,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value: LogisticsContextType = {
    state,
    dispatch,
    registrarCamion,
    avanzarEstado,
    registrarPeso,
    liberarTurno,
    loading,
    error,
  };

  return (
    <LogisticsContext.Provider value={value}>
      {children}
    </LogisticsContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useLogistics(): LogisticsContextType {
  const context = useContext(LogisticsContext);

  if (!context) {
    throw new Error('useLogistics debe usarse dentro de LogisticsProvider');
  }

  return context;
}

// ============================================================================
// IMPORTS DE ACTIONS
// ============================================================================

import { createTruckAction, updateTruckStateAction, registerWeighingAction, releaseTruckAction } from '../actions/truck.action';
import type { CreateTruckInput } from '../types';
```

### `frontend/src/features/logistics/context/reducer.ts`

```typescript
'use client';

import { LogisticsQueueState, Truck, LogisticsAction } from '../types';

export function logisticsReducer(
  state: LogisticsQueueState,
  action: LogisticsAction,
): LogisticsQueueState {
  switch (action.type) {
    case 'TRUCK_CREATED': {
      const newTruck = action.payload as Truck;
      return {
        ...state,
        truck_proximos: [...state.truck_proximos, newTruck],
        sesion_numero_turnos: state.sesion_numero_turnos + 1,
      };
    }

    case 'TRUCK_STATE_UPDATED': {
      const updatedTruck = action.payload as Truck;

      if (updatedTruck.estado === 'ESPERA') {
        // Mover a próximos si estaba en otro lado
        return {
          ...state,
          truck_proximos: state.truck_proximos.map((t) =>
            t.id === updatedTruck.id ? updatedTruck : t,
          ),
          truck_actual:
            state.truck_actual?.id === updatedTruck.id ? updatedTruck : state.truck_actual,
          truck_descargando: state.truck_descargando.filter((t) => t.id !== updatedTruck.id),
        };
      }

      if (updatedTruck.estado === 'PESANDO_BRUTO') {
        // Mover de próximos a actual
        const newProximos = state.truck_proximos.filter((t) => t.id !== updatedTruck.id);
        return {
          ...state,
          truck_actual: updatedTruck,
          truck_proximos: newProximos,
        };
      }

      if (updatedTruck.estado === 'DESCARGANDO') {
        // Pasar a descargando
        return {
          ...state,
          truck_actual: null,
          truck_descargando: [...state.truck_descargando, updatedTruck],
          truck_proximos:
            state.truck_proximos.length > 0
              ? [
                  ...state.truck_proximos.slice(1),
                  ...state.truck_proximos.slice(0, 1),
                ]
              : [],
        };
      }

      if (updatedTruck.estado === 'PESANDO_TARA') {
        // Vuelve a actual desde descargando
        return {
          ...state,
          truck_actual: updatedTruck,
          truck_descargando: state.truck_descargando.filter((t) => t.id !== updatedTruck.id),
        };
      }

      if (updatedTruck.estado === 'FINALIZADO') {
        // Mover a finalizados
        return {
          ...state,
          truck_actual: null,
          truck_finalizados: [updatedTruck, ...state.truck_finalizados],
          sesion_peso_total_kg:
            state.sesion_peso_total_kg +
            (updatedTruck.peso_neto || 0),
        };
      }

      return state;
    }

    case 'TRUCK_WEIGHING_REGISTERED': {
      const updatedTruck = action.payload as Truck;

      if (state.truck_actual?.id === updatedTruck.id) {
        return {
          ...state,
          truck_actual: updatedTruck,
        };
      }

      return {
        ...state,
        truck_descargando: state.truck_descargando.map((t) =>
          t.id === updatedTruck.id ? updatedTruck : t,
        ),
      };
    }

    case 'TRUCK_RELEASED': {
      const releasedTruck = action.payload as Truck;

      return {
        ...state,
        truck_actual:
          state.truck_actual?.id === releasedTruck.id ? null : state.truck_actual,
        truck_descargando: state.truck_descargando.filter(
          (t) => t.id !== releasedTruck.id,
        ),
        truck_proximos:
          state.truck_proximos.length > 0
            ? {
                ...state,
                truck_actual: state.truck_proximos[0],
                truck_proximos: state.truck_proximos.slice(1),
              }
            : state,
      };
    }

    case 'QUEUE_REFRESHED': {
      return action.payload as LogisticsQueueState;
    }

    case 'ERROR': {
      // Los errores se manejan en el provider, aquí solo mostramos el estado actual
      return state;
    }

    default:
      return state;
  }
}
```

---

## 🪝 HOOKS PERSONALIZADOS

### `frontend/src/features/logistics/hooks/useLogisticsData.ts`

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LogisticsQueueState } from '../types';
import { truckService } from '../services/truckService';

/**
 * Hook principal para obtener datos del TMS
 * - Fetching de datos
 * - Caching con React Query
 * - Refetch automático
 */

export function useLogisticsData() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetching principal
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['logistics-queue'],
    queryFn: async () => await truckService.getQueue(),
    refetchInterval: 5000, // Refetch cada 5 segundos
    enabled: isOnline,
  });

  const queue = data ?? {
    truck_actual: null,
    truck_proximos: [],
    truck_descargando: [],
    truck_finalizados: [],
    sesion_fecha: new Date(),
    sesion_numero_turnos: 0,
    sesion_peso_total_kg: 0,
    sesion_tiempo_promedio_minutos: 0,
  } as LogisticsQueueState;

  return {
    queue,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    isOnline,
  };
}
```

### `frontend/src/features/logistics/hooks/useRealtimeSync.ts`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { realtimeService } from '../services/realtimeService';

/**
 * Hook para sincronización en tiempo real
 * - WebSocket listeners
 * - Actualización de estado global
 * - Manejo de desconexiones
 */

export function useRealtimeSync() {
  const { dispatch, state } = useLogistics();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Suscribirse a cambios en tiempo real
    unsubscribeRef.current = realtimeService.onTrucksChanged((updatedTruck) => {
      dispatch({
        type: 'TRUCK_STATE_UPDATED',
        payload: updatedTruck,
      });
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [dispatch]);

  return {
    queue: state,
  };
}
```

### `frontend/src/features/logistics/hooks/useTruckState.ts`

```typescript
'use client';

import { useCallback, useState } from 'react';
import { Truck, TruckState, canTransition } from '../types';

/**
 * Hook para manejar transiciones de estado de un camión
 * - Validaciones de transición
 * - Errores claros
 */

export function useTruckState(initialTruck: Truck | null) {
  const [truck, setTruck] = useState<Truck | null>(initialTruck);
  const [error, setError] = useState<string | null>(null);

  const canAdvance = useCallback(
    (nextState: TruckState) => {
      if (!truck) return false;
      return canTransition(truck.estado, nextState, truck);
    },
    [truck],
  );

  const validateAdvance = useCallback(
    (nextState: TruckState): { valid: boolean; error?: string } => {
      if (!truck) {
        return { valid: false, error: 'Camión no cargado' };
      }

      if (!canAdvance(nextState)) {
        return {
          valid: false,
          error: `No puedes ir de ${truck.estado} a ${nextState}`,
        };
      }

      // Validaciones específicas por estado
      if (nextState === 'FINALIZADO' && (!truck.peso_neto || truck.peso_neto <= 0)) {
        return {
          valid: false,
          error: 'Peso neto inválido para finalizar',
        };
      }

      return { valid: true };
    },
    [truck, canAdvance],
  );

  return {
    truck,
    setTruck,
    error,
    setError,
    canAdvance,
    validateAdvance,
  };
}
```

---

## 🔄 SERVER ACTIONS

### `frontend/src/features/logistics/actions/truck.action.ts`

```typescript
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import {
  Truck,
  TruckState,
  CreateTruckInput,
  ApiResponse,
} from '../types';

const API_BASE = `${process.env.BACKEND_API_URL || 'http://localhost:3000/api/v1'}/logistics`;

async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  const token = (session?.user as any)?.accessToken;

  if (!token) {
    throw new Error('No authenticated');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// ============================================================================
// CREAR CAMIÓN
// ============================================================================

export async function createTruckAction(
  input: CreateTruckInput,
): Promise<ApiResponse<Truck>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}/trucks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || 'Error creando camión',
        timestamp: new Date(),
      };
    }

    const truck = await response.json();

    return {
      success: true,
      data: truck,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date(),
    };
  }
}

// ============================================================================
// ACTUALIZAR ESTADO
// ============================================================================

export async function updateTruckStateAction(
  truckId: string,
  nuevoEstado: TruckState,
): Promise<ApiResponse<Truck>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}/trucks/${truckId}/state`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nuevoEstado }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || 'Error actualizando estado',
        timestamp: new Date(),
      };
    }

    const truck = await response.json();

    return {
      success: true,
      data: truck,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date(),
    };
  }
}

// ============================================================================
// REGISTRAR PESO
// ============================================================================

export async function registerWeighingAction(
  truckId: string,
  peso: number,
  tipo: 'bruto' | 'tara',
): Promise<ApiResponse<Truck>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}/trucks/${truckId}/weighing`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tipo, peso }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || 'Error registrando peso',
        timestamp: new Date(),
      };
    }

    const truck = await response.json();

    return {
      success: true,
      data: truck,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date(),
    };
  }
}

// ============================================================================
// LIBERAR TURNO
// ============================================================================

export async function releaseTruckAction(
  truckId: string,
): Promise<ApiResponse<Truck>> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}/trucks/${truckId}/release`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || 'Error liberando turno',
        timestamp: new Date(),
      };
    }

    const truck = await response.json();

    return {
      success: true,
      data: truck,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date(),
    };
  }
}
```

---

## 🎨 COMPONENTES REACT

### `frontend/src/features/logistics/components/TruckInputForm.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { CreateTruckInput, validateTruckInput } from '../types';

interface TruckInputFormProps {
  onSubmit?: (truck: any) => void;
  isLoading?: boolean;
}

export function TruckInputForm({ onSubmit, isLoading }: TruckInputFormProps) {
  const [formData, setFormData] = useState<CreateTruckInput>({
    patente: '',
    transportista: '',
    chofer: '',
    guia: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar
    const validation = validateTruckInput(formData);
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((err) => {
        if (err.includes('Patente')) newErrors.patente = err;
        if (err.includes('Chofer')) newErrors.chofer = err;
        if (err.includes('Transportista')) newErrors.transportista = err;
        if (err.includes('Guía')) newErrors.guia = err;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Aquí iría la acción
      onSubmit?.(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Patente</label>
        <input
          type="text"
          name="patente"
          value={formData.patente}
          onChange={handleChange}
          placeholder="ABC-1234"
          className={`w-full px-3 py-2 border rounded ${
            errors.patente ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
        />
        {errors.patente && <p className="text-red-600 text-sm">{errors.patente}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Chofer</label>
        <input
          type="text"
          name="chofer"
          value={formData.chofer}
          onChange={handleChange}
          placeholder="Nombre del chofer"
          className={`w-full px-3 py-2 border rounded ${
            errors.chofer ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
        />
        {errors.chofer && <p className="text-red-600 text-sm">{errors.chofer}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Transportista</label>
        <input
          type="text"
          name="transportista"
          value={formData.transportista}
          onChange={handleChange}
          placeholder="Nombre de la empresa"
          className={`w-full px-3 py-2 border rounded ${
            errors.transportista ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
        />
        {errors.transportista && (
          <p className="text-red-600 text-sm">{errors.transportista}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Guía</label>
        <input
          type="text"
          name="guia"
          value={formData.guia}
          onChange={handleChange}
          placeholder="Número de guía"
          className={`w-full px-3 py-2 border rounded ${
            errors.guia ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting || isLoading}
        />
        {errors.guia && <p className="text-red-600 text-sm">{errors.guia}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 rounded transition"
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Camión'}
      </button>
    </form>
  );
}
```

---

**Documento continúa en la próxima sección...**

---

Pendiente:
- Backend Service (NestJS) - Implementación completa
- Configuración y Setup (ENV, DB migrations)
- Ejemplos de Flujos (step by step)
- Testing examples

*Este documento es complementario al documento principal `TRUCK_MANAGEMENT_ARCHITECTURE.md`*
