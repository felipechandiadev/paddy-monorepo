'use client';

import { useState, useCallback, useEffect } from 'react';
import { serialPortService } from '@/services/serialPort.service';

interface UseSerialPortReturn {
  isConnected: boolean;
  isAvailable: boolean;
  isConnecting: boolean;
  error: string | null;
  lastWeight: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  readWeight: () => number | null;
  sendCommand: (command: string) => Promise<boolean>;
}

/**
 * Hook personalizado para usar el servicio de puerto serial
 */
export function useSerialPort(enabled: boolean = false): UseSerialPortReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastWeight, setLastWeight] = useState<number | null>(null);

  // Verificar disponibilidad de Serial API
  const isAvailable = serialPortService.isAvailable();

  // Conectar
  const connect = useCallback(async () => {
    if (!isAvailable) {
      setError('Serial API no está disponible en este navegador');
      return;
    }

    if (isConnected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const success = await serialPortService.connect();
      if (success) {
        setIsConnected(true);
        // Comenzar a polling del peso
        const interval = setInterval(() => {
          const weight = serialPortService.readWeight();
          if (weight !== null) {
            setLastWeight(weight);
          }
        }, 100);

        return () => clearInterval(interval);
      } else {
        setError('No se pudo conectar al puerto serial');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error conectando: ${errorMessage}`);
      console.error('Error en conexión serial:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isAvailable]);

  // Desconectar
  const disconnect = useCallback(async () => {
    try {
      await serialPortService.disconnect();
      setIsConnected(false);
      setLastWeight(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error desconectando: ${errorMessage}`);
    }
  }, []);

  // Leer peso
  const readWeight = useCallback(() => {
    const weight = serialPortService.readWeight();
    if (weight !== null) {
      setLastWeight(weight);
    }
    return weight;
  }, []);

  // Enviar comando
  const sendCommand = useCallback(async (command: string) => {
    return await serialPortService.sendCommand(command);
  }, []);

  // Auto-conectar si enabled es true
  useEffect(() => {
    if (enabled && isAvailable && !isConnected) {
      connect();
    }
  }, [enabled, isAvailable, isConnected, connect]);

  return {
    isConnected,
    isAvailable,
    isConnecting,
    error,
    lastWeight,
    connect,
    disconnect,
    readWeight,
    sendCommand,
  };
}
