/**
 * Roles y navegación por rol.
 * Fuente de verdad: Excel ECO5_Proyecto_UX.xlsx → hojas "Actores y jerarquia" y "Tab bar por rol".
 *
 * Dos mundos:
 *  - Gestión ECO5:  superadmin · admin · staff
 *  - Competidores:  manager · capitan · jugador · coach
 *  - Audiencia:     visitante (solo lectura)
 */

export type Role =
  | 'superadmin'
  | 'admin'
  | 'staff'
  | 'manager'
  | 'capitan'
  | 'jugador'
  | 'coach'
  | 'visitante';

/** Sub-roles de staff — los permisos del staff son la SUMA de sus sub-roles. */
export type StaffSubRole =
  | 'caster'
  | 'streamer'
  | 'moderador'
  | 'disenador'
  | 'redes'
  | 'observer'
  | 'coordinador';

/** Pestañas posibles en la tab bar (4 por rol). "Inicio" = Eventos para todos. */
export type TabKey =
  | 'inicio'
  | 'buscarOrg'
  | 'miOrg'
  | 'invitaciones'
  | 'partidas'
  | 'tareas'
  | 'gestion'
  | 'perfil';

export interface TabConfig {
  key: TabKey;
  label: string;
  /** Nombre de ícono (Tabler/Feather) — el lib de íconos se enlaza después. */
  icon: string;
}

export const TAB_DEFS: Record<TabKey, TabConfig> = {
  inicio: { key: 'inicio', label: 'Inicio', icon: 'home' },
  buscarOrg: { key: 'buscarOrg', label: 'Buscar org', icon: 'search' },
  miOrg: { key: 'miOrg', label: 'Mi org', icon: 'users' },
  invitaciones: { key: 'invitaciones', label: 'Invitaciones', icon: 'mail' },
  partidas: { key: 'partidas', label: 'Partidas', icon: 'device-gamepad-2' },
  tareas: { key: 'tareas', label: 'Tareas', icon: 'checklist' },
  gestion: { key: 'gestion', label: 'Gestión', icon: 'layout-dashboard' },
  perfil: { key: 'perfil', label: 'Perfil', icon: 'user' },
};

/** Las 4 pestañas de cada rol (hoja "Tab bar por rol"). */
export const TABS_BY_ROLE: Record<Role, TabKey[]> = {
  visitante: ['inicio', 'buscarOrg', 'invitaciones', 'perfil'],
  jugador: ['inicio', 'buscarOrg', 'invitaciones', 'perfil'],
  capitan: ['inicio', 'miOrg', 'partidas', 'perfil'],
  coach: ['inicio', 'miOrg', 'partidas', 'perfil'],
  manager: ['inicio', 'miOrg', 'invitaciones', 'perfil'],
  staff: ['inicio', 'partidas', 'tareas', 'perfil'],
  admin: ['inicio', 'gestion', 'partidas', 'perfil'],
  superadmin: ['inicio', 'gestion', 'partidas', 'perfil'],
};

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: 'Super-admin',
  admin: 'Admin',
  staff: 'Staff',
  manager: 'Manager de organización',
  capitan: 'Capitán',
  jugador: 'Jugador',
  coach: 'Coach / Suplente',
  visitante: 'Visitante',
};
