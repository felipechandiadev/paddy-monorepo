'use client';

import React, { useCallback, useMemo, useState } from 'react';
import type { TruckReception } from '@/actions/truckReceptionActions';
import { updateTruckTurnoAction } from '@/actions/truckReceptionActions';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { RECEPTION_TURNO_MAX, RECEPTION_TURNO_MIN } from '@/lib/receptionTurno';

export interface TurnoSlotsDialogProps {
  open: boolean;
  onClose: () => void;
  trucks: TruckReception[];
  selectedTruckId: number | null;
  onSelectTruck: (id: number | null) => void;
  onAfterAssign: () => Promise<void>;
}

export const TurnoSlotsDialog: React.FC<TurnoSlotsDialogProps> = ({
  open,
  onClose,
  trucks,
  selectedTruckId,
  onSelectTruck,
  onAfterAssign,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slotToTruck = useMemo(() => {
    const m = new Map<number, TruckReception>();
    for (const t of trucks) {
      if (t.status !== 'ESPERA' || t.numero_turno == null) continue;
      const n = Number(t.numero_turno);
      if (n >= RECEPTION_TURNO_MIN && n <= RECEPTION_TURNO_MAX) {
        m.set(n, t);
      }
    }
    return m;
  }, [trucks]);

  const assignTruckToSlot = useCallback(
    async (truckId: number, slot: number) => {
      setError(null);
      const occupant = slotToTruck.get(slot);
      if (occupant) {
        onSelectTruck(occupant.id);
        return;
      }
      const selected = trucks.find((t) => t.id === truckId);
      if (!selected || selected.status !== 'ESPERA') {
        setError('El camión no está en espera.');
        return;
      }
      setBusy(true);
      try {
        await updateTruckTurnoAction(truckId, slot);
        await onAfterAssign();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo asignar el turno');
      } finally {
        setBusy(false);
      }
    },
    [slotToTruck, trucks, onSelectTruck, onAfterAssign, onClose],
  );

  const handleCellClick = useCallback(
    async (slot: number) => {
      const occupant = slotToTruck.get(slot);
      if (occupant) {
        onSelectTruck(occupant.id);
        return;
      }
      if (selectedTruckId == null) {
        setError('Selecciona un camión en la lista o arrastra una fila a un cupo libre.');
        return;
      }
      await assignTruckToSlot(selectedTruckId, slot);
    },
    [selectedTruckId, slotToTruck, onSelectTruck, assignTruckToSlot],
  );

  const slots = useMemo(
    () =>
      Array.from({ length: RECEPTION_TURNO_MAX - RECEPTION_TURNO_MIN + 1 }, (_, i) => RECEPTION_TURNO_MIN + i),
    [],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Cupos de turno (1–100)"
      size="xl"
      scroll="paper"
      showCloseButton
      hideActions
      bodyClassName="pt-2"
    >
      <p className="text-sm text-muted-foreground mb-3">
        Cupo libre: asigna el turno al camión seleccionado en la lista. Cupo ocupado: revisa la patente o
        selecciónalo.
      </p>
      {error && (
        <Alert variant="error" className="mb-3">
          {error}
        </Alert>
      )}
      <div className="grid grid-cols-10 gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
        {slots.map((n) => {
          const truck = slotToTruck.get(n);
          const isSel = selectedTruckId != null && truck?.id === selectedTruckId;
          const free = !truck;
          return (
            <button
              key={n}
              type="button"
              disabled={busy}
              onClick={() => void handleCellClick(n)}
              onDragOver={(e) => {
                if (busy || truck) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (busy || truck) return;
                const raw = e.dataTransfer.getData('text/paddy-truck-id');
                const truckId = Number(raw);
                if (!Number.isFinite(truckId)) return;
                void assignTruckToSlot(truckId, n);
              }}
              title={truck ? `${truck.license_plate}` : `Turno ${n} libre`}
              className={[
                'rounded-md border text-[11px] leading-tight min-h-[44px] px-0.5 py-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                free
                  ? 'border-dashed border-border bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:border-primary/50'
                  : 'border-border bg-card text-foreground hover:bg-primary/15',
                isSel ? 'ring-2 ring-primary' : '',
              ].join(' ')}
            >
              <span className="font-semibold tabular-nums">{n}</span>
              {truck ? (
                <span className="truncate w-full text-center font-medium">{truck.license_plate}</span>
              ) : (
                <span className="text-[10px] opacity-70">Libre</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outlined" onClick={onClose} disabled={busy}>
          Cerrar
        </Button>
      </div>
    </Dialog>
  );
};
