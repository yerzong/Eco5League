/**
 * Contratos del servicio de equipos (SA-M04).
 */
export type TeamStatus = 'activo' | 'pendiente';

export interface Team {
  id: string;
  /** Iniciales del escudo (ej. "TO"). */
  initials: string;
  name: string;
  /** Organización o "Independiente". */
  org: string;
  status: TeamStatus;
  /** Texto de cupo (ej. "4 / 4 jugadores"). */
  playersLabel: string;
  /** Evento al que pertenece (para filtrar): "Copa T1", "Torneo #4", "T #5". */
  eventTag: string;
}

export interface TeamsService {
  getTeams(): Promise<Team[]>;
  /** Total de equipos registrados (puede exceder la página actual). */
  getRegisteredCount(): Promise<number>;
}
