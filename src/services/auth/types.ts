/**
 * Contratos del servicio de autenticación.
 * Las pantallas dependen de la INTERFAZ `AuthService`, no de una
 * implementación concreta — así el mock de hoy y el backend de mañana
 * son intercambiables sin tocar la UI.
 */
import { Role } from '@/shared/auth/roles';

export interface AuthUser {
  email: string;
  role: Role;
  nombre: string;
}

export interface Credentials {
  email: string;
  password: string;
}

/** Resultado de iniciar sesión. */
export type SignInResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'not_registered' | 'wrong_password' };

/**
 * Servicio de autenticación. Toda la lógica de cuentas pasa por aquí.
 * Implementaciones: MockAuthService (maqueta) · HttpAuthService (backend).
 */
export interface AuthService {
  /** Inicia sesión con correo + contraseña. */
  signIn(credentials: Credentials): Promise<SignInResult>;
  /** ¿El correo ya tiene una cuenta? (registro / recuperación). */
  isEmailRegistered(email: string): Promise<boolean>;
  /** Solicita el envío de un código de recuperación al correo. */
  requestPasswordReset(email: string): Promise<void>;
  /** Verifica un código (recuperación o teléfono). */
  verifyCode(code: string): Promise<boolean>;
  /** Establece la nueva contraseña tras verificar el código. */
  resetPassword(email: string, newPassword: string): Promise<void>;
}
