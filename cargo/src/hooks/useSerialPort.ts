'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { serialPortService, type SerialRawSample } from '@/services/serialPort.service';
import { serialPortConfigStorage } from '@/services/serialPortConfigService';

interface UseSerialPortReturn {
  isConnected: boolean;
  isAvailable: boolean;
  isConnecting: boolean;
  error: string | null;
  lastWeight: number | null;
  lastRawSample: SerialRawSample | null;
  bytesReceivedTotal: number;
  configuredBaudRate: number;
  configuredDataBits: 7 | 8;
  configuredParity: 'none' | 'even' | 'odd';
  connect: () => Promise<void>;
  connectChoosingPort: () => Promise<void>;
  disconnect: () => Promise<void>;
  readWeight: () => number | null;
  sendCommand: (command: string) => Promise<boolean>;
}

function persistSerialConfig() {
  const fp = serialPortService.getPortFingerprint();
  const prev = serialPortConfigStorage.getConfig();
  serialPortConfigStorage.saveConfig({
    port: fp || 'serial',
    baudRate: prev?.baudRate ?? 9600,
    dataBits: prev?.dataBits === 8 ? 8 : 7,
    stopBits: 1,
    parity: prev?.parity === 'even' || prev?.parity === 'odd' ? prev.parity : 'none',
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
  const [lastRawSample, setLastRawSample] = useState<SerialRawSample | null>(null);
  const [bytesReceivedTotal, setBytesReceivedTotal] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectedRef = useRef(false);
  /** Evita que el efecto de auto-conexión vuelva a conectar tras un Desconectar explícito */
  const suppressAutoConnectRef = useRef(false);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // Verificar disponibilidad de Serial API
  const isAvailable = serialPortService.isAvailable();
  const configuredBaudRate = serialPortService.getConfiguredBaudRate();
  const configuredDataBits = serialPortService.getConfiguredDataBits();
  const configuredParity = serialPortService.getConfiguredParity();

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
        suppressAutoConnectRef.current = false;
        setIsConnected(true);
        persistSerialConfig();
        const interval = setInterval(() => {
          if (!serialPortService.getIsConnected() && isConnectedRef.current) {
            isConnectedRef.current = false;
            suppressAutoConnectRef.current = true;
            setIsConnected(false);
            const lost = serialPortService.getConnectionLostMessage();
            if (lost) {
              setError(lost);
            }
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            return;
          }
          const weight = serialPortService.readWeight();
          if (weight !== null) {
            setLastWeight(weight);
          }
          setLastRawSample(serialPortService.getLastRawSample());
          setBytesReceivedTotal(serialPortService.getBytesReceivedTotal());
        }, 100);

        pollingIntervalRef.current = interval;
      } else {
        suppressAutoConnectRef.current = true;
        setError(
          serialPortService.getConnectionLostMessage() || 'No se pudo conectar al puerto serial',
        );
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
          if (!serialPortService.getIsConnected() && isConnectedRef.current) {
            isConnectedRef.current = false;
            suppressAutoConnectRef.current = true;
            setIsConnected(false);
            const lost = serialPortService.getConnectionLostMessage();
            if (lost) {
              setError(lost);
            }
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            return;
          }
          const weight = serialPortService.readWeight();
          if (weight !== null) {
            setLastWeight(weight);
          }
          setLastRawSample(serialPortService.getLastRawSample());
          setBytesReceivedTotal(serialPortService.getBytesReceivedTotal());
        }, 100);
        pollingIntervalRef.current = interval;
      } else {
        setIsConnected(false);
        suppressAutoConnectRef.current = true;
        setError(
          serialPortService.getConnectionLostMessage() ||
            'No se pudo conectar o se canceló la selección del puerto',
        );
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
      setLastRawSample(null);
      setBytesReceivedTotal(0);
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
    lastRawSample,
    bytesReceivedTotal,
    configuredBaudRate,
    configuredDataBits,
    configuredParity,
    connect,
    connectChoosingPort,
    disconnect,
    readWeight,
    sendCommand,
  };
}
