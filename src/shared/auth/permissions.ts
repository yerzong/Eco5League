/**
 * Matriz de permisos por rol.
 * Fuente de verdad: Excel ECO5_Proyecto_UX.xlsx → hoja "Modulos por rol".
 *
 * Niveles de acceso a cada módulo:
 *  - full      = Completo
 *  - limited   = Limitado (acceso parcial; ej. staff según sub-roles)
 *  - readonly  = Solo lectura
 *  - none      = no aplica
 */
import { Role } from './roles';

export type AccessLevel = 'full' | 'limited' | 'readonly' | 'none';

export type ModuleKey =
  | 'eventos'
  | 'bracketStandings'
  | 'miOrganizacion'
  | 'buscarOrg'
  | 'invitaciones'
  | 'partidas'
  | 'panelStaff'
  | 'gestionEventos'
  | 'aprobaciones'
  | 'usuariosAdmins'
  | 'configLiga'
  | 'perfil'
  | 'notificaciones';

type Matrix = Record<ModuleKey, Record<Role, AccessLevel>>;

const F: AccessLevel = 'full';
const L: AccessLevel = 'limited';
const R: AccessLevel = 'readonly';
const N: AccessLevel = 'none';

//                       super  admin  staff  manager capitan jugador visitante
export const PERMISSIONS: Matrix = {
  eventos:          { superadmin: F, admin: F, staff: F, manager: F, capitan: F, jugador: F, visitante: R, coach: F },
  bracketStandings: { superadmin: F, admin: F, staff: F, manager: F, capitan: F, jugador: F, visitante: R, coach: F },
  miOrganizacion:   { superadmin: N, admin: N, staff: N, manager: F, capitan: L, jugador: R, visitante: N, coach: R },
  buscarOrg:        { superadmin: N, admin: N, staff: N, manager: N, capitan: N, jugador: F, visitante: N, coach: N },
  invitaciones:     { superadmin: N, admin: N, staff: N, manager: F, capitan: L, jugador: F, visitante: N, coach: N },
  partidas:         { superadmin: F, admin: F, staff: L, manager: L, capitan: L, jugador: L, visitante: R, coach: L },
  panelStaff:       { superadmin: F, admin: F, staff: L, manager: N, capitan: N, jugador: N, visitante: N, coach: N },
  gestionEventos:   { superadmin: F, admin: F, staff: L, manager: N, capitan: N, jugador: N, visitante: N, coach: N },
  aprobaciones:     { superadmin: F, admin: F, staff: L, manager: N, capitan: N, jugador: N, visitante: N, coach: N },
  usuariosAdmins:   { superadmin: F, admin: L, staff: N, manager: N, capitan: N, jugador: N, visitante: N, coach: N },
  configLiga:       { superadmin: F, admin: F, staff: N, manager: N, capitan: N, jugador: N, visitante: N, coach: N },
  perfil:           { superadmin: F, admin: F, staff: F, manager: F, capitan: F, jugador: F, visitante: N, coach: F },
  notificaciones:   { superadmin: F, admin: F, staff: F, manager: F, capitan: F, jugador: F, visitante: N, coach: F },
};

/** ¿Puede el rol acceder al módulo (en cualquier nivel distinto de "none")? */
export function canAccess(role: Role, moduleKey: ModuleKey): boolean {
  return PERMISSIONS[moduleKey][role] !== 'none';
}

/** Nivel de acceso del rol a un módulo. */
export function accessLevel(role: Role, moduleKey: ModuleKey): AccessLevel {
  return PERMISSIONS[moduleKey][role];
}
