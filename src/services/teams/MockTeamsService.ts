/**
 * Implementación SIMULADA del servicio de equipos (maqueta SA-M04).
 * Datos fieles al diseño v2 (estado, cupo y evento).
 */
import type { TeamsService, Team } from './types';

const TEAMS: Team[] = [
  {
    id: 't1',
    initials: 'TO',
    name: 'Team Ozone',
    org: 'Ozone Esports',
    status: 'activo',
    playersLabel: '4 / 4 jugadores',
    eventTag: 'Copa T1',
  },
  {
    id: 't2',
    initials: 'VG',
    name: 'Viral GG',
    org: 'Viral Gaming',
    status: 'activo',
    playersLabel: '4 / 4 jugadores',
    eventTag: 'Torneo #4',
  },
  {
    id: 't3',
    initials: 'RG',
    name: 'Red Gaming',
    org: 'Red Org',
    status: 'activo',
    playersLabel: '4 / 4 jugadores',
    eventTag: 'Copa T1',
  },
  {
    id: 't4',
    initials: 'NW',
    name: 'NightWolves',
    org: 'Independiente',
    status: 'pendiente',
    playersLabel: '3 / 4 jugadores',
    eventTag: 'T #5',
  },
  {
    id: 't5',
    initials: 'SL',
    name: 'Steel Legion',
    org: 'Steel Org',
    status: 'activo',
    playersLabel: '4 / 4 jugadores',
    eventTag: 'Torneo #4',
  },
];

export class MockTeamsService implements TeamsService {
  async getTeams(): Promise<Team[]> {
    return TEAMS;
  }

  async getRegisteredCount(): Promise<number> {
    return 24;
  }
}
