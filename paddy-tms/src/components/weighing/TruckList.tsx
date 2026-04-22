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
              className={`group relative flex items-center rounded-lg border transition-all cursor-move overflow-hidden ${
                selectedTruckId === truck.id
                  ? 'bg-primary/10 border-primary shadow-lg'
                  : draggedId === truck.id
                  ? 'bg-neutral/20 border-primary/50 opacity-60'
                  : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Icono de Flecha - 18% ancho con padding izquierdo */}
              <div className="w-[18%] flex items-center justify-center bg-gradient-to-r from-primary/5 to-transparent py-4 pl-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(truck.id);
                  }}
                  className="p-3 rounded-full hover:bg-primary/20 transition-colors"
                  title="Seleccionar para pesar"
                >
                  {/* Icono de flecha izquierda en cuadrado */}
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Cuadrado */}
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    {/* Flecha izquierda */}
                    <path d="M 15 12 L 9 12 M 9 12 L 12 9 M 9 12 L 12 15" />
                  </svg>
                </button>
              </div>

              {/* Contenido Principal - 82% ancho */}
              <div className="flex-1 flex items-center justify-between p-4 pr-3 relative gap-4">
                {/* Sección izquierda: Info principal */}
                <div className="flex-1 min-w-0">
                  {/* Patente + Turno */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-lg font-bold text-foreground truncate">
                      {truck.license_plate}
                    </p>
                    <Badge variant="primary" className="text-xs font-semibold flex-shrink-0">
                      #{truck.numero_turno}
                    </Badge>
                  </div>

                  {/* Chofer - Más pequeño */}
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {truck.driver_name}
                  </p>

                  {/* Empresa y Guía - Más pequeño, una sola línea */}
                  <div className="text-xs text-muted-foreground truncate">
                    {truck.carrier_company && (
                      <span>{truck.carrier_company}</span>
                    )}
                    {truck.carrier_company && truck.dispatch_guide && (
                      <span className="mx-1">•</span>
                    )}
                    {truck.dispatch_guide && (
                      <span>{truck.dispatch_guide}</span>
                    )}
                  </div>
                </div>

                {/* Sección derecha: Pesos y entrada */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Peso Bruto */}
                  <div className="text-center px-2 py-1.5 rounded-md bg-neutral/10">
                    <p className="text-xs text-muted-foreground font-medium">Bruto</p>
                    <p className="text-sm font-bold text-foreground">
                      {Number(truck.gross_weight || 0).toFixed(0)} kg
                    </p>
                  </div>

                  {/* Entrada */}
                  <div className="text-center px-2 py-1.5 rounded-md bg-neutral/10">
                    <p className="text-xs text-muted-foreground font-medium">Entrada</p>
                    <p className="text-sm font-bold text-foreground">
                      {new Date(truck.entry_at).toLocaleTimeString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Icono Drag - Esquina Superior Derecha */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-neutral/20 transition-colors"
                    title="Arrastrar"
                  >
                    <svg
                      className="w-4 h-4 text-muted-foreground"
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
