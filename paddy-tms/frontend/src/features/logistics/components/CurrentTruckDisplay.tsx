'use client';

import React from 'react';
import { Truck } from '../types/logistics.types';

interface CurrentTruckDisplayProps {
  truck: Truck | null;
  isLoading?: boolean;
}

export const CurrentTruckDisplay: React.FC<CurrentTruckDisplayProps> = ({ truck, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p className="text-lg font-medium">No truck in process</p>
        <p className="text-sm mt-1">Waiting for next truck...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{truck.plate}</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {truck.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Driver Name</p>
          <p className="text-lg font-semibold text-gray-900">{truck.driverName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Document</p>
          <p className="text-lg font-semibold text-gray-900">{truck.driverDocument}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Entry Time</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(truck.entryTime).toLocaleTimeString()}
          </p>
        </div>
        {truck.weight && (
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="text-lg font-semibold text-gray-900">{truck.weight} kg</p>
          </div>
        )}
      </div>
    </div>
  );
};
