'use client';

import React from 'react';
import { Truck } from '../types/logistics.types';
import { TruckCard } from './TruckCard';

interface QueueListProps {
  trucks: Truck[];
  selectedTruckId?: string;
  onSelectTruck?: (truck: Truck) => void;
  maxDisplay?: number;
}

export const QueueList: React.FC<QueueListProps> = ({ 
  trucks, 
  selectedTruckId, 
  onSelectTruck, 
  maxDisplay = 5 
}) => {
  const pendingTrucks = trucks
    .filter(t => t.status === 'pending')
    .slice(0, maxDisplay);

  if (pendingTrucks.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center text-gray-500">
        <p className="text-lg font-medium">Queue is empty</p>
        <p className="text-sm mt-1">No pending trucks</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Next Trucks ({pendingTrucks.length})</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {pendingTrucks.map((truck, index) => (
          <div
            key={truck.id}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 flex items-center">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
            </div>
            <div className="ml-2">
              <TruckCard
                truck={truck}
                isSelected={selectedTruckId === truck.id}
                onClick={() => onSelectTruck?.(truck)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
