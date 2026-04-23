'use client';

import React from 'react';
import DataGrid, { DataGridColumn } from '@/shared/components/ui/DataGrid';
import type { TruckReceptionGridRow } from '@/actions/truckReceptionActions';
import { formatLogisticsProductLabel } from '@/lib/logisticsProduct';

const columns: DataGridColumn[] = [
  { field: 'id', headerName: 'Folio', type: 'id', width: 72 },
  { field: 'status', headerName: 'Estado', width: 124, renderType: 'badge' },
  {
    field: 'product',
    headerName: 'Producto',
    width: 130,
    valueGetter: ({ row }) => formatLogisticsProductLabel(row.product),
  },
  {
    field: 'license_plate',
    headerName: 'Patente',
    minWidth: 118,
    width: 126,
    nowrap: true,
    mono: true,
  },
  { field: 'driver_name', headerName: 'Chofer', minWidth: 169, flex: 1.3 },
  { field: 'producer_name', headerName: 'Productor', minWidth: 260, flex: 3 },
  {
    field: 'producer_rut',
    headerName: 'RUT productor',
    minWidth: 120,
    width: 128,
    nowrap: true,
    mono: true,
  },
  { field: 'gross_weight', headerName: 'Bruto (kg)', type: 'number', renderType: 'weightKg', width: 112 },
  { field: 'tare_weight', headerName: 'Tara (kg)', type: 'number', renderType: 'weightKg', width: 112 },
  { field: 'net_weight', headerName: 'Neto (kg)', type: 'number', renderType: 'weightKg', width: 112 },
  { field: 'dispatch_guide', headerName: 'Guía', minWidth: 108, flex: 1 },
  { field: 'entry_at', headerName: 'Entrada', type: 'dateTime', minWidth: 156, width: 164 },
  { field: 'finished_at', headerName: 'Finalizado', type: 'dateTime', minWidth: 156, width: 164 },
];

interface ReceptionsDataGridProps {
  rows: TruckReceptionGridRow[];
  totalRows: number;
}

export const ReceptionsDataGrid: React.FC<ReceptionsDataGridProps> = ({ rows, totalRows }) => {
  return (
    <DataGrid
      title="Listado de recepciones de carga"
      columns={columns}
      rows={rows}
      totalRows={totalRows}
      limit={25}
      showExportButton={false}
      height="85vh"
    />
  );
};
