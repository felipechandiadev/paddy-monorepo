'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { logout } from '@/features/logistics/services/authService';

export default function WeighingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Panel de Pesaje</h1>
              <p className="text-sm text-foreground mt-1">
                Operador: {user?.name || 'Unknown'}
              </p>
              <p className="text-xs text-muted mt-1">Email: {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-primary mb-6">Bienvenido al Panel de Pesaje</h2>
          
          {/* User Info */}
          <div className="mb-6 p-4 bg-neutral rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-3">Información del Usuario</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted">Nombre</p>
                <p className="font-semibold text-foreground">{user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="font-semibold text-foreground">{user?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Rol</p>
                <p className="font-semibold text-foreground">{user?.role || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Estado</p>
                <p className="font-semibold text-success">Autenticado ✓</p>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="p-4 bg-info/10 border border-info rounded-lg">
            <p className="text-info font-medium">
              El panel de pesaje está siendo implementado. Este es un placeholder.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push('/monitor')}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              Ver Monitor
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-error text-white rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
