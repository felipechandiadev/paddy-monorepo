'use client';

import { useContext } from 'react';
import { LogisticsContext } from '../context/LogisticsContext';

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within LogisticsProvider');
  }
  return context;
};
