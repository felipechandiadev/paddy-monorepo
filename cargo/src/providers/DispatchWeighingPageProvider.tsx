'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getDispatchesWeighingQueueTodayAction,
  type TruckDispatch,
} from '@/actions/truckDispatchActions';

interface DispatchWeighingPageContextType {
  dispatches: TruckDispatch[];
  selectedDispatchId: number | null;
  isLoading: boolean;
  error: string | null;
  loadDispatchesToday: () => Promise<void>;
  selectDispatch: (id: number | null) => void;
  addDispatch: (d: TruckDispatch) => void;
  updateDispatch: (d: TruckDispatch) => void;
  clearError: () => void;
}

const DispatchWeighingPageContext = createContext<
  DispatchWeighingPageContextType | undefined
>(undefined);

export const DispatchWeighingPageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [dispatches, setDispatches] = useState<TruckDispatch[]>([]);
  const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDispatchesToday = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getDispatchesWeighingQueueTodayAction();
      setDispatches(rows);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error cargando despachos: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectDispatch = useCallback((id: number | null) => {
    setSelectedDispatchId(id);
  }, []);

  const addDispatch = useCallback((d: TruckDispatch) => {
    setDispatches((prev) => [d, ...prev]);
  }, []);

  const updateDispatch = useCallback((d: TruckDispatch) => {
    setDispatches((prev) => prev.filter((x) => x.id !== d.id));
    setSelectedDispatchId((cur) => (cur === d.id ? null : cur));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    void loadDispatchesToday();
  }, [loadDispatchesToday]);

  useEffect(() => {
    const id = setInterval(() => {
      void loadDispatchesToday();
    }, 30000);
    return () => clearInterval(id);
  }, [loadDispatchesToday]);

  const value: DispatchWeighingPageContextType = {
    dispatches,
    selectedDispatchId,
    isLoading,
    error,
    loadDispatchesToday,
    selectDispatch,
    addDispatch,
    updateDispatch,
    clearError,
  };

  return (
    <DispatchWeighingPageContext.Provider value={value}>
      {children}
    </DispatchWeighingPageContext.Provider>
  );
};

export const useDispatchWeighingPage = (): DispatchWeighingPageContextType => {
  const ctx = useContext(DispatchWeighingPageContext);
  if (!ctx) {
    throw new Error(
      'useDispatchWeighingPage debe usarse dentro de DispatchWeighingPageProvider',
    );
  }
  return ctx;
};
