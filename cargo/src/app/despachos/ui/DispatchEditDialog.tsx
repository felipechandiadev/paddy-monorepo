'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import Select from '@/shared/components/ui/Select/Select';
import { fetchProducersAction, ProducerOption } from '@/actions/fetchProducersAction';
import {
  getTruckDispatchByIdAction,
  updateTruckDispatchAction,
  type TruckDispatchGridRow,
} from '@/actions/truckDispatchActions';
import {
  LOGISTICS_PRODUCT_OPTIONS,
  type LogisticsProductCode,
} from '@/lib/logisticsProduct';

export interface DispatchEditDialogProps {
  open: boolean;
  row: TruckDispatchGridRow | null;
  onClose: () => void;
  onSaved: () => void;
}

export const DispatchEditDialog: React.FC<DispatchEditDialogProps> = ({
  open,
  row,
  onClose,
  onSaved,
}) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (open) {
      void loadProducers();
    }
  }, [open, loadProducers]);

  useEffect(() => {
    if (!open || !row) {
      return;
    }
    setError(null);
    setProducerSearch('');
    const product =
      row.product === 'CASCARILLA' || row.product === 'ARROZ_PADDY'
        ? row.product
        : 'ARROZ_PADDY';
    setFormData({
      producer_id: row.producer_id ?? null,
      product,
      license_plate: row.license_plate ?? '',
      driver_name: row.driver_name ?? '',
      carrier_company: row.carrier_company ?? '',
      dispatch_guide: row.dispatch_guide ?? '',
      notes: '',
      tare_weight:
        row.tare_weight != null && row.tare_weight !== ''
          ? String(row.tare_weight)
          : '',
      gross_weight:
        row.gross_weight != null && row.gross_weight !== ''
          ? String(row.gross_weight)
          : '',
    });
  }, [open, row]);

  useEffect(() => {
    if (!open || !row?.id) {
      return;
    }
    void (async () => {
      const full = await getTruckDispatchByIdAction(row.id);
      const notes = full?.notes != null ? String(full.notes) : '';
      setFormData((prev) => ({ ...prev, notes }));
    })();
  }, [open, row?.id]);

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

  const isFinished =
    row != null && row.status?.trim().toUpperCase() === 'FINISHED';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!row) return;
    setError(null);

    if (!formData.producer_id) {
      setError('Selecciona un productor');
      return;
    }

    if (!formData.license_plate.trim()) {
      setError('La patente es requerida');
      return;
    }

    const tare = Number(formData.tare_weight);
    if (!tare || tare <= 0) {
      setError('El peso tara debe ser mayor a 0');
      return;
    }

    const grossTrim = formData.gross_weight.trim();
    let grossNum: number | undefined;
    if (grossTrim !== '') {
      grossNum = Number(grossTrim);
      if (!Number.isFinite(grossNum) || grossNum <= 0) {
        setError('El peso bruto debe ser mayor a 0');
        return;
      }
    } else if (
      row.gross_weight != null &&
      String(row.gross_weight).trim() !== ''
    ) {
      const existing = Number(row.gross_weight);
      if (Number.isFinite(existing) && existing > 0) {
        grossNum = existing;
      }
    }

    if (isFinished && grossNum === undefined) {
      setError('En despachos finalizados el bruto es obligatorio');
      return;
    }

    if (grossNum !== undefined && grossNum <= tare) {
      setError('El peso bruto debe ser mayor que la tara');
      return;
    }

    setIsLoading(true);

    try {
      const driverTrim = formData.driver_name.trim();
      const notesTrim = formData.notes.trim();
      await updateTruckDispatchAction(row.id, {
        producer_id: formData.producer_id,
        license_plate: formData.license_plate.trim(),
        driver_name: driverTrim === '' ? null : driverTrim,
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        notes: notesTrim === '' ? null : notesTrim,
        tare_weight: tare,
        ...(grossNum !== undefined ? { gross_weight: grossNum } : {}),
        product: formData.product,
      });
      onSaved();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar despacho';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Editar despacho"
      size="lg"
      scroll="body"
      hideActions
      showCloseButton
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-1 pb-2">
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
          name="dispatch-edit-product"
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
          name="dispatch-edit-plate"
          value={formData.license_plate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, license_plate: e.target.value }))
          }
          disabled={isLoading}
          required
        />

        <TextField
          label="Chofer (opcional)"
          name="dispatch-edit-driver"
          value={formData.driver_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, driver_name: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Empresa transporte (opcional)"
          name="dispatch-edit-carrier"
          value={formData.carrier_company}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, carrier_company: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Guía de despacho (opcional)"
          name="dispatch-edit-guide"
          value={formData.dispatch_guide}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dispatch_guide: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Notas (opcional)"
          name="dispatch-edit-notes"
          type="textarea"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          disabled={isLoading}
        />

        <TextField
          label="Peso tara (kg)"
          name="dispatch-edit-tare"
          type="number"
          value={formData.tare_weight}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tare_weight: e.target.value }))
          }
          disabled={isLoading}
          required
        />

        <TextField
          label="Peso bruto (kg)"
          name="dispatch-edit-gross"
          type="number"
          value={formData.gross_weight}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gross_weight: e.target.value }))
          }
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground -mt-2">
          {isFinished
            ? 'Despacho finalizado: bruto y tara deben ser válidos (bruto mayor que tara).'
            : 'Vacío en bruto = no cambiar el bruto actual. Con bruto válido puede finalizar el despacho.'}
        </p>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button type="button" variant="outlined" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
