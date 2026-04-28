'use client';

import React from 'react';
import type { TruckDispatch, TruckReception } from '@/features/logistics-trucks/types';
import { formatLogisticsProductLabel } from '@/lib/logisticsProduct';
import { formatChileanRut } from '@/shared/utils/chileanRutFormatter';
import styles from './TruckWeighingTicketToPrint.module.css';

function toDate(value: Date | string | undefined | null): Date | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateDash(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatTimeCl(d: Date) {
  return d.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDateTimeLine(d: Date) {
  return `${formatDateDash(d)} ${formatTimeCl(d)}`;
}

function formatKgTicket(value?: number | string | null) {
  if (value === undefined || value === null || value === '') return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return '—';
  const rounded = Math.round(n);
  return `${rounded.toLocaleString('de-DE')} kg`;
}

export interface TruckWeighingTicketToPrintProps {
  truck: TruckReception | TruckDispatch;
  /** Folio siempre es `truck.id`; el subtítulo depende de la operación. */
  variant?: 'reception' | 'dispatch';
  observations?: string;
}

export const TruckWeighingTicketToPrint: React.FC<TruckWeighingTicketToPrintProps> = ({
  truck,
  variant = 'reception',
  observations,
}) => {
  const entry = toDate(truck.entry_at);
  const exit = toDate(truck.finished_at);
  /** Encabezado "Fecha:": salida si existe; si no, entrada (mismo criterio que en cargo). */
  const documentDate = exit ?? entry;
  const producerRut = truck.producer?.rut
    ? formatChileanRut(String(truck.producer.rut))
    : '—';
  const producerName = truck.producer?.name ?? '—';
  const productorLine = `${producerRut} ${producerName}`.trim();

  const folioFormatted = Number(truck.id).toLocaleString('es-CL');
  const operationSubtitle =
    variant === 'dispatch' ? 'Despacho de Carga' : 'Recepción de Carga';

  const guia = truck.dispatch_guide?.trim() || '—';

  return (
    <div className={styles.sheet}>
      <header className={styles.companyHeader}>
        <div>
          <p className={styles.companyKicker}>Sociedad Comercial e Industrial</p>
          <h1 className={styles.companyName}>Aparicio y Garcia Ltda</h1>
          <p className={styles.companyAddress}>Panamericana Sur km 342</p>
          <p className={styles.companyAddress}>Parral, Chile</p>
        </div>
        <div className={styles.documentMeta}>
          <h2 className={styles.ticketTitle}>TICKET DE PESAJE</h2>
          <p className={styles.ticketNumber}>Folio Nº {folioFormatted}</p>
          <p className={styles.documentSubtitle}>{operationSubtitle}</p>
          {documentDate && (
            <p className={styles.documentDate} suppressHydrationWarning>
              Fecha: {formatDateDash(documentDate)}
            </p>
          )}
        </div>
      </header>

      <div className={styles.separator} />

      <section className={styles.ticketGeneral}>
        <div className={styles.plateGuideRow}>
          <div className={styles.plateGuideItem}>
            <span className={styles.plateGuideLabel}>Patente</span>
            <span className={`${styles.plateGuideValue} ${styles.plateGuideValuePlate}`}>
              {truck.license_plate}
            </span>
          </div>
          <div className={styles.plateGuideItem}>
            <span className={styles.plateGuideLabel}>Nº Guía de Despacho</span>
            <span className={styles.plateGuideValue}>{guia}</span>
          </div>
        </div>

        <div className={`${styles.blockRow} ${styles.producerBlockRow}`}>
          <span className={styles.label}>Productor:</span>
          <span className={styles.value}>{productorLine}</span>
        </div>
        <div className={styles.blockRow}>
          <span className={styles.label}>Producto:</span>
          <span className={styles.value}>{formatLogisticsProductLabel(truck.product)}</span>
        </div>

        <div className={styles.datetimeRow}>
          {entry && (
            <div className={styles.blockRow}>
              <span className={styles.label}>Entrada:</span>
              <span className={styles.value}>{formatDateTimeLine(entry)}</span>
            </div>
          )}
          {exit && (
            <div className={styles.blockRow}>
              <span className={styles.label}>Salida:</span>
              <span className={styles.value}>{formatDateTimeLine(exit)}</span>
            </div>
          )}
        </div>
      </section>

      <section className={styles.ticketBox}>
        <table className={styles.weightTable}>
          <tbody>
            <tr>
              <td>Peso Bruto:</td>
              <td>{formatKgTicket(truck.gross_weight)}</td>
            </tr>
            <tr>
              <td>Peso Tara:</td>
              <td>{formatKgTicket(truck.tare_weight)}</td>
            </tr>
            <tr>
              <td>Peso Neto:</td>
              <td>{formatKgTicket(truck.net_weight)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.obsBox}>
        <p className={styles.obsLabel}>Observaciones:</p>
        <p className={styles.obsBody}>{observations?.trim() || '\u00A0'}</p>
      </section>
    </div>
  );
};

export default TruckWeighingTicketToPrint;
