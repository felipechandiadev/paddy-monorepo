import { io, type Socket } from 'socket.io-client';

/** Origen HTTP del API Nest (sin path /api/v1); mismo host que Socket.IO. */
export function getLogisticsSocketBaseUrl(): string {
  const api =
    process.env.NEXT_PUBLIC_WS_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3000/api/v1';
  try {
    const u = new URL(api);
    return `${u.protocol}//${u.host}`;
  } catch {
    return 'http://localhost:3000';
  }
}

export function createLogisticsSocket(): Socket {
  return io(`${getLogisticsSocketBaseUrl()}/logistics`, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 12,
    reconnectionDelay: 1500,
  });
}

/**
 * Socket compartido para la pantalla de pesaje (selección en balanza + orden de cola).
 * El monitor usa su propia conexión vía createLogisticsSocket.
 */
let sharedWeighingSocket: Socket | null = null;

export function getSharedWeighingLogisticsSocket(): Socket {
  if (!sharedWeighingSocket) {
    sharedWeighingSocket = io(`${getLogisticsSocketBaseUrl()}/logistics`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 12,
      reconnectionDelay: 1500,
    });
  }
  return sharedWeighingSocket;
}

/** Notifica al backend el orden de la cola ESPERA tras drag-and-drop; el monitor recibe `monitor-state` actualizado. */
export function emitEsperaQueueOrder(orderedIds: number[]): void {
  const s = getSharedWeighingLogisticsSocket();
  const payload = { ordered_ids: orderedIds };
  const send = () => s.emit('espera-queue-order', payload);
  if (s.connected) {
    send();
  } else {
    s.once('connect', send);
  }
}
