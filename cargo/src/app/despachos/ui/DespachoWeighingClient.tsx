'use client';

import React from 'react';
import Link from 'next/link';
import Alert from '@/shared/components/ui/Alert/Alert';
import { useTmsSerialPort } from '@/components/layout/TmsAppLayout';
import { useDispatchWeighingPage } from '@/providers/DispatchWeighingPageProvider';
import { TruckDispatchForm } from '@/components/weighing/TruckDispatchForm';
import { DispatchTruckList } from '@/components/weighing/DispatchTruckList';

export const DespachoWeighingClient: React.FC = () => {
  const {
    dispatches,
    selectedDispatchId,
    error,
    selectDispatch,
    clearError,
    loadDispatchesToday,
  } = useDispatchWeighingPage();
  const { isConnected: serialConnected, lastWeight } = useTmsSerialPort();

  const selected =
    dispatches.find((d) => d.id === selectedDispatchId) ?? null;
  const formMode = selectedDispatchId ? 'gross' : 'create';

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

      <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Despacho de carga</h1>
        <Link
          href="/despachos/lista"
          className="btn-text cursor-pointer px-4 py-2 text-sm inline-flex items-center justify-center rounded-md"
        >
          Lista de despachos
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
        <div className="lg:col-span-1 overflow-auto">
          <TruckDispatchForm
            mode={formMode as 'create' | 'gross'}
            selected={selected}
            serialWeight={lastWeight}
            isSerialConnected={serialConnected}
            onCancel={() => selectDispatch(null)}
            onGrossFinalized={() => {
              void loadDispatchesToday();
            }}
          />
        </div>
        <div className="lg:col-span-1 overflow-auto">
          <DispatchTruckList
            dispatches={dispatches}
            selectedId={selectedDispatchId}
            onSelect={(id) => selectDispatch(id)}
          />
        </div>
      </div>
    </main>
  );
};
