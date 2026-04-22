'use client';

import React from 'react';
import type { MonitorQueueItem, MonitorState } from '../hooks/useMonitorQueueSocket';

function formatEntryTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '—';
  }
}

function QueueCard({
  item,
  variant,
}: {
  item: MonitorQueueItem;
  variant: 'weighing' | 'next' | 'queue';
}) {
  const isWeighing = variant === 'weighing';
  const isNext = variant === 'next';

  const metaClass = isWeighing
    ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
    : isNext
      ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
      : 'text-lg sm:text-xl md:text-2xl lg:text-3xl';

  const plateClass = isWeighing
    ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary'
    : isNext
      ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground'
      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground/90';

  return (
    <div
      className={[
        'rounded-2xl border-2 w-full transition-shadow',
        'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10',
        isWeighing
          ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30'
          : isNext
            ? 'border-amber-500/70 bg-amber-500/5 shadow-md'
            : 'border-border bg-card/80',
      ].join(' ')}
    >
      <div
        className={[
          'grid w-full grid-cols-3 items-center gap-3 sm:gap-6 md:gap-8',
          'min-h-[1.2em]',
        ].join(' ')}
      >
        <span
          className={[
            'justify-self-start text-left tabular-nums font-semibold text-foreground',
            metaClass,
          ].join(' ')}
        >
          <span className="font-medium text-muted-foreground">Turno</span>{' '}
          {item.numero_turno}
        </span>
        <span
          className={[
            'justify-self-center text-center font-bold tracking-wide min-w-0 px-1',
            plateClass,
          ].join(' ')}
        >
          {item.license_plate}
        </span>
        <span
          className={[
            'justify-self-end text-right tabular-nums font-semibold text-foreground',
            metaClass,
          ].join(' ')}
        >
          <span className="font-medium text-muted-foreground">Ingreso</span>{' '}
          {formatEntryTime(item.entry_at)}
        </span>
      </div>
      {isWeighing && (
        <p className="text-center text-base sm:text-lg md:text-xl font-semibold text-primary mt-4 md:mt-5 uppercase tracking-wide">
          En balanza
        </p>
      )}
      {isNext && !isWeighing && (
        <p className="text-center text-sm sm:text-base md:text-lg font-semibold text-amber-700 dark:text-amber-400 mt-3 md:mt-4">
          Siguiente
        </p>
      )}
    </div>
  );
}

export interface MonitorDisplayProps {
  state: MonitorState | null;
  error: string | null;
}

export const MonitorDisplay: React.FC<MonitorDisplayProps> = ({ state, error }) => {

  const weighingId = state?.weighingTruckReceptionId ?? null;
  const waiting = state?.waiting ?? [];

  const weighingItem = weighingId
    ? waiting.find((w) => w.id === weighingId) ?? null
    : null;

  const orderedRest = [...waiting]
    .filter((w) => w.id !== weighingId)
    .sort((a, b) => a.numero_turno - b.numero_turno);

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
        <p className="text-destructive font-medium">Error de conexión en tiempo real</p>
        <p className="text-destructive/80 text-sm mt-2">{error}</p>
        <p className="text-muted-foreground text-xs mt-4">
          Compruebe que el backend esté en ejecución y que CORS permita este origen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!state && (
        <div className="flex flex-col gap-4 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 sm:h-48 md:h-56 rounded-2xl bg-muted animate-pulse w-full"
            />
          ))}
        </div>
      )}

      {state && waiting.length === 0 && (
        <p className="text-center text-muted-foreground py-16 text-lg">
          No hay turnos registrados para hoy.
        </p>
      )}

      {state && waiting.length > 0 && (
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          {weighingItem && (
            <QueueCard item={weighingItem} variant="weighing" />
          )}
          {orderedRest.map((item, idx) => (
            <QueueCard
              key={item.id}
              item={item}
              variant={idx === 0 ? 'next' : 'queue'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
