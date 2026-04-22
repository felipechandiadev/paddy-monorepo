'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { fetchProducersAction, ProducerOption } from '@/actions/fetchProducersAction';
import {
  createTruckReceptionAction,
  recordTareWeightAction,
  TruckReception,
  RegisterTareWeightPayload,
} from '@/actions/truckReceptionActions';
import { useWeighingPage } from '@/hooks/useWeighingPage';

type FormMode = 'create' | 'tare';

interface TruckReceptionFormProps {
  mode: FormMode;
  selectedTruck?: TruckReception | null;
  serialWeight: number | null;
  isSerialConnected: boolean;
  onTruckCreated?: (truck: TruckReception) => void;
  onTareFinalized?: (truck: TruckReception) => void;
  onCancel?: () => void;
}

export const TruckReceptionForm: React.FC<TruckReceptionFormProps> = ({
  mode,
  selectedTruck,
  serialWeight,
  isSerialConnected,
  onTruckCreated,
  onTareFinalized,
  onCancel,
}) => {
  const { addTruck, loadTrucksToday, updateTruck } = useWeighingPage();

  const [formData, setFormData] = useState({
    // Modo: create
    producer_id: null as number | null,
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    gross_weight: '' as string,

    // Modo: tare
    tare_weight: '' as string,
  });

  const [producers, setProducers] = useState<ProducerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar productores
  const loadProducers = useCallback(async (search?: string) => {
    try {
      const result = await fetchProducersAction({ search });
      setProducers(result.data);
    } catch (err) {
      console.error('Error cargando productores:', err);
    }
  }, []);

  // Cargar productores al montar
  useEffect(() => {
    loadProducers();
  }, [loadProducers]);

  // Sincronizar peso serial en modo create
  useEffect(() => {
    if (mode === 'create' && serialWeight && isSerialConnected) {
      setFormData((prev) => ({ ...prev, gross_weight: String(serialWeight) }));
    }
  }, [serialWeight, isSerialConnected, mode]);

  // Resetear formulario cuando cambia el modo
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    if (mode === 'create') {
      setFormData({
        producer_id: null,
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: '',
        tare_weight: '',
      });
    } else if (mode === 'tare') {
      setFormData((prev) => ({
        ...prev,
        tare_weight: '',
      }));
    }
  }, [mode]);

  const handleProducerSearch = useCallback(
    (searchValue: string) => {
      loadProducers(searchValue);
    },
    [loadProducers]
  );

  // Calcular peso neto en modo tara
  const netWeight =
    mode === 'tare' && selectedTruck?.gross_weight && formData.tare_weight
      ? selectedTruck.gross_weight - Number(formData.tare_weight)
      : null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validación
    if (!formData.producer_id) {
      setError('Selecciona un productor');
      return;
    }

    if (!formData.license_plate.trim()) {
      setError('La patente es requerida');
      return;
    }

    if (!formData.driver_name.trim()) {
      setError('El nombre del chofer es requerido');
      return;
    }

    const weight = Number(formData.gross_weight);
    if (!weight || weight <= 0) {
      setError('El peso bruto debe ser mayor a 0');
      return;
    }

    setIsLoading(true);

    try {
      const newTruck = await createTruckReceptionAction({
        producer_id: formData.producer_id,
        license_plate: formData.license_plate.trim(),
        driver_name: formData.driver_name.trim(),
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        gross_weight: weight,
      });

      console.log('newTruck created:', newTruck);

      addTruck(newTruck);
      await loadTrucksToday();

      setSuccessMessage(`Recepción creada: Turno #${newTruck.numero_turno}`);

      // Limpiar formulario
      setFormData({
        producer_id: null,
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: '',
        tare_weight: '',
      });

      if (onTruckCreated) {
        onTruckCreated(newTruck);
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear recepción';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedTruck) {
      setError('No hay camión seleccionado');
      return;
    }

    const weight = Number(formData.tare_weight);
    if (!weight || weight <= 0) {
      setError('El peso tara debe ser mayor a 0');
      return;
    }

    if (selectedTruck.gross_weight && weight >= selectedTruck.gross_weight) {
      setError('El peso tara debe ser menor al peso bruto');
      return;
    }

    setIsLoading(true);

    try {
      const payload: RegisterTareWeightPayload = {
        truck_reception_id: selectedTruck.id,
        tare_weight: weight,
        status: 'FINISHED',
      };

      const updatedTruck = await recordTareWeightAction(payload);
      updateTruck(updatedTruck);
      setFormData((prev) => ({ ...prev, tare_weight: '' }));

      setSuccessMessage('Recepción finalizada correctamente');
      if (onTareFinalized) {
        onTareFinalized(updatedTruck);
      }

      // Limpiar selección después de 1.5 segundos (cuando el mensaje de éxito se ve)
      setTimeout(() => {
        onCancel?.();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar peso tara';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar modo CREATE
  if (mode === 'create') {
    return (
      <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
        <h2 className="text-xl font-bold text-foreground mb-6">Nueva Recepción</h2>

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {/* Success Alert */}
          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Productor - AutoComplete */}
          <AutoComplete
            options={producers}
            value={producers.find((p) => p.id === formData.producer_id) || null}
            onChange={(option) => setFormData((prev) => ({ ...prev, producer_id: option?.id || null }))}
            onInputChange={handleProducerSearch}
            getOptionLabel={(option: any) => `${option.name} · ${option.rut}`}
            getOptionValue={(option: any) => option.id}
            filterOption={(option: any, searchValue: string) => {
              const searchLower = searchValue.toLowerCase();
              return (
                option.name.toLowerCase().includes(searchLower) ||
                option.rut.toLowerCase().includes(searchLower) ||
                option.email?.toLowerCase().includes(searchLower) ||
                option.city?.toLowerCase().includes(searchLower)
              );
            }}
            placeholder="Busca productor"
            disabled={isLoading}
            labelAlwaysVisible
          />

          {/* Patente */}
          <TextField
            label="Patente *"
            value={formData.license_plate}
            onChange={(e) => setFormData((prev) => ({ ...prev, license_plate: e.target.value }))}
            placeholder="Ej: ABC-1234"
            disabled={isLoading}
            labelAlwaysVisible
          />

          {/* Nombre del Chofer */}
          <TextField
            label="Nombre del Chofer *"
            value={formData.driver_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, driver_name: e.target.value }))}
            placeholder="Ej: Juan Pérez"
            disabled={isLoading}
            labelAlwaysVisible
          />

          {/* Empresa de Transporte */}
          <TextField
            label="Empresa de Transporte"
            value={formData.carrier_company}
            onChange={(e) => setFormData((prev) => ({ ...prev, carrier_company: e.target.value }))}
            placeholder="Ej: Transporte XYZ"
            disabled={isLoading}
            labelAlwaysVisible
          />

          {/* Guía de Despacho */}
          <TextField
            label="Guía de Despacho"
            value={formData.dispatch_guide}
            onChange={(e) => setFormData((prev) => ({ ...prev, dispatch_guide: e.target.value }))}
            placeholder="Ej: DG-2024-001"
            disabled={isLoading}
            labelAlwaysVisible
          />

          {/* Peso Bruto */}
          <TextField
            label="Peso Bruto (kg) *"
            type="number"
            value={formData.gross_weight}
            onChange={(e) => setFormData((prev) => ({ ...prev, gross_weight: e.target.value }))}
            placeholder={isSerialConnected ? `${serialWeight || 0} kg (serial)` : 'Ingresa peso manualmente'}
            disabled={isLoading}
            min="0"
            step="0.01"
            labelAlwaysVisible
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Recepción'}
          </Button>
        </form>
      </div>
    );
  }

  // Renderizar modo TARE
  if (mode === 'tare' && selectedTruck) {
    return (
      <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">Registrar Peso Tara</h2>

        {/* Información General - Grid compacta */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-neutral/5 rounded-lg">
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">ID Recepción</label>
            <p className="text-lg font-semibold text-foreground">#{selectedTruck.id}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Patente</label>
            <p className="text-sm font-semibold text-foreground">{selectedTruck.license_plate}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Turno</label>
            <p className="text-sm font-bold text-primary">#{selectedTruck.numero_turno}</p>
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Chofer</label>
            <p className="text-sm text-foreground">{selectedTruck.driver_name}</p>
          </div>

          {selectedTruck.carrier_company && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Empresa</label>
              <p className="text-sm text-foreground">{selectedTruck.carrier_company}</p>
            </div>
          )}

          {selectedTruck.dispatch_guide && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Guía de Despacho</label>
              <p className="text-sm text-foreground">{selectedTruck.dispatch_guide}</p>
            </div>
          )}
        </div>

        {/* Pesos - Layout destacado */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-neutral/10 rounded-lg p-3">
            <label className="text-xs font-medium text-muted-foreground">Bruto</label>
            <p className="text-lg font-bold text-foreground">
              {selectedTruck.gross_weight ? Number(selectedTruck.gross_weight).toLocaleString('es-CL', { maximumFractionDigits: 0 }) : '-'}
              <span className="text-xs ml-1">kg</span>
            </p>
          </div>

          <div className="flex-1 bg-neutral/10 rounded-lg p-3">
            <label className="text-xs font-medium text-muted-foreground">Tara</label>
            <p className="text-lg font-bold text-foreground">
              {formData.tare_weight ? Number(formData.tare_weight).toLocaleString('es-CL', { maximumFractionDigits: 0 }) : '-'}
              <span className="text-xs ml-1">kg</span>
            </p>
          </div>

          <div className="flex-1 bg-primary/10 rounded-lg p-3">
            <label className="text-xs font-medium text-primary">Neto</label>
            <p className="text-lg font-bold text-primary">
              {netWeight !== null ? netWeight.toLocaleString('es-CL', { maximumFractionDigits: 0 }) : '-'}
              <span className="text-xs ml-1">kg</span>
            </p>
          </div>
        </div>

        {/* Formulario Tara */}
        <form onSubmit={handleTareSubmit} className="space-y-4">
          {/* Success Alert */}
          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <h3 className="font-medium text-foreground text-sm">Ingresa Peso Tara</h3>

          <TextField
            label="Peso Tara (kg) *"
            type="number"
            value={formData.tare_weight}
            onChange={(e) => setFormData((prev) => ({ ...prev, tare_weight: e.target.value }))}
            placeholder={isSerialConnected ? `${serialWeight || 0} kg (serial)` : 'Ingresa peso'}
            disabled={isLoading}
            min="0"
            step="0.01"
            labelAlwaysVisible
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Finalizando...' : 'Finalizar Recepción'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            className="w-full"
            disabled={isLoading}
            onClick={() => onCancel?.()}
          >
            Cancelar
          </Button>
        </form>
      </div>
    );
  }

  // Estado por defecto (sin camión seleccionado en modo tare)
  return (
    <div className="bg-background rounded-lg border border-border p-6 h-full flex items-center justify-center">
      <p className="text-muted-foreground text-center text-sm">
        Selecciona un camión para registrar peso tara
      </p>
    </div>
  );
};
