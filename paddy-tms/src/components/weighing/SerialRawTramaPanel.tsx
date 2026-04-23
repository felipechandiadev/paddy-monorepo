'use client';

import React, { useEffect, useState } from 'react';
import type { SerialRawSample } from '@/services/serialPort.service';

interface SerialRawTramaPanelProps {
  isConnected: boolean;
  lastRawSample: SerialRawSample | null;
  lastParsedWeight: number | null;
  bytesReceivedTotal: number;
  configuredBaudRate: number;
  configuredDataBits: 7 | 8;
  configuredParity: 'none' | 'even' | 'odd';
}

/**
 * Muestra la última trama cruda del puerto serie (texto + hex) para ajustar el protocolo de la balanza.
 */
export const SerialRawTramaPanel: React.FC<SerialRawTramaPanelProps> = ({
  isConnected,
  lastRawSample,
  lastParsedWeight,
  bytesReceivedTotal,
  configuredBaudRate,
  configuredDataBits,
  configuredParity,
}) => {
  const [noDataHint, setNoDataHint] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setNoDataHint(false);
      return;
    }
    if (bytesReceivedTotal > 0) {
      setNoDataHint(false);
      return;
    }
    const t = window.setTimeout(() => setNoDataHint(true), 6000);
    return () => window.clearTimeout(t);
  }, [isConnected, bytesReceivedTotal]);

  if (!isConnected) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        Conecte la balanza (icono del puerto en la barra superior) para ver aquí los datos que envía por
        serie.
      </div>
    );
  }

  return (
    <details
      className="mt-4 rounded-lg border border-border bg-muted/25 open:pb-3"
      open
    >
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40 rounded-lg">
        Datos recibidos por puerto serie (última trama)
      </summary>
      <div className="px-3 pt-1 space-y-2 text-xs">
        <p className="text-muted-foreground">
          Línea serie:{' '}
          <span className="font-mono text-foreground">
            {configuredBaudRate} baud, {configuredDataBits}{configuredParity === 'none' ? 'N' : configuredParity === 'even' ? 'E' : 'O'}1
          </span>
          {' · '}
          Bytes recibidos (sesión):{' '}
          <span className="font-mono text-foreground">{bytesReceivedTotal}</span>
        </p>
        {noDataHint && (
          <p className="rounded-md border border-amber-200 bg-amber-50 text-amber-950 px-2 py-1.5">
            Sigue sin llegar ningún byte. Compruebe: otro baud en configuración (icono serie), que la
            balanza esté en envío continuo o que ningún otro programa use el mismo puerto; pruebe otro
            cable USB o puerto COM.
          </p>
        )}
        <p className="text-muted-foreground">
          Peso que usa el formulario (si la trama tiene un número y es &gt; 0):{' '}
          <span className="font-mono text-foreground">
            {lastParsedWeight != null ? String(lastParsedWeight) : '—'}
          </span>
        </p>
        {lastRawSample ? (
          <>
            <div className="grid gap-1">
              <span className="text-muted-foreground">
                Bytes: {lastRawSample.byteLength} · Hora:{' '}
                {new Date(lastRawSample.receivedAt).toLocaleTimeString('es-CL', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  fractionalSecondDigits: 3,
                })}
              </span>
              <label className="text-muted-foreground">Hexadecimal</label>
              <pre className="max-h-24 overflow-auto rounded bg-background border border-border p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all">
                {lastRawSample.hex}
              </pre>
              <label className="text-muted-foreground">Texto (UTF-8)</label>
              <pre className="max-h-24 overflow-auto rounded bg-background border border-border p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all">
                {lastRawSample.text === '' ? '(vacío)' : lastRawSample.text}
              </pre>
              <p className="text-muted-foreground italic">
                Como JSON (caracteres especiales visibles): {JSON.stringify(lastRawSample.text)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">
            Esperando la primera trama… Si la balanza solo responde a comandos, habría que ampliar el
            software para enviar el comando que pide su manual.
          </p>
        )}
      </div>
    </details>
  );
};
