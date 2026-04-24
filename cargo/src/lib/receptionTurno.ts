import type { TruckReception } from '@/actions/truckReceptionActions';

export const RECEPTION_TURNO_MIN = 1;
export const RECEPTION_TURNO_MAX = 100;

/** Cupos ocupados por recepciones en ESPERA (turno manual 1–100). */
export function occupiedReceptionTurnos(trucks: TruckReception[]): Set<number> {
  const s = new Set<number>();
  for (const t of trucks) {
    if (t.status === 'ESPERA' && t.numero_turno != null) {
      const n = Number(t.numero_turno);
      if (n >= RECEPTION_TURNO_MIN && n <= RECEPTION_TURNO_MAX) {
        s.add(n);
      }
    }
  }
  return s;
}

export function firstFreeReceptionTurno(trucks: TruckReception[]): number | null {
  const taken = occupiedReceptionTurnos(trucks);
  for (let n = RECEPTION_TURNO_MIN; n <= RECEPTION_TURNO_MAX; n++) {
    if (!taken.has(n)) return n;
  }
  return null;
}

export function receptionTurnoOptionsForSelect(trucks: TruckReception[]): { id: number; label: string }[] {
  const taken = occupiedReceptionTurnos(trucks);
  const opts: { id: number; label: string }[] = [];
  for (let n = RECEPTION_TURNO_MIN; n <= RECEPTION_TURNO_MAX; n++) {
    if (!taken.has(n)) {
      opts.push({ id: n, label: `Turno ${n}` });
    }
  }
  return opts;
}
