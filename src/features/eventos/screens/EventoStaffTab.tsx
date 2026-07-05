/**
 * EV ✦ Tab "Staff" de la gestión de evento (Figma 642:3694).
 * Búsqueda + toolbar (orden/filtros) + contador + lista de staff.
 * Mismo patrón que EventoEquiposTab.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GlassSearch,
  GlassToolbar,
  GlassCountRow,
  GlassStaffRow,
  FilterSheet,
  SortSheet,
  ConfirmModal,
  type SortOption,
} from '@/design-system/components';
import { IconSearch } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';
import { eventsService, type EventStaff, type LeagueEvent } from '@/services';
import {
  applyFilterGroups,
  countSelected,
  type FilterGroupDef,
  type FilterSelection,
} from '@/shared/filters';

/* ─────────────────── Filtros ─────────────────── */

const FILTER_GROUPS: FilterGroupDef<EventStaff>[] = [
  {
    key: 'subrol',
    label: 'SUB-ROL',
    options: [
      { key: 'admin',       label: 'Admin',       test: s => s.subRole.toLowerCase().includes('admin')        },
      { key: 'arbitro',     label: 'Árbitro',     test: s => s.subRole.toLowerCase().includes('árbitro')      },
      { key: 'caster',      label: 'Caster',      test: s => s.subRole.toLowerCase().includes('caster')       },
      { key: 'streamer',    label: 'Streamer',     test: s => s.subRole.toLowerCase().includes('streamer')     },
      { key: 'coordinador', label: 'Coordinador', test: s => s.subRole.toLowerCase().includes('coordinador')  },
    ],
  },
  {
    key: 'estado',
    label: 'ESTADO',
    options: [
      { key: 'active',   label: 'Activo',   test: s => s.status === 'active'   },
      { key: 'inactive', label: 'Inactivo', test: s => s.status === 'inactive' },
    ],
  },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'nombre',  label: 'Nombre'  },
  { key: 'subrol',  label: 'Sub-rol' },
];
const SORT_DIRECTIONS: [string, string] = ['↓ A–Z', '↑ Z–A'];
const SORT_PILL_DIR: [string, string]   = ['A–Z', 'Z–A'];

/* ─────────────────── Props ─────────────────── */

interface EventoStaffTabProps {
  event: LeagueEvent | null;
  /** Incrementar para forzar re-fetch del staff (ej. tras agregar uno nuevo). */
  refreshKey?: number;
}

/* ─────────────────── Componente ─────────────────── */

export function EventoStaffTab({ event, refreshKey }: EventoStaffTabProps) {
  const [staff, setStaff]               = useState<EventStaff[]>([]);
  const [search, setSearch]             = useState('');
  const [advanced, setAdvanced]         = useState<FilterSelection>({});
  const [sortBy, setSortBy]             = useState('nombre');
  const [sortDir, setSortDir]           = useState<0 | 1>(0);
  const [sortOpen, setSortOpen]         = useState(false);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<EventStaff | null>(null);

  useEffect(() => {
    if (!event) return;
    eventsService.getEventStaff(event.id).then(setStaff);
  }, [event, refreshKey]);

  /* ─── Pipeline de filtrado ─── */

  const searched = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return staff;
    return staff.filter(
      s => s.name.toLowerCase().includes(q) || s.subRole.toLowerCase().includes(q),
    );
  }, [staff, search]);

  const base = useMemo(
    () => applyFilterGroups(searched, FILTER_GROUPS, advanced),
    [searched, advanced],
  );

  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre'
        ? [...base].sort((a, b) => a.name.localeCompare(b.name))
        : [...base].sort((a, b) => a.subRole.localeCompare(b.subRole));
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const isEmpty = filtered.length === 0;

  /* ─── Eliminar staff ─── */

  async function handleConfirmRemove() {
    if (!event || !staffToRemove) return;
    await eventsService.removeEventStaff(event.id, staffToRemove.id);
    setStaff(prev => prev.filter(s => s.id !== staffToRemove.id));
    setStaffToRemove(null);
  }

  /* ─── Render ─── */

  return (
    <View style={styles.root}>
      <GlassSearch
        placeholder="Buscar staff…"
        value={search}
        onChangeText={setSearch}
      />

      <GlassToolbar
        sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Nombre'}
        sortValue={SORT_PILL_DIR[sortDir]}
        onSort={() => setSortOpen(true)}
        filtersCount={countSelected(advanced)}
        onFilters={() => setFiltersOpen(true)}
      />

      {isEmpty ? (
        <View style={styles.empty}>
          <IconSearch size={30} color={theme.colors.textOnGlassFaint} strokeWidth={1.5} />
          <Txt style={styles.emptyTitle}>Sin staff</Txt>
          <Txt style={styles.emptyText}>Prueba con otro término o ajusta los filtros.</Txt>
        </View>
      ) : (
        <View style={styles.section}>
          <GlassCountRow count={filtered.length} noun="staff" />
          <View style={styles.list}>
            {filtered.map(s => (
              <GlassStaffRow
                key={s.id}
                initials={s.initials}
                color={s.color}
                name={s.name}
                subtitle={s.subRole}
                onRemove={() => setStaffToRemove(s)}
              />
            ))}
          </View>
        </View>
      )}

      {filtersOpen ? (
        <FilterSheet
          groups={FILTER_GROUPS}
          initial={advanced}
          itemNoun="staff"
          computeCount={sel => applyFilterGroups(searched, FILTER_GROUPS, sel).length}
          onApply={sel => { setAdvanced(sel); setFiltersOpen(false); }}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}

      {sortOpen ? (
        <SortSheet
          options={SORT_OPTIONS}
          directions={SORT_DIRECTIONS}
          initialCriteria={sortBy}
          initialDir={sortDir}
          onApply={(c, d) => { setSortBy(c); setSortDir(d); }}
          onClose={() => setSortOpen(false)}
        />
      ) : null}

      <ConfirmModal
        visible={staffToRemove !== null}
        title="¿Remover del staff?"
        body={staffToRemove ? `${staffToRemove.name} dejará de ser parte del staff de este evento.` : ''}
        cancelLabel="Cancelar"
        confirmLabel="Remover"
        onCancel={() => setStaffToRemove(null)}
        onConfirm={handleConfirmRemove}
      />
    </View>
  );
}

/* ─────────────────── Styles ─────────────────── */

const styles = StyleSheet.create({
  root: { gap: 14 },
  section: { gap: 10 },
  list: { gap: 10 },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyTitle: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 15,
    color: theme.colors.textOnGlass,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: theme.colors.textOnGlassDim,
    textAlign: 'center',
  },
});
