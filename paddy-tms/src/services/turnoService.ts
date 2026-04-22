import { TruckReception } from '@/actions/truckReceptionActions';

interface TurnoState {
  date: string; // YYYY-MM-DD
  lastTurnoAssigned: number;
  previousDayRecepciones: TruckReception[];
  lastSystemAccess: string; // ISO timestamp del último acceso
  hasTransactionsToday: boolean; // ¿Hubo transacciones hoy?
}

const TURNO_STATE_KEY = 'paddy_turno_state';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function now(): string {
  return new Date().toISOString();
}

export const turnoService = {
  // Obtener estado actual de turnos
  getTurnoState(): TurnoState {
    if (typeof window === 'undefined') {
      return {
        date: today(),
        lastTurnoAssigned: 0,
        previousDayRecepciones: [],
        lastSystemAccess: now(),
        hasTransactionsToday: false,
      };
    }

    try {
      const stored = localStorage.getItem(TURNO_STATE_KEY);
      if (!stored) {
        return {
          date: today(),
          lastTurnoAssigned: 0,
          previousDayRecepciones: [],
          lastSystemAccess: now(),
          hasTransactionsToday: false,
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      return {
        date: today(),
        lastTurnoAssigned: 0,
        previousDayRecepciones: [],
        lastSystemAccess: now(),
        hasTransactionsToday: false,
      };
    }
  },

  // Guardar estado de turnos
  saveTurnoState(state: TurnoState): void {
    if (typeof window === 'undefined') return;

    try {
      state.lastSystemAccess = now(); // Actualizar timestamp de acceso
      localStorage.setItem(TURNO_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      // Error guardando
    }
  },

  // Detectar si es un nuevo día y resetear si es necesario
  checkAndInitNewDay(currentRecepciones: TruckReception[]): {
    isNewDay: boolean;
    wasSystemRestart: boolean;
    allRecepciones: TruckReception[];
  } {
    const state = this.getTurnoState();
    const currentDay = today();
    const isNewDay = state.date !== currentDay;

    // Si es nuevo día SIN transacciones del día anterior
    if (isNewDay && !state.hasTransactionsToday) {
      // Obtener pendientes del día anterior
      const previousDayPendientes = state.previousDayRecepciones.filter(
        (r) => r.status === 'ESPERA'
      );

      // REASIGNAR TURNOS a las recepciones pendientes (empezando en 1 del nuevo día)
      const reasignedPendientes = previousDayPendientes.map((turno, index) => ({
        ...turno,
        numero_turno: index + 1,
      }));

      // Crear nuevo estado: reiniciar contador con la cantidad de pendientes
      const newState: TurnoState = {
        date: currentDay,
        lastTurnoAssigned: reasignedPendientes.length, // El contador empieza desde la cantidad de pendientes
        previousDayRecepciones: reasignedPendientes,
        lastSystemAccess: now(),
        hasTransactionsToday: reasignedPendientes.length > 0, // Si hay pendientes, marcar como "con transacciones"
      };

      this.saveTurnoState(newState);

      // Combinar: pendientes reasignados + recepciones nuevas de hoy
      const allRecepciones = [...reasignedPendientes, ...currentRecepciones];
      return {
        isNewDay: true,
        wasSystemRestart: false,
        allRecepciones,
      };
    }

    // Si es el mismo día: mantener pendientes + agregar nuevas
    if (!isNewDay) {
      const allRecepciones = [...state.previousDayRecepciones, ...currentRecepciones];
      return {
        isNewDay: false,
        wasSystemRestart: false,
        allRecepciones,
      };
    }

    // Si es nuevo día PERO ya hay transacciones: continuar desde donde quedó
    const allRecepciones = [...state.previousDayRecepciones, ...currentRecepciones];
    return {
      isNewDay: true,
      wasSystemRestart: false,
      allRecepciones,
    };
  },

  // Obtener siguiente número de turno (sin guardar aún)
  getNextTurnoNumber(): number {
    const state = this.getTurnoState();
    return state.lastTurnoAssigned + 1;
  },

  // Guardar turno asignado cuando se crea una recepción
  recordTurnoAssigned(numero: number): void {
    const state = this.getTurnoState();
    state.lastTurnoAssigned = Math.max(state.lastTurnoAssigned, numero);
    state.hasTransactionsToday = true; // Marcar que hubo transacción hoy
    this.saveTurnoState(state);
  },

  // Actualizar recepciones pendientes del día anterior cuando se finaliza una
  updatePreviousDayRecepciones(truck: TruckReception): void {
    const state = this.getTurnoState();

    if (truck.status === 'FINISHED') {
      // Remover de pendientes cuando se finaliza
      state.previousDayRecepciones = state.previousDayRecepciones.filter(
        (r) => r.id !== truck.id
      );
    } else {
      // Actualizar si cambió algo
      const index = state.previousDayRecepciones.findIndex((r) => r.id === truck.id);
      if (index >= 0) {
        state.previousDayRecepciones[index] = truck;
      }
    }

    this.saveTurnoState(state);
  },

  // Limpiar estado (útil para debugging)
  clearState(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(TURNO_STATE_KEY);
    } catch (error) {
      // Error limpiando
    }
  },
};
