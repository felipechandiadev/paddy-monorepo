/**
 * Producto logístico (recepción / despacho). Alineado con `LogisticsProduct` en el backend.
 */
export type LogisticsProductCode = 'ARROZ_PADDY' | 'CASCARILLA';

export const LOGISTICS_PRODUCT_OPTIONS: { value: LogisticsProductCode; label: string }[] = [
  { value: 'ARROZ_PADDY', label: 'Arroz paddy' },
  { value: 'CASCARILLA', label: 'Cascarilla' },
];

export function formatLogisticsProductLabel(code: string | undefined | null): string {
  if (code === 'CASCARILLA') {
    return 'Cascarilla';
  }
  return 'Arroz paddy';
}
