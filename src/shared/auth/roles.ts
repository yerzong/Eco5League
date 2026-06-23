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

/**
 * Pestañas posibles en la tab bar. Perfil y Notificaciones NO van aquí:
 * se abren desde el header (campana + avatar) en cualquier pantalla.
 */
export type TabKey =
  | 'inicio'
  | 'buscarOrg'
  | 'miOrg'
  | 'invitaciones'
  | 'partidas'
  | 'tareas'
  | 'gestion'
  | 'eventos'
  | 'staff'
  | 'equipos'
  | 'usuarios';

export interface TabConfig {
  key: TabKey;
  label: string;
  /** Nombre de ícono (Tabler) — el mapa a componente vive en AppTabs. */
  icon: string;
}

export const TAB_DEFS: Record<TabKey, TabConfig> = {
  inicio: { key: 'inicio', label: 'Inicio', icon: 'home' },
  buscarOrg: { key: 'buscarOrg', label: 'Buscar org', icon: 'search' },
  miOrg: { key: 'miOrg', label: 'Mi org', icon: 'users' },
  invitaciones: { key: 'invitaciones', label: 'Invitaciones', icon: 'mail' },
  partidas: { key: 'partidas', label: 'Partidas', icon: 'gamepad' },
  tareas: { key: 'tareas', label: 'Tareas', icon: 'checklist' },
  gestion: { key: 'gestion', label: 'Gestión', icon: 'dashboard' },
  eventos: { key: 'eventos', label: 'Eventos', icon: 'calendar' },
  staff: { key: 'staff', label: 'Staff', icon: 'headset' },
  equipos: { key: 'equipos', label: 'Equipos', icon: 'shield' },
  usuarios: { key: 'usuarios', label: 'Usuarios', icon: 'users-group' },
};

/** Pestañas de cada rol (hoja "Tab bar por rol"). Super-admin ve todo. */
export const TABS_BY_ROLE: Record<Role, TabKey[]> = {
  visitante: ['inicio', 'buscarOrg', 'invitaciones'],
  jugador: ['inicio', 'buscarOrg', 'invitaciones'],
  capitan: ['inicio', 'miOrg', 'partidas'],
  coach: ['inicio', 'miOrg', 'partidas'],
  manager: ['inicio', 'miOrg', 'invitaciones'],
  staff: ['inicio', 'partidas', 'tareas'],
  admin: ['inicio', 'eventos', 'staff', 'equipos', 'usuarios'],
  superadmin: ['inicio', 'eventos', 'staff', 'equipos', 'usuarios'],
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
