'use client';

import React, { useState } from 'react';
import { TruckReception } from '@/services/truckReceptionService';
import { truckReceptionService } from '@/services/truckReceptionService';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import Badge from '@/shared/components/ui/Badge/Badge';
import Alert from '@/shared/components/ui/Alert/Alert';

interface TruckDetailPanelProps {
  truck: TruckReception | null;
  serialWeight: number | null;
  isSerialConnected: boolean;
  onTareWeightRecorded: (truck: TruckReception) => void;
  isLoading: boolean;
}

export const TruckDetailPanel: React.FC<TruckDetailPanelProps> = ({
  truck,
  serialWeight,
  isSerialConnected,
  onTareWeightRecorded,
  isLoading,
}) => {
  const [tareWeight, setTareWeight] = useState('');
  const [isSavingTare, setIsSavingTare] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calcular peso neto en tiempo real
  const calculateNetWeight = (bruto: number, tara: number): number => {
    return Math.max(0, bruto - tara);
  };

  const netWeight = truck && truck.gross_weight && tareWeight
    ? calculateNetWeight(truck.gross_weight, parseFloat(tareWeight) || 0)
    : truck?.net_weight || 0;

  // Validar y registrar tara
  const handleRecordTare = async () => {
    if (!truck) return;

    setError(null);

    // Validaciones
    if (!tareWeight) {
      setError('Ingresa el peso tara');
      return;
    }

    const tare = parseFloat(tareWeight);
    if (isNaN(tare) || tare <= 0) {
      setError('El peso tara debe ser mayor a 0');
      return;
    }

    if (!truck.gross_weight || truck.gross_weight <= 0) {
      setError('No hay peso bruto registrado');
      return;
    }

    const calculated_net = truck.gross_weight - tare;
    if (calculated_net <= 0) {
      setError('El peso neto debe ser mayor a 0 (Bruto - Tara debe ser positivo)');
      return;
    }

    // Guardar
    setIsSavingTare(true);
    try {
      const updatedTruck = await truckReceptionService.recordTareWeight({
        truck_reception_id: truck.id,
        tare_weight: tare,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Limpiar formulario
      setTareWeight('');

      // Callback al padre
      onTareWeightRecorded(updatedTruck);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error registrando tara: ${message}`);
      console.error('Error:', err);
    } finally {
      setIsSavingTare(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 opacity-50">📋</div>
          <p className="text-xl font-semibold text-foreground mb-2">Selecciona un camión</p>
          <p className="text-muted">Haz click en un camión de la lista lateral para ver sus detalles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background p-6 overflow-y-auto">
      {/* Header del Camión */}
      <div className="bg-white rounded-lg shadow-md border-l-4 border-primary p-6 mb-6">
        {/* Título */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{truck.license_plate}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={truck.status === 'ESPERA' ? 'warning' : 'success'}>
                {truck.status === 'ESPERA' ? 'En Espera' : 'Finalizado'}
              </Badge>
              {truck.numero_turno && (
                <Badge variant="secondary">Turno #{truck.numero_turno}</Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Entrada</div>
            <div className="text-sm font-mono font-semibold">
              {new Date(truck.entry_at).toLocaleTimeString('es-CL')}
            </div>
          </div>
        </div>

        {/* Información del Camión */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
          <div>
            <p className="text-xs text-muted uppercase">Chofer</p>
            <p className="font-semibold text-foreground">{truck.driver_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase">Empresa</p>
            <p className="font-semibold text-foreground">{truck.carrier_company || '—'}</p>
          </div>
          {truck.dispatch_guide && (
            <div>
              <p className="text-xs text-muted uppercase">Guía</p>
              <p className="font-semibold text-foreground">{truck.dispatch_guide}</p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-4">
          ✓ Peso tara registrado exitosamente
        </Alert>
      )}

      {/* Contenido según Estado */}
      {truck.status === 'ESPERA' ? (
        // Estado ESPERA - Formulario para registrar tara
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Pesos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral rounded-lg p-4">
              <p className="text-xs text-muted uppercase mb-2">Peso Bruto</p>
              <p className="text-2xl font-bold text-foreground">
                {truck.gross_weight || '—'}
              </p>
              <p className="text-xs text-muted mt-1">kg</p>
            </div>

            <div className="bg-neutral rounded-lg p-4">
              <p className="text-xs text-muted uppercase mb-2">Peso Tara</p>
              <p className="text-2xl font-bold text-foreground">
                {tareWeight || (isSerialConnected && serialWeight ? serialWeight.toFixed(2) : '—')}
              </p>
              <p className="text-xs text-muted mt-1">kg</p>
            </div>

            <div className="bg-info/10 border border-info rounded-lg p-4">
              <p className="text-xs text-muted uppercase mb-2">Peso Neto</p>
              <p className="text-2xl font-bold text-info">
                {netWeight.toFixed(2)}
              </p>
              <p className="text-xs text-muted mt-1">kg</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-info/10 border border-info rounded-lg p-4">
            <p className="text-sm text-info font-medium">
              El camión está descargando. Ingresa el peso tara cuando haya terminado.
            </p>
          </div>

          {/* Formulario Tara */}
          <div className="space-y-4">
            <TextField
              label="Peso Tara (kg) *"
              type="number"
              value={tareWeight || (isSerialConnected && serialWeight ? serialWeight.toString() : '')}
              onChange={(e) => setTareWeight(e.target.value)}
              placeholder={isSerialConnected ? `Balanza: ${serialWeight || '—'} kg` : 'Ingresa peso manualmente'}
              inputMode="decimal"
              step="0.01"
              required
            />

            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleRecordTare}
                disabled={isSavingTare}
              >
                {isSavingTare ? 'Guardando...' : 'Finalizar Recepción'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Estado FINISHED - Resumen
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <Alert variant="success">
            ✓ Recepción completada exitosamente
          </Alert>

          {/* Resumen Pesos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-success/10 border border-success rounded-lg p-4">
              <p className="text-xs text-muted uppercase mb-2">Peso Bruto</p>
              <p className="text-2xl font-bold text-foreground">{truck.gross_weight}</p>
              <p className="text-xs text-muted mt-1">kg</p>
            </div>

            <div className="bg-success/10 border border-success rounded-lg p-4">
              <p className="text-xs text-muted uppercase mb-2">Peso Tara</p>
              <p className="text-2xl font-bold text-foreground">{truck.tare_weight}</p>
              <p className="text-xs text-muted mt-1">kg</p>
            </div>

            <div className="bg-success/10 border border-success rounded-lg p-4">
              <p className="text-xs text-muted uppercase mb-2">Peso Neto</p>
              <p className="text-2xl font-bold text-success">{truck.net_weight}</p>
              <p className="text-xs text-muted mt-1">kg</p>
            </div>
          </div>

          {/* Fecha Finalización */}
          {truck.finished_at && (
            <div className="bg-neutral rounded-lg p-4">
              <p className="text-xs text-muted uppercase">Finalización</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(truck.finished_at).toLocaleString('es-CL')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
