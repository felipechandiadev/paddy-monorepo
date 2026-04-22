/**
 * Fecha/hora para grillas: DD-MM-YYYY HH:mm (hora local del navegador).
 */
export function formatGridDateTime(value: unknown): string {
  if (value == null || value === '') return '—';
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

export function formatGridDate(value: unknown): string {
  if (value == null || value === '') return '—';
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Kilos en grilla: entero redondeado, miles separados con punto (ej. 12.345). */
export function formatKilogramsDisplay(value: unknown): string {
  if (value == null || value === '') return '—';
  let n: number;
  if (typeof value === 'number') {
    n = value;
  } else {
    const s = String(value).trim();
    n = Number(s);
    if (Number.isNaN(n)) {
      n = parseFloat(s.replace(/\./g, '').replace(',', '.'));
    }
  }
  if (Number.isNaN(n)) return '—';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
