/**
 * Contratos del servicio de usuarios (USR · Usuarios).
 */
export type UserStatus = 'activo' | 'pendiente' | 'suspendido';

export interface AppUser {
  id: string;
  initials: string;
  name: string;
  /** Color sólido del avatar. */
  avatarColor: string;
  /** Etiqueta del rol (ej. "Super-admin", "Jugador"). */
  roleLabel: string;
  /** Color del badge de rol. */
  roleColor: string;
  /** Usuario con @ (ej. "@gerson"). */
  username: string;
  status: UserStatus;
  /** Cuenta de Xbox verificada. */
  verified: boolean;
  /** Antigüedad (ej. "feb 2025"). */
  since: string;
}

export interface UsersSummary {
  total: number;
  activos: number;
  pendientes: number;
}

export interface UsersService {
  getUsers(): Promise<AppUser[]>;
  getSummary(): Promise<UsersSummary>;
}
