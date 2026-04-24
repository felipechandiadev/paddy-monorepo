'use client';

import React, { useMemo, useState, useCallback } from 'react';
import DataGrid from '@/shared/components/ui/DataGrid';
import type { DataGridColumn } from '@/shared/components/ui/DataGrid';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import type { TruckDispatch, TruckDispatchGridRow } from '@/features/logistics-trucks/types';
import { getTruckDispatchByIdAction } from '@/features/logistics-trucks/actions/truck-dispatch.actions';
import DialogToPrint from '@/shared/components/ui/Dialog/DialogToPrint';
import { TruckWeighingTicketToPrint } from '@/features/logistics-trucks/components/TruckWeighingTicketToPrint';
import { formatLogisticsProductLabel, type LogisticsProductCode } from '@/lib/logisticsProduct';

function parseGridWeight(v: string | number | null | undefined): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
}

function truckDispatchFromGridRow(row: TruckDispatchGridRow): TruckDispatch {
  const st = row.status?.trim().toUpperCase();
  const status: TruckDispatch['status'] = st === 'FINISHED' ? 'FINISHED' : 'ESPERA';
  const product: LogisticsProductCode | undefined =
    row.product === 'CASCARILLA' || row.product === 'ARROZ_PADDY' ? row.product : undefined;

  return {
    id: row.id,
    status,
    producer_id: row.producer_id ?? 0,
    producer:
      row.producer_name || row.producer_rut
        ? { name: row.producer_name || '—', rut: row.producer_rut || '' }
        : undefined,
    product,
    license_plate: row.license_plate,
    driver_name: row.driver_name?.trim() ? row.driver_name : null,
    carrier_company: row.carrier_company ?? undefined,
    dispatch_guide: row.dispatch_guide ?? undefined,
    gross_weight: parseGridWeight(row.gross_weight),
    tare_weight: parseGridWeight(row.tare_weight),
    net_weight: parseGridWeight(row.net_weight),
    entry_at: new Date(row.entry_at),
    finished_at: row.finished_at ? new Date(row.finished_at) : undefined,
  };
}

const baseColumns: DataGridColumn[] = [
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
  const [printOpen, setPrintOpen] = useState(false);
  const [printTruck, setPrintTruck] = useState<TruckDispatch | null>(null);
  const [printLoadingId, setPrintLoadingId] = useState<number | null>(null);

  const closePrint = useCallback(() => {
    setPrintOpen(false);
    setPrintTruck(null);
  }, []);

  const openDispatchPrint = useCallback(async (row: TruckDispatchGridRow) => {
    setPrintLoadingId(row.id);
    try {
      const full = await getTruckDispatchByIdAction(row.id);
      const truck: TruckDispatch =
        full != null
          ? {
              ...full,
              producer:
                full.producer ??
                (row.producer_name || row.producer_rut
                  ? { name: row.producer_name || '—', rut: row.producer_rut || '' }
                  : undefined),
            }
          : truckDispatchFromGridRow(row);
      setPrintTruck(truck);
      setPrintOpen(true);
    } finally {
      setPrintLoadingId(null);
    }
  }, []);

  const columns = useMemo<DataGridColumn[]>(() => {
    const ActionsCell: React.FC<{ row: TruckDispatchGridRow; column: DataGridColumn }> = ({
      row,
    }) => {
      const printBusy = printLoadingId === row.id;
      return (
        <div className="flex items-center justify-end gap-0.5">
          <IconButton
            icon="print"
            variant="ghost"
            size="sm"
            ariaLabel="Reimprimir documento de despacho"
            isLoading={printBusy}
            disabled={printBusy}
            onClick={() => void openDispatchPrint(row)}
          />
        </div>
      );
    };

    return [
      ...baseColumns,
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 88,
        minWidth: 88,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        actionComponent: ActionsCell,
      },
    ];
  }, [openDispatchPrint, printLoadingId]);

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        totalRows={totalRows}
        title="Despachos de carga"
        limit={limit}
        height="75vh"
        showExportButton={false}
        pinActionsColumn
        actionsColumnField="actions"
      />

      <DialogToPrint
        open={printOpen && printTruck != null}
        onClose={closePrint}
        title={
          printTruck
            ? `Ticket de despacho — Folio Nº ${printTruck.id.toLocaleString('es-CL')}`
            : 'Ticket de despacho'
        }
        printLabel="Imprimir"
        closeLabel="Cerrar"
        size="xl"
        scroll="paper"
      >
        {printTruck ? (
          <TruckWeighingTicketToPrint truck={printTruck} variant="dispatch" />
        ) : null}
      </DialogToPrint>
    </>
  );
}
