'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export interface MonitorFullscreenButtonProps {
  className?: string;
}

/**
 * Entrar / salir de pantalla completa (API del navegador).
 */
export const MonitorFullscreenButton: React.FC<MonitorFullscreenButtonProps> = ({
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    sync();
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('[MonitorFullscreen]', err);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
    >
      {isFullscreen ? (
        <Minimize2 className="h-5 w-5" strokeWidth={2} />
      ) : (
        <Maximize2 className="h-5 w-5" strokeWidth={2} />
      )}
    </button>
  );
};
