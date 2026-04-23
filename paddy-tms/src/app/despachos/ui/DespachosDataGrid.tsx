'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DataGrid, { DataGridColumn } from '@/shared/components/ui/DataGrid';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import Dialog from '@/shared/components/ui/Dialog/Dialog';
import { Button } from '@/shared/components/ui/Button/Button';
import type { TruckDispatch, TruckDispatchGridRow } from '@/actions/truckDispatchActions';
import {
  deleteTruckDispatchAction,
  getTruckDispatchByIdAction,
} from '@/actions/truckDispatchActions';
import DialogToPrint from '@/shared/components/ui/Dialog/DialogToPrint';
import { TruckWeighingTicketToPrint } from '@/components/weighing/TruckWeighingTicketToPrint';
import { formatLogisticsProductLabel, type LogisticsProductCode } from '@/lib/logisticsProduct';
import { DispatchManualCreateForm } from './DispatchManualCreateForm';
import { DispatchEditDialog } from './DispatchEditDialog';

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
    numero_turno: null,
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

interface DespachosDataGridProps {
  rows: TruckDispatchGridRow[];
  totalRows: number;
}

export const DespachosDataGrid: React.FC<DespachosDataGridProps> = ({
  rows,
  totalRows,
}) => {
  const router = useRouter();
  const [editRow, setEditRow] = useState<TruckDispatchGridRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<TruckDispatchGridRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [printTruck, setPrintTruck] = useState<TruckDispatch | null>(null);
  const [printLoadingId, setPrintLoadingId] = useState<number | null>(null);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

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
            ariaLabel="Imprimir ticket de despacho"
            isLoading={printBusy}
            disabled={printBusy}
            onClick={() => void openDispatchPrint(row)}
          />
          <IconButton
            icon="edit"
            variant="ghost"
            size="sm"
            ariaLabel="Editar despacho"
            onClick={() => setEditRow(row)}
          />
          <IconButton
            icon="delete"
            variant="ghost"
            size="sm"
            ariaLabel="Eliminar despacho"
            onClick={() => setDeleteRow(row)}
          />
        </div>
      );
    };

    return [
      ...baseColumns,
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 136,
        minWidth: 136,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        actionComponent: ActionsCell,
      },
    ];
  }, [openDispatchPrint, printLoadingId]);

  const confirmDelete = async () => {
    if (!deleteRow) return;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await deleteTruckDispatchAction(deleteRow.id);
      setDeleteRow(null);
      refresh();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'No se pudo eliminar');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <DataGrid
        title="Listado de despachos"
        columns={columns}
        rows={rows}
        totalRows={totalRows}
        limit={25}
        showExportButton={false}
        height="85vh"
        pinActionsColumn
        actionsColumnField="actions"
        createFormTitle="Nuevo despacho manual"
        createForm={<DispatchManualCreateForm onCreated={refresh} />}
      />

      <DispatchEditDialog
        open={editRow != null}
        row={editRow}
        onClose={() => setEditRow(null)}
        onSaved={refresh}
      />

      <DialogToPrint
        open={printOpen && !!printTruck}
        onClose={closePrint}
        title={
          printTruck
            ? `Ticket de despacho — Folio ${printTruck.id.toLocaleString('es-CL')}`
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

      <Dialog
        open={deleteRow != null}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteRow(null);
            setDeleteError(null);
          }
        }}
        title="Eliminar despacho"
        size="sm"
        hideActions
        showCloseButton={!deleteLoading}
      >
        <div className="space-y-4 px-1 pb-1">
          <p className="text-sm text-foreground">
            ¿Eliminar el despacho con folio{' '}
            <span className="font-semibold tabular-nums">{deleteRow?.id}</span>
            {deleteRow?.license_plate ? (
              <>
                {' '}
                (patente <span className="font-mono uppercase">{deleteRow.license_plate}</span>)?
              </>
            ) : (
              '?'
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            El despacho se anulará en el sistema (baja lógica).
          </p>
          {deleteError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                if (!deleteLoading) {
                  setDeleteRow(null);
                  setDeleteError(null);
                }
              }}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => void confirmDelete()}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
