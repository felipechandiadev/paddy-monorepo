/**
 * Formatea un RUT chileno al formato XX.XXX.XXX-X
 * Ej: "12345678-9" → "12.345.678-9"
 * Ej: "123456789" → "12.345.678-9"
 */
export function formatChileanRut(rut: string | null | undefined): string {
  if (!rut || rut.trim() === '') {
    return '-';
  }

  // Remover puntos y guiones existentes
  const cleanRut = rut.replace(/[.-]/g, '');

  // Validar que tenga al menos 8 caracteres (7 dígitos + verificador)
  if (cleanRut.length < 2) {
    return rut;
  }

  // Separar el cuerpo del dígito verificador
  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);

  // Agrupar de derecha a izquierda: XX.XXX.XXX
  // Rellenar con ceros a la izquierda si es necesario
  const paddedBody = body.padStart(8, '0');
  
  const part3 = paddedBody.slice(-3); // Últimos 3 dígitos
  const part2 = paddedBody.slice(-6, -3); // Dígitos 4-6
  const part1 = paddedBody.slice(0, -6); // Primeros 2 dígitos

  return `${part1}.${part2}.${part3}-${verifier}`;
}
