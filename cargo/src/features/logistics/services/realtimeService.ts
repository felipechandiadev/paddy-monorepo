export const initializeRealtimeService = (onMessage: (data: any) => void) => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

  try {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Real-time service connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing real-time message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('Real-time service error:', error);
    };

    socket.onclose = () => {
      console.log('Real-time service disconnected');
    };

    return socket;
  } catch (error) {
    console.error('Failed to initialize real-time service:', error);
    return null;
  }
};

export const subscribeToTruckUpdates = (socket: WebSocket, truckId: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        action: 'subscribe',
        channel: `truck:${truckId}`,
      })
    );
  }
};

export const unsubscribeFromTruckUpdates = (socket: WebSocket, truckId: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        action: 'unsubscribe',
        channel: `truck:${truckId}`,
      })
    );
  }
};
