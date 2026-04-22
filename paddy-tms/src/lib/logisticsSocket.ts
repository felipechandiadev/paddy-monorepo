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
