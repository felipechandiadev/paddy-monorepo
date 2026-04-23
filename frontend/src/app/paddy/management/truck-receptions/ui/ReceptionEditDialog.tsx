'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import AutoComplete from '@/shared/components/ui/AutoComplete/AutoComplete';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import Select from '@/shared/components/ui/Select/Select';
import {
  fetchProducersForLogisticsAction,
  type ProducerOption,
} from '@/features/logistics-trucks/actions/fetchProducersForLogistics.action';
import { updateTruckReceptionAction } from '@/features/logistics-trucks/actions/truck-reception.actions';
import type { TruckReceptionGridRow } from '@/features/logistics-trucks/types';
import {
  LOGISTICS_PRODUCT_OPTIONS,
  type LogisticsProductCode,
} from '@/lib/logisticsProduct';
import { RECEPTION_TURNO_MAX, RECEPTION_TURNO_MIN } from '@/lib/receptionTurno';

export interface ReceptionEditDialogProps {
  open: boolean;
  row: TruckReceptionGridRow | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ReceptionEditDialog: React.FC<ReceptionEditDialogProps> = ({
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
    gross_weight: '' as string,
    tare_weight: '' as string,
    numero_turno: '' as string,
  });

  const [producers, setProducers] = useState<ProducerOption[]>([]);
  const [producerSearch, setProducerSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducers = useCallback(async () => {
    try {
      const data = await fetchProducersForLogisticsAction();
      setProducers(data);
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
      gross_weight:
        row.gross_weight != null && row.gross_weight !== ''
          ? String(row.gross_weight)
          : '',
      tare_weight:
        row.tare_weight != null && row.tare_weight !== ''
          ? String(row.tare_weight)
          : '',
      numero_turno: row.numero_turno != null ? String(row.numero_turno) : '',
    });
  }, [open, row]);

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
    } else if (row.tare_weight != null && String(row.tare_weight).trim() !== '') {
      const existing = Number(row.tare_weight);
      if (Number.isFinite(existing) && existing > 0) {
        tareNum = existing;
      }
    }
    if (tareNum !== undefined && tareNum >= weight) {
      setError('El peso tara debe ser menor al peso bruto');
      return;
    }

    const turnoTrim = formData.numero_turno.trim();
    let numero_turno: number | undefined;
    if (!isFinished && turnoTrim !== '') {
      const n = Math.round(Number(turnoTrim));
      if (
        !Number.isFinite(n) ||
        n < RECEPTION_TURNO_MIN ||
        n > RECEPTION_TURNO_MAX
      ) {
        setError(
          `El turno debe ser un entero entre ${RECEPTION_TURNO_MIN} y ${RECEPTION_TURNO_MAX}`,
        );
        return;
      }
      numero_turno = n;
    }

    setIsLoading(true);

    try {
      const driverTrim = formData.driver_name.trim();
      await updateTruckReceptionAction(row.id, {
        producer_id: formData.producer_id,
        license_plate: formData.license_plate.trim(),
        driver_name: driverTrim === '' ? null : driverTrim,
        carrier_company: formData.carrier_company.trim() || undefined,
        dispatch_guide: formData.dispatch_guide.trim() || undefined,
        gross_weight: weight,
        ...(tareNum !== undefined ? { tare_weight: tareNum } : {}),
        product: formData.product,
        ...(!isFinished && numero_turno !== undefined ? { numero_turno } : {}),
      });
      onSaved();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar recepción';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Editar recepción"
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
          name="reception-edit-product"
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
          name="reception-edit-plate"
          value={formData.license_plate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, license_plate: e.target.value }))
          }
          disabled={isLoading}
          required
        />

        <div>
          <TextField
            label={`Turno (${RECEPTION_TURNO_MIN}–${RECEPTION_TURNO_MAX})`}
            name="reception-edit-turno"
            value={formData.numero_turno}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, numero_turno: e.target.value }))
            }
            disabled={isLoading || isFinished}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {isFinished
              ? 'En recepciones finalizadas el turno no se modifica.'
              : 'Vacío = no cambiar el turno. Con valor = asignar o actualizar cupo.'}
          </p>
        </div>

        <TextField
          label="Chofer (opcional)"
          name="reception-edit-driver"
          value={formData.driver_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, driver_name: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Empresa transporte (opcional)"
          name="reception-edit-carrier"
          value={formData.carrier_company}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, carrier_company: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Guía de despacho (opcional)"
          name="reception-edit-guide"
          value={formData.dispatch_guide}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dispatch_guide: e.target.value }))
          }
          disabled={isLoading}
        />

        <TextField
          label="Peso bruto (kg)"
          name="reception-edit-gross"
          type="number"
          value={formData.gross_weight}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gross_weight: e.target.value }))
          }
          disabled={isLoading}
          required
        />

        <TextField
          label="Peso tara (kg)"
          name="reception-edit-tare"
          type="number"
          value={formData.tare_weight}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tare_weight: e.target.value }))
          }
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground -mt-2">
          Debe ser menor que el bruto. Si la recepción está en espera y registras tara, pasará a
          finalizada. Si ya había tara, puedes dejarlo vacío para mantener el valor actual.
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
