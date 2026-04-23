'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { Button } from '@/shared/components/ui/Button/Button';
import { serialPortService, SERIAL_BAUD_RATES, SERIAL_DATA_BITS } from '@/services/serialPort.service';
import { serialPortConfigStorage } from '@/services/serialPortConfigService';

interface SerialPortConfigDialogProps {
  open: boolean;
  onClose: () => void;
  isConnected: boolean;
  isAvailable: boolean;
  isConnecting: boolean;
  dialogError: string | null;
  onChoosePort: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const SerialPortConfigDialog: React.FC<SerialPortConfigDialogProps> = ({
  open,
  onClose,
  isConnected,
  isAvailable,
  isConnecting,
  dialogError,
  onChoosePort,
  onDisconnect,
}) => {
  const [savedPortLabel, setSavedPortLabel] = useState<string | null>(null);
  const [baudRate, setBaudRate] = useState(9600);
  const [dataBits, setDataBits] = useState<7 | 8>(7);
  const [parity, setParity] = useState<'none' | 'even' | 'odd'>('none');

  useEffect(() => {
    if (open) {
      const cfg = serialPortConfigStorage.getConfig();
      setSavedPortLabel(cfg?.port ?? null);
      setBaudRate(cfg?.baudRate && cfg.baudRate > 0 ? cfg.baudRate : 9600);
      setDataBits(cfg?.dataBits === 8 ? 8 : 7);
      setParity(cfg?.parity === 'even' || cfg?.parity === 'odd' ? cfg.parity : 'none');
    }
  }, [open]);

  const persistLineSettings = (patch: {
    baudRate?: number;
    dataBits?: 7 | 8;
    parity?: 'none' | 'even' | 'odd';
  }) => {
    const prev = serialPortConfigStorage.getConfig();
    const rate = patch.baudRate ?? prev?.baudRate ?? 9600;
    const bits = patch.dataBits ?? (prev?.dataBits === 8 ? 8 : 7);
    const par = patch.parity ?? (prev?.parity === 'even' || prev?.parity === 'odd' ? prev.parity : 'none');
    serialPortConfigStorage.saveConfig({
      port: prev?.port ?? 'serial',
      baudRate: rate,
      dataBits: bits,
      stopBits: 1,
      parity: par,
      lastUsed: new Date().toISOString(),
    });
  };

  const currentLabel = isConnected ? serialPortService.getPortFingerprint() : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Puerto serial — Balanza"
      size="sm"
      showCloseButton
      closeButtonText="Cerrar"
      hideActions
    >
      <div className="space-y-4 text-sm text-foreground">
        {!isAvailable && (
          <p className="text-muted-foreground">
            Tu navegador no soporta Web Serial API. Usa Chrome o Edge en HTTPS o localhost.
          </p>
        )}

        {isAvailable && (
          <>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Estado</p>
              <p className="font-medium">
                {isConnected ? (
                  <span className="text-success">Conectado</span>
                ) : (
                  <span className="text-red-400">Sin conexión</span>
                )}
              </p>
            </div>

            {currentLabel && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Puerto actual</p>
                <p className="font-mono text-xs break-all">{currentLabel}</p>
              </div>
            )}

            {savedPortLabel && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Último guardado (local)</p>
                <p className="font-mono text-xs break-all">{savedPortLabel}</p>
              </div>
            )}

            <div>
              <label htmlFor="serial-baud" className="text-xs font-medium text-muted-foreground block mb-1">
                Velocidad (baud rate)
              </label>
              <select
                id="serial-baud"
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                value={baudRate}
                onChange={(e) => {
                  const rate = Number(e.target.value);
                  setBaudRate(rate);
                  persistLineSettings({ baudRate: rate });
                }}
              >
                {SERIAL_BAUD_RATES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Balanza 9600 / 7 bits: deje 9600 y 7 abajo. Tras cambiar línea serie, desconecte y vuelva
                a elegir el puerto.
              </p>
            </div>

            <div>
              <label htmlFor="serial-databits" className="text-xs font-medium text-muted-foreground block mb-1">
                Bits de datos
              </label>
              <select
                id="serial-databits"
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                value={dataBits}
                onChange={(e) => {
                  const bits = Number(e.target.value) === 8 ? 8 : 7;
                  setDataBits(bits);
                  persistLineSettings({ dataBits: bits });
                }}
              >
                {SERIAL_DATA_BITS.map((b) => (
                  <option key={b} value={b}>
                    {b} bits
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="serial-parity" className="text-xs font-medium text-muted-foreground block mb-1">
                Paridad
              </label>
              <select
                id="serial-parity"
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                value={parity}
                onChange={(e) => {
                  const v = e.target.value;
                  const p = v === 'even' || v === 'odd' ? v : 'none';
                  setParity(p);
                  persistLineSettings({ parity: p });
                }}
              >
                <option value="none">Ninguna (N)</option>
                <option value="even">Par (E)</option>
                <option value="odd">Impar (O)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Si el texto llega corrupto con 7 bits, pruebe paridad par (7E1 es habitual en RS-232).
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              El navegador pedirá permiso para el puerto. Puedes elegir otro dispositivo en cualquier
              momento.
            </p>

            {dialogError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
                {dialogError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1"
                disabled={!isAvailable || isConnecting}
                onClick={async () => {
                  await onChoosePort();
                }}
              >
                {isConnecting ? 'Conectando…' : isConnected ? 'Cambiar puerto' : 'Elegir puerto'}
              </Button>
              <Button
                variant="outlined"
                className="flex-1"
                disabled={!isConnected || isConnecting}
                onClick={async () => {
                  await onDisconnect();
                }}
              >
                Desconectar
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
