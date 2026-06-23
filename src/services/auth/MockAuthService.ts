/**
 * Implementación SIMULADA del servicio de autenticación (maqueta).
 * Valida contra los usuarios demo en memoria y el código OTP de prueba.
 * No hay red: responde con promesas resueltas para imitar el backend.
 */
import { MOCK_USERS } from '@/shared/auth/mockUsers';
import { config } from '@/services/config';
import type { AuthService, Credentials, SignInResult } from './types';

export class MockAuthService implements AuthService {
  private normalize(email: string): string {
    return email.trim().toLowerCase();
  }

  async signIn({ email, password }: Credentials): Promise<SignInResult> {
    const target = this.normalize(email);
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === target);
    if (!user) return { ok: false, reason: 'not_registered' };
    if (user.password !== password) return { ok: false, reason: 'wrong_password' };
    return {
      ok: true,
      user: { email: user.email, role: user.role, nombre: user.nombre },
    };
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const target = this.normalize(email);
    return MOCK_USERS.some(u => u.email.toLowerCase() === target);
  }

  async requestPasswordReset(_email: string): Promise<void> {
    // Maqueta: no envía nada; el código válido es config.demo.otpCode.
  }

  async verifyCode(code: string): Promise<boolean> {
    return code === config.demo.otpCode;
  }

  async resetPassword(_email: string, _newPassword: string): Promise<void> {
    // Maqueta: no persiste; en backend haría PATCH /auth/password.
  }
}
