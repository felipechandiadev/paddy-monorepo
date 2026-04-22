'use client';

import React, { useCallback, useState } from 'react';
import type { TruckReception } from '@/actions/truckReceptionActions';
import { WeighingPageProvider, useWeighingPage } from '@/providers/WeighingPageProvider';
import { TruckReceptionForm } from '@/components/weighing/TruckReceptionForm';
import { TruckList } from '@/components/weighing/TruckList';
import Alert from '@/shared/components/ui/Alert/Alert';
import { TmsAppLayout, useTmsSerialPort } from '@/components/layout/TmsAppLayout';
import { WeighingMonitorSync } from '@/components/weighing/WeighingMonitorSync';
import DialogToPrint from '@/shared/components/ui/Dialog/DialogToPrint';
import { TruckWeighingTicketToPrint } from '@/components/weighing/TruckWeighingTicketToPrint';

const WeighingPageContent: React.FC = () => {
  const { trucks, selectedTruckId, error, selectTruck, clearError } = useWeighingPage();
  const [printOpen, setPrintOpen] = useState(false);
  const [printTruck, setPrintTruck] = useState<TruckReception | null>(null);
  const {
    isConnected: serialConnected,
    lastWeight,
  } = useTmsSerialPort();

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || null;
  const formMode = selectedTruckId ? 'tare' : 'create';

  const handleCancel = () => {
    selectTruck(null);
  };

  const handleTareFinalized = useCallback(
    (final: TruckReception) => {
      const fromList = trucks.find((t) => t.id === final.id);
      setPrintTruck({
        ...final,
        producer: final.producer ?? fromList?.producer,
      });
      setPrintOpen(true);
    },
    [trucks],
  );

  const closePrint = useCallback(() => {
    setPrintOpen(false);
    setPrintTruck(null);
  }, []);

  return (
    <main className="flex-1 p-6 overflow-hidden">
      <WeighingMonitorSync />
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
            onTareFinalized={handleTareFinalized}
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

      <DialogToPrint
        open={printOpen && !!printTruck}
        onClose={closePrint}
        title={
          printTruck
            ? `Ticket de pesaje — Nº ${printTruck.numero_turno?.toLocaleString('es-CL') ?? ''}`
            : 'Ticket de pesaje'
        }
        printLabel="Imprimir"
        closeLabel="Cerrar"
        size="xl"
        scroll="paper"
      >
        {printTruck ? <TruckWeighingTicketToPrint truck={printTruck} /> : null}
      </DialogToPrint>
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
