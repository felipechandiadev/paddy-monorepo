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
  createTruckReceptionAction,
  recordTareWeightAction,
  TruckReception,
  RegisterTareWeightPayload,
} from '@/actions/truckReceptionActions';
import {
  LOGISTICS_PRODUCT_OPTIONS,
  formatLogisticsProductLabel,
  type LogisticsProductCode,
} from '@/lib/logisticsProduct';
import { useWeighingPage } from '@/hooks/useWeighingPage';
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

type FormMode = 'create' | 'tare';

interface TruckReceptionFormProps {
  mode: FormMode;
  selectedTruck?: TruckReception | null;
  serialWeight: number | null;
  isSerialConnected: boolean;
  /** Web Serial API disponible (HTTPS / localhost). */
  serialAvailable?: boolean;
  /** Abre el selector de puerto (requiere gesto del usuario la primera vez). */
  onConnectSerial?: () => void;
  serialConnecting?: boolean;
  onTruckCreated?: (truck: TruckReception) => void;
  onTareFinalized?: (truck: TruckReception) => void;
  onCancel?: () => void;
}

export const TruckReceptionForm: React.FC<TruckReceptionFormProps> = ({
  mode,
  selectedTruck,
  serialWeight,
  isSerialConnected,
  serialAvailable = false,
  onConnectSerial,
  serialConnecting = false,
  onTruckCreated,
  onTareFinalized,
  onCancel,
}) => {
  const { addTruck, loadTrucksToday, updateTruck } = useWeighingPage();

  const [formData, setFormData] = useState({
    // Modo: create
    producer_id: null as number | null,
    product: 'ARROZ_PADDY' as LogisticsProductCode,
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    gross_weight: '' as string,

    // Modo: tare
    tare_weight: '' as string,
  });

  const [producers, setProducers] = useState<ProducerOption[]>([]);
  const [producerSearch, setProducerSearch] = useState('');
  const [createProducerDialogOpen, setCreateProducerDialogOpen] = useState(false);
  const [producerAutocompleteResetKey, setProducerAutocompleteResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  /** Evita mismatch SSR: `serialAvailable` solo existe en el navegador. */
  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);

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

  // Resetear formulario al pasar a modo creación
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
        gross_weight: '',
        tare_weight: '',
      });
    }
  }, [mode]);

  // En tara: limpiar campo al elegir otro camión (el peso se vuelve a llenar desde la balanza)
  useEffect(() => {
    if (mode === 'tare' && selectedTruck?.id != null) {
      setFormData((prev) => ({ ...prev, tare_weight: '' }));
    }
  }, [mode, selectedTruck?.id]);

  /** Peso bruto / tara desde balanza (debe ir después de los resets anteriores). */
  useEffect(() => {
    if (!isSerialConnected || serialWeight == null || !Number.isFinite(serialWeight)) {
      return;
    }
    const value = String(serialWeight);
    if (mode === 'create') {
      setFormData((prev) => ({ ...prev, gross_weight: value }));
    } else if (mode === 'tare') {
      setFormData((prev) => ({ ...prev, tare_weight: value }));
    }
  }, [serialWeight, isSerialConnected, mode]);

  const handleProducerCreated = useCallback(
    (producer: CreatedProducer) => {
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
    },
    [],
  );

  // Calcular peso neto en modo tara
  const netWeight =
    mode === 'tare' && selectedTruck?.gross_weight && formData.tare_weight
      ? selectedTruck.gross_weight - Number(formData.tare_weight)
      : null;

  const serialScaleNotice =
    clientMounted && serialAvailable ? (
      <div className="mb-4 rounded-md border border-border bg-muted/30 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {isSerialConnected ? (
          <p className="text-xs text-muted-foreground">
            Balanza conectada: el peso del campo inferior se actualiza desde el puerto serie.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Si la balanza no enlaza sola, elija el puerto serie (requiere un clic del usuario).
            </p>
            {onConnectSerial ? (
              <Button
                type="button"
                variant="outlined"
                size="sm"
                className="shrink-0"
                onClick={() => onConnectSerial()}
                disabled={serialConnecting}
              >
                {serialConnecting ? 'Conectando…' : 'Conectar puerto serie'}
              </Button>
            ) : null}
          </>
        )}
      </div>
    ) : null;

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

    const weight = Number(formData.gross_weight);
    if (!weight || weight <= 0) {
      setError('El peso bruto debe ser mayor a 0');
      return;
    }

    setIsLoading(true);

    try {
      const driverTrim = formData.driver_name.trim();
      const newTruck = await createTruckReceptionAction({
        producer_id: formData.producer_id,
        license_plate: formData.license_plate.trim(),
        ...(driverTrim ? { driver_name: driverTrim } : {}),
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        gross_weight: weight,
        product: formData.product,
      });

      console.log('newTruck created:', newTruck);

      addTruck(newTruck);
      await loadTrucksToday();

      setSuccessMessage(
        newTruck.numero_turno != null
          ? `Recepción creada: Turno #${newTruck.numero_turno}`
          : 'Recepción creada. Asigna el turno en el tablero cuando corresponda.',
      );

      // Limpiar formulario
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
      setProducerAutocompleteResetKey((k) => k + 1);

      if (onTruckCreated) {
        onTruckCreated(newTruck);
      }

      void loadProducers();

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
      <>
        <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-bold text-foreground mb-2">Nueva Recepción</h2>
          {serialScaleNotice}

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
            name="reception-product"
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
            data-test-id="reception-product"
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
            label="Nombre del Chofer"
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
            placeholder={
              isSerialConnected && serialWeight != null && Number.isFinite(serialWeight)
                ? `${serialWeight} kg (serie)`
                : 'Ingresa peso manualmente'
            }
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

        <CreateProducerDialog
          open={createProducerDialogOpen}
          onClose={() => setCreateProducerDialogOpen(false)}
          onSuccess={handleProducerCreated}
        />
      </>
    );
  }

  // Renderizar modo TARE
  if (mode === 'tare' && selectedTruck) {
    return (
      <div className="bg-background rounded-lg border border-border p-6 h-full overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-2">Registrar Peso Tara</h2>
        {serialScaleNotice}

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
            <p className="text-sm font-bold text-primary">
              {selectedTruck.numero_turno != null
                ? `#${selectedTruck.numero_turno}`
                : 'Sin turno — asignar en tablero'}
            </p>
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Producto</label>
            <p className="text-sm font-semibold text-foreground">
              {formatLogisticsProductLabel(selectedTruck.product)}
            </p>
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Chofer</label>
            <p className="text-sm text-foreground">
              {selectedTruck.driver_name?.trim() || '—'}
            </p>
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
            placeholder={
              isSerialConnected && serialWeight != null && Number.isFinite(serialWeight)
                ? `${serialWeight} kg (serie)`
                : 'Ingresa peso'
            }
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
