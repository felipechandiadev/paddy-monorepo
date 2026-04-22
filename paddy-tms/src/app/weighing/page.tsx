'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const { trucks, selectedTruckId, isLoading, error, selectTruck, addTruck, updateTruck, clearError } =
    useWeighingPage();
  const { isConnected: serialConnected, lastWeight } = useSerialPort(true);

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.svg" 
              alt="Paddy Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold text-primary">Paddy TMS</h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${serialConnected ? 'bg-success' : 'bg-muted'}`}
              />
              <span className="text-sm text-muted-foreground">
                {serialConnected ? 'Balanza conectada' : 'Sin conexión serial'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            <Button variant="outlined" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden">
        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
            <button
              onClick={clearError}
              className="ml-2 underline text-sm"
            >
              Cerrar
            </button>
          </Alert>
        )}

        {/* Layout: Left Form (50%) | Right Truck List (50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Column: New Reception Form */}
          <div className="lg:col-span-1 overflow-auto">
            <NewTruckReceptionForm
              serialWeight={lastWeight}
              isSerialConnected={serialConnected}
            />
          </div>

          {/* Right Column: Truck List */}
          <div className="lg:col-span-1 overflow-auto">
            <TruckList
              trucks={trucks}
              selectedTruckId={selectedTruckId}
              onSelectTruck={selectTruck}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Main Page Component
export default function WeighingPage() {
  return (
    <WeighingPageProvider>
      <WeighingPageContent />
    </WeighingPageProvider>
  );
}
