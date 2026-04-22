'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { serialPortService } from '@/services/serialPort.service';
import { serialPortConfigStorage } from '@/services/serialPortConfigService';

interface UseSerialPortReturn {
  isConnected: boolean;
  isAvailable: boolean;
  isConnecting: boolean;
  error: string | null;
  lastWeight: number | null;
  connect: () => Promise<void>;
  connectChoosingPort: () => Promise<void>;
  disconnect: () => Promise<void>;
  readWeight: () => number | null;
  sendCommand: (command: string) => Promise<boolean>;
}

function persistSerialConfig() {
  const fp = serialPortService.getPortFingerprint();
  serialPortConfigStorage.saveConfig({
    port: fp || 'serial',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    lastUsed: new Date().toISOString(),
  });
}

/**
 * Hook personalizado para usar el servicio de puerto serial
 */
export function useSerialPort(enabled: boolean = false): UseSerialPortReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  /** Evita que el efecto de auto-conexión vuelva a conectar tras un Desconectar explícito */
  const suppressAutoConnectRef = useRef(false);

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
        persistSerialConfig();
        // Comenzar a polling del peso
        const interval = setInterval(() => {
          const weight = serialPortService.readWeight();
          if (weight !== null) {
            setLastWeight(weight);
          }
        }, 100);
        
        pollingIntervalRef.current = interval;
      } else {
        setError('No se pudo conectar al puerto serial');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error conectando: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isAvailable]);

  const connectChoosingPort = useCallback(async () => {
    if (!isAvailable) {
      setError('Serial API no está disponible en este navegador');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      const success = await serialPortService.connectChoosingPort();
      if (success) {
        suppressAutoConnectRef.current = false;
        setIsConnected(true);
        persistSerialConfig();
        const interval = setInterval(() => {
          const weight = serialPortService.readWeight();
          if (weight !== null) {
            setLastWeight(weight);
          }
        }, 100);
        pollingIntervalRef.current = interval;
      } else {
        setIsConnected(false);
        setError('No se pudo conectar o se canceló la selección del puerto');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error: ${errorMessage}`);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isAvailable]);

  // Desconectar
  const disconnect = useCallback(async () => {
    try {
      suppressAutoConnectRef.current = true;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
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

  // Auto-conectar si enabled es true (no tras desconectar manualmente en esta sesión)
  useEffect(() => {
    if (enabled && isAvailable && !isConnected && !suppressAutoConnectRef.current) {
      connect();
    }
  }, [enabled, isAvailable, isConnected, connect]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    isAvailable,
    isConnecting,
    error,
    lastWeight,
    connect,
    connectChoosingPort,
    disconnect,
    readWeight,
    sendCommand,
  };
}
