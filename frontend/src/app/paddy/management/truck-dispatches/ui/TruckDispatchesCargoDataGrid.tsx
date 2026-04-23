'use client';

import React from 'react';
import DataGrid from '@/shared/components/ui/DataGrid';
import type { DataGridColumn } from '@/shared/components/ui/DataGrid';
import type { TruckDispatchGridRow } from '@/features/logistics-trucks/types';
import { formatLogisticsProductLabel } from '@/lib/logisticsProduct';

const columns: DataGridColumn[] = [
  { field: 'id', headerName: 'Folio', type: 'id', width: 72, sortable: true },
  {
    field: 'status',
    headerName: 'Estado',
    width: 124,
    renderType: 'badge',
    sortable: true,
  },
  {
    field: 'product',
    headerName: 'Producto',
    width: 130,
    valueGetter: ({ row }) => formatLogisticsProductLabel(row.product),
    sortable: true,
  },
  {
    field: 'license_plate',
    headerName: 'Patente',
    minWidth: 118,
    width: 126,
    nowrap: true,
    mono: true,
    sortable: true,
  },
  {
    field: 'dispatch_guide',
    headerName: 'Guía',
    minWidth: 140,
    width: 148,
    flex: 1.2,
    sortable: true,
  },
  {
    field: 'producer_name',
    headerName: 'Productor',
    minWidth: 320,
    flex: 4,
    sortable: true,
  },
  {
    field: 'producer_rut',
    headerName: 'RUT productor',
    minWidth: 120,
    width: 128,
    nowrap: true,
    mono: true,
    sortable: true,
  },
  {
    field: 'tare_weight',
    headerName: 'Tara (kg)',
    type: 'number',
    renderType: 'weightKg',
    width: 112,
    sortable: true,
  },
  {
    field: 'gross_weight',
    headerName: 'Bruto (kg)',
    type: 'number',
    renderType: 'weightKg',
    width: 112,
    sortable: true,
  },
  {
    field: 'net_weight',
    headerName: 'Neto (kg)',
    type: 'number',
    renderType: 'weightKg',
    width: 112,
    sortable: true,
  },
  {
    field: 'entry_at',
    headerName: 'Entrada',
    type: 'dateTime',
    minWidth: 156,
    width: 164,
    sortable: true,
  },
  {
    field: 'finished_at',
    headerName: 'Finalizado',
    type: 'dateTime',
    minWidth: 156,
    width: 164,
    sortable: true,
  },
];

interface TruckDispatchesCargoDataGridProps {
  rows: TruckDispatchGridRow[];
  totalRows: number;
  limit: number;
}

export function TruckDispatchesCargoDataGrid({
  rows,
  totalRows,
  limit,
}: TruckDispatchesCargoDataGridProps) {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      totalRows={totalRows}
      title="Despachos de carga"
      limit={limit}
      height="75vh"
      showExportButton={false}
    />
  );
}
