import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { LogisticsProvider } from '@/features/logistics/context/LogisticsContext';
import { AuthProvider } from '@/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Paddy TMS - Truck Management System',
  description: 'Sistema de Gestión de Logística en Tiempo Real',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-background text-foreground">
        <AuthProvider>
          <LogisticsProvider>
            {children}
          </LogisticsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
