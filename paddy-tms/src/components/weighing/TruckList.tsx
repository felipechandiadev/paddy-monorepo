'use client';

import React, { useState } from 'react';
import { TruckReception } from '@/actions/truckReceptionActions';
import Badge from '@/shared/components/ui/Badge/Badge';

interface TruckListProps {
  trucks: TruckReception[];
  selectedTruckId: number | null;
  onSelectTruck: (id: number) => void;
}

export const TruckList: React.FC<TruckListProps> = ({
  trucks,
  selectedTruckId,
  onSelectTruck,
}) => {
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const trucksByStatus = {
    ESPERA: trucks.filter(t => t.status === 'ESPERA'),
    FINISHED: trucks.filter(t => t.status === 'FINISHED'),
  };

  const handleDragStart = (e: React.DragEvent, truckId: number) => {
    setDraggedId(truckId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const formatWeight = (weight: number | undefined | null): string => {
    if (!weight) return '0 kg';
    return `${Number(weight).toFixed(2)} kg`;
  };

  return (
    <div className="bg-background rounded-lg border border-border p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">En Espera para Tara</h2>
        <Badge variant="secondary" className="text-sm">
          {trucksByStatus.ESPERA.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {trucksByStatus.ESPERA.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Sin camiones en espera</p>
          </div>
        ) : (
          trucksByStatus.ESPERA.map((truck) => (
            <div
              key={truck.id}
              draggable
              onDragStart={(e) => handleDragStart(e, truck.id)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelectTruck(truck.id)}
              className={`group relative flex items-stretch rounded-lg border-2 transition-all cursor-move overflow-hidden ${
                selectedTruckId === truck.id
                  ? 'bg-primary/15 border-primary shadow-lg'
                  : draggedId === truck.id
                  ? 'bg-neutral/20 border-primary/50 opacity-60'
                  : 'bg-background border-border hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {/* Icono de Balanza/Pesaje - 20% ancho */}
              <div className="w-[20%] flex items-center justify-center bg-gradient-to-b from-primary/10 to-transparent border-r border-border">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(truck.id);
                  }}
                  className="p-3 rounded-full hover:bg-primary/20 transition-colors"
                  title="Registrar peso"
                >
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 6M6 7l3 9M6 7l6-1m6 11a5 5 0 10-10 0"
                    />
                  </svg>
                </button>
              </div>

              {/* Contenido Principal - 80% ancho */}
              <div className="flex-1 flex flex-col justify-between p-4 relative">
                {/* Icono Drag - Esquina Superior Derecha */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-neutral/20 transition-colors"
                    title="Arrastrar"
                  >
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="5" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="9" cy="19" r="1.5" />
                      <circle cx="15" cy="5" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="15" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>

                {/* Fila 1: Patente y Turno */}
                <div className="flex items-baseline justify-between mb-2 pr-8">
                  <p className="font-bold text-lg text-foreground">
                    {truck.license_plate}
                  </p>
                  <Badge variant="primary" className="text-xs font-semibold">
                    Turno #{truck.numero_turno}
                  </Badge>
                </div>

                {/* Fila 2: Chofer */}
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">
                    Chofer: <span className="text-foreground font-medium">{truck.driver_name}</span>
                  </p>
                </div>

                {/* Fila 3: Empresa y Guía */}
                <div className="flex gap-4 mb-2 text-xs">
                  {truck.carrier_company && (
                    <p className="text-muted-foreground">
                      Empresa: <span className="text-foreground font-medium">{truck.carrier_company}</span>
                    </p>
                  )}
                  {truck.dispatch_guide && (
                    <p className="text-muted-foreground">
                      Guía: <span className="text-foreground font-medium">{truck.dispatch_guide}</span>
                    </p>
                  )}
                </div>

                {/* Fila 4: Pesos */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2 bg-neutral/10 px-3 py-1.5 rounded-md">
                    <span className="text-xs text-muted-foreground">Bruto:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatWeight(truck.gross_weight)}
                    </span>
                  </div>
                  {truck.tare_weight && (
                    <div className="flex items-center gap-2 bg-neutral/10 px-3 py-1.5 rounded-md">
                      <span className="text-xs text-muted-foreground">Tara:</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatWeight(truck.tare_weight)}
                      </span>
                    </div>
                  )}
                  {truck.net_weight && (
                    <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-md">
                      <span className="text-xs text-muted-foreground">Neto:</span>
                      <span className="text-sm font-semibold text-success">
                        {formatWeight(truck.net_weight)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fila 5: Hora de entrada */}
                <div className="mt-2 text-xs text-muted-foreground">
                  Entrada: {new Date(truck.entry_at).toLocaleTimeString('es-CL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
