'use client';

import React from 'react';
import { WeighingPageProvider, useWeighingPage } from '@/providers/WeighingPageProvider';
import { TruckReceptionForm } from '@/components/weighing/TruckReceptionForm';
import { TruckList } from '@/components/weighing/TruckList';
import Alert from '@/shared/components/ui/Alert/Alert';
import { TmsAppLayout, useTmsSerialPort } from '@/components/layout/TmsAppLayout';

const WeighingPageContent: React.FC = () => {
  const { trucks, selectedTruckId, isLoading, error, selectTruck, clearError } = useWeighingPage();
  const {
    isConnected: serialConnected,
    lastWeight,
  } = useTmsSerialPort();

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || null;
  const formMode = selectedTruckId ? 'tare' : 'create';

  const handleCancel = () => {
    selectTruck(null);
  };

  return (
    <main className="flex-1 p-6 overflow-hidden">
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
          <button type="button" onClick={clearError} className="ml-2 underline text-sm">
            Cerrar
          </button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        <div className="lg:col-span-1 overflow-auto">
          <TruckReceptionForm
            mode={formMode as 'create' | 'tare'}
            selectedTruck={selectedTruck}
            serialWeight={lastWeight}
            isSerialConnected={serialConnected}
            onCancel={handleCancel}
          />
        </div>

        <div className="lg:col-span-1 overflow-auto">
          <TruckList
            trucks={trucks}
            selectedTruckId={selectedTruckId}
            onSelectTruck={selectTruck}
          />
        </div>
      </div>
    </main>
  );
};

export default function WeighingPage() {
  return (
    <WeighingPageProvider>
      <TmsAppLayout serialEnabled>
        <WeighingPageContent />
      </TmsAppLayout>
    </WeighingPageProvider>
  );
}
