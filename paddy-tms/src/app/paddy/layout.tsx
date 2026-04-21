import React from 'react';
import { LogisticsProvider } from '@/features/logistics/context/LogisticsContext';

export const metadata = {
  title: 'Paddy TMS',
  description: 'Truck Management System',
};

export default function PaddyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LogisticsProvider>
      {children}
    </LogisticsProvider>
  );
}
