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
