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
              className={`group relative flex items-center rounded-lg border transition-all cursor-move overflow-hidden ${
                selectedTruckId === truck.id
                  ? 'bg-primary/10 border-primary shadow-lg'
                  : draggedId === truck.id
                  ? 'bg-neutral/20 border-primary/50 opacity-60'
                  : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Icono de Balanza - 18% ancho */}
              <div className="w-[18%] flex items-center justify-center bg-gradient-to-r from-primary/5 to-transparent py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(truck.id);
                  }}
                  className="p-3 rounded-full hover:bg-primary/20 transition-colors"
                  title="Seleccionar para pesar"
                >
                  {/* Icono de Balanza mejorado */}
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Base de la balanza */}
                    <path d="M 20 18 L 4 18 L 4 20 L 20 20 Z" />
                    {/* Poste central */}
                    <path d="M 11 20 L 11 4" strokeWidth="1.5" stroke="currentColor" fill="none" />
                    {/* Brazos de la balanza */}
                    <path d="M 6 6 L 16 6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
                    {/* Platillo izquierdo */}
                    <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                    <path d="M 3 7 L 9 7 L 8.5 11 L 3.5 11 Z" fill="currentColor" opacity="0.6" />
                    {/* Platillo derecho */}
                    <circle cx="16" cy="6" r="1.5" fill="currentColor" />
                    <path d="M 15 7 L 21 7 L 20.5 11 L 15.5 11 Z" fill="currentColor" opacity="0.6" />
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

                  {/* Chofer */}
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {truck.driver_name}
                  </p>

                  {/* Empresa y Guía - una sola línea */}
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

                {/* Sección derecha: Pesos y hora */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Peso Bruto */}
                  <div className="text-center px-2 py-1.5 rounded-md bg-neutral/10">
                    <p className="text-xs text-muted-foreground font-medium">Bruto</p>
                    <p className="text-sm font-bold text-foreground">
                      {Number(truck.gross_weight || 0).toFixed(0)} kg
                    </p>
                  </div>

                  {/* Hora */}
                  <div className="text-center px-2 py-1.5 rounded-md bg-neutral/10">
                    <p className="text-xs text-muted-foreground font-medium">Hora</p>
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
