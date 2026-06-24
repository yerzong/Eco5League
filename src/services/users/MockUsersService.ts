/**
 * Implementación SIMULADA del servicio de usuarios (maqueta USR · Usuarios).
 * Datos fieles al diseño v2 (rol, color y estado).
 */
import type { UsersService, AppUser, UsersSummary } from './types';

const USERS: AppUser[] = [
  { id: 'u1', initials: 'GG', name: 'Gerson García', avatarColor: '#c8102e', roleLabel: 'Super-admin', roleColor: '#c8102e', username: '@gerson', status: 'activo', verified: true, since: 'feb 2025' },
  { id: 'u2', initials: 'EC', name: 'Elena Cruz', avatarColor: '#e0533d', roleLabel: 'Admin', roleColor: '#e0533d', username: '@elenac', status: 'activo', verified: true, since: 'ene 2025' },
  { id: 'u3', initials: 'LV', name: 'Laura Vega', avatarColor: '#7a4fc0', roleLabel: 'Staff', roleColor: '#5865f2', username: '@laurav', status: 'activo', verified: true, since: 'mar 2025' },
  { id: 'u4', initials: 'DS', name: 'Diego Soto', avatarColor: '#3e9c5f', roleLabel: 'Manager', roleColor: '#3e9c5f', username: '@diegos', status: 'activo', verified: true, since: 'abr 2025' },
  { id: 'u5', initials: 'CM', name: 'Carlos Mora', avatarColor: '#b0452b', roleLabel: 'Capitán', roleColor: '#e0a526', username: '@carlosm', status: 'activo', verified: false, since: 'may 2025' },
  { id: 'u6', initials: 'PG', name: 'Pedro Gómez', avatarColor: '#5865f2', roleLabel: 'Jugador', roleColor: '#8a9099', username: '@pedrog', status: 'activo', verified: true, since: 'may 2025' },
  { id: 'u7', initials: 'MT', name: 'Marco Tena', avatarColor: '#2a6fdb', roleLabel: 'Coach', roleColor: '#2a6fdb', username: '@marcot', status: 'activo', verified: false, since: 'jun 2025' },
  { id: 'u8', initials: 'SL', name: 'Sofía Luna', avatarColor: '#e0a526', roleLabel: 'Jugador', roleColor: '#8a9099', username: '@sofial', status: 'pendiente', verified: false, since: 'jun 2025' },
  { id: 'u9', initials: 'BD', name: 'Bruno Díaz', avatarColor: '#8a9099', roleLabel: 'Jugador', roleColor: '#8a9099', username: '@brunod', status: 'suspendido', verified: false, since: 'jun 2025' },
  { id: 'u10', initials: 'VR', name: 'Valeria Ruiz', avatarColor: '#7a4fc0', roleLabel: 'Visitante', roleColor: '#8a9099', username: '@valer', status: 'activo', verified: true, since: 'jul 2025' },
];

export class MockUsersService implements UsersService {
  async getUsers(): Promise<AppUser[]> {
    return USERS;
  }

  async getSummary(): Promise<UsersSummary> {
    return { total: 248, activos: 218, pendientes: 24 };
  }
}
