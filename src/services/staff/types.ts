/**
 * Contratos del servicio de staff (SA-M03).
 */
export type StaffStatus = 'activo' | 'inactivo';

/** Rol del staff con su color de marca para el chip. */
export interface StaffRole {
  label: string;
  color: string;
}

export interface StaffMember {
  id: string;
  /** Iniciales para el avatar (ej. "CM"). */
  initials: string;
  name: string;
  /** Color de acento del avatar (tinte + borde + iniciales). */
  color: string;
  /** Roles del staff (chips de color). */
  roles: StaffRole[];
  status: StaffStatus;
  /** Alcance asignado (ej. "Copa ECO5 T1", "Todos los eventos"). */
  scope: string;
}

export interface StaffService {
  getStaff(): Promise<StaffMember[]>;
}
