/**
 * Usuarios demo (hardcodeados) para el maquetado, mientras no hay backend.
 * Solo DATOS — la lógica de autenticación vive en `services/auth/MockAuthService`.
 * Cuando exista API real, este archivo desaparece.
 */
import { Role } from './roles';

export interface MockUser {
  email: string;
  password: string;
  role: Role;
  nombre: string;
}

export const MOCK_USERS: MockUser[] = [
  { email: 'gerson@eco5.mx', password: 'eco5demo', role: 'superadmin', nombre: 'Gerson' },
  { email: 'admin@eco5.mx', password: 'eco5demo', role: 'admin', nombre: 'Admin' },
  { email: 'jugador@eco5.mx', password: 'eco5demo', role: 'jugador', nombre: 'Jugador' },
];
