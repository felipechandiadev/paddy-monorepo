'use client';

import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useSerialPort } from '@/hooks/useSerialPort';
import { SerialPortConfigDialog } from '@/components/weighing/SerialPortConfigDialog';

type SerialPortContextValue = ReturnType<typeof useSerialPort>;

const TmsSerialPortContext = createContext<SerialPortContextValue | null>(null);

export function useTmsSerialPort(): SerialPortContextValue {
  const ctx = useContext(TmsSerialPortContext);
  if (!ctx) {
    throw new Error('useTmsSerialPort must be used within TmsAppLayout');
  }
  return ctx;
}

/** Pesaje en otra app/puerto (sobrescribir con NEXT_PUBLIC_WEIGHING_APP_URL). */
const WEIGHING_APP_URL =
  process.env.NEXT_PUBLIC_WEIGHING_APP_URL || 'http://localhost:3002/weighing';

interface TmsAppLayoutProps {
  children: React.ReactNode;
  /** Si true, intenta auto-conectar la balanza (p. ej. en pesaje). */
  serialEnabled?: boolean;
}

export const TmsAppLayout: React.FC<TmsAppLayoutProps> = ({
  children,
  serialEnabled = false,
}) => {
  const serial = useSerialPort(serialEnabled);
  const { data: session } = useSession();
  const {
    isConnected: serialConnected,
    isAvailable: serialAvailable,
    isConnecting: serialConnecting,
    error: serialError,
    connectChoosingPort,
    disconnect: disconnectSerial,
  } = serial;

  const [serialDialogOpen, setSerialDialogOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <TmsSerialPortContext.Provider value={serial}>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Link href="/weighing" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
              <img src="/logo.svg" alt="Paddy AyG" className="h-8 w-auto" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary">Paddy AyG</span>
                <span className="text-xs text-muted-foreground -mt-1">Recepción y despacho de carga</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{session?.user?.email}</span>

              <button
                type="button"
                className={`p-2 rounded-full transition-all duration-200 ${
                  serialConnected
                    ? 'bg-success/20 hover:bg-success/30'
                    : 'bg-destructive/20 hover:bg-destructive/30'
                }`}
                title={
                  serialConnected
                    ? 'Balanza conectada - Clic para configurar'
                    : 'Sin conexión - Clic para configurar'
                }
                onClick={() => setSerialDialogOpen(true)}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${
                    serialConnected ? 'text-success' : 'text-red-300'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <rect x="2" y="6" width="20" height="12" rx="1" />
                  <path d="M6 18v2m3 0v-2m3 0v2m3 0v-2m3 0v2" />
                  <line x1="6" y1="10" x2="6" y2="14" />
                  <line x1="9" y1="10" x2="9" y2="14" />
                  <line x1="12" y1="10" x2="12" y2="14" />
                  <line x1="15" y1="10" x2="15" y2="14" />
                  <line x1="18" y1="10" x2="18" y2="14" />
                </svg>
              </button>

              <a
                href={WEIGHING_APP_URL}
                className="group p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200 inline-flex items-center justify-center"
                title="Ir a recepción y pesaje"
                aria-label="Ir a recepción y pesaje"
              >
                <span className="material-symbols-outlined text-[22px] leading-none text-foreground group-hover:text-primary transition-colors">
                  local_shipping
                </span>
              </a>

              <Link
                href="/despachos"
                className="group p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200 inline-flex items-center justify-center"
                title="Despacho"
                aria-label="Ir a despacho"
              >
                <span className="material-symbols-outlined text-[22px] leading-none text-foreground group-hover:text-primary transition-colors">
                  outbox
                </span>
              </Link>

              <button
                type="button"
                className="p-2 rounded-lg hover:bg-muted/60 transition-colors duration-200"
                title="Cerrar sesión"
                onClick={handleLogout}
              >
                <svg
                  className="w-5 h-5 text-foreground hover:text-primary transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <SerialPortConfigDialog
          open={serialDialogOpen}
          onClose={() => setSerialDialogOpen(false)}
          isConnected={serialConnected}
          isAvailable={serialAvailable}
          isConnecting={serialConnecting}
          dialogError={serialError}
          onChoosePort={connectChoosingPort}
          onDisconnect={disconnectSerial}
        />

        {children}
      </div>
    </TmsSerialPortContext.Provider>
  );
};
