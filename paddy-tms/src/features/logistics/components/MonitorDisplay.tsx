'use client';

import React, { useEffect, useState } from 'react';
import { useLogisticsData } from '../hooks/useLogisticsData';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { TruckCard } from './TruckCard';

interface MonitorDisplayProps {
  refreshInterval?: number;
  publicView?: boolean;
}

export const MonitorDisplay: React.FC<MonitorDisplayProps> = ({ 
  refreshInterval = 5000,
  publicView = true 
}) => {
  const { trucks, loading, error, refetch } = useLogisticsData(true);
  // Solo habilitar WebSocket en monitor view (comentado por ahora ya que no hay WS server)
  const { isConnected } = useRealtimeSync(false);

  useEffect(() => {
    if (!publicView) return;

    const interval = setInterval(() => {
      refetch();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refetch, publicView]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">Error loading data</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  const activeTrucks = trucks.filter(t => t.status !== 'completed');
  const completedTrucks = trucks.filter(t => t.status === 'completed').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Active</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">{activeTrucks.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Completed Today</p>
          <p className="text-3xl font-bold text-green-900 mt-1">{completedTrucks.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Real-time</p>
          <p className={`text-3xl font-bold mt-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Offline'}
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Trucks</h3>
        {activeTrucks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active trucks</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrucks.map(truck => (
              <TruckCard key={truck.id} truck={truck} />
            ))}
          </div>
        )}
      </div>

      {completedTrucks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recently Completed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedTrucks.map(truck => (
              <TruckCard key={truck.id} truck={truck} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
