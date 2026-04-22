'use client';

import React, { useState, useCallback } from 'react';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { fetchProducersAction, ProducerOption } from '@/actions/fetchProducersAction';
import { createTruckReceptionAction, TruckReception } from '@/actions/truckReceptionActions';
import { useWeighingPage } from '@/hooks/useWeighingPage';

interface NewTruckReceptionFormProps {
  serialWeight: number | null;
  isSerialConnected: boolean;
}

export const NewTruckReceptionForm: React.FC<NewTruckReceptionFormProps> = ({
  serialWeight,
  isSerialConnected,
}) => {
  const { addTruck, loadTrucksToday } = useWeighingPage();
  
  const [formData, setFormData] = useState({
    producer_id: null as number | null,
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    gross_weight: '' as string,
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
  React.useEffect(() => {
    loadProducers();
  }, [loadProducers]);

  // Sincronizar peso serial
  React.useEffect(() => {
    if (serialWeight && isSerialConnected) {
      setFormData(prev => ({ ...prev, gross_weight: String(serialWeight) }));
    }
  }, [serialWeight, isSerialConnected]);

  const handleProducerSearch = useCallback(
    (searchValue: string) => {
      loadProducers(searchValue);
    },
    [loadProducers]
  );

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      // Agregar a la lista local
      addTruck(newTruck);

      // Recargar la lista completa desde el servidor para sincronizar turnos
      console.log('Calling loadTrucksToday...');
      await loadTrucksToday();
      console.log('loadTrucksToday completed');

      setSuccessMessage(`Recepción creada: Turno #${newTruck.numero_turno}`);
      
      // Limpiar formulario
      setFormData({
        producer_id: null,
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: '',
      });

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear recepción';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-foreground mb-6">Nueva Recepción</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Productor *
          </label>
          <AutoComplete
            options={producers}
            value={producers.find(p => p.id === formData.producer_id) || null}
            onChange={(option) => setFormData(prev => ({ ...prev, producer_id: option?.id || null }))}
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
          />
        </div>

        {/* Patente */}
        <TextField
          label="Patente *"
          value={formData.license_plate}
          onChange={(e) => setFormData(prev => ({ ...prev, license_plate: e.target.value }))}
          placeholder="Ej: ABC-1234"
          disabled={isLoading}
        />

        {/* Nombre del Chofer */}
        <TextField
          label="Nombre del Chofer *"
          value={formData.driver_name}
          onChange={(e) => setFormData(prev => ({ ...prev, driver_name: e.target.value }))}
          placeholder="Ej: Juan Pérez"
          disabled={isLoading}
        />

        {/* Empresa de Transporte */}
        <TextField
          label="Empresa de Transporte"
          value={formData.carrier_company}
          onChange={(e) => setFormData(prev => ({ ...prev, carrier_company: e.target.value }))}
          placeholder="Ej: Transporte XYZ"
          disabled={isLoading}
        />

        {/* Guía de Despacho */}
        <TextField
          label="Guía de Despacho"
          value={formData.dispatch_guide}
          onChange={(e) => setFormData(prev => ({ ...prev, dispatch_guide: e.target.value }))}
          placeholder="Ej: DG-2024-001"
          disabled={isLoading}
        />

        {/* Peso Bruto */}
        <TextField
          label="Peso Bruto (kg) *"
          type="number"
          value={formData.gross_weight}
          onChange={(e) => setFormData(prev => ({ ...prev, gross_weight: e.target.value }))}
          placeholder={isSerialConnected ? `${serialWeight || 0} kg (serial)` : 'Ingresa peso manualmente'}
          disabled={isLoading}
          min="0"
          step="0.01"
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
};
