'use client';

import React from 'react';
import { Truck } from '../types/logistics.types';

interface TruckCardProps {
  truck: Truck;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TruckCard: React.FC<TruckCardProps> = ({ truck, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border transition-all cursor-pointer
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{truck.plate}</h3>
        <span className={`
          px-2 py-1 rounded-full text-sm font-medium
          ${truck.status === 'completed' ? 'bg-green-100 text-green-800' :
            truck.status === 'weighing' ? 'bg-blue-100 text-blue-800' :
            truck.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'}
        `}>
          {truck.status}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Driver:</span> {truck.driverName}</p>
        <p><span className="font-medium">Document:</span> {truck.driverDocument}</p>
        {truck.weight && (
          <p><span className="font-medium">Weight:</span> {truck.weight} kg</p>
        )}
        <p className="text-xs text-gray-500">
          Entry: {new Date(truck.entryTime).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
