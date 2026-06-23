/**
 * Implementación SIMULADA del servicio de eventos (maqueta SA-M02).
 */
import type { EventsData, EventsService } from './types';

export class MockEventsService implements EventsService {
  async getEvents(): Promise<EventsData> {
    return {
      featured: {
        id: 'e1',
        code: 'C1',
        game: 'VALORANT',
        title: 'Copa ECO5',
        subtitle: 'Liga · Valorant · Round-robin',
        status: 'en_curso',
        teamsLabel: '16/16 equipos',
        dateLabel: '01 feb – 30 mar 2026',
      },
      upcoming: [
        {
          id: 'e2',
          code: 'R4',
          game: 'LOL',
          title: 'Torneo Relámpago #4',
          subtitle: 'Torneo · 8/24 · 25 jun',
          status: 'inscripcion',
        },
        {
          id: 'e3',
          code: 'EG',
          game: 'VAL',
          title: 'ECO5 Girls · Febrero',
          subtitle: 'Copa · 12/12 · finalizado',
          status: 'finalizado',
        },
      ],
    };
  }
}
