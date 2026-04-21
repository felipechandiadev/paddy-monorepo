import React from 'react';

export const metadata = {
  title: 'Logistics - Paddy TMS',
};

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
