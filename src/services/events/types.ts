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
  /** Marca el evento que se muestra como "destacado". */
  featured?: boolean;
  /** Texto de equipos (ej. "16/16 equipos"). Opcional en filas. */
  teamsLabel?: string;
  /** Rango de fechas (ej. "01 feb – 30 mar 2026"). Opcional. */
  dateLabel?: string;
}

export interface EventsService {
  /** Lista completa de eventos (el destacado va marcado con `featured`). */
  getEvents(): Promise<LeagueEvent[]>;
}
