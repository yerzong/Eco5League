/**
 * Implementación SIMULADA del servicio de eventos (maqueta SA-M02).
 * Datos dummy variados para que la búsqueda y los filtros se aprecien.
 */
import type { EventsService, LeagueEvent } from './types';

const EVENTS: LeagueEvent[] = [
  {
    id: 'e1',
    code: 'C1',
    game: 'VALORANT',
    title: 'Copa ECO5',
    subtitle: 'Liga · Valorant · Round-robin',
    status: 'en_curso',
    format: 'liga',
    featured: true,
    teamsLabel: '16/16 equipos',
    dateLabel: '01 feb – 30 mar 2026',
  },
  {
    id: 'e2',
    code: 'R4',
    game: 'LOL',
    title: 'Torneo Relámpago #4',
    subtitle: 'Torneo · 8/24 · 25 jun',
    status: 'inscripcion',
    format: 'torneo',
  },
  {
    id: 'e3',
    code: 'EG',
    game: 'VAL',
    title: 'ECO5 Girls · Febrero',
    subtitle: 'Copa · 12/12 · finalizado',
    status: 'finalizado',
    format: 'copa',
  },
  {
    id: 'e4',
    code: 'L2',
    game: 'GEARS',
    title: 'Liga ECO5 · Temporada 2',
    subtitle: 'Liga · Gears · Doble eliminación',
    status: 'en_curso',
    format: 'liga',
    teamsLabel: '10/12 equipos',
    dateLabel: '15 mar – 20 may 2026',
  },
  {
    id: 'e5',
    code: 'CW',
    game: 'COD',
    title: 'Copa Invierno',
    subtitle: 'Copa · 0/16 · próximamente',
    status: 'proximo',
    format: 'copa',
  },
  {
    id: 'e6',
    code: 'T7',
    game: 'VALORANT',
    title: 'Torneo Express #7',
    subtitle: 'Torneo · 16/16 · 02 jul',
    status: 'inscripcion',
    format: 'torneo',
  },
];

export class MockEventsService implements EventsService {
  async getEvents(): Promise<LeagueEvent[]> {
    return EVENTS;
  }
}
