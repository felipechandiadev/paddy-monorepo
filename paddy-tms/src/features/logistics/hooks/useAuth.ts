'use client';

import { useSession } from 'next-auth/react';
import { useLogistics } from './useLogistics';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { setUser, setError } = useLogistics();
  
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const user = session?.user || null;

  return {
    user,
    isAuthenticated,
    isLoading,
    hasPermission: (permission: string) => user?.permissions?.includes(permission) ?? false,
    hasRole: (role: string) => user?.role === role,
  };
};
