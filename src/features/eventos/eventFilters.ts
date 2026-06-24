/**
 * Búsqueda y filtrado de eventos — función pura, sin UI.
 * El filtro v2 es por estado (Todos / En curso / Inscripciones / Finalizados).
 */
import type { LeagueEvent } from '@/services';
import type { EventStatus } from '@/shared/events/status';

/** Filtro activo por estado. */
export type EventFilterKey = 'todos' | 'en_curso' | 'inscripcion' | 'finalizado';

export function filterEvents(
  events: LeagueEvent[],
  search: string,
  filter: EventFilterKey,
): LeagueEvent[] {
  const q = search.trim().toLowerCase();
  return events.filter(e => {
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.game.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q);

    const matchesFilter =
      filter === 'todos' || e.status === (filter as EventStatus);

    return matchesSearch && matchesFilter;
  });
}
