import { DateTime } from 'luxon';
import { ValueTransformer } from 'typeorm';

/**
 * Transformer para receptionDate que evita conversión de zona horaria
 * - Al guardar: convierte Date a string "YYYY-MM-DD HH:MM:SS" en UTC
 * - Al leer: parsea string como UTC sin cambiar zona horaria
 * 
 * Esto garantiza que 2026-03-30 se guarde como 2026-03-30 12:00:00 exactamente
 */
export const receptionDateTransformer: ValueTransformer = {
  to(value: Date | null | undefined | string): string | null {
    if (!value) return null;

    let dt: DateTime;

    if (typeof value === 'string') {
      // Si es un string, parsearlo como UTC
      if (value.includes('T')) {
        // ISO format: 2026-03-30T12:00:00Z
        dt = DateTime.fromISO(value, { zone: 'utc' });
      } else if (value.includes(':')) {
        // MySQL format: 2026-03-30 12:00:00
        dt = DateTime.fromSQL(value, { zone: 'utc' });
      } else {
        // Solo fecha: 2026-03-30
        dt = DateTime.fromISO(value, { zone: 'utc' });
      }
    } else if (value instanceof Date) {
      // Es un Date object de JavaScript
      dt = DateTime.fromJSDate(value, { zone: 'utc' });
    } else {
      // Por si acaso recibimos un timestamp numérico
      return null;
    }

    // Devolver como string MySQL: "YYYY-MM-DD HH:MM:SS"
    return dt.toFormat('yyyy-MM-dd HH:mm:ss');
  },

  from(value: any): Date | null {
    // Manejar valores nulos/undefined
    if (value === null || value === undefined) return null;

    // Si ya es un Date, devolverlo como está
    if (value instanceof Date) {
      return value;
    }

    // Si no es un string, intentar convertirlo
    if (typeof value !== 'string') {
      return null;
    }

    // Ahora sabemos que es un string, parsear como UTC
    let dt: DateTime;

    try {
      if (value.includes('T')) {
        // ISO format: 2026-03-30T12:00:00Z
        dt = DateTime.fromISO(value, { zone: 'utc' });
      } else if (value.includes(':')) {
        // MySQL format: 2026-03-30 12:00:00
        dt = DateTime.fromSQL(value, { zone: 'utc' });
      } else {
        // Solo fecha: 2026-03-30
        dt = DateTime.fromISO(value, { zone: 'utc' });
      }

      if (!dt.isValid) {
        return null;
      }

      return dt.toJSDate();
    } catch (error) {
      console.warn('[receptionDateTransformer] Failed to parse date:', value, error);
      return null;
    }
  }
};
