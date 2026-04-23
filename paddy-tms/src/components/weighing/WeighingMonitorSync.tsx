'use client';

import { useEffect, useRef } from 'react';
import { useWeighingPage } from '@/providers/WeighingPageProvider';
import { getSharedWeighingLogisticsSocket } from '@/lib/logisticsSocket';

/**
 * Emite al namespace /logistics qué recepción está seleccionada en pesaje,
 * para que el monitor público destaque “en balanza”.
 * Usa el mismo socket que emitEsperaQueueOrder (TruckList).
 */
export function WeighingMonitorSync() {
  const { selectedTruckId } = useWeighingPage();
  const selectedRef = useRef(selectedTruckId);
  selectedRef.current = selectedTruckId;

  useEffect(() => {
    const socket = getSharedWeighingLogisticsSocket();

    const onConnect = () => {
      socket.emit('weighing-selection', {
        truck_reception_id: selectedRef.current,
      });
    };

    socket.on('connect', onConnect);
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
    };
  }, []);

  useEffect(() => {
    const s = getSharedWeighingLogisticsSocket();
    const send = () =>
      s.emit('weighing-selection', { truck_reception_id: selectedTruckId });
    if (s.connected) {
      send();
    } else {
      s.once('connect', send);
    }
  }, [selectedTruckId]);

  return null;
}
