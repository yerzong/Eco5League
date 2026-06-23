/**
 * Contratos del servicio de eventos (SA-M02).
 */
import type { EventStatus } from '@/shared/events/status';

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
  /** Texto de equipos (ej. "16/16 equipos"). Opcional en filas. */
  teamsLabel?: string;
  /** Rango de fechas (ej. "01 feb – 30 mar 2026"). Opcional. */
  dateLabel?: string;
}

export interface EventsData {
  featured?: LeagueEvent;
  upcoming: LeagueEvent[];
}

export interface EventsService {
  getEvents(): Promise<EventsData>;
}
