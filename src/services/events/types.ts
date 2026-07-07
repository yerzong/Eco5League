/**
 * Contratos del servicio de eventos (SA-M02).
 */
import type { EventStatus, EventFormat } from '@/shared/events/status';

export interface LeagueEvent {
  id: string;
  /** Iniciales/código corto (ej. "C1", "R4"). */
  code: string;
  /** Nombre del juego para el arte (ej. "VALORANT", "LOL"). */
  game: string;
  title: string;
  /** Línea secundaria (formato · juego · modo, o "Torneo · 8/24 · 25 jun"). */
  subtitle: string;
  status: EventStatus;
  /** Formato de competencia (para filtrar). */
  format: EventFormat;
  /** Color de acento del cover (gradiente + shard). Default rojo de marca. */
  accent?: string;
  /** URI de la foto de portada. Si existe, se muestra como fondo de la card. */
  coverUri?: string;
  /** Texto de equipos del footer (ej. "16/16 equipos"). */
  teamsLabel?: string;
  /** Meta del footer-derecho (ej. "01 feb – 30 mar", "Cierra 25 jun"). */
  dateLabel?: string;
}

export interface EventTeam {
  id: string;
  initials: string;
  color: string;
  name: string;
  org: string;
  rosterCurrent: number;
  rosterMax: number;
  status: 'pending' | 'active';
}

export interface EventStaff {
  id: string;
  initials: string;
  /** Color de acento del avatar (tinte + borde + texto de iniciales). */
  color: string;
  name: string;
  /** Sub-rol descriptivo (ej. "Árbitro principal", "Caster · Diseño"). */
  subRole: string;
  status: 'active' | 'inactive';
}

/** Usuario disponible para ser asignado como staff. */
export interface StaffCandidate {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
}

export type MatchStatus = 'live' | 'upcoming' | 'finished';

export type MapStatus = 'pending' | 'live' | 'won_t1' | 'won_t2';

export interface EventMatchMap {
  number: number;
  status: MapStatus;
}

/** Datos mínimos de un equipo dentro de un partido (snapshot). */
export interface MatchTeam {
  initials: string;
  color: string;
  name: string;
}

export interface EventMatch {
  id: string;
  status: MatchStatus;
  /** Contexto corto para la lista (ej. "Grupo A · Mapa 2/3"). */
  context: string;
  /** Etiqueta de la columna izquierda: hora ("18:00") o jornada ("J1"). */
  roundLabel: string;
  team1: MatchTeam;
  team2: MatchTeam;
  /** null si el partido aún no ha iniciado. */
  score1: number | null;
  score2: number | null;
  /** Formato del enfrentamiento (ej. "BO3", "BO5"). */
  format: string;
  /** Resultados por mapa. */
  maps: EventMatchMap[];
  /** Fecha formateada para mostrar en el detalle (ej. "Hoy · 18:00"). */
  dateLabel: string;
  /** Fecha para el formulario de edición (ej. "04 feb 2026"). */
  scheduledDate: string;
  /** Hora para el formulario de edición (ej. "18:00"). */
  scheduledTime: string;
  /** Info de transmisión (ej. "En vivo · Twitch", "Ver repetición (VOD)"). */
  streamLabel: string;
  /** Contexto completo para el detalle (ej. "Grupo A · Jornada 2 · BO3"). */
  detailContext: string;
}

export interface EventsService {
  /** Lista completa de eventos (las cards "en curso" se resaltan en la UI). */
  getEvents(): Promise<LeagueEvent[]>;
  /** Equipos inscritos/pendientes de aprobación para un evento. */
  getEventTeams(eventId: string): Promise<EventTeam[]>;
  /** Staff asignado a un evento. */
  getEventStaff(eventId: string): Promise<EventStaff[]>;
  /** Usuarios disponibles para agregar como staff (no asignados aún). */
  getStaffCandidates(eventId: string): Promise<StaffCandidate[]>;
  /** Agrega un candidato como staff del evento con el sub-rol indicado. */
  addEventStaff(eventId: string, candidate: StaffCandidate, subRole: string): Promise<EventStaff>;
  /** Elimina un miembro del staff de un evento. */
  removeEventStaff(eventId: string, staffId: string): Promise<void>;
  /** Partidos de un evento (en vivo, próximos y finalizados). */
  getEventMatches(eventId: string): Promise<EventMatch[]>;
}
