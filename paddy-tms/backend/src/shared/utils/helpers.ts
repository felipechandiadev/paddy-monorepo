/**
 * Valida y formatea RUT chileno (Rol Único Tributario)
 * Formato: XX.XXX.XXX-X (sin puntos ni guión internamente)
 * Ejemplo: 12345678-9 o 12.345.678-9
 */
export function validateAndFormatRut(rut: string): string {
  // Remover puntos y espacios
  let cleanRut = rut.replace(/\./g, '').replace(/\s/g, '');

  // Dividir en número y dígito verificador
  const parts = cleanRut.split('-');
  if (parts.length !== 2) {
    throw new Error('RUT debe estar en formato XX.XXX.XXX-X');
  }

  const [rutNumber, dv] = parts;

  // Validar dígito verificador
  if (!isValidRutDv(rutNumber, dv)) {
    throw new Error('RUT tiene dígito verificador inválido');
  }

  // Retornar sin formato
  return `${rutNumber}-${dv}`;
}

/**
 * Calcula el dígito verificador del RUT
 */
function isValidRutDv(rut: string, dv: string): boolean {
  let sum = 0;
  let multiplier = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    sum += parseInt(rut[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const calculatedDv = remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString();

  return calculatedDv === dv.toUpperCase();
}

/**
 * Formatea cantidad a money format CLP (pesos chilenos)
 * Ejemplo: 1000000 -> "$1.000.000"
 */
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
}

/**
 * Parsea string de money CLP a número
 * Ejemplo: "$1.000.000" -> 1000000
 */
export function parseCLP(amount: string): number {
  return parseInt(amount.replace(/[^0-9-]/g, ''), 10);
}

/**
 * Redondea a 2 decimales (típico para kg y porcentajes)
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
