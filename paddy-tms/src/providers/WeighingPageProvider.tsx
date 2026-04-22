'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getTurnosTodayAction, TruckReception } from '@/actions/truckReceptionActions';

interface WeighingPageContextType {
  // Estado
  trucks: TruckReception[];
  selectedTruckId: number | null;
  isLoading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';

  // Acciones
  loadTrucksToday: () => Promise<void>;
  selectTruck: (id: number | null) => void;
  addTruck: (truck: TruckReception) => void;
  updateTruck: (truck: TruckReception) => void;
  clearError: () => void;
}

const WeighingPageContext = createContext<WeighingPageContextType | undefined>(undefined);

export const WeighingPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trucks, setTrucks] = useState<TruckReception[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Cargar turnos de hoy
  const loadTrucksToday = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const turnos = await getTurnosTodayAction();
      setTrucks(turnos);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error cargando turnos: ${message}`);
      console.error('Error cargando turnos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Seleccionar camión
  const selectTruck = useCallback((id: number | null) => {
    setSelectedTruckId(id);
  }, []);

  // Agregar camión a la lista
  const addTruck = useCallback((truck: TruckReception) => {
    setTrucks((prev) => [truck, ...prev]);
  }, []);

  // Actualizar camión existente
  const updateTruck = useCallback((truck: TruckReception) => {
    setTrucks((prev) =>
      prev.map((t) => (t.id === truck.id ? truck : t))
    );
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar turnos al montar
  useEffect(() => {
    loadTrucksToday();
  }, [loadTrucksToday]);

  // Sincronizar cola cada 30 segundos
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      setSyncStatus('syncing');
      try {
        // Recargar la lista de turnos (esto es la sincronización)
        await loadTrucksToday();
        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('error');
        console.error('Error sincronizando:', err);
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [loadTrucksToday]);

  const value: WeighingPageContextType = {
    trucks,
    selectedTruckId,
    isLoading,
    error,
    syncStatus,
    loadTrucksToday,
    selectTruck,
    addTruck,
    updateTruck,
    clearError,
  };

  return (
    <WeighingPageContext.Provider value={value}>
      {children}
    </WeighingPageContext.Provider>
  );
};

// Hook para usar el contexto
export const useWeighingPage = (): WeighingPageContextType => {
  const context = useContext(WeighingPageContext);
  if (!context) {
    throw new Error('useWeighingPage debe usarse dentro de WeighingPageProvider');
  }
  return context;
};
