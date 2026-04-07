'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types/user';

type UserRole = 'administrador' | 'contador' | 'operador';

function isValidRole(role: string): role is UserRole {
  return ['administrador', 'contador', 'operador'].includes(role);
}

function mapBackendRole(backendRole: string): UserRole {
  // Mapear roles del backend a roles del frontend
  switch (backendRole.toLowerCase()) {
    case 'admin':
    case 'administrador':
      return 'administrador';
    case 'contador':
      return 'contador';
    case 'operador':
    case 'operator':
      return 'operador';
    default:
      return 'operador'; // rol por defecto
  }
}

export const useUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // Mapear el role del backend al formato del frontend
      const role = mapBackendRole(session.user.role);
      
      // Usar los datos de la sesión que ya incluyen el name del backend
      const userFromSession: User = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email || 'Usuario',
        role: role,
      };
      
      setUser(userFromSession);
      
      // Persistir userId en sessionStorage para auditoría de cierre de sesión
      if (typeof window !== 'undefined' && userFromSession.id) {
        sessionStorage.setItem('userId', String(userFromSession.id));
      }
    } else {
      setUser(null);
      // Eliminar userId de sessionStorage al cerrar sesión
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userId');
      }
    }
    
    setLoading(false);
  }, [session, status]);

  const refreshUser = async () => {
    // La sesión se actualiza automáticamente con next-auth
    setLoading(true);
    setLoading(false);
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser
  };
};
