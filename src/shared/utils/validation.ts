/**
 * Validaciones de formularios reutilizables.
 * Devuelven `undefined` si es válido, o el mensaje de error si no.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN = 8;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Ingresa tu correo.';
  if (!EMAIL_RE.test(v)) return 'Correo inválido. Revisa el formato.';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Ingresa tu contraseña.';
  if (value.length < PASSWORD_MIN)
    return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
  return undefined;
}

/** Requisitos de contraseña fuerte (para registro). */
export interface PasswordChecks {
  length: boolean;
  upper: boolean;
  number: boolean;
  special: boolean;
}

export function passwordChecks(value: string): PasswordChecks {
  return {
    length: value.length >= PASSWORD_MIN,
    upper: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
}

export function isStrongPassword(value: string): boolean {
  const c = passwordChecks(value);
  return c.length && c.upper && c.number && c.special;
}

export function validateStrongPassword(value: string): string | undefined {
  if (!value) return 'Ingresa tu contraseña.';
  if (!isStrongPassword(value)) return 'La contraseña no cumple los requisitos.';
  return undefined;
}

/** Edad mínima para registrarse. Recibe fecha "dd / mm / aaaa". */
export const MIN_AGE = 13;

export function validateBirthDate(value: string): string | undefined {
  if (!value.trim()) return 'Selecciona tu fecha de nacimiento.';
  const m = value.match(/(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})/);
  if (!m) return 'Fecha inválida.';
  const [, dd, mm, yyyy] = m.map(Number);
  // Edad aproximada con año fijo de referencia (maqueta, sin Date.now).
  const REF_YEAR = 2026;
  const age = REF_YEAR - yyyy - (mm > 6 ? 1 : 0);
  if (age < MIN_AGE) return `Debes tener al menos ${MIN_AGE} años para registrarte.`;
  return undefined;
}

export function validateRequired(
  value: string,
  message = 'Este campo es obligatorio.',
): string | undefined {
  return value.trim() ? undefined : message;
}

export function validatePasswordMatch(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) return 'Confirma tu contraseña.';
  if (password !== confirm) return 'Las contraseñas no coinciden.';
  return undefined;
}
