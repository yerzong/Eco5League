/**
 * Punto único de acceso a los servicios (capa de datos / integraciones).
 *
 * Aquí se "cablean" las dependencias (composition root): se decide qué
 * implementación usar según `config.useMockServices` y se exponen
 * instancias listas para consumir desde las features:
 *
 *   import { authService } from '@/services';
 *   const result = await authService.signIn({ email, password });
 *
 * Las pantallas NUNCA instancian servicios ni conocen si son mock o HTTP.
 */
import { config } from './config';
import { ApiClient } from './http/ApiClient';
import type { AuthService } from './auth/types';
import { MockAuthService } from './auth/MockAuthService';
import { HttpAuthService } from './auth/HttpAuthService';

/** Cliente HTTP compartido. El token de sesión se inyectará al integrar auth real. */
export const apiClient = new ApiClient(config.apiBaseUrl);

/** Servicio de autenticación activo (mock en maqueta, HTTP con backend). */
export const authService: AuthService = config.useMockServices
  ? new MockAuthService()
  : new HttpAuthService(apiClient);

export { ApiClient } from './http/ApiClient';
export { ApiError } from './http/ApiError';
export type {
  AuthService,
  AuthUser,
  Credentials,
  SignInResult,
} from './auth/types';
