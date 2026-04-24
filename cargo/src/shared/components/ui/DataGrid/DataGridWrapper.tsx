'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { DataGridProps } from './DataGrid';

const DataGrid = dynamic(() => import('./DataGrid'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Cargando tabla…</div>
  ),
});

const DataGridWrapper: React.FC<DataGridProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Cargando tabla…</div>
      }
    >
      <DataGrid {...props} />
    </Suspense>
  );
};

export default DataGridWrapper;
