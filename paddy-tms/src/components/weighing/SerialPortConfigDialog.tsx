'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { Button } from '@/shared/components/ui/Button/Button';
import { serialPortService } from '@/services/serialPort.service';
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

  useEffect(() => {
    if (open) {
      const cfg = serialPortConfigStorage.getConfig();
      setSavedPortLabel(cfg?.port ?? null);
    }
  }, [open]);

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
