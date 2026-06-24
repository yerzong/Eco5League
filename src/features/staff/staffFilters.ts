/**
 * Búsqueda + filtrado de staff — función pura, sin UI.
 */
import type { StaffMember } from '@/services';

/** Filtro activo: todos o por rol. */
export type StaffFilterKey = 'todos' | 'caster' | 'streamer' | 'moderador';

/** Etiqueta de rol asociada a cada clave de filtro. */
const FILTER_ROLE: Record<Exclude<StaffFilterKey, 'todos'>, string> = {
  caster: 'caster',
  streamer: 'streamer',
  moderador: 'moderador',
};

export function filterStaff(
  staff: StaffMember[],
  search: string,
  filter: StaffFilterKey,
): StaffMember[] {
  const q = search.trim().toLowerCase();
  return staff.filter(m => {
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.scope.toLowerCase().includes(q) ||
      m.roles.some(r => r.label.toLowerCase().includes(q));

    const matchesFilter =
      filter === 'todos' ||
      m.roles.some(r => r.label.toLowerCase() === FILTER_ROLE[filter]);

    return matchesSearch && matchesFilter;
  });
}
