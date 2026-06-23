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
import type { DashboardService } from './dashboard/types';
import { MockDashboardService } from './dashboard/MockDashboardService';
import type { NotificationsService } from './notifications/types';
import { MockNotificationsService } from './notifications/MockNotificationsService';
import type { EventsService } from './events/types';
import { MockEventsService } from './events/MockEventsService';

/** Cliente HTTP compartido. El token de sesión se inyectará al integrar auth real. */
export const apiClient = new ApiClient(config.apiBaseUrl);

/** Servicio de autenticación activo (mock en maqueta, HTTP con backend). */
export const authService: AuthService = config.useMockServices
  ? new MockAuthService()
  : new HttpAuthService(apiClient);

/**
 * Dashboard y notificaciones: por ahora solo mock (el backend se conecta
 * agregando HttpDashboardService / HttpNotificationsService aquí).
 */
export const dashboardService: DashboardService = new MockDashboardService();
export const notificationsService: NotificationsService = new MockNotificationsService();
export const eventsService: EventsService = new MockEventsService();

export { ApiClient } from './http/ApiClient';
export { ApiError } from './http/ApiError';
export type {
  AuthService,
  AuthUser,
  Credentials,
  SignInResult,
} from './auth/types';
export type {
  DashboardService,
  DashboardData,
  DashboardStat,
  PendingTask,
  ActivityItem,
} from './dashboard/types';
export type { NotificationsService, NotificationItem } from './notifications/types';
export type { EventsService, LeagueEvent } from './events/types';
