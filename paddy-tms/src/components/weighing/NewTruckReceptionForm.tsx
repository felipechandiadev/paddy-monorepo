'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { truckReceptionService, TruckReception } from '@/services/truckReceptionService';
import { fetchProducersAction, ProducerOption } from '@/actions/fetchProducersAction';

interface NewTruckReceptionFormProps {
  onSuccess: (truck: TruckReception) => void;
  serialWeight: number | null;
  isSerialConnected: boolean;
}

export const NewTruckReceptionForm: React.FC<NewTruckReceptionFormProps> = ({
  onSuccess,
  serialWeight,
  isSerialConnected,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    producer_id: '',
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    gross_weight: '',
  });

  // Estado de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado de productores
  const [producers, setProducers] = useState<ProducerOption[]>([]);
  const [producersLoading, setProducersLoading] = useState(false);
  const [producerSearch, setProducerSearch] = useState('');
  const [selectedProducer, setSelectedProducer] = useState<ProducerOption | null>(null);

  // Cargar productores al montar
  useEffect(() => {
    const loadProducers = async () => {
      setProducersLoading(true);
      try {
        const result = await fetchProducersAction({
          page: 1,
          limit: 1000,
          sortField: 'name',
          sort: 'ASC',
        });
        setProducers(result.data);
      } catch (err) {
        console.error('Error cargando productores:', err);
      } finally {
        setProducersLoading(false);
      }
    };

    loadProducers();
  }, []);

  // Generar opciones del autocomplete con opción de crear nuevo
  const producerOptions = useMemo<ProducerOption[]>(() => {
    const normalizedQuery = producerSearch.trim().toLowerCase();

    if (!normalizedQuery) {
      return producers;
    }

    const hasMatches = producers.some((producer) => {
      return (
        producer.name.toLowerCase().includes(normalizedQuery) ||
        producer.rut.toLowerCase().includes(normalizedQuery) ||
        producer.email?.toLowerCase().includes(normalizedQuery) ||
        producer.city?.toLowerCase().includes(normalizedQuery)
      );
    });

    return producers;
  }, [producers, producerSearch]);

  // Manejar cambio en formulario
  const handleFormChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Manejar selección de productor
  const handleProducerChange = (producer: ProducerOption | null) => {
    setSelectedProducer(producer);
    if (producer) {
      handleFormChange('producer_id', producer.id.toString());
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!selectedProducer || !selectedProducer.id) {
      errors.push('Selecciona un productor');
    }

    if (!formData.license_plate.trim()) {
      errors.push('Ingresa la patente del camión');
    }

    if (!formData.driver_name.trim()) {
      errors.push('Ingresa el nombre del chofer');
    }

    const grossWeight = parseFloat(formData.gross_weight);
    if (!formData.gross_weight || isNaN(grossWeight) || grossWeight <= 0) {
      errors.push('Ingresa un peso bruto válido (mayor a 0)');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const newTruck = await truckReceptionService.createWithGrossWeight({
        producer_id: parseInt(formData.producer_id),
        license_plate: formData.license_plate.trim(),
        driver_name: formData.driver_name.trim(),
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        gross_weight: parseFloat(formData.gross_weight),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Limpiar formulario
      setFormData({
        producer_id: '',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: '',
      });
      setSelectedProducer(null);
      setProducerSearch('');

      // Callback al padre
      onSuccess(newTruck);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error creando recepción: ${message}`);
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border-r border-border h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Nueva Recepción</h2>
        <p className="text-sm text-muted">Registra un nuevo camión para pesaje</p>
      </div>

      {/* Alertas */}
      {error && (
        <Alert variant="error" className="whitespace-pre-line">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          ✓ Recepción creada exitosamente
        </Alert>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4">
        {/* Productor - AutoComplete */}
        <AutoComplete<ProducerOption>
          label="Productor *"
          placeholder={producersLoading ? 'Cargando productores...' : 'Buscar por nombre o RUT'}
          options={producerOptions}
          value={selectedProducer}
          onChange={handleProducerChange}
          onInputChange={setProducerSearch}
          getOptionLabel={(option) => `${option.name} · ${option.rut}`}
          getOptionValue={(option) => option.id}
          filterOption={(option, inputValue) => {
            const searchLower = inputValue.toLowerCase();
            return !!(
              option.name.toLowerCase().includes(searchLower) ||
              option.rut.toLowerCase().includes(searchLower) ||
              (option.email?.toLowerCase().includes(searchLower)) ||
              (option.city?.toLowerCase().includes(searchLower))
            );
          }}
          disabled={producersLoading}
          required
        />

        {/* Patente */}
        <TextField
          label="Patente *"
          value={formData.license_plate}
          onChange={(e) => handleFormChange('license_plate', e.target.value.toUpperCase())}
          placeholder="ABC-1234"
          required
        />

        {/* Chofer */}
        <TextField
          label="Chofer *"
          value={formData.driver_name}
          onChange={(e) => handleFormChange('driver_name', e.target.value)}
          placeholder="Nombre del chofer"
          required
        />

        {/* Empresa de Transporte */}
        <TextField
          label="Empresa de Transporte"
          value={formData.carrier_company}
          onChange={(e) => handleFormChange('carrier_company', e.target.value)}
          placeholder="Opcional"
        />

        {/* Guía de Despacho */}
        <TextField
          label="Guía de Despacho"
          value={formData.dispatch_guide}
          onChange={(e) => handleFormChange('dispatch_guide', e.target.value)}
          placeholder="Opcional"
        />

        {/* Peso Bruto */}
        <TextField
          label="Peso Bruto (kg) *"
          type="number"
          value={formData.gross_weight || (isSerialConnected && serialWeight ? serialWeight.toString() : '')}
          onChange={(e) => handleFormChange('gross_weight', e.target.value)}
          placeholder={isSerialConnected ? `Balanza: ${serialWeight || '—'} kg` : 'Ingresa peso manualmente'}
          inputMode="decimal"
          step="0.01"
          required
        />

        {/* Botones */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving || producersLoading}
            className="flex-1"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>

      {/* Footer info */}
      <div className="border-t border-border pt-4 text-xs text-muted">
        <p>Campos requeridos marcados con *</p>
        {isSerialConnected && (
          <p className="text-success mt-1">✓ Balanza conectada</p>
        )}
      </div>
    </div>
  );
};
