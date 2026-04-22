'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { logout } from '@/features/logistics/services/authService';
import { useSerialPort } from '@/hooks/useSerialPort';
import { WeighingPageProvider, useWeighingPage } from '@/providers/WeighingPageProvider';
import { NewTruckReceptionForm } from '@/components/weighing/NewTruckReceptionForm';
import { TruckList } from '@/components/weighing/TruckList';
import { TruckDetailPanel } from '@/components/weighing/TruckDetailPanel';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';

// Componente interno que usa el contexto
const WeighingPageContent: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { trucks, selectedTruckId, isLoading, error, selectTruck, addTruck, updateTruck, clearError } =
    useWeighingPage();
  const { isConnected: serialConnected, lastWeight } = useSerialPort(true);

  // Redireccionar si no está autenticado
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || null;

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10 border-b border-border">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Panel de Pesaje</h1>
              <p className="text-sm text-muted mt-1">
                Operador: {user?.name || 'Unknown'}
                {serialConnected && ' • ✓ Balanza Conectada'}
                {error && ' • ⚠ Error de sincronización'}
              </p>
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

      {/* Alert Global */}
      {error && (
        <div className="bg-white border-b border-error px-6 py-3">
          <Alert variant="error" className="m-0">
            {error}
            <button
              onClick={clearError}
              className="ml-3 underline text-sm font-medium hover:opacity-75"
            >
              Descartar
            </button>
          </Alert>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Columna Izquierda - Formulario de Nueva Recepción */}
        <div className="w-96 bg-white border-r border-border overflow-y-auto flex-shrink-0">
          <NewTruckReceptionForm
            onSuccess={addTruck}
            serialWeight={lastWeight}
            isSerialConnected={serialConnected}
          />
        </div>

        {/* Columna Derecha - Lista de Camiones */}
        <div className="w-72 bg-white border-r border-border flex-shrink-0 overflow-y-auto">
          <TruckList
            trucks={trucks}
            selectedTruckId={selectedTruckId}
            onSelectTruck={selectTruck}
          />
        </div>

        {/* Área Central - Detalles del Camión */}
        <TruckDetailPanel
          truck={selectedTruck}
          serialWeight={lastWeight}
          isSerialConnected={serialConnected}
          onTareWeightRecorded={updateTruck}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Página principal que envuelve con el provider
export default function WeighingPage() {
  return (
    <WeighingPageProvider>
      <WeighingPageContent />
    </WeighingPageProvider>
  );
}
