'use client';

import { useEffect, useCallback } from 'react';
import { useLogistics } from './useLogistics';
import { Truck, TruckReception } from '../types/logistics.types';
import { fetchTrucks, fetchReceptions } from '../services/truckService';
import { ACTION_TYPES } from '../context/actions';

export const useLogisticsData = (enabled = true) => {
  const { dispatch, state, setLoading, setError } = useLogistics();

  const loadData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    try {
      const [trucks, receptions] = await Promise.all([
        fetchTrucks(),
        fetchReceptions(),
      ]);
      
      dispatch({ type: ACTION_TYPES.SET_TRUCKS, payload: trucks });
      dispatch({ type: ACTION_TYPES.SET_RECEPTIONS, payload: receptions });
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, setError, enabled]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    trucks: state.trucks,
    receptions: state.receptions,
    loading: state.loading,
    error: state.error,
    refetch: loadData,
  };
};
