/**
 * Implementación SIMULADA del servicio de eventos (maqueta SA-M02).
 * Datos dummy variados para que la búsqueda y los filtros se aprecien.
 */
import type { EventsService, LeagueEvent } from './types';

/** Acentos de cover por juego (fieles al diseño v2). */
const ACCENT = {
  red: '#c8102e',
  amber: '#e8a020',
  purple: '#7a3fb0',
  blue: '#2a6fdb',
  green: '#2ea846',
} as const;

const EVENTS: LeagueEvent[] = [
  {
    id: 'e1',
    code: 'C1',
    game: 'VALORANT',
    title: 'Copa ECO5',
    subtitle: 'Liga · Valorant · Round-robin',
    status: 'en_curso',
    format: 'liga',
    accent: ACCENT.red,
    teamsLabel: '16/16 equipos',
    dateLabel: '01 feb – 30 mar',
  },
  {
    id: 'e2',
    code: 'R4',
    game: 'LOL',
    title: 'Torneo Relámpago #4',
    subtitle: 'Torneo · LoL · Eliminación directa',
    status: 'inscripcion',
    format: 'torneo',
    accent: ACCENT.amber,
    teamsLabel: '8 / 24 equipos',
    dateLabel: 'Cierra 25 jun',
  },
  {
    id: 'e3',
    code: 'EG',
    game: 'VAL',
    title: 'ECO5 Girls · Febrero',
    subtitle: 'Copa · Valorant · Femenil',
    status: 'finalizado',
    format: 'copa',
    accent: ACCENT.purple,
    teamsLabel: '12 / 12 equipos',
    dateLabel: 'Finalizado · feb 2026',
  },
  {
    id: 'e4',
    code: 'L2',
    game: 'GEARS',
    title: 'Liga ECO5 · Temporada 2',
    subtitle: 'Liga · Gears · Doble eliminación',
    status: 'en_curso',
    format: 'liga',
    accent: ACCENT.blue,
    teamsLabel: '10/12 equipos',
    dateLabel: '15 mar – 20 may',
  },
  {
    id: 'e5',
    code: 'CW',
    game: 'COD',
    title: 'Copa Invierno',
    subtitle: 'Copa · CoD · Por iniciar',
    status: 'proximo',
    format: 'copa',
    accent: ACCENT.green,
    teamsLabel: '0/16 equipos',
    dateLabel: 'Próximamente',
  },
  {
    id: 'e6',
    code: 'T7',
    game: 'VALORANT',
    title: 'Torneo Express #7',
    subtitle: 'Torneo · Valorant · Suizo',
    status: 'inscripcion',
    format: 'torneo',
    accent: ACCENT.red,
    teamsLabel: '16/16 equipos',
    dateLabel: 'Cierra 02 jul',
  },
];

export class MockEventsService implements EventsService {
  async getEvents(): Promise<LeagueEvent[]> {
    return EVENTS;
  }
}
