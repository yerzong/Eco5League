/**
 * Implementación SIMULADA del servicio de eventos (maqueta SA-M02).
 * Datos dummy variados para que la búsqueda y los filtros se aprecien.
 */
import type { EventsService, EventStaff, EventTeam, LeagueEvent, StaffCandidate } from './types';

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
    game: 'GEARS',
    title: 'Copa ECO5',
    subtitle: 'Liga · Gears E-Day · Round-robin',
    status: 'en_curso',
    format: 'liga',
    accent: ACCENT.red,
    teamsLabel: '16/16 equipos',
    dateLabel: '01 feb – 30 mar',
  },
  {
    id: 'e2',
    code: 'R4',
    game: 'GEARS',
    title: 'Torneo Relámpago #4',
    subtitle: 'Torneo · Gears 5 · Eliminación directa',
    status: 'inscripcion',
    format: 'torneo',
    accent: ACCENT.amber,
    teamsLabel: '8 / 24 equipos',
    dateLabel: 'Cierra 25 jun',
  },
  {
    id: 'e3',
    code: 'EG',
    game: 'GEARS',
    title: 'ECO5 Girls · Febrero',
    subtitle: 'Copa · Gears E-Day · Femenil',
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

const EVENT_TEAMS: Record<string, EventTeam[]> = {
  e1: [
    { id: 'et1', initials: 'NW', color: '#b2bdd1', name: 'NightWolves',  org: 'Independiente',   rosterCurrent: 4, rosterMax: 4, status: 'pending' },
    { id: 'et2', initials: 'PX', color: '#ffa673', name: 'Phoenix X',    org: 'Phoenix Esports', rosterCurrent: 4, rosterMax: 4, status: 'pending' },
    { id: 'et3', initials: 'TO', color: '#ff7385', name: 'Team Ozone',   org: 'Ozone Esports',   rosterCurrent: 4, rosterMax: 4, status: 'active'  },
    { id: 'et4', initials: 'VG', color: '#a6b2ff', name: 'Viral GG',     org: 'Independiente',   rosterCurrent: 4, rosterMax: 4, status: 'active'  },
    { id: 'et5', initials: 'RG', color: '#eb8c73', name: 'Red Gaming',   org: 'Red Org',         rosterCurrent: 4, rosterMax: 4, status: 'active'  },
    { id: 'et6', initials: 'SL', color: '#80d99e', name: 'Steel Legion', org: 'Steel Org',       rosterCurrent: 4, rosterMax: 4, status: 'active'  },
    { id: 'et7', initials: 'DX', color: '#c4a0e8', name: 'Dark X',       org: 'Dark Esports',    rosterCurrent: 3, rosterMax: 4, status: 'active'  },
    { id: 'et8', initials: 'BZ', color: '#7ab8ff', name: 'BlueZone',     org: 'BZ Gaming',       rosterCurrent: 4, rosterMax: 4, status: 'active'  },
  ],
};

const EVENT_STAFF_INIT: Record<string, EventStaff[]> = {
  e1: [
    { id: 'ef1', initials: 'CM', color: '#ff7385', name: 'Carlos Mendoza', subRole: 'Admin del evento',    status: 'active' },
    { id: 'ef2', initials: 'AR', color: '#f6c878', name: 'Ana Ríos',       subRole: 'Árbitro principal',   status: 'active' },
    { id: 'ef3', initials: 'MT', color: '#f6c878', name: 'Mía Torres',     subRole: 'Árbitro',             status: 'active' },
    { id: 'ef4', initials: 'DS', color: '#ff7385', name: 'Diego Sosa',     subRole: 'Caster · Diseño',     status: 'active' },
    { id: 'ef5', initials: 'LV', color: '#c299f2', name: 'Laura Vega',     subRole: 'Streamer · Redes',    status: 'active' },
    { id: 'ef6', initials: 'HL', color: '#ff9973', name: 'Hugo Lara',      subRole: 'Coordinador general', status: 'active' },
  ],
};

const ALL_STAFF_CANDIDATES: StaffCandidate[] = [
  { id: 'sc1', initials: 'SR', color: '#ff808f', name: 'Sofía Ramírez',    email: 'sofia.ramirez@eco5.gg'    },
  { id: 'sc2', initials: 'MA', color: '#7ab8ff', name: 'Marcos Ávila',     email: 'marcos.avila@eco5.gg'     },
  { id: 'sc3', initials: 'ML', color: '#80d99e', name: 'Mariana López',    email: 'mariana.lopez@eco5.gg'    },
  { id: 'sc4', initials: 'DA', color: '#f6c878', name: 'Diego Aguilar',    email: 'diego.aguilar@eco5.gg'    },
  { id: 'sc5', initials: 'LT', color: '#c299f2', name: 'Lucía Torres',     email: 'lucia.torres@eco5.gg'     },
  { id: 'sc6', initials: 'JP', color: '#ff9973', name: 'Javier Paz',       email: 'javier.paz@eco5.gg'       },
  { id: 'sc7', initials: 'ER', color: '#b2bdd1', name: 'Eduardo Reyes',    email: 'eduardo.reyes@eco5.gg'    },
];

export class MockEventsService implements EventsService {
  private eventStaff: Record<string, EventStaff[]> = Object.fromEntries(
    Object.entries(EVENT_STAFF_INIT).map(([k, v]) => [k, [...v]]),
  );

  async getEvents(): Promise<LeagueEvent[]> {
    return EVENTS;
  }

  async getEventTeams(eventId: string): Promise<EventTeam[]> {
    return EVENT_TEAMS[eventId] ?? [];
  }

  async getEventStaff(eventId: string): Promise<EventStaff[]> {
    return this.eventStaff[eventId] ?? [];
  }

  async getStaffCandidates(eventId: string): Promise<StaffCandidate[]> {
    const assignedIds = new Set((this.eventStaff[eventId] ?? []).map(s => s.id));
    return ALL_STAFF_CANDIDATES.filter(c => !assignedIds.has(c.id));
  }

  async addEventStaff(
    eventId: string,
    candidate: StaffCandidate,
    subRole: string,
  ): Promise<EventStaff> {
    const newStaff: EventStaff = {
      id: candidate.id,
      initials: candidate.initials,
      color: candidate.color,
      name: candidate.name,
      subRole,
      status: 'active',
    };
    if (!this.eventStaff[eventId]) {
      this.eventStaff[eventId] = [];
    }
    this.eventStaff[eventId].push(newStaff);
    return newStaff;
  }

  async removeEventStaff(eventId: string, staffId: string): Promise<void> {
    if (this.eventStaff[eventId]) {
      this.eventStaff[eventId] = this.eventStaff[eventId].filter(s => s.id !== staffId);
    }
  }
}
