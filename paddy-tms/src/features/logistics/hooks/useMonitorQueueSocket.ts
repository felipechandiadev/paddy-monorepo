'use client';

import { useEffect, useState } from 'react';
import { createLogisticsSocket } from '@/lib/logisticsSocket';

export interface MonitorQueueItem {
  id: number;
  numero_turno: number;
  license_plate: string;
  entry_at: string;
  status: string;
}

export interface MonitorState {
  serverTime: string;
  weighingTruckReceptionId: number | null;
  waiting: MonitorQueueItem[];
}

export function useMonitorQueueSocket() {
  const [state, setState] = useState<MonitorState | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = createLogisticsSocket();

    const onState = (payload: MonitorState) => {
      setState(payload);
      setError(null);
    };

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (e: Error) => {
      setError(e.message || 'No se pudo conectar al servidor en tiempo real');
    });
    socket.on('monitor-state', onState);

    return () => {
      socket.off('monitor-state', onState);
      socket.disconnect();
    };
  }, []);

  return { state, connected, error };
}
