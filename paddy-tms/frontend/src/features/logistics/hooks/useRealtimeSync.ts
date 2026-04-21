'use client';

import { useEffect, useCallback } from 'react';
import { useLogistics } from './useLogistics';
import { ACTION_TYPES } from '../context/actions';
import { Truck } from '../types/logistics.types';

export const useRealtimeSync = (enabled = true) => {
  const { dispatch, setError } = useLogistics();

  const connectSocket = useCallback(() => {
    if (!enabled) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'truck_updated') {
            dispatch({
              type: ACTION_TYPES.UPDATE_TRUCK,
              payload: data.truck,
            });
          } else if (data.type === 'truck_added') {
            dispatch({
              type: ACTION_TYPES.ADD_TRUCK,
              payload: data.truck,
            });
          } else if (data.type === 'reception_recorded') {
            dispatch({
              type: ACTION_TYPES.ADD_RECEPTION,
              payload: data.reception,
            });
          }
        } catch (error) {
          console.error('Error parsing socket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error with real-time updates');
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        if (enabled) {
          setTimeout(connectSocket, 3000);
        }
      };

      return socket;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'WebSocket connection failed';
      setError(message);
    }
  }, [dispatch, setError, enabled]);

  useEffect(() => {
    let socket: WebSocket | undefined;

    if (enabled) {
      socket = connectSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectSocket, enabled]);

  return {
    isConnected: true,
  };
};
