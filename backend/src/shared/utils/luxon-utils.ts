import { DateTime, Duration } from 'luxon';

/**
 * Luxon-based date utilities for consistent, timezone-safe date handling.
 * All functions assume UTC and return/accept YYYY-MM-DD format for API compatibility.
 */

/**
 * Parses a YYYY-MM-DD string to a DateTime object in UTC
 * @param value Date string in YYYY-MM-DD format or null
 * @returns DateTime in UTC or null if invalid
 */
export function parseDateString(value?: string | null): DateTime | null {
  if (!value) return null;

  const trimmed = String(value).trim();
  
  // Try ISO format first (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  const dt = DateTime.fromISO(trimmed, { zone: 'utc' });
  if (dt.isValid) {
    return dt;
  }

  return null;
}

/**
 * Formats a DateTime or Date object to YYYY-MM-DD string in UTC
 * Safe for API responses and database operations
 * @param value DateTime, Date object, or date string
 * @returns Formatted YYYY-MM-DD string or null
 */
export function formatDateString(value?: DateTime | Date | string | null): string | null {
  if (!value) return null;

  let dt: DateTime;

  if (value instanceof DateTime) {
    dt = value;
  } else if (value instanceof Date) {
    dt = DateTime.fromJSDate(value, { zone: 'utc' });
  } else {
    dt = parseDateString(String(value));
  }

  if (!dt || !dt.isValid) return null;

  return dt.toFormat('yyyy-MM-dd');
}

/**
 * Flexible date parser for various input formats
 * Handles Date objects, ISO strings, and YYYY-MM-DD strings
 * For date-only strings (YYYY-MM-DD), returns UTC start of day
 * @param value Input value in various formats
 * @returns DateTime in UTC or null
 */
export function parseDateInput(value?: string | Date | null): DateTime | null {
  if (!value) return null;

  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: 'utc' });
  }

  const strValue = String(value).trim();
  
  // Check if it's a date-only string (YYYY-MM-DD format)
  const dateOnlyMatch = strValue.match(/^\d{4}-\d{2}-\d{2}$/);
  if (dateOnlyMatch) {
    // For date-only strings, parse as UTC at start of day (midnight UTC)
    // This ensures the date is preserved exactly as provided
    const dt = DateTime.fromISO(strValue + 'T00:00:00Z', { zone: 'utc' });
    return dt.isValid ? dt : null;
  }

  return parseDateString(strValue);
}

/**
 * Calculates the number of days between two dates
 * @param start Start date
 * @param end End date (exclusive = end of day)
 * @returns Number of complete days (positive or negative)
 */
export function daysBetween(start: DateTime | null, end: DateTime | null): number {
  if (!start || !end || !start.isValid || !end.isValid) return 0;

  const diff = end.diff(start, 'days');
  return Math.floor(diff.days);
}

/**
 * Gets ISO 8601 week number and year
 * Week 1 is the week with the first Thursday of the year
 * @param dt DateTime object
 * @returns Object with week number (1-53) and week year
 */
export function getISOWeek(dt: DateTime | null): { week: number; year: number } | null {
  if (!dt || !dt.isValid) return null;

  return {
    week: dt.weekNumber,
    year: dt.weekYear,
  };
}

/**
 * Converts a date to a month key string (YYYY-MM) for grouping
 * @param dt DateTime object
 * @returns String in format YYYY-MM or null
 */
export function toMonthKey(dt: DateTime | null): string | null {
  if (!dt || !dt.isValid) return null;
  return dt.toFormat('yyyy-MM');
}

/**
 * Converts a date to a day key string (YYYY-MM-DD) for grouping
 * @param dt DateTime object
 * @returns String in format YYYY-MM-DD or null
 */
export function toDayKey(dt: DateTime | null): string | null {
  if (!dt || !dt.isValid) return null;
  return formatDateString(dt);
}

/**
 * Converts a date to a week key string (YYYY-Www) ISO format
 * @param dt DateTime object
 * @returns String in format YYYY-Www or null
 */
export function toWeekKey(dt: DateTime | null): string | null {
  if (!dt || !dt.isValid) return null;

  const week = getISOWeek(dt);
  if (!week) return null;

  return `${week.year}-W${String(week.week).padStart(2, '0')}`;
}

/**
 * Parses a month key (YYYY-MM) to DateTime at start of month
 * @param keystring Month key in YYYY-MM format
 * @returns DateTime at start of month or null
 */
export function fromMonthKey(keystring: string): DateTime | null {
  if (!keystring || keystring.length !== 7) return null;

  const dt = DateTime.fromISO(`${keystring}-01`, { zone: 'utc' });
  return dt.isValid ? dt : null;
}

/**
 * Validates if a value is a valid date
 * @param value Value to validate
 * @returns true if valid date, false otherwise
 */
export function isValidDate(value?: any): boolean {
  if (!value) return false;

  let dt: DateTime | null = null;

  if (value instanceof DateTime) {
    dt = value;
  } else if (value instanceof Date) {
    dt = DateTime.fromJSDate(value, { zone: 'utc' });
  } else if (typeof value === 'string') {
    dt = parseDateString(value);
  }

  return dt !== null && dt.isValid;
}

/**
 * Gets current date in UTC as DateTime
 * @returns DateTime for now in UTC
 */
export function now(): DateTime {
  return DateTime.now().toUTC();
}

/**
 * Gets current date in UTC as a Date object (for TypeORM compatibility)
 * @returns JavaScript Date object in UTC
 */
export function nowAsDate(): Date {
  return new Date();
}

/**
 * Builds an array of month keys for a date range
 * Includes start month and end month
 * @param start Start date
 * @param end End date (exclusive = start of this month not included)
 * @returns Array of month keys (YYYY-MM)
 */
export function buildMonthKeysInRange(start: DateTime, end: DateTime): string[] {
  const keys: string[] = [];
  let current = start.startOf('month');
  const endMonth = end.startOf('month');

  while (current <= endMonth) {
    const key = toMonthKey(current);
    if (key) keys.push(key);
    current = current.plus({ months: 1 });
  }

  return keys;
}

/**
 * Builds an array of week keys for a date range (ISO 8601)
 * @param start Start date
 * @param end End date (exclusive)
 * @returns Array of week keys (YYYY-Www)
 */
export function buildWeekKeysInRange(start: DateTime, end: DateTime): string[] {
  const keys: string[] = [];
  let current = start.startOf('week');
  const endWeek = end.startOf('week');

  while (current <= endWeek) {
    const key = toWeekKey(current);
    if (key) keys.push(key);
    current = current.plus({ weeks: 1 });
  }

  return keys;
}

/**
 * Builds an array of day keys for a date range
 * @param start Start date
 * @param end End date (exclusive)
 * @returns Array of day keys (YYYY-MM-DD)
 */
export function buildDayKeysInRange(start: DateTime, end: DateTime): string[] {
  const keys: string[] = [];
  let current = start.startOf('day');
  const endDay = end.startOf('day');

  while (current < endDay) {
    const key = toDayKey(current);
    if (key) keys.push(key);
    current = current.plus({ days: 1 });
  }

  return keys;
}

/**
 * Converts DateTime to JavaScript Date (for database operations)
 * @param dt DateTime object
 * @returns JavaScript Date or null
 */
export function toJSDate(dt: DateTime | null): Date | null {
  if (!dt || !dt.isValid) return null;
  return dt.toJSDate();
}

/**
 * Creates a DateTime from year, month, day (UTC midnight)
 * Useful for date-only columns in database
 * @param year Full year
 * @param month Month (1-12)
 * @param day Day of month
 * @returns DateTime at UTC midnight or null
 */
export function dateOnlyUTC(year: number, month: number, day: number): DateTime {
  return DateTime.utc(year, month, day, 0, 0, 0, 0);
}

/**
 * Adds days to a date
 * @param dt Start date
 * @param days Number of days to add (can be negative)
 * @returns New DateTime or null
 */
export function addDays(dt: DateTime | null, days: number): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.plus({ days });
}

/**
 * Adds months to a date
 * @param dt Start date
 * @param months Number of months to add (can be negative)
 * @returns New DateTime or null
 */
export function addMonths(dt: DateTime | null, months: number): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.plus({ months });
}

/**
 * Gets the start of day (midnight UTC)
 * @param dt DateTime object
 * @returns DateTime at start of day or null
 */
export function startOfDay(dt: DateTime | null): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.startOf('day');
}

/**
 * Gets the end of day (23:59:59.999 UTC)
 * @param dt DateTime object
 * @returns DateTime at end of day or null
 */
export function endOfDay(dt: DateTime | null): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.endOf('day');
}

/**
 * Gets the start of month (1st day at midnight UTC)
 * @param dt DateTime object
 * @returns DateTime at start of month or null
 */
export function startOfMonth(dt: DateTime | null): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.startOf('month');
}

/**
 * Gets the end of month (last day at 23:59:59.999 UTC)
 * @param dt DateTime object
 * @returns DateTime at end of month or null
 */
export function endOfMonth(dt: DateTime | null): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.endOf('month');
}

/**
 * Gets the start of year
 * @param dt DateTime object
 * @returns DateTime at start of year or null
 */
export function startOfYear(dt: DateTime | null): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.startOf('year');
}

/**
 * Gets the end of year
 * @param dt DateTime object
 * @returns DateTime at end of year or null
 */
export function endOfYear(dt: DateTime | null): DateTime | null {
  if (!dt || !dt.isValid) return null;
  return dt.endOf('year');
}

/**
 * Compares two dates
 * @param dt1 First date
 * @param dt2 Second date
 * @returns -1 if dt1 < dt2, 0 if equal, 1 if dt1 > dt2
 */
export function compareDateTime(
  dt1: DateTime | null,
  dt2: DateTime | null,
): -1 | 0 | 1 {
  if (!dt1 || !dt2 || !dt1.isValid || !dt2.isValid) return 0;

  const diff = dt1.diff(dt2);
  if (diff.milliseconds < 0) return -1;
  if (diff.milliseconds > 0) return 1;
  return 0;
}
