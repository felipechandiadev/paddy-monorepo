import { TruckReception } from '@/actions/truckReceptionActions';

/**
 * Estado local histórico (ya no reinicia turnos por día ni reasigna números).
 * Se mantiene la clave por compatibilidad; la fuente de verdad es el backend.
 */
const TURNO_STATE_KEY = 'paddy_turno_state';

export const turnoService = {
  checkAndInitNewDay(currentRecepciones: TruckReception[]): {
    isNewDay: boolean;
    wasSystemRestart: boolean;
    allRecepciones: TruckReception[];
  } {
    return {
      isNewDay: false,
      wasSystemRestart: false,
      allRecepciones: currentRecepciones,
    };
  },

  recordTurnoAssigned(_numero: number): void {
    // Sin contador local: el cupo lo define el servidor y la lista en memoria.
  },

  updatePreviousDayRecepciones(_truck: TruckReception): void {
    // Sin cola “día anterior” en cliente.
  },

  clearState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TURNO_STATE_KEY);
    } catch {
      // ignore
    }
  },
};
