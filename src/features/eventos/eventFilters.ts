/**
 * Lógica de búsqueda y filtrado de eventos — función pura, sin UI.
 * Separada de la pantalla para mantenerla simple y poder probarla aparte.
 */
import type { LeagueEvent } from '@/services';
import type { EventFormat } from '@/shared/events/status';

/** Filtro activo: todos, un formato (liga/torneo/copa) o "en curso". */
export type EventFilterKey = 'todos' | EventFormat | 'en_curso';

/** Aplica búsqueda de texto + filtro a la lista de eventos. */
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
      filter === 'todos'
        ? true
        : filter === 'en_curso'
          ? e.status === 'en_curso'
          : e.format === filter;

    return matchesSearch && matchesFilter;
  });
}
