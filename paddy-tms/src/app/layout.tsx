import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

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
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
