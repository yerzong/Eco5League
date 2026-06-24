/**
 * Implementación SIMULADA del servicio de staff (maqueta SA-M03).
 * Datos fieles al diseño v2 (roles, colores y estados).
 */
import type { StaffService, StaffMember } from './types';

/** Colores de marca por rol (fieles al diseño). */
const ROLE = {
  caster: { label: 'Caster', color: '#c8102e' },
  moderador: { label: 'Moderador', color: '#e8a020' },
  streamer: { label: 'Streamer', color: '#7a3fb0' },
  disenador: { label: 'Diseñador', color: '#2e8fd6' },
  redes: { label: 'Redes', color: '#16a3a3' },
  arbitro: { label: 'Árbitro', color: '#e8a020' },
  observer: { label: 'Observer', color: '#5b616b' },
} as const;

const STAFF: StaffMember[] = [
  {
    id: 's1',
    initials: 'CM',
    name: 'Carlos Mendoza',
    color: '#c8102e',
    roles: [ROLE.caster, ROLE.moderador],
    status: 'activo',
    scope: 'Copa ECO5 T1',
  },
  {
    id: 's2',
    initials: 'LV',
    name: 'Laura Vega',
    color: '#7a3fb0',
    roles: [ROLE.streamer],
    status: 'activo',
    scope: 'Todos los eventos',
  },
  {
    id: 's3',
    initials: 'DT',
    name: 'Diego Torres',
    color: '#2e8fd6',
    roles: [ROLE.disenador, ROLE.redes],
    status: 'activo',
    scope: 'Todos los eventos',
  },
  {
    id: 's4',
    initials: 'AR',
    name: 'Ana Ríos',
    color: '#e8a020',
    roles: [ROLE.arbitro],
    status: 'activo',
    scope: 'Torneo Relámpago #4',
  },
  {
    id: 's5',
    initials: 'PS',
    name: 'Pedro Sánchez',
    color: '#5b616b',
    roles: [ROLE.observer],
    status: 'inactivo',
    scope: 'Copa ECO5 T1',
  },
];

export class MockStaffService implements StaffService {
  async getStaff(): Promise<StaffMember[]> {
    return STAFF;
  }
}
