'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { TruckReception } from '@/actions/truckReceptionActions';
import { formatLogisticsProductLabel } from '@/lib/logisticsProduct';
import Badge from '@/shared/components/ui/Badge/Badge';
import { AssignTurnoRollerDialog } from '@/components/weighing/AssignTurnoRollerDialog';

const QUEUE_STORAGE_KEY = 'paddy_tms_weighing_espera_order';

function loadSavedQueueIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is number => typeof x === 'number');
  } catch {
    return [];
  }
}

function persistQueueIds(ids: number[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/** Aplica orden guardado y añade al final los camiones nuevos (por número de turno). */
function mergeEsperaOrder(espera: TruckReception[], savedIds: number[]): TruckReception[] {
  const byId = new Map(espera.map((t) => [t.id, t]));
  const idSet = new Set(espera.map((t) => t.id));
  const out: TruckReception[] = [];
  const used = new Set<number>();
  for (const id of savedIds) {
    if (!idSet.has(id)) continue;
    const t = byId.get(id);
    if (t) {
      out.push(t);
      used.add(id);
    }
  }
  const rest = espera
    .filter((t) => !used.has(t.id))
    .sort((a, b) => (a.numero_turno ?? 1000) - (b.numero_turno ?? 1000));
  out.push(...rest);
  return out;
}

interface TruckListProps {
  trucks: TruckReception[];
  selectedTruckId: number | null;
  onSelectTruck: (id: number | null) => void;
  onOpenTurnoBoard?: () => void;
  onAfterTurnoChange?: () => Promise<void>;
}

export const TruckList: React.FC<TruckListProps> = ({
  trucks,
  selectedTruckId,
  onSelectTruck,
  onOpenTurnoBoard,
  onAfterTurnoChange,
}) => {
  const [orderedTrucks, setOrderedTrucks] = useState<TruckReception[]>([]);
  const [rollerTruckId, setRollerTruckId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const espera = useMemo(() => trucks.filter((t) => t.status === 'ESPERA'), [trucks]);

  useEffect(() => {
    const saved = loadSavedQueueIds();
    const merged = mergeEsperaOrder(espera, saved);
    setOrderedTrucks(merged);
    persistQueueIds(merged.map((t) => t.id));
  }, [espera]);

  const queueHeadId = orderedTrucks[0]?.id ?? null;

  useEffect(() => {
    if (selectedTruckId == null || queueHeadId == null) return;
    if (selectedTruckId !== queueHeadId) {
      onSelectTruck(null);
    }
  }, [queueHeadId, selectedTruckId, onSelectTruck]);

  const handleDragStart = (e: React.DragEvent, truckId: number) => {
    setDraggedId(truckId);
    e.dataTransfer.setData('text/paddy-truck-id', String(truckId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = useCallback(
    (targetId: number) => {
      if (!draggedId || draggedId === targetId) {
        handleDragEnd();
        return;
      }
      const from = orderedTrucks.findIndex((t) => t.id === draggedId);
      const to = orderedTrucks.findIndex((t) => t.id === targetId);
      if (from < 0 || to < 0) {
        handleDragEnd();
        return;
      }
      const next = [...orderedTrucks];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      setOrderedTrucks(next);
      persistQueueIds(next.map((t) => t.id));
      handleDragEnd();
    },
    [draggedId, orderedTrucks],
  );

  return (
    <div className="bg-background rounded-lg border border-border p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 gap-2">
        <h2 className="text-lg font-bold text-foreground">En Espera para Tara</h2>
        <div className="flex items-center gap-2">
          {onOpenTurnoBoard && (
            <button
              type="button"
              onClick={onOpenTurnoBoard}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-foreground hover:bg-muted/80 transition-colors"
              title="Tablero de turnos 1–100"
              aria-label="Abrir tablero de turnos"
            >
              <span className="material-symbols-outlined text-xl leading-none">grid_view</span>
            </button>
          )}
          <Badge variant="secondary" className="text-sm">
            {orderedTrucks.length}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Arrastra para reordenar la cola. Solo el primero puede pasar a tara en recepción.
      </p>

      <div className="space-y-3" onDragOver={handleDragOver}>
        {orderedTrucks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Sin camiones en espera</p>
          </div>
        ) : (
          orderedTrucks.map((truck, index) => {
            const isHead = index === 0;
            const isSelected = selectedTruckId === truck.id;
            const isDragOver = dragOverId === truck.id;
            const isDragging = draggedId === truck.id;

            return (
              <div
                key={truck.id}
                role="listitem"
                onDragOver={handleDragOver}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOverId(truck.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDrop(truck.id);
                }}
                onClick={() => {
                  if (isHead) {
                    onSelectTruck(truck.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (!isHead) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTruck(truck.id);
                  }
                }}
                tabIndex={isHead ? 0 : -1}
                className={[
                  'group flex items-stretch rounded-lg border-2 transition-all overflow-hidden',
                  isHead ? 'cursor-pointer' : '',
                  isDragging ? 'opacity-50 border-dashed border-primary/50' : '',
                  isDragOver && !isDragging ? 'ring-2 ring-primary/40 border-primary/60' : '',
                  isHead
                    ? 'ring-1 ring-amber-500/50 border-amber-500/40 bg-amber-500/5'
                    : 'border-border bg-card',
                  isSelected && isHead
                    ? 'bg-primary/10 border-primary shadow-lg ring-2 ring-primary'
                    : '',
                  !isHead ? 'opacity-95 hover:border-primary/30' : '',
                ].join(' ')}
              >
                <div className="w-[18%] flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-primary/5 to-transparent px-4 py-4">
                  {isHead && (
                    <Badge variant="primary" className="text-[10px] font-semibold uppercase tracking-wide">
                      Siguiente tara
                    </Badge>
                  )}
                  {truck.numero_turno != null ? (
                    <Badge variant="primary" className="text-xs font-semibold flex-shrink-0">
                      #{truck.numero_turno}
                    </Badge>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAfterTurnoChange) {
                          setRollerTruckId(truck.id);
                        }
                      }}
                      disabled={!onAfterTurnoChange}
                      title="Asignar número de turno"
                      className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold flex-shrink-0 cursor-pointer hover:bg-primary/20 border border-dashed border-primary/40"
                      >
                        Sin turno
                      </Badge>
                    </button>
                  )}
                  <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                </div>

                <div className="flex-1 flex items-center justify-between px-4 py-4 gap-4 min-w-0">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-lg font-bold text-foreground truncate">{truck.license_plate}</p>

                    <div className="text-xs">
                      <span className="text-muted-foreground font-medium">Producto:</span>
                      <span className="text-foreground ml-1">
                        {formatLogisticsProductLabel(truck.product)}
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-muted-foreground font-medium">Chofer:</span>
                      <span className="text-foreground ml-1">
                        {truck.driver_name?.trim() || '—'}
                      </span>
                    </div>

                    {truck.carrier_company && (
                      <div className="text-xs">
                        <span className="text-muted-foreground font-medium">Empresa:</span>
                        <span className="text-foreground ml-1">{truck.carrier_company}</span>
                      </div>
                    )}

                    {truck.dispatch_guide && (
                      <div className="text-xs">
                        <span className="text-muted-foreground font-medium">Guía:</span>
                        <span className="text-foreground ml-1">{truck.dispatch_guide}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-center px-2 py-1.5 rounded-md bg-neutral/10">
                      <p className="text-xs text-muted-foreground font-medium">Bruto</p>
                      <p className="text-sm font-bold text-foreground">
                        {Number(truck.gross_weight || 0).toLocaleString('es-CL', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        kg
                      </p>
                    </div>

                    <div className="text-center px-2 py-1.5 rounded-md bg-neutral/10">
                      <p className="text-xs text-muted-foreground font-medium">Entrada</p>
                      <p className="text-sm font-bold text-foreground">
                        {new Date(truck.entry_at).toLocaleTimeString('es-CL', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, truck.id)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()}
                  title="Arrastrar para reordenar"
                  aria-label="Arrastrar para reordenar en la cola"
                  className={[
                    'flex-shrink-0 min-w-12 flex items-center justify-center self-stretch border-l border-border/80 bg-muted/25 text-muted-foreground px-3 py-4',
                    'cursor-grab active:cursor-grabbing hover:bg-muted/45 hover:text-foreground select-none touch-none',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
                  ].join(' ')}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-xl leading-none" aria-hidden>
                    drag_pan
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {onAfterTurnoChange && (
        <AssignTurnoRollerDialog
          open={rollerTruckId != null}
          truckId={rollerTruckId}
          trucks={trucks}
          onClose={() => setRollerTruckId(null)}
          onAfterAssign={onAfterTurnoChange}
        />
      )}
    </div>
  );
};
