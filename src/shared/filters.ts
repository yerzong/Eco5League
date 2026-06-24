/**
 * Lógica genérica de filtros multi-grupo — pura, sin UI.
 * Un ítem pasa si, para CADA grupo con selección, cumple ALGUNA de sus
 * opciones seleccionadas (AND entre grupos, OR dentro de cada grupo).
 */

export interface FilterOptionDef<T> {
  key: string;
  label: string;
  /** Predicado: ¿el ítem cumple esta opción? */
  test: (item: T) => boolean;
}

export interface FilterGroupDef<T> {
  key: string;
  label: string;
  options: FilterOptionDef<T>[];
}

/** Selección activa: claves de opción por clave de grupo. */
export type FilterSelection = Record<string, string[]>;

export function applyFilterGroups<T>(
  items: T[],
  groups: FilterGroupDef<T>[],
  selection: FilterSelection,
): T[] {
  return items.filter(item =>
    groups.every(group => {
      const selected = selection[group.key] ?? [];
      if (selected.length === 0) return true;
      return group.options.some(o => selected.includes(o.key) && o.test(item));
    }),
  );
}

/** Nº total de opciones seleccionadas (para el badge de "Filtros"). */
export function countSelected(selection: FilterSelection): number {
  return Object.values(selection).reduce((n, arr) => n + arr.length, 0);
}

/** Alterna una opción dentro de su grupo, devolviendo una nueva selección. */
export function toggleSelection(
  selection: FilterSelection,
  groupKey: string,
  optionKey: string,
): FilterSelection {
  const current = selection[groupKey] ?? [];
  const next = current.includes(optionKey)
    ? current.filter(k => k !== optionKey)
    : [...current, optionKey];
  return { ...selection, [groupKey]: next };
}
