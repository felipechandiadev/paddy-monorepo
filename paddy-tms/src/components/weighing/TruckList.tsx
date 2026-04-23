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

/** Fantasma bajo el cursor: carta “levantada” con sombra y borde acentuado. */
function setQueueCardDragPreview(e: React.DragEvent, rowEl: HTMLElement) {
  const rect = rowEl.getBoundingClientRect();
  const clone = rowEl.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.querySelectorAll('[draggable]').forEach((el) => el.removeAttribute('draggable'));

  const w = Math.round(rect.width);
  const shadowLift =
    '0 28px 56px -16px rgba(0,0,0,0.38), 0 0 0 2px rgba(37, 99, 168, 0.55), 0 14px 32px -12px rgba(28, 32, 70, 0.35)';

  clone.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    `width:${w}px`,
    'pointer-events:none',
    'opacity:1',
    'border-radius:0.5rem',
    'overflow:hidden',
    'box-sizing:border-box',
    `box-shadow:${shadowLift}`,
    'transform:translate3d(-9999px,0,0) rotate(-1.25deg) scale(1.025)',
    'z-index:2147483647',
    'background:var(--color-background)',
    'will-change:transform',
  ].join(';');

  document.body.appendChild(clone);
  const offsetX = Math.max(8, Math.min(e.clientX - rect.left, w - 8));
  const offsetY = Math.max(8, Math.min(e.clientY - rect.top, rect.height - 8));
  e.dataTransfer.setDragImage(clone, offsetX, offsetY);
  requestAnimationFrame(() => clone.remove());
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
  onAfterTurnoChange?: () => Promise<void>;
}

export const TruckList: React.FC<TruckListProps> = ({
  trucks,
  selectedTruckId,
  onSelectTruck,
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

  const handleRowDragStart = (e: React.DragEvent, truckId: number, rowEl: HTMLElement) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.preventDefault();
      return;
    }
    setDraggedId(truckId);
    e.dataTransfer.setData('text/paddy-truck-id', String(truckId));
    e.dataTransfer.effectAllowed = 'move';
    setQueueCardDragPreview(e, rowEl);
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
        <Badge variant="secondary" className="text-sm">
          {orderedTrucks.length}
        </Badge>
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
                data-truck-queue-row
                aria-grabbed={isDragging}
                draggable
                onDragStart={(e) => handleRowDragStart(e, truck.id, e.currentTarget)}
                onDragEnd={handleDragEnd}
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
                  'group flex items-stretch rounded-lg border-2 overflow-hidden transition-[opacity,box-shadow,transform,border-color,background-color] duration-200',
                  isDragging
                    ? 'opacity-[0.52] cursor-grabbing border-dashed border-primary/70 bg-muted/40 shadow-[inset_0_1px_12px_rgba(0,0,0,0.08)] ring-2 ring-inset ring-primary/25 scale-[0.992]'
                    : '',
                  !isDragging && isHead ? 'cursor-pointer' : '',
                  !isDragging && !isHead ? 'cursor-grab active:cursor-grabbing' : '',
                  !isDragging && isDragOver ? 'ring-2 ring-primary/45 border-primary/65 shadow-md' : '',
                  !isDragging &&
                    isHead &&
                    !isSelected &&
                    'ring-1 ring-amber-500/50 border-amber-500/40 bg-amber-500/5',
                  !isDragging && !isHead && 'border-border bg-card opacity-95 hover:border-primary/35',
                  !isDragging && isSelected && isHead
                    ? 'bg-primary/10 border-primary shadow-lg ring-2 ring-primary'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="w-[18%] flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-primary/5 to-transparent px-4 py-4">
                  {isHead && (
                    <Badge variant="primary" className="text-[10px] font-semibold uppercase tracking-wide">
                      Siguiente tara
                    </Badge>
                  )}
                  {truck.numero_turno != null ? (
                    <div className="flex items-center gap-0.5">
                      <Badge variant="primary" className="text-xs font-semibold flex-shrink-0">
                        #{truck.numero_turno}
                      </Badge>
                      {onAfterTurnoChange && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRollerTruckId(truck.id);
                          }}
                          title="Cambiar número de turno"
                          aria-label="Cambiar número de turno"
                          className="inline-flex items-center justify-center rounded-md p-1 text-primary hover:bg-primary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span className="material-symbols-outlined text-lg leading-none">edit_square</span>
                        </button>
                      )}
                    </div>
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
                  title="Arrastrar la fila para reordenar"
                  aria-hidden
                  className={[
                    'flex-shrink-0 min-w-12 flex items-center justify-center self-stretch border-l border-border/80 bg-muted/25 text-muted-foreground px-3 py-4',
                    'pointer-events-none select-none',
                    'group-hover:bg-muted/35',
                  ].join(' ')}
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
