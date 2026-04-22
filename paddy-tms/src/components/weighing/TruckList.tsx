'use client';

import React, { useState, useEffect } from 'react';
import { TruckReception, updateTruckTurnoAction } from '@/actions/truckReceptionActions';
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
  const [orderedTrucks, setOrderedTrucks] = useState<TruckReception[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const espera = trucks.filter(t => t.status === 'ESPERA');
    setOrderedTrucks(espera);
  }, [trucks]);

  const handleDragStart = (e: React.DragEvent, truckId: number) => {
    setDraggedId(truckId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('truckId', truckId.toString());
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, truckId: number) => {
    e.preventDefault();
    setDragOverId(truckId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetTruckId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedId || draggedId === targetTruckId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedIndex = orderedTrucks.findIndex(t => t.id === draggedId);
    const targetIndex = orderedTrucks.findIndex(t => t.id === targetTruckId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Simple swap: intercambiar las posiciones
    const newList = [...orderedTrucks];
    [newList[draggedIndex], newList[targetIndex]] = [newList[targetIndex], newList[draggedIndex]];

    // Actualizar los números de turno en los objetos
    newList.forEach((truck, index) => {
      truck.numero_turno = index + 1;
    });

    setOrderedTrucks(newList);
    setDraggedId(null);
    setDragOverId(null);

    // Actualizar turnos en el backend
    setIsUpdating(true);
    try {
      // Actualizar todos los turnos con sus nuevas posiciones
      const updatePromises = newList.map((truck, index) =>
        updateTruckTurnoAction(truck.id, index + 1)
      );
      
      await Promise.all(updatePromises);
      console.log('Turnos actualizados exitosamente:', newList.map(t => ({ id: t.id, turno: t.numero_turno })));
    } catch (error) {
      console.error('Error actualizando turnos:', error);
      // Revertir a la lista original en caso de error
      const espera = trucks.filter(t => t.status === 'ESPERA');
      setOrderedTrucks(espera);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-background rounded-lg border border-border p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">En Espera para Tara</h2>
        <Badge variant="secondary" className="text-sm">
          {orderedTrucks.length}
        </Badge>
      </div>

      <div className="space-y-3" onDragOver={handleDragOver}>
        {orderedTrucks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Sin camiones en espera</p>
          </div>
        ) : (
          orderedTrucks.map((truck) => (
            <div
              key={truck.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, truck.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, truck.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, truck.id)}
              onClick={() => onSelectTruck(truck.id)}
              className={`group relative flex items-center rounded-lg border-2 transition-all cursor-move overflow-hidden ${
                isUpdating ? 'opacity-50 cursor-wait' :
                draggedId === truck.id
                  ? 'opacity-50 border-dashed border-primary/50'
                  : dragOverId === truck.id
                  ? 'bg-primary/5 border-primary border-dashed shadow-md'
                  : selectedTruckId === truck.id
                  ? 'bg-primary/10 border-primary shadow-lg'
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
                  className="p-3 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50"
                  title="Seleccionar para pesar"
                  disabled={isUpdating}
                >
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M 15 12 L 9 12 M 9 12 L 12 9 M 9 12 L 12 15" />
                  </svg>
                </button>
              </div>

              {/* Contenido Principal - 82% ancho */}
              <div className="flex-1 flex items-center justify-between p-4 pr-3 relative gap-4">
                {/* Sección izquierda: Info principal */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Patente + Turno */}
                  <div className="flex items-baseline gap-3">
                    <p className="text-lg font-bold text-foreground truncate">
                      {truck.license_plate}
                    </p>
                    <Badge variant="primary" className="text-xs font-semibold flex-shrink-0">
                      #{truck.numero_turno}
                    </Badge>
                  </div>

                  {/* Chofer */}
                  <div className="text-xs">
                    <span className="text-muted-foreground font-medium">Chofer:</span>
                    <span className="text-foreground ml-1">{truck.driver_name}</span>
                  </div>

                  {/* Empresa */}
                  {truck.carrier_company && (
                    <div className="text-xs">
                      <span className="text-muted-foreground font-medium">Empresa:</span>
                      <span className="text-foreground ml-1">{truck.carrier_company}</span>
                    </div>
                  )}

                  {/* Guía */}
                  {truck.dispatch_guide && (
                    <div className="text-xs">
                      <span className="text-muted-foreground font-medium">Guía:</span>
                      <span className="text-foreground ml-1">{truck.dispatch_guide}</span>
                    </div>
                  )}
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
                        hour12: false,
                      })}
                    </p>
                  </div>
                </div>

                {/* Icono Drag - Esquina Superior Derecha */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-neutral/20 transition-colors disabled:opacity-50"
                    title="Arrastrar para reordenar"
                    disabled={isUpdating}
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
