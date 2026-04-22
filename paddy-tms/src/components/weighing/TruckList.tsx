'use client';

import React from 'react';
import Badge from '@/shared/components/ui/Badge/Badge';
import { TruckReception } from '@/services/truckReceptionService';

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
  // Agrupar camiones por estado
  const trucksByStatus = {
    ESPERA: trucks.filter((t) => t.status === 'ESPERA'),
    FINISHED: trucks.filter((t) => t.status === 'FINISHED'),
  };

  const renderTruckButton = (truck: TruckReception) => (
    <button
      key={truck.id}
      onClick={() => onSelectTruck(truck.id)}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
        selectedTruckId === truck.id
          ? 'bg-primary text-white shadow-md'
          : 'bg-neutral text-foreground hover:bg-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className={`font-mono font-bold text-sm truncate ${selectedTruckId === truck.id ? '' : ''}`}>
            {truck.license_plate}
          </div>
          <div className="text-xs opacity-75 truncate">
            {truck.driver_name}
          </div>
        </div>
        {truck.numero_turno && (
          <Badge
            variant={selectedTruckId === truck.id ? 'default' : 'secondary'}
            className="text-xs whitespace-nowrap"
          >
            #{truck.numero_turno}
          </Badge>
        )}
      </div>
    </button>
  );

  return (
    <div className="bg-white border-l border-border h-full flex flex-col p-4 space-y-4 overflow-y-auto">
      {/* En Espera */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            En Espera
          </h3>
          <Badge variant="primary" className="text-xs">
            {trucksByStatus.ESPERA.length}
          </Badge>
        </div>

        {trucksByStatus.ESPERA.length > 0 ? (
          <div className="space-y-1">
            {trucksByStatus.ESPERA.map((truck) => renderTruckButton(truck))}
          </div>
        ) : (
          <p className="text-xs text-muted italic px-2 py-2">Sin camiones</p>
        )}
      </div>

      {/* Finalizados */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Finalizados
          </h3>
          <Badge variant="success" className="text-xs">
            {trucksByStatus.FINISHED.length}
          </Badge>
        </div>

        {trucksByStatus.FINISHED.length > 0 ? (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {trucksByStatus.FINISHED.map((truck) => renderTruckButton(truck))}
          </div>
        ) : (
          <p className="text-xs text-muted italic px-2 py-2">Sin camiones</p>
        )}
      </div>

      {/* Stats */}
      {trucks.length > 0 && (
        <div className="border-t border-border pt-4 mt-auto">
          <p className="text-xs text-muted text-center">
            Total: <span className="font-semibold text-foreground">{trucks.length}</span> camiones
          </p>
        </div>
      )}
    </div>
  );
};
