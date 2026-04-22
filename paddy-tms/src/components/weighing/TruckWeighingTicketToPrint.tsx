'use client';

import React from 'react';
import type { TruckReception } from '@/actions/truckReceptionActions';
import { formatChileanRut } from '@/lib/formatChileanRut';
import styles from './TruckWeighingTicketToPrint.module.css';

const DEFAULT_PRODUCT_LABEL = 'Arroz paddy';

function toDate(value: Date | string | undefined | null): Date | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** dd-mm-aaaa */
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

/** dd-mm-aaaa hh:mm:ss */
function formatDateTimeLine(d: Date) {
  return `${formatDateDash(d)} ${formatTimeCl(d)}`;
}

/** Enteros; miles con punto (p. ej. 47.080 kg). */
function formatKgTicket(value?: number | string | null) {
  if (value === undefined || value === null || value === '') return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return '—';
  const rounded = Math.round(n);
  return `${rounded.toLocaleString('de-DE')} kg`;
}

export interface TruckWeighingTicketToPrintProps {
  truck: TruckReception;
  /** Texto libre bajo “Observaciones” (opcional). */
  observations?: string;
}

/**
 * Comprobante de pesaje (ticket) con el mismo encabezado de empresa que
 * `ReceptionToPrint` en el frontend principal.
 */
export const TruckWeighingTicketToPrint: React.FC<TruckWeighingTicketToPrintProps> = ({
  truck,
  observations,
}) => {
  const entry = toDate(truck.entry_at);
  const exit = toDate(truck.finished_at);
  const producerRut = truck.producer?.rut
    ? formatChileanRut(String(truck.producer.rut))
    : '—';
  const producerName = truck.producer?.name ?? '—';
  const productorLine = `${producerRut} ${producerName}`.trim();

  const turnoFormatted =
    truck.numero_turno != null
      ? Number(truck.numero_turno).toLocaleString('es-CL')
      : '—';

  const guia = truck.dispatch_guide?.trim() || '—';
  const transportista = truck.carrier_company?.trim() || '—';
  const chofer = truck.driver_name?.trim() || '—';

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
          <p className={styles.ticketNumber}>Nº {turnoFormatted}</p>
          <p className={styles.documentSubtitle}>Recepción de Carga</p>
          {exit && (
            <p className={styles.documentDate} suppressHydrationWarning>
              Fecha: {formatDateDash(exit)}
            </p>
          )}
        </div>
      </header>

      <div className={styles.separator} />

      <section className={styles.ticketGeneral}>
        <div className={styles.twoColRow}>
          <div>
            <span className={styles.label}>Patente:</span>
            <span className={styles.value}>{truck.license_plate}</span>
          </div>
          <div>
            <span className={styles.label}>Nº Guía de Despacho:</span>
            <span className={styles.value}>{guia}</span>
          </div>
        </div>

        <div className={styles.blockRow}>
          <span className={styles.label}>Productor:</span>
          <span className={styles.value}>{productorLine}</span>
        </div>
        <div className={styles.blockRow}>
          <span className={styles.label}>Producto:</span>
          <span className={styles.value}>{DEFAULT_PRODUCT_LABEL}</span>
        </div>
        <div className={styles.blockRow}>
          <span className={styles.label}>Transportista:</span>
          <span className={styles.value}>{transportista}</span>
        </div>
        <div className={styles.blockRow}>
          <span className={styles.label}>Chofer:</span>
          <span className={styles.value}>{chofer}</span>
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
