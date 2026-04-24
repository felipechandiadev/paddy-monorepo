/**
 * Formato visual RUT chileno (misma regla que TextField type="dni"):
 * • 12.222.222-4  (8 dígitos + DV)
 * • 3.444.444-3   (7 dígitos + DV)
 * • …-k cuando el dígito verificador es K
 */
export function formatChileanRut(value: string): string {
  let cleanValue = value.replace(/[^0-9kK]/g, '');
  cleanValue = cleanValue.toLowerCase();

  if (cleanValue.length === 0) return '';
  if (cleanValue.length === 1) return cleanValue;

  if (cleanValue.length === 9 && !cleanValue.includes('k')) {
    const numbers = cleanValue.slice(0, 8);
    const dv = cleanValue.slice(8);
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}-${dv}`;
  }
  if (cleanValue.length === 8 && !cleanValue.includes('k')) {
    const numbers = cleanValue.slice(0, 7);
    const dv = cleanValue.slice(7);
    return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4)}-${dv}`;
  }
  if (cleanValue.length === 9 && cleanValue.endsWith('k')) {
    const numbers = cleanValue.slice(0, 8);
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}-k`;
  }
  if (cleanValue.length === 8 && cleanValue.endsWith('k')) {
    const numbers = cleanValue.slice(0, 7);
    return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4)}-k`;
  }

  return cleanValue;
}
