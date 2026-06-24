/**
 * Búsqueda + filtrado de equipos — función pura, sin UI.
 */
import type { Team } from '@/services';

/** Filtro activo: todos o por evento. */
export type TeamFilterKey = 'todos' | 'copa_t1' | 'torneo_4' | 't_5';

/** Etiqueta de evento asociada a cada clave de filtro. */
const FILTER_EVENT: Record<Exclude<TeamFilterKey, 'todos'>, string> = {
  copa_t1: 'Copa T1',
  torneo_4: 'Torneo #4',
  t_5: 'T #5',
};

export function filterTeams(
  teams: Team[],
  search: string,
  filter: TeamFilterKey,
): Team[] {
  const q = search.trim().toLowerCase();
  return teams.filter(t => {
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.org.toLowerCase().includes(q);

    const matchesFilter =
      filter === 'todos' || t.eventTag === FILTER_EVENT[filter];

    return matchesSearch && matchesFilter;
  });
}
