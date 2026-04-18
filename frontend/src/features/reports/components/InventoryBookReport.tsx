'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useReactToPrint } from 'react-to-print';
import Select, { Option } from '@/shared/components/ui/Select/Select';
import IconButton from '@/shared/components/ui/IconButton/IconButton';
import Alert from '@/shared/components/ui/Alert/Alert';
import { AdvanceSeasonOption } from '@/features/finances/types/finances.types';
import {
  fetchInventoryBookReport,
  fetchInventoryBookSeasonSummary,
} from '../actions/reports.action';
import {
  InventoryBookMovementItem,
  InventoryBookMonthlyReportResponse,
  InventoryBookSeasonSummaryItem,
  InventoryBookSeasonSummaryResponse,
} from '../types/reports.types';
import PrintableReportTable, {
  PrintableReportTableColumn,
} from './common/PrintableReportTable';
import ReportSummaryCard from './common/ReportSummaryCard';
import {
  formatDateValue,
  mapSeasonOptions,
  toOptionalNumber,
} from './common/reportUtils';
import InventoryBalanceBarChart from './common/InventoryBalanceBarChart';
import { formatChileanRut } from '@/shared/utils/chileanRutFormatter';
import styles from './InventoryBookReport.module.css';

interface InventoryBookReportProps {
  seasons: AdvanceSeasonOption[];
  initialSeasonId?: number;
  initialPrintDateLabel: string;
}

interface InventoryBookUIFilters {
  seasonId?: number;
  month?: string;
}

interface InventoryBookDerivedSummary {
  previousBalance: {
    deposito: number;
    propio: number;
    total: number;
  };
  receivedKg: number;
  purchasedKg: number;
  closingBalance: {
    deposito: number;
    propio: number;
    total: number;
  };
}

function formatMonthLabel(monthKey: string): string {
  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return monthKey;
  }

  const parsed = new Date(`${monthKey}-01T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return monthKey;
  }

  return parsed.toLocaleDateString('es-CL', {
    month: 'long',
    year: 'numeric',
  });
}

function toMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function toNumeric(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 0;
  }

  return Number(value);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

const InventoryBookReport: React.FC<InventoryBookReportProps> = ({
  seasons,
  initialSeasonId,
  initialPrintDateLabel,
}) => {
  const reportPrintRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<InventoryBookUIFilters>({
    seasonId: initialSeasonId ?? seasons[0]?.id,
    month: undefined,
  });
  const [report, setReport] = useState<InventoryBookMonthlyReportResponse | null>(null);
  const [seasonSummary, setSeasonSummary] = useState<InventoryBookSeasonSummaryResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [],
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  );

  const seasonOptions = useMemo(() => mapSeasonOptions(seasons), [seasons]);

  const monthOptions = useMemo<Option[]>(() => {
    const mapped = (seasonSummary?.monthly ?? []).map((item) => ({
      id: item.month,
      label: formatMonthLabel(item.month),
    }));

    if (mapped.length > 0) {
      return mapped;
    }

    if (filters.month) {
      return [{ id: filters.month, label: formatMonthLabel(filters.month) }];
    }

    return [];
  }, [filters.month, seasonSummary?.monthly]);

  const handlePrint = useReactToPrint({
    contentRef: reportPrintRef,
    documentTitle: `Libro-Existencias-${report?.season?.name ?? 'temporada'}-${report?.month ?? ''}`,
  });

  const handleSessionExpired = useCallback(async () => {
    setReport(null);
    setSeasonSummary(null);
    setError('Tu sesión expiró. Serás redirigido al inicio de sesión.');
    await signOut({ callbackUrl: '/' });
  }, []);

  const runReport = useCallback(async () => {
    const seasonId = filters.seasonId;

    if (!seasonId) {
      setError('Debes seleccionar una temporada para generar el reporte.');
      return;
    }

    setLoading(true);
    setError(null);

    const summaryResult = await fetchInventoryBookSeasonSummary({ seasonId });

    if (summaryResult.error === 'SESSION_EXPIRED') {
      setLoading(false);
      await handleSessionExpired();
      return;
    }

    if (!summaryResult.success || !summaryResult.data) {
      setSeasonSummary(null);
      setReport(null);
      setError(
        summaryResult.error ||
          'No fue posible obtener el resumen de temporada del Libro de Existencias.',
      );
      setLoading(false);
      return;
    }

    const availableMonths = summaryResult.data.monthly.map((item) => item.month);
    const fallbackMonth =
      availableMonths[availableMonths.length - 1] ?? toMonthKey(new Date());
    const selectedMonth =
      filters.month && availableMonths.includes(filters.month)
        ? filters.month
        : fallbackMonth;

    if (!selectedMonth) {
      setSeasonSummary(summaryResult.data);
      setReport(null);
      setError('No hay meses disponibles para la temporada seleccionada.');
      setLoading(false);
      return;
    }

    if (selectedMonth !== filters.month) {
      setFilters((prev) => ({
        ...prev,
        month: selectedMonth,
      }));
    }

    const monthlyResult = await fetchInventoryBookReport({
      seasonId,
      month: selectedMonth,
    });

    if (monthlyResult.error === 'SESSION_EXPIRED') {
      setLoading(false);
      await handleSessionExpired();
      return;
    }

    if (!monthlyResult.success || !monthlyResult.data) {
      setSeasonSummary(summaryResult.data);
      setReport(null);
      setError(
        monthlyResult.error || 'No fue posible obtener el detalle mensual del Libro de Existencias.',
      );
      setLoading(false);
      return;
    }

    setSeasonSummary(summaryResult.data);
    setReport(monthlyResult.data);
    setLoading(false);
  }, [filters.month, filters.seasonId, handleSessionExpired]);

  useEffect(() => {
    if (!filters.seasonId) {
      return;
    }

    void runReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.seasonId, filters.month]);

  const movementColumns = useMemo<PrintableReportTableColumn<InventoryBookMovementItem>[]>(
    () => [
      {
        key: 'movementType',
        label: 'Movimiento',
        render: (row) => {
          const text = row.movementType === 'RECEPTION' ? 'Recepción' : 'Compra';
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium print:rounded-none print:px-0 print:py-0 print:bg-transparent print:text-[8px] print:font-normal ${
                row.movementType === 'RECEPTION'
                  ? 'bg-green-100 text-green-800 print:text-neutral-900'
                  : 'bg-blue-100 text-blue-800 print:text-neutral-900'
              }`}
            >
              {text}
            </span>
          );
        },
      },
      {
        key: 'date',
        label: 'Fecha',
        render: (row) => formatDateValue(row.date),
      },
      {
        key: 'receptionId',
        label: 'Guía Recepción',
        render: (row) => row.receptionId ?? '-',
      },
      {
        key: 'rut',
        label: 'RUT',
        render: (row) => formatChileanRut(row.rut),
      },
      {
        key: 'producerName',
        label: 'Agricultor',
        render: (row) => row.producerName ?? '-',
      },
      {
        key: 'dispatchGuide',
        label: 'Guía Despacho',
        render: (row) => row.dispatchGuide ?? '-',
      },
      {
        key: 'receivedKg',
        label: 'Kilos (Recepción)',
        align: 'right',
        render: (row) =>
          row.movementType === 'RECEPTION' && row.receivedKg !== null
            ? numberFormatter.format(row.receivedKg)
            : '-',
      },
      {
        key: 'purchaseInvoice',
        label: 'Factura Compra',
        render: (row) => row.purchaseInvoice ?? '-',
      },
      {
        key: 'purchasedKg',
        label: 'Kilos (Compra)',
        align: 'right',
        render: (row) =>
          row.movementType === 'PURCHASE' && row.purchasedKg !== null
            ? numberFormatter.format(row.purchasedKg)
            : '-',
      },
      {
        key: 'pricePerKg',
        label: 'PRECIO',
        align: 'right',
        render: (row) => {
          if (row.movementType === 'PURCHASE' && row.purchasedKg && row.totalAmount) {
            const pricePerKg = row.totalAmount / row.purchasedKg;
            return currencyFormatter.format(pricePerKg);
          }
          return '-';
        },
      },
      {
        key: 'totalAmount',
        label: 'TOTAL',
        align: 'right',
        render: (row) =>
          row.totalAmount !== null
            ? currencyFormatter.format(row.totalAmount)
            : '-',
      },
      {
        key: 'depositoBalanceAfter',
        label: 'Saldo Depósito (kg)',
        align: 'right',
        render: (row) =>
          row.depositoBalanceAfter !== undefined
            ? numberFormatter.format(row.depositoBalanceAfter)
            : '-',
      },
      {
        key: 'propioBalanceAfter',
        label: 'Saldo Propio (kg)',
        align: 'right',
        render: (row) =>
          row.propioBalanceAfter !== undefined
            ? numberFormatter.format(row.propioBalanceAfter)
            : '-',
      },
    ],
    [currencyFormatter, numberFormatter],
  );

  const monthlySummaryColumns = useMemo<
    PrintableReportTableColumn<InventoryBookSeasonSummaryItem>[]
  >(
    () => [
      {
        key: 'month',
        label: 'Mes',
        render: (row) => formatMonthLabel(row.month),
      },
      {
        key: 'previousDeposito',
        label: 'Saldo Ant. Depósito',
        align: 'right',
        render: (row) => numberFormatter.format(row.previousBalance.deposito),
      },
      {
        key: 'previousPropio',
        label: 'Saldo Ant. Propio',
        align: 'right',
        render: (row) => numberFormatter.format(row.previousBalance.propio),
      },
      {
        key: 'receivedKg',
        label: 'Recibido (kg)',
        align: 'right',
        render: (row) => numberFormatter.format(row.receivedKg),
      },
      {
        key: 'purchasedKg',
        label: 'Comprado (kg)',
        align: 'right',
        render: (row) => numberFormatter.format(row.purchasedKg),
      },
      {
        key: 'closingDeposito',
        label: 'Cierre Depósito',
        align: 'right',
        render: (row) => numberFormatter.format(row.closingBalance.deposito),
      },
      {
        key: 'closingPropio',
        label: 'Cierre Propio',
        align: 'right',
        render: (row) => numberFormatter.format(row.closingBalance.propio),
      },
      {
        key: 'closingTotal',
        label: 'Cierre Total',
        align: 'right',
        render: (row) => numberFormatter.format(row.closingBalance.total),
      },
    ],
    [numberFormatter],
  );

  const filteredMovements = useMemo(() => {
    if (!report) {
      return [] as InventoryBookMovementItem[];
    }

    return report.movements;
  }, [report]);

  const reportSummary = useMemo<InventoryBookDerivedSummary | null>(() => {
    if (!report) {
      return null;
    }

    const previousBalance = {
      deposito: toNumeric(report.summary.previousBalance.deposito),
      propio: toNumeric(report.summary.previousBalance.propio),
      total: toNumeric(report.summary.previousBalance.total),
    };

    let receivedKg = 0;
    let purchasedKg = 0;
    let closingDeposito = previousBalance.deposito;
    let closingPropio = previousBalance.propio;
    let closingTotal = previousBalance.total;

    for (const movement of filteredMovements) {
      const received = toNumeric(movement.receivedKg);
      const purchased = toNumeric(movement.purchasedKg);
      const depositoDelta = toNumeric(movement.depositoDelta);
      const propioDelta = toNumeric(movement.propioDelta);

      receivedKg += received;
      purchasedKg += purchased;
      closingDeposito += depositoDelta;
      closingPropio += propioDelta;
      closingTotal += depositoDelta + propioDelta;
    }

    return {
      previousBalance: {
        deposito: round2(previousBalance.deposito),
        propio: round2(previousBalance.propio),
        total: round2(previousBalance.total),
      },
      receivedKg: round2(receivedKg),
      purchasedKg: round2(purchasedKg),
      closingBalance: {
        deposito: round2(closingDeposito),
        propio: round2(closingPropio),
        total: round2(closingTotal),
      },
    };
  }, [filteredMovements, report]);

  return (
    <div className="flex flex-col gap-6 p-6 print:p-0 print:gap-4">
      <div className="flex flex-col gap-1 print:hidden">
        <h1 className="text-2xl font-semibold text-foreground">Libro de Existencias</h1>
        <p className="text-sm text-neutral-500">
          Control de stock por mes separando saldo en Depósito y arroz Propio comprado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 items-end md:grid-cols-2 xl:grid-cols-2 print:hidden">
        <Select
          label="Temporada"
          options={seasonOptions}
          value={filters.seasonId ?? null}
          onChange={(value) => {
            setFilters({
              seasonId: toOptionalNumber(value),
              month: undefined,
            });
            setSeasonSummary(null);
            setReport(null);
          }}
        />

        <Select
          label="Mes"
          options={monthOptions}
          value={filters.month ?? null}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              month: value ? String(value) : undefined,
            }))
          }
          disabled={monthOptions.length === 0}
        />
      </div>

      <div className="flex justify-end gap-2 print:hidden">
        <IconButton
          icon="print"
          variant="basicSecondary"
          disabled={!report || loading}
          onClick={() => handlePrint()}
          ariaLabel="Imprimir"
        />
        <IconButton
          icon="bar_chart"
          variant="ghost"
          isLoading={loading}
          disabled={!filters.seasonId}
          onClick={() => void runReport()}
          ariaLabel="Generar Reporte"
        />
      </div>

      {error && !loading && <Alert variant="error">Error al generar el reporte: {error}</Alert>}

      {loading && (
        <div className="flex items-center justify-center py-16 text-neutral-500">
          <span className="text-sm">Calculando libro de existencias…</span>
        </div>
      )}

      {!loading && !error && report && filteredMovements.length === 0 && (
        <Alert variant="info">
          No hay movimientos para el mes seleccionado.
        </Alert>
      )}

      {!loading && report && seasonSummary && (
        <div ref={reportPrintRef} className={`flex flex-col gap-6 print:gap-1 print:${styles.sheet}`}>
          {/* Professional Print Header - Print Only */}
          <div className={`hidden print:block ${styles.sheet}`}>
            <header className={styles.companyHeader}>
              <div>
                <p className={styles.companyKicker}>Sociedad Comercial e Industrial</p>
                <h1 className={styles.companyName}>Aparicio y Garcia Ltda</h1>
                <p className={styles.companyAddress}>Panamericana Sur km 342</p>
                <p className={styles.companyAddress}>Parral, Chile</p>
              </div>
              <div className={styles.documentMeta}>
                <h2 className={styles.documentTitle}>LIBRO DE EXISTENCIAS</h2>
                <p className={styles.documentDate} suppressHydrationWarning>
                  Impreso: {initialPrintDateLabel}
                </p>
                <p className={styles.documentSubtitle}>
                  Temporada: {report.season.name}
                </p>
              </div>
            </header>

            <div className={styles.separator} />
          </div>

          {/* Web Content and Print Content - Show in both modes */}
          <div className={`print:${styles.sheet}`}>
            <div className={styles.reportInfoGrid}>
              <div className={styles.infoBlock}>
                <div className={styles.infoLabel}>Período</div>
                <div className={styles.infoValue}>{formatMonthLabel(report.month)}</div>
              </div>
              <div className={styles.infoBlock}>
                <div className={styles.infoLabel}>Movimientos</div>
                <div className={styles.infoValue}>{filteredMovements.length}</div>
              </div>
            </div>

            {reportSummary && (
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardTitle}>Saldo Anterior Depósito</div>
                  <div className={styles.summaryCardValue}>
                    {numberFormatter.format(reportSummary.previousBalance.deposito)}
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardTitle}>Saldo Anterior Propio</div>
                  <div className={styles.summaryCardValue}>
                    {numberFormatter.format(reportSummary.previousBalance.propio)}
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardTitle}>Kilos Recibidos</div>
                  <div className={styles.summaryCardValue}>
                    {numberFormatter.format(reportSummary.receivedKg)}
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardTitle}>Kilos Comprados</div>
                  <div className={styles.summaryCardValue}>
                    {numberFormatter.format(reportSummary.purchasedKg)}
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardTitle}>Saldo Cierre Depósito</div>
                  <div className={styles.summaryCardValue}>
                    {numberFormatter.format(reportSummary.closingBalance.deposito)}
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardTitle}>Saldo Cierre Propio</div>
                  <div className={styles.summaryCardValue}>
                    {numberFormatter.format(reportSummary.closingBalance.propio)}
                  </div>
                </div>
              </div>
            )}

            {reportSummary && (
              <div className={styles.chartContainer}>
                <InventoryBalanceBarChart
                  deposito={reportSummary.closingBalance.deposito}
                  propio={reportSummary.closingBalance.propio}
                  numberFormatter={numberFormatter}
                />
              </div>
            )}

            <div className={styles.tableSection}>
              <PrintableReportTable<InventoryBookMovementItem>
                title="Movimientos del Mes"
                subtitle="Recepciones y compras consolidadas por liquidación del mes seleccionado."
                columns={movementColumns}
                rows={filteredMovements}
                emptyMessage="Sin movimientos para el mes seleccionado."
              />
            </div>

            <div className={`${styles.tableSection} print:mt-2`}>
              <PrintableReportTable<InventoryBookSeasonSummaryItem>
                title="Resumen Mensual de Temporada"
                subtitle="Evolución mensual de saldos de Depósito y Propio durante la temporada."
                columns={monthlySummaryColumns}
                rows={seasonSummary.monthly}
                emptyMessage="Sin resumen mensual disponible para la temporada."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 print:grid-cols-3 print:gap-2 print:mt-2">
            <ReportSummaryCard
              title="Total Recibido Temporada"
              value={`${numberFormatter.format(seasonSummary.totals.receivedKg)} kg`}
            />
            <ReportSummaryCard
              title="Total Comprado Temporada"
              value={`${numberFormatter.format(seasonSummary.totals.purchasedKg)} kg`}
            />
            <ReportSummaryCard
              title="Saldo Final Temporada"
              value={`${numberFormatter.format(seasonSummary.totals.closingBalance.total)} kg`}
              hint={`Depósito: ${numberFormatter.format(
                seasonSummary.totals.closingBalance.deposito,
              )} kg · Propio: ${numberFormatter.format(
                seasonSummary.totals.closingBalance.propio,
              )} kg`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryBookReport;
