'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import Select from '@/shared/components/ui/Select/Select';
import { fetchProducersAction, ProducerOption } from '@/actions/fetchProducersAction';
import type { CreatedProducer } from '@/actions/producerActions';
import {
  createTruckDispatchWithTareAction,
  registerDispatchGrossWeightAction,
  type TruckDispatch,
} from '@/actions/truckDispatchActions';
import {
  LOGISTICS_PRODUCT_OPTIONS,
  formatLogisticsProductLabel,
  type LogisticsProductCode,
} from '@/lib/logisticsProduct';
import { useDispatchWeighingPage } from '@/providers/DispatchWeighingPageProvider';
import CreateProducerDialog from '@/components/producers/CreateProducerDialog';

const CREATE_PRODUCER_OPTION_ID = '__create_new_producer__' as const;

interface CreateProducerOption {
  id: typeof CREATE_PRODUCER_OPTION_ID;
  query: string;
  isCreateOption: true;
}

type ProducerAutoCompleteOption = ProducerOption | CreateProducerOption;

function isCreateProducerOption(
  option: ProducerAutoCompleteOption | null,
): option is CreateProducerOption {
  return Boolean(option && 'isCreateOption' in option && option.isCreateOption);
}

type FormMode = 'create' | 'gross';

interface TruckDispatchFormProps {
  mode: FormMode;
  selected?: TruckDispatch | null;
  serialWeight: number | null;
  isSerialConnected: boolean;
  onDispatchCreated?: (d: TruckDispatch) => void;
  onGrossFinalized?: (d: TruckDispatch) => void;
  onCancel?: () => void;
}

export const TruckDispatchForm: React.FC<TruckDispatchFormProps> = ({
  mode,
  selected,
  serialWeight,
  isSerialConnected,
  onDispatchCreated,
  onGrossFinalized,
  onCancel,
}) => {
  const { addDispatch, loadDispatchesToday, updateDispatch } = useDispatchWeighingPage();

  const [formData, setFormData] = useState({
    producer_id: null as number | null,
    product: 'ARROZ_PADDY' as LogisticsProductCode,
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    notes: '',
    tare_weight: '' as string,
    gross_weight: '' as string,
  });

  const [producers, setProducers] = useState<ProducerOption[]>([]);
  const [producerSearch, setProducerSearch] = useState('');
  const [createProducerDialogOpen, setCreateProducerDialogOpen] = useState(false);
  const [producerAutocompleteResetKey, setProducerAutocompleteResetKey] = useState(0);
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

  const producerAutocompleteOptions = useMemo<ProducerAutoCompleteOption[]>(() => {
    const normalizedQuery = producerSearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return producers;
    }
    const hasMatches = producers.some(
      (producer) =>
        producer.name.toLowerCase().includes(normalizedQuery) ||
        producer.rut.toLowerCase().includes(normalizedQuery) ||
        (producer.city || '').toLowerCase().includes(normalizedQuery) ||
        (producer.email || '').toLowerCase().includes(normalizedQuery),
    );
    if (hasMatches) {
      return producers;
    }
    return [
      ...producers,
      {
        id: CREATE_PRODUCER_OPTION_ID,
        query: producerSearch.trim(),
        isCreateOption: true,
      },
    ];
  }, [producers, producerSearch]);

  const productSelectOptions = useMemo(
    () => LOGISTICS_PRODUCT_OPTIONS.map((o) => ({ id: o.value, label: o.label })),
    [],
  );

  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    if (mode === 'create') {
      setFormData({
        producer_id: null,
        product: 'ARROZ_PADDY',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        notes: '',
        tare_weight: '',
        gross_weight: '',
      });
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'gross' && selected?.id != null) {
      setFormData((prev) => ({ ...prev, gross_weight: '' }));
    }
  }, [mode, selected?.id]);

  useEffect(() => {
    if (!isSerialConnected || serialWeight == null || !Number.isFinite(serialWeight)) {
      return;
    }
    const value = String(serialWeight);
    if (mode === 'create') {
      setFormData((prev) => ({ ...prev, tare_weight: value }));
    } else if (mode === 'gross') {
      setFormData((prev) => ({ ...prev, gross_weight: value }));
    }
  }, [serialWeight, isSerialConnected, mode]);

  const handleProducerCreated = useCallback((producer: CreatedProducer) => {
    const normalized: ProducerOption = {
      id: producer.id,
      name: producer.name || '',
      rut: producer.rut || '',
      email: producer.email,
      city: producer.city,
    };
    setFormData((prev) => ({ ...prev, producer_id: normalized.id }));
    setProducers((current) => {
      const next = [normalized, ...current.filter((p) => p.id !== normalized.id)];
      return next.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    });
    setProducerSearch('');
    setProducerAutocompleteResetKey((k) => k + 1);
  }, []);

  const netPreview =
    mode === 'gross' && selected?.tare_weight != null && formData.gross_weight
      ? Number(formData.gross_weight) - Number(selected.tare_weight)
      : null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
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
    const tw = Number(formData.tare_weight);
    if (!tw || tw <= 0) {
      setError('El peso tara debe ser mayor a 0');
      return;
    }

    setIsLoading(true);
    try {
      const driverTrim = formData.driver_name.trim();
      const notesTrim = formData.notes.trim();
      const created = await createTruckDispatchWithTareAction({
        producer_id: formData.producer_id,
        license_plate: formData.license_plate.trim(),
        ...(driverTrim ? { driver_name: driverTrim } : {}),
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        ...(notesTrim ? { notes: notesTrim } : {}),
        tare_weight: tw,
        product: formData.product,
      });

      addDispatch(created);
      await loadDispatchesToday();
      setSuccessMessage(`Despacho #${created.id} creado con tara.`);
      setFormData({
        producer_id: null,
        product: 'ARROZ_PADDY',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        notes: '',
        tare_weight: '',
        gross_weight: '',
      });
      setProducerSearch('');
      setProducerAutocompleteResetKey((k) => k + 1);
      onDispatchCreated?.(created);
      void loadProducers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear despacho');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrossSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selected) {
      setError('No hay despacho seleccionado');
      return;
    }
    const gw = Number(formData.gross_weight);
    if (!gw || gw <= 0) {
      setError('El peso bruto debe ser mayor a 0');
      return;
    }
    const tw = Number(selected.tare_weight ?? 0);
    if (gw <= tw) {
      setError('El peso bruto debe ser mayor que la tara');
      return;
    }

    setIsLoading(true);
    try {
      const updated = await registerDispatchGrossWeightAction({
        truck_dispatch_id: selected.id,
        gross_weight: gw,
        status: 'FINISHED',
      });
      updateDispatch(updated);
      setFormData((prev) => ({ ...prev, gross_weight: '' }));
      setSuccessMessage('Despacho finalizado correctamente');
      onGrossFinalized?.(updated);
      setTimeout(() => onCancel?.(), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar bruto');
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'create') {
    return (
      <>
        <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-bold text-foreground mb-2">Nuevo despacho (tara)</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {successMessage && (
              <Alert variant="success" className="mb-4">
                {successMessage}
              </Alert>
            )}
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <AutoComplete<ProducerAutoCompleteOption>
              key={producerAutocompleteResetKey}
              options={producerAutocompleteOptions}
              value={producers.find((p) => p.id === formData.producer_id) || null}
              onChange={(option) => {
                if (!option) {
                  setFormData((prev) => ({ ...prev, producer_id: null }));
                  return;
                }
                if (isCreateProducerOption(option)) {
                  setCreateProducerDialogOpen(true);
                  setProducerAutocompleteResetKey((k) => k + 1);
                  return;
                }
                setFormData((prev) => ({ ...prev, producer_id: option.id }));
              }}
              onInputChange={setProducerSearch}
              getOptionLabel={(option) =>
                isCreateProducerOption(option)
                  ? `+ Nuevo productor "${option.query}"`
                  : `${option.name} · ${option.rut}`
              }
              getOptionValue={(option) => option.id}
              filterOption={(option, searchValue) => {
                if (isCreateProducerOption(option)) {
                  return true;
                }
                const q = searchValue.trim().toLowerCase();
                if (!q) {
                  return true;
                }
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
              name="dispatch-product"
              placeholder="Selecciona producto"
              options={productSelectOptions}
              value={formData.product}
              onChange={(id) => {
                if (id !== null && id !== undefined) {
                  setFormData((prev) => ({ ...prev, product: id as LogisticsProductCode }));
                }
              }}
              required
              disabled={isLoading}
              data-test-id="dispatch-product"
            />

            <TextField
              label="Patente *"
              value={formData.license_plate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, license_plate: e.target.value }))
              }
              disabled={isLoading}
              labelAlwaysVisible
            />

            <TextField
              label="Chofer"
              value={formData.driver_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, driver_name: e.target.value }))
              }
              disabled={isLoading}
              labelAlwaysVisible
            />

            <TextField
              label="Empresa transporte"
              value={formData.carrier_company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, carrier_company: e.target.value }))
              }
              disabled={isLoading}
              labelAlwaysVisible
            />

            <TextField
              label="Guía de despacho"
              value={formData.dispatch_guide}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dispatch_guide: e.target.value }))
              }
              disabled={isLoading}
              labelAlwaysVisible
            />

            <TextField
              label="Notas"
              type="textarea"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              disabled={isLoading}
              labelAlwaysVisible
            />

            <TextField
              label="Peso tara (kg) *"
              type="number"
              value={formData.tare_weight}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tare_weight: e.target.value }))
              }
              disabled={isLoading}
              min="0"
              step="0.01"
              labelAlwaysVisible
            />

            <Button type="submit" variant="primary" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar despacho'}
            </Button>
          </form>
        </div>

        <CreateProducerDialog
          open={createProducerDialogOpen}
          onClose={() => setCreateProducerDialogOpen(false)}
          onSuccess={handleProducerCreated}
        />
      </>
    );
  }

  if (mode === 'gross' && selected) {
    return (
      <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-2">Registrar peso bruto</h2>
        <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-neutral/5 rounded-lg">
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">ID despacho</label>
            <p className="text-lg font-semibold text-foreground">#{selected.id}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Patente</label>
            <p className="text-sm font-semibold text-foreground">{selected.license_plate}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Producto</label>
            <p className="text-sm font-semibold text-foreground">
              {formatLogisticsProductLabel(selected.product)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-neutral/10 rounded-lg p-3">
            <label className="text-xs text-muted-foreground">Tara</label>
            <p className="text-lg font-bold text-foreground">
              {selected.tare_weight != null
                ? Number(selected.tare_weight).toLocaleString('es-CL', {
                    maximumFractionDigits: 2,
                  })
                : '—'}{' '}
              kg
            </p>
          </div>
          <div className="flex-1 bg-neutral/10 rounded-lg p-3">
            <label className="text-xs text-muted-foreground">Bruto</label>
            <p className="text-lg font-bold text-foreground">
              {formData.gross_weight
                ? Number(formData.gross_weight).toLocaleString('es-CL', {
                    maximumFractionDigits: 2,
                  })
                : '—'}{' '}
              kg
            </p>
          </div>
          <div className="flex-1 bg-primary/10 rounded-lg p-3">
            <label className="text-xs text-primary">Neto</label>
            <p className="text-lg font-bold text-primary">
              {netPreview != null && Number.isFinite(netPreview)
                ? netPreview.toLocaleString('es-CL', { maximumFractionDigits: 2 })
                : '—'}{' '}
              kg
            </p>
          </div>
        </div>

        <form onSubmit={handleGrossSubmit} className="space-y-4">
          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <TextField
            label="Peso bruto (kg) *"
            type="number"
            value={formData.gross_weight}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gross_weight: e.target.value }))
            }
            disabled={isLoading}
            min="0"
            step="0.01"
            labelAlwaysVisible
          />

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'Finalizando...' : 'Finalizar despacho'}
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

  return (
    <div className="bg-background rounded-lg border border-border p-6 h-full flex items-center justify-center">
      <p className="text-muted-foreground text-center text-sm">
        Selecciona un despacho para registrar el bruto
      </p>
    </div>
  );
};
