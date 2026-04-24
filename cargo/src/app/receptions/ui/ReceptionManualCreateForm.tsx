'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import Select from '@/shared/components/ui/Select/Select';
import { fetchProducersAction, ProducerOption } from '@/actions/fetchProducersAction';
import { createTruckReceptionAction } from '@/actions/truckReceptionActions';
import {
  LOGISTICS_PRODUCT_OPTIONS,
  type LogisticsProductCode,
} from '@/lib/logisticsProduct';

export interface ReceptionManualCreateFormProps {
  onClose?: () => void;
  onCreated?: () => void;
}

export const ReceptionManualCreateForm: React.FC<ReceptionManualCreateFormProps> = ({
  onClose,
  onCreated,
}) => {
  const [formData, setFormData] = useState({
    producer_id: null as number | null,
    product: 'ARROZ_PADDY' as LogisticsProductCode,
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    gross_weight: '' as string,
    tare_weight: '' as string,
  });

  const [producers, setProducers] = useState<ProducerOption[]>([]);
  const [producerSearch, setProducerSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProducers = useCallback(async () => {
    try {
      const result = await fetchProducersAction({
        page: 1,
        limit: 5000,
        sortField: 'name',
        sort: 'ASC',
      });
      setProducers(result.data);
    } catch (err) {
      console.error('Error cargando productores:', err);
    }
  }, []);

  useEffect(() => {
    void loadProducers();
  }, [loadProducers]);

  const producerAutocompleteOptions = useMemo(() => {
    const normalizedQuery = producerSearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return producers;
    }
    return producers.filter(
      (producer) =>
        producer.name.toLowerCase().includes(normalizedQuery) ||
        producer.rut.toLowerCase().includes(normalizedQuery) ||
        (producer.city || '').toLowerCase().includes(normalizedQuery) ||
        (producer.email || '').toLowerCase().includes(normalizedQuery),
    );
  }, [producers, producerSearch]);

  const productSelectOptions = useMemo(
    () => LOGISTICS_PRODUCT_OPTIONS.map((o) => ({ id: o.value, label: o.label })),
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.producer_id) {
      setError('Selecciona un productor');
      return;
    }

    if (!formData.license_plate.trim()) {
      setError('La patente es requerida');
      return;
    }

    const weight = Number(formData.gross_weight);
    if (!weight || weight <= 0) {
      setError('El peso bruto debe ser mayor a 0');
      return;
    }

    const tareTrim = formData.tare_weight.trim();
    let tareNum: number | undefined;
    if (tareTrim !== '') {
      tareNum = Number(tareTrim);
      if (!Number.isFinite(tareNum) || tareNum <= 0) {
        setError('El peso tara debe ser mayor a 0');
        return;
      }
      if (tareNum >= weight) {
        setError('El peso tara debe ser menor al peso bruto');
        return;
      }
    }

    setIsLoading(true);

    try {
      const driverTrim = formData.driver_name.trim();
      await createTruckReceptionAction({
        producer_id: formData.producer_id,
        license_plate: formData.license_plate.trim(),
        ...(driverTrim ? { driver_name: driverTrim } : {}),
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        gross_weight: weight,
        ...(tareNum !== undefined ? { tare_weight: tareNum } : {}),
        product: formData.product,
      });

      setSuccessMessage('Recepción creada correctamente.');
      setFormData({
        producer_id: null,
        product: 'ARROZ_PADDY',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: '',
        tare_weight: '',
      });
      setProducerSearch('');
      onCreated?.();
      void loadProducers();
      setTimeout(() => {
        setSuccessMessage(null);
        onClose?.();
      }, 600);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear recepción';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <Alert variant="success" className="mb-2">
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert variant="error" className="mb-2">
            {error}
          </Alert>
        )}

        <AutoComplete<ProducerOption>
          options={producerAutocompleteOptions}
          value={producers.find((p) => p.id === formData.producer_id) || null}
          onChange={(option) => {
            setFormData((prev) => ({
              ...prev,
              producer_id: option?.id ?? null,
            }));
          }}
          onInputChange={setProducerSearch}
          getOptionLabel={(option) => `${option.name} · ${option.rut}`}
          getOptionValue={(option) => option.id}
          filterOption={(option, searchValue) => {
            const q = searchValue.trim().toLowerCase();
            if (!q) return true;
            return (
              option.name.toLowerCase().includes(q) ||
              option.rut.toLowerCase().includes(q) ||
              (option.email || '').toLowerCase().includes(q) ||
              (option.city || '').toLowerCase().includes(q)
            );
          }}
          placeholder="Buscar por nombre o RUT"
          disabled={isLoading}
          label="Productor"
          labelAlwaysVisible
        />

        <Select
          label="Producto"
          name="reception-create-product"
          placeholder="Selecciona producto"
          options={productSelectOptions}
          value={formData.product}
          onChange={(id) => {
            if (id !== null && id !== undefined) {
              setFormData((prev) => ({ ...prev, product: id as LogisticsProductCode }));
            }
          }}
          disabled={isLoading}
        />

        <TextField
          label="Patente"
          name="reception-create-plate"
          value={formData.license_plate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, license_plate: e.target.value }))
          }
          disabled={isLoading}
          required
          labelAlwaysVisible
        />

        <TextField
          label="Chofer (opcional)"
          name="reception-create-driver"
          value={formData.driver_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, driver_name: e.target.value }))
          }
          disabled={isLoading}
          labelAlwaysVisible
        />

        <TextField
          label="Empresa transporte (opcional)"
          name="reception-create-carrier"
          value={formData.carrier_company}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, carrier_company: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Guía de despacho (opcional)"
          name="reception-create-guide"
          value={formData.dispatch_guide}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dispatch_guide: e.target.value }))
          }
          disabled={isLoading}
          labelAlwaysVisible
        />

        <TextField
          label="Peso bruto (kg)"
          name="reception-create-gross"
          type="number"
          value={formData.gross_weight}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gross_weight: e.target.value }))
          }
          disabled={isLoading}
          required
        />

        <TextField
          label="Peso tara (kg) — opcional"
          name="reception-create-tare"
          type="number"
          value={formData.tare_weight}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tare_weight: e.target.value }))
          }
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground -mt-2">
          Si indicas tara, la recepción queda finalizada con el neto calculado.
        </p>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button type="button" variant="outlined" onClick={() => onClose?.()} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Guardando…' : 'Crear recepción'}
          </Button>
        </div>
      </form>
    </div>
  );
};
