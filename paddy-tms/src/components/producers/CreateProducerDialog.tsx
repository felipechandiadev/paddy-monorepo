'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  createProducerAction,
  type CreateProducerPayload,
  type CreatedProducer,
} from '@/actions/producerActions';
import Alert from '@/shared/components/ui/Alert/Alert';
import { Button } from '@/shared/components/ui/Button/Button';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import Switch from '@/shared/components/ui/Switch/Switch';

interface CreateProducerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (producer: CreatedProducer) => void;
}

function normalizeRut(rawRut: string): string {
  return rawRut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
}

function hasValidRutVerifier(rut: string): boolean {
  const normalizedRut = normalizeRut(rut);

  if (!/^\d{7,8}[\dK]$/.test(normalizedRut)) {
    return false;
  }

  const body = normalizedRut.slice(0, -1);
  const verifier = normalizedRut.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);

  return verifier === expectedVerifier;
}

export default function CreateProducerDialog({ open, onClose, onSuccess }: CreateProducerDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateProducerPayload>({
    rut: '',
    name: '',
    address: '',
    city: '',
    email: '',
    phone: '',
    contactPerson: '',
    isActive: true,
    bankAccounts: [],
  });

  const fieldIds = {
    rut: 'tms-producer-rut',
    name: 'tms-producer-name',
    email: 'tms-producer-email',
    phone: 'tms-producer-phone',
    address: 'tms-producer-address',
    city: 'tms-producer-city',
    contactPerson: 'tms-producer-contact',
    submitBtn: 'tms-producer-submit-btn',
  };

  const tabOrder = [
    fieldIds.rut,
    fieldIds.name,
    fieldIds.email,
    fieldIds.phone,
    fieldIds.address,
    fieldIds.city,
    fieldIds.contactPerson,
    fieldIds.submitBtn,
  ];

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setFormData({
        rut: '',
        name: '',
        address: '',
        city: '',
        email: '',
        phone: '',
        contactPerson: '',
        isActive: true,
        bankAccounts: [],
      });
      setError('');
    }
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setError('');
    setIsLoading(true);

    if (!formData.rut.trim()) {
      setError('RUT es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Nombre es requerido');
      setIsLoading(false);
      return;
    }

    if (!hasValidRutVerifier(formData.rut)) {
      setError('RUT tiene dígito verificador inválido');
      setIsLoading(false);
      return;
    }

    const result = await createProducerAction(formData);

    if (result.success && result.data) {
      onSuccess?.(result.data);
      onClose();
    } else {
      setError(result.error || 'Error al crear productor');
    }

    setIsLoading(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldId: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIndex = tabOrder.indexOf(fieldId);
      if (currentIndex === -1) return;
      const nextFieldId = tabOrder[currentIndex + 1];
      if (nextFieldId) {
        const nextElement = document.getElementById(nextFieldId) as HTMLInputElement | HTMLButtonElement;
        if (nextElement) nextElement.focus();
      }
    }
  };

  if (!open || !isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-background shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Crear Productor</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {error && <Alert variant="error">{error}</Alert>}

          <TextField
            id={fieldIds.rut}
            label="RUT *"
            type="dni"
            value={formData.rut}
            onChange={(e) => setFormData((prev) => ({ ...prev, rut: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.rut)}
            placeholder="12.345.678-9"
            required
            labelAlwaysVisible
          />

          <TextField
            id={fieldIds.name}
            label="Nombre *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.name)}
            placeholder="Nombre del productor"
            required
            labelAlwaysVisible
          />

          <TextField
            id={fieldIds.email}
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.email)}
            placeholder="correo@ejemplo.com"
            labelAlwaysVisible
          />

          <TextField
            id={fieldIds.phone}
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.phone)}
            placeholder="+56912345678"
            phonePrefix="+56"
            labelAlwaysVisible
          />

          <TextField
            id={fieldIds.address}
            label="Dirección"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.address)}
            placeholder="Calle Principal 123"
            labelAlwaysVisible
          />

          <TextField
            id={fieldIds.city}
            label="Ciudad"
            type="text"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.city)}
            placeholder="Parral"
            labelAlwaysVisible
          />

          <TextField
            id={fieldIds.contactPerson}
            label="Persona de Contacto"
            type="text"
            value={formData.contactPerson}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, fieldIds.contactPerson)}
            placeholder="Nombre del contacto"
            labelAlwaysVisible
          />

          <div className="pt-2">
            <Switch
              label="Activo"
              checked={formData.isActive ?? true}
              onChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              labelPosition="right"
            />
          </div>

          <div className="flex justify-between gap-3 border-t border-border pt-4">
            <Button type="button" onClick={onClose} variant="outlined" disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              id={fieldIds.submitBtn}
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSubmit();
              }}
            >
              Crear
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
