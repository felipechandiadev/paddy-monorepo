'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { MonitorFullscreenButton } from '@/components/monitor/MonitorFullscreenButton';

function formatClock(d: Date) {
  return d.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export interface MonitorTopBarProps {
  /** Estado del socket del monitor (una sola conexión desde la página). */
  connected: boolean;
}

export const MonitorTopBar: React.FC<MonitorTopBarProps> = ({ connected }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-background border-b border-border shadow-sm shrink-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <img src="/logo.svg" alt="Paddy AyG" className="h-10 w-auto shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-3xl font-bold text-primary leading-tight">Paddy AyG</span>
              <span className="text-sm text-muted-foreground -mt-0.5">
                Monitor De Espera
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="text-right tabular-nums">
              <div className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-none">
                {formatClock(now)}
              </div>
            </div>
            <span
              className="flex items-center justify-center"
              role="status"
              aria-label={
                connected ? 'Conectado al servidor' : 'Sin conexión en vivo, reconectando'
              }
            >
              {connected ? (
                <Wifi
                  className="h-7 w-7 md:h-8 md:w-8 text-success"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : (
                <WifiOff
                  className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground animate-pulse"
                  strokeWidth={2}
                  aria-hidden
                />
              )}
            </span>
            <MonitorFullscreenButton />
          </div>
        </div>
      </div>
    </header>
  );
};
