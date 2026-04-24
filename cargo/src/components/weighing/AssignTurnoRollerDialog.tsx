'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { TruckReception } from '@/actions/truckReceptionActions';
import { updateTruckTurnoAction } from '@/actions/truckReceptionActions';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import {
  RECEPTION_TURNO_MAX,
  RECEPTION_TURNO_MIN,
  occupiedReceptionTurnos,
} from '@/lib/receptionTurno';

const ROW_PX = 48;
const PAD_ROWS = 3;

export interface AssignTurnoRollerDialogProps {
  open: boolean;
  truckId: number | null;
  trucks: TruckReception[];
  onClose: () => void;
  onAfterAssign: () => Promise<void>;
}

export const AssignTurnoRollerDialog: React.FC<AssignTurnoRollerDialogProps> = ({
  open,
  truckId,
  trucks,
  onClose,
  onAfterAssign,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerSlot, setCenterSlot] = useState(RECEPTION_TURNO_MIN);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const truck = useMemo(
    () => (truckId != null ? trucks.find((t) => t.id === truckId) ?? null : null),
    [truckId, trucks],
  );

  const taken = useMemo(() => occupiedReceptionTurnos(trucks), [trucks]);

  const slotOccupantPlate = useCallback(
    (n: number): string | null => {
      const o = trucks.find(
        (t) => t.status === 'ESPERA' && t.numero_turno === n && t.id !== truckId,
      );
      return o ? o.license_plate : null;
    },
    [trucks, truckId],
  );

  const isFree = useCallback((n: number) => !taken.has(n) || truck?.numero_turno === n, [taken, truck]);

  const padPx = PAD_ROWS * ROW_PX;

  const scrollToSlot = useCallback((n: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = n - RECEPTION_TURNO_MIN;
    const targetTop = padPx + idx * ROW_PX - el.clientHeight / 2 + ROW_PX / 2;
    el.scrollTop = Math.max(0, targetTop);
  }, []);

  const readCenterSlot = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return RECEPTION_TURNO_MIN;
    const centerY = el.scrollTop + el.clientHeight / 2;
    const idx = Math.round((centerY - padPx - ROW_PX / 2) / ROW_PX);
    const n = RECEPTION_TURNO_MIN + Math.min(RECEPTION_TURNO_MAX - RECEPTION_TURNO_MIN, Math.max(0, idx));
    return n;
  }, []);

  useLayoutEffect(() => {
    if (!open || truckId == null) return;
    setError(null);
    const current = trucks.find((t) => t.id === truckId);
    let initial: number | null = null;
    if (current?.numero_turno != null) {
      const n = Number(current.numero_turno);
      if (n >= RECEPTION_TURNO_MIN && n <= RECEPTION_TURNO_MAX) {
        initial = n;
      }
    }
    if (initial == null) {
      for (let n = RECEPTION_TURNO_MIN; n <= RECEPTION_TURNO_MAX; n++) {
        if (isFree(n)) {
          initial = n;
          break;
        }
      }
    }
    if (initial == null) {
      initial = RECEPTION_TURNO_MIN;
    }
    setCenterSlot(initial);
    requestAnimationFrame(() => scrollToSlot(initial));
  }, [open, truckId, scrollToSlot, isFree, trucks]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => setCenterSlot(readCenterSlot()), 60);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (t) clearTimeout(t);
    };
  }, [open, readCenterSlot]);

  const occupantPlate = slotOccupantPlate(centerSlot);
  const centerIsFree = isFree(centerSlot);

  const unchanged = truck?.numero_turno != null && Number(truck.numero_turno) === centerSlot;

  const handleAssign = async () => {
    if (truckId == null || !centerIsFree || unchanged) return;
    setError(null);
    setBusy(true);
    try {
      await updateTruckTurnoAction(truckId, centerSlot);
      await onAfterAssign();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo asignar el turno');
    } finally {
      setBusy(false);
    }
  };

  const slots = useMemo(
    () =>
      Array.from(
        { length: RECEPTION_TURNO_MAX - RECEPTION_TURNO_MIN + 1 },
        (_, i) => RECEPTION_TURNO_MIN + i,
      ),
    [],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        truck
          ? truck.numero_turno != null
            ? `Cambiar turno — ${truck.license_plate}`
            : `Asignar turno — ${truck.license_plate}`
          : 'Turno'
      }
      size="md"
      scroll="body"
      showCloseButton
      hideActions
      bodyClassName="pt-2"
    >
      <p className="text-sm text-muted-foreground mb-3">
        Desplaza la lista para elegir un número. Tu cupo actual sigue disponible para este camión; el resto libre
        puede asignarse. Los ocupados por otras patentes no se pueden guardar.
      </p>

      {error && (
        <Alert variant="error" className="mb-3">
          {error}
        </Alert>
      )}

      <div className="relative rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-background via-background/90 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-background via-background/90 to-transparent"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-2 top-1/2 z-20 -translate-y-1/2 h-12 rounded-lg border-2 border-primary/60 bg-primary/5"
          aria-hidden
        />

        <div
          ref={scrollRef}
          className="max-h-56 overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory [scrollbar-width:thin]"
        >
          <div style={{ height: padPx }} aria-hidden />
          {slots.map((n) => {
            const free = isFree(n);
            const plate = slotOccupantPlate(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  scrollToSlot(n);
                  setCenterSlot(n);
                }}
                className={[
                  'w-full shrink-0 flex flex-col items-center justify-center gap-0.5 border-b border-border/40 transition-colors',
                  free
                    ? 'bg-background/50 hover:bg-primary/10'
                    : 'bg-secondary-12 hover:bg-secondary-20',
                  centerSlot === n ? 'text-primary font-bold' : 'text-foreground font-medium',
                  !free ? 'text-foreground/85' : '',
                ].join(' ')}
                style={{ height: ROW_PX, scrollSnapAlign: 'center' }}
              >
                <span className="text-lg tabular-nums leading-none">{n}</span>
                <span className="text-[10px] leading-none uppercase tracking-wide">
                  {free ? 'Libre' : plate ? plate : 'Ocupado'}
                </span>
              </button>
            );
          })}
          <div style={{ height: padPx }} aria-hidden />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Selección</span>
        <span className="font-semibold tabular-nums text-lg text-foreground">
          {centerSlot}
          {!centerIsFree && occupantPlate ? (
            <span className="ml-2 text-xs font-normal text-destructive">ocupado ({occupantPlate})</span>
          ) : null}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        <Button type="button" variant="outlined" onClick={onClose} disabled={busy}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => void handleAssign()}
          disabled={busy || !centerIsFree || truckId == null || unchanged}
        >
          {busy
            ? 'Guardando…'
            : unchanged
              ? 'Sin cambios'
              : truck?.numero_turno != null
                ? `Guardar turno ${centerSlot}`
                : `Asignar turno ${centerSlot}`}
        </Button>
      </div>
    </Dialog>
  );
};
