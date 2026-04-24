'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useLogistics } from './useLogistics';
import { ACTION_TYPES } from '../context/actions';
import { Truck } from '../types/logistics.types';

export const useRealtimeSync = (enabled = false) => {
  const { dispatch, setError } = useLogistics();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectSocket = useCallback(() => {
    if (!enabled) {
      console.log('WebSocket sync disabled');
      return null;
    }

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
      console.log('Attempting WebSocket connection to:', wsUrl);
      
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
        console.warn('WebSocket error - Real-time updates disabled:', error);
        // No mostrar error en UI - es esperado si el backend no tiene WebSocket configurado
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        socketRef.current = null;
        
        if (enabled) {
          // Intentar reconectar después de 5 segundos
          reconnectTimeoutRef.current = setTimeout(() => {
            connectSocket();
          }, 5000);
        }
      };

      socketRef.current = socket;
      return socket;
    } catch (error) {
      console.warn('WebSocket connection error - falling back to polling:', error);
      // No mostrar error - es opcional si el backend no tiene WebSocket
      return null;
    }
  }, [dispatch, enabled]);

  useEffect(() => {
    if (enabled) {
      connectSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectSocket, enabled]);

  return {
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
  };
};
