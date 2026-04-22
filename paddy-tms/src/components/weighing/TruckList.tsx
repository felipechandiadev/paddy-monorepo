'use client';

import React from 'react';
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
  const trucksByStatus = {
    ESPERA: trucks.filter(t => t.status === 'ESPERA'),
    FINISHED: trucks.filter(t => t.status === 'FINISHED'),
  };

  const renderTruckGroup = (status: 'ESPERA' | 'FINISHED', statusLabel: string) => {
    const groupTrucks = trucksByStatus[status];

    return (
      <div key={status} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">{statusLabel}</h3>
          <Badge variant="secondary" className="text-xs">
            {groupTrucks.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {groupTrucks.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">Sin camiones</p>
          ) : (
            groupTrucks.map((truck) => (
              <button
                key={truck.id}
                onClick={() => onSelectTruck(truck.id)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  selectedTruckId === truck.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-background border-border hover:bg-neutral'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {truck.license_plate}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {truck.driver_name}
                    </p>
                  </div>
                  <Badge variant="primary" className="text-xs whitespace-nowrap">
                    #{truck.numero_turno}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background rounded-lg border border-border p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-foreground mb-6">En Espera para Tara</h2>

      <div className="space-y-2">
        {trucksByStatus.ESPERA.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">Sin camiones en espera</p>
        ) : (
          trucksByStatus.ESPERA.map((truck) => (
            <button
              key={truck.id}
              onClick={() => onSelectTruck(truck.id)}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                selectedTruckId === truck.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-background border-border hover:bg-neutral'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {truck.license_plate}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {truck.driver_name}
                  </p>
                </div>
                <Badge variant="primary" className="text-xs whitespace-nowrap">
                  #{truck.numero_turno}
                </Badge>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
