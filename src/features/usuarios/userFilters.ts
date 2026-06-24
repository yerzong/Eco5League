/**
 * Búsqueda y filtrado de usuarios — función pura, sin UI.
 */
import type { AppUser } from '@/services';

/** Filtro activo por categoría de rol. */
export type UserFilterKey =
  | 'todos'
  | 'jugadores'
  | 'managers'
  | 'capitanes'
  | 'staff'
  | 'admins';

/** Roles que cubre cada filtro (por etiqueta de rol del usuario). */
const FILTER_ROLES: Record<Exclude<UserFilterKey, 'todos'>, string[]> = {
  jugadores: ['jugador'],
  managers: ['manager'],
  capitanes: ['capitán'],
  staff: ['staff'],
  admins: ['admin', 'super-admin'],
};

export function filterUsers(
  users: AppUser[],
  search: string,
  filter: UserFilterKey,
): AppUser[] {
  const q = search.trim().toLowerCase();
  return users.filter(u => {
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.roleLabel.toLowerCase().includes(q);

    const matchesFilter =
      filter === 'todos' ||
      FILTER_ROLES[filter].includes(u.roleLabel.toLowerCase());

    return matchesSearch && matchesFilter;
  });
}
