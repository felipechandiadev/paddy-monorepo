'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useWeighingPage } from '@/providers/WeighingPageProvider';
import { getLogisticsSocketBaseUrl } from '@/lib/logisticsSocket';

/**
 * Emite al namespace /logistics qué recepción está seleccionada en pesaje,
 * para que el monitor público destaque “en balanza”.
 */
export function WeighingMonitorSync() {
  const { selectedTruckId } = useWeighingPage();
  const socketRef = useRef<Socket | null>(null);
  const selectedRef = useRef(selectedTruckId);
  selectedRef.current = selectedTruckId;

  useEffect(() => {
    const socket = io(`${getLogisticsSocketBaseUrl()}/logistics`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('weighing-selection', {
        truck_reception_id: selectedRef.current,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (s?.connected) {
      s.emit('weighing-selection', { truck_reception_id: selectedTruckId });
    }
  }, [selectedTruckId]);

  return null;
}
