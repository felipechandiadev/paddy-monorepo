'use client';

import React, { useState } from 'react';
import { recordTareWeightAction, RegisterTareWeightPayload, TruckReception } from '@/actions/truckReceptionActions';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { useWeighingPage } from '@/hooks/useWeighingPage';

interface TruckDetailPanelProps {
  truck: TruckReception | null;
  serialWeight: number | null;
  isSerialConnected: boolean;
  isLoading: boolean;
}

export const TruckDetailPanel: React.FC<TruckDetailPanelProps> = ({
  truck,
  serialWeight,
  isSerialConnected,
  isLoading: externalLoading,
}) => {
  const { updateTruck } = useWeighingPage();

  const [tareWeight, setTareWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!truck) {
    return (
      <div className="bg-background rounded-lg border border-border p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-center text-sm">
          Esperando seleccionar un camión...
        </p>
      </div>
    );
  }

  const netWeight = truck.gross_weight && truck.tare_weight 
    ? truck.gross_weight - truck.tare_weight 
    : null;

  const handleFinalizeTare = async () => {
    setError(null);

    const weight = Number(tareWeight);
    if (!weight || weight <= 0) {
      setError('El peso tara debe ser mayor a 0');
      return;
    }

    if (truck.gross_weight && weight >= truck.gross_weight) {
      setError('El peso tara debe ser menor al peso bruto');
      return;
    }

    setIsLoading(true);

    try {
      const payload: RegisterTareWeightPayload = {
        truck_reception_id: truck.id,
        tare_weight: weight,
      };

      const updatedTruck = await recordTareWeightAction(payload);
      updateTruck(updatedTruck);
      setTareWeight('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar peso tara';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-foreground mb-6">Detalles del Camión</h2>

      {/* Información General */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Patente</label>
          <p className="text-lg font-semibold text-foreground">{truck.license_plate}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Chofer</label>
          <p className="text-foreground">{truck.driver_name}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Empresa</label>
          <p className="text-foreground">{truck.carrier_company || '-'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Guía de Despacho</label>
          <p className="text-foreground">{truck.dispatch_guide || '-'}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Turno</label>
          <p className="text-lg font-bold text-primary">#{truck.numero_turno}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Estado</label>
          <p className="text-foreground capitalize">{truck.status === 'ESPERA' ? 'En Espera' : 'Finalizado'}</p>
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* Pesos */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Peso Bruto (kg)</label>
          <p className="text-2xl font-bold text-foreground">{truck.gross_weight?.toFixed(2) || '-'}</p>
        </div>

        {truck.tare_weight && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Peso Tara (kg)</label>
            <p className="text-2xl font-bold text-foreground">{truck.tare_weight.toFixed(2)}</p>
          </div>
        )}

        {netWeight && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Peso Neto (kg)</label>
            <p className="text-2xl font-bold text-primary">{netWeight.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* Acciones según estado */}
      {truck.status === 'ESPERA' ? (
        <>
          <hr className="my-6 border-border" />
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">En Espera para Tara</h3>

            {error && <Alert variant="error">{error}</Alert>}

            <TextField
              label="Peso Tara (kg) *"
              type="number"
              value={tareWeight}
              onChange={(e) => setTareWeight(e.target.value)}
              placeholder={isSerialConnected ? `${serialWeight || 0} kg (serial)` : 'Ingresa peso'}
              disabled={isLoading || externalLoading}
              min="0"
              step="0.01"
            />

            <Button
              onClick={handleFinalizeTare}
              variant="primary"
              className="w-full"
              disabled={isLoading || externalLoading}
            >
              {isLoading ? 'Finalizando...' : 'Finalizar Recepción'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <hr className="my-6 border-border" />
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <p className="text-sm font-medium text-success">Recepción Finalizada</p>
            <p className="text-xs text-muted-foreground mt-1">
              Finalizado: {truck.finished_at ? new Date(truck.finished_at).toLocaleString() : '-'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
