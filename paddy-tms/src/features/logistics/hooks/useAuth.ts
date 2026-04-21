'use client';

import { useEffect, useState } from 'react';
import { useLogistics } from './useLogistics';
import { AuthUser } from '../types/logistics.types';
import { validateAuth } from '../services/authService';

export const useAuth = () => {
  const { state, setUser, setError } = useLogistics();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const user = await validateAuth();
        
        if (user) {
          setUser(user);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed';
        setError(message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setError]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading,
    hasPermission: (permission: string) => state.user?.permissions.includes(permission) ?? false,
    hasRole: (role: string) => state.user?.role === role,
  };
};
