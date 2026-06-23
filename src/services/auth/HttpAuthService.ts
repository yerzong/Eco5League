/**
 * Implementación REAL del servicio de autenticación contra el backend.
 * Esqueleto listo para conectar: cada método mapea a un endpoint REST.
 * Se activa poniendo `config.useMockServices = false` (ver services/index).
 */
import type { ApiClient } from '@/services/http/ApiClient';
import { ApiError } from '@/services/http/ApiError';
import type { AuthService, AuthUser, Credentials, SignInResult } from './types';

export class HttpAuthService implements AuthService {
  constructor(private readonly api: ApiClient) {}

  async signIn(credentials: Credentials): Promise<SignInResult> {
    try {
      const user = await this.api.post<AuthUser>('/auth/login', credentials);
      return { ok: true, user };
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        return { ok: false, reason: 'not_registered' };
      }
      if (e instanceof ApiError && e.status === 401) {
        return { ok: false, reason: 'wrong_password' };
      }
      throw e;
    }
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const res = await this.api.post<{ exists: boolean }>('/auth/email-exists', {
      email,
    });
    return res.exists;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.api.post('/auth/password/forgot', { email });
  }

  async verifyCode(code: string): Promise<boolean> {
    const res = await this.api.post<{ valid: boolean }>('/auth/code/verify', {
      code,
    });
    return res.valid;
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    await this.api.patch('/auth/password', { email, newPassword });
  }
}
