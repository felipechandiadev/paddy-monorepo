'use client';

import React, { createContext, useReducer, ReactNode, useCallback } from 'react';
import { LogisticsState, LogisticsAction, AuthUser } from '../types/logistics.types';
import { logisticsReducer, ACTION_TYPES } from './actions';

const initialState: LogisticsState = {
  trucks: [],
  currentTruck: null,
  receptions: [],
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
};

export const LogisticsContext = createContext<{
  state: LogisticsState;
  dispatch: (action: LogisticsAction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}>({
  state: initialState,
  dispatch: () => {},
  setLoading: () => {},
  setError: () => {},
  setUser: () => {},
  logout: () => {},
});

export interface LogisticsProviderProps {
  children: ReactNode;
}

export const LogisticsProvider: React.FC<LogisticsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(logisticsReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    if (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    } else {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
    }
  }, []);

  const setUser = useCallback((user: AuthUser | null) => {
    dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: ACTION_TYPES.LOGOUT });
  }, []);

  const value = {
    state,
    dispatch,
    setLoading,
    setError,
    setUser,
    logout,
  };

  return (
    <LogisticsContext.Provider value={value}>
      {children}
    </LogisticsContext.Provider>
  );
};
