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
  /** Texto de equipos del footer (ej. "16/16 equipos"). */
  teamsLabel?: string;
  /** Meta del footer-derecho (ej. "01 feb – 30 mar", "Cierra 25 jun"). */
  dateLabel?: string;
}

export interface EventsService {
  /** Lista completa de eventos (las cards "en curso" se resaltan en la UI). */
  getEvents(): Promise<LeagueEvent[]>;
}
