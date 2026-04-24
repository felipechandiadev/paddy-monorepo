'use client';

import React from 'react';
import type { TruckDispatch } from '@/actions/truckDispatchActions';
import { formatLogisticsProductLabel } from '@/lib/logisticsProduct';
import Badge from '@/shared/components/ui/Badge/Badge';

interface DispatchTruckListProps {
  dispatches: TruckDispatch[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export const DispatchTruckList: React.FC<DispatchTruckListProps> = ({
  dispatches,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="bg-background rounded-lg border border-border p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 gap-2">
        <h2 className="text-lg font-bold text-foreground">En espera (registrar bruto)</h2>
        <Badge variant="secondary" className="text-sm">
          {dispatches.length}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Selecciona un despacho para pesar el bruto y finalizar.
      </p>

      <div className="space-y-3">
        {dispatches.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Sin despachos pendientes</p>
          </div>
        ) : (
          dispatches.map((d) => {
            const isSelected = selectedId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelect(d.id)}
                className={[
                  'w-full text-left rounded-lg border-2 p-4 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-md'
                    : 'border-border bg-card hover:border-primary/40',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Folio</p>
                    <p className="text-lg font-bold text-foreground">#{d.id}</p>
                  </div>
                  <Badge variant="secondary">{formatLogisticsProductLabel(d.product)}</Badge>
                </div>
                <p className="mt-2 font-mono text-sm font-semibold">{d.license_plate}</p>
                {d.producer && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {d.producer.name} · {d.producer.rut}
                  </p>
                )}
                <div className="mt-3 flex gap-4 text-sm">
                  <span>
                    <span className="text-muted-foreground">Tara: </span>
                    <span className="font-semibold">
                      {d.tare_weight != null
                        ? Number(d.tare_weight).toLocaleString('es-CL', {
                            maximumFractionDigits: 2,
                          })
                        : '—'}{' '}
                      kg
                    </span>
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
