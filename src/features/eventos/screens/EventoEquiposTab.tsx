/**
 * EV ✦ Tab "Equipos" de la gestión de evento (Figma 641:3602).
 * Búsqueda + toolbar (orden/filtros) + sección "Por aprobar" + sección "Activos".
 * Se monta dentro del ScrollView de EventoGestionScreen — no agrega su propio scroll.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GlassSearch,
  GlassToolbar,
  GlassSectionHeader,
  GlassTeamRow,
  EventoPendingTeamCard,
  FilterSheet,
  SortSheet,
  type SortOption,
} from '@/design-system/components';
import { IconSearch } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';
import { eventsService, type LeagueEvent, type EventTeam } from '@/services';
import {
  applyFilterGroups,
  countSelected,
  type FilterGroupDef,
  type FilterSelection,
} from '@/shared/filters';
import { AprobarEquipoSheet } from './AprobarEquipoSheet';
import { RechazarEquipoSheet } from './RechazarEquipoSheet';

/* ─────────────────── Filtros ─────────────────── */

const FILTER_GROUPS: FilterGroupDef<EventTeam>[] = [
  {
    key: 'estado',
    label: 'ESTADO',
    options: [
      { key: 'pending', label: 'Por aprobar', test: t => t.status === 'pending' },
      { key: 'active',  label: 'Activo',      test: t => t.status === 'active'  },
    ],
  },
  {
    key: 'roster',
    label: 'ROSTER',
    options: [
      { key: 'completo',   label: 'Completo',   test: t => t.rosterCurrent === t.rosterMax },
      { key: 'incompleto', label: 'Incompleto', test: t => t.rosterCurrent < t.rosterMax   },
    ],
  },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'estado', label: 'Estado' },
];
const SORT_DIRECTIONS: [string, string] = ['↓ A–Z', '↑ Z–A'];
const SORT_PILL_DIR: [string, string] = ['A–Z', 'Z–A'];

/* ─────────────────── Componente ─────────────────── */

interface EventoEquiposTabProps {
  event: LeagueEvent | null;
  onTeamDetail?: (team: EventTeam) => void;
}

export function EventoEquiposTab({ event, onTeamDetail }: EventoEquiposTabProps) {
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [search, setSearch] = useState('');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Modales de acción */
  const [approveTeam, setApproveTeam] = useState<EventTeam | null>(null); // tap "✓ Aprobar"
  const [rejectTeam, setRejectTeam]   = useState<EventTeam | null>(null); // tap "✕ Rechazar"

  useEffect(() => {
    if (!event) return;
    eventsService.getEventTeams(event.id).then(setTeams);
  }, [event]);

  /* ─── Handlers ─── */

  function find(id: string) { return teams.find(x => x.id === id) ?? null; }

  function confirmApprove(id: string) {
    setTeams(prev => prev.map(t => (t.id === id ? { ...t, status: 'active' as const } : t)));
  }

  function confirmReject(id: string) {
    setTeams(prev => prev.filter(t => t.id !== id));
  }

  /* ─── Pipeline de filtrado ─── */

  const searched = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return teams;
    return teams.filter(
      t => t.name.toLowerCase().includes(q) || t.org.toLowerCase().includes(q),
    );
  }, [teams, search]);

  const base = useMemo(
    () => applyFilterGroups(searched, FILTER_GROUPS, advanced),
    [searched, advanced],
  );

  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre'
        ? [...base].sort((a, b) => a.name.localeCompare(b.name))
        : base;
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const pending = filtered.filter(t => t.status === 'pending');
  const active  = filtered.filter(t => t.status === 'active');
  const isEmpty = pending.length === 0 && active.length === 0;

  /* ─── Render ─── */

  return (
    <View style={styles.root}>
      <GlassSearch
        placeholder="Buscar equipo…"
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
          <Txt style={styles.emptyTitle}>Sin equipos</Txt>
          <Txt style={styles.emptyText}>Prueba con otro término o ajusta los filtros.</Txt>
        </View>
      ) : (
        <>
          {pending.length > 0 ? (
            <View style={styles.section}>
              <GlassSectionHeader label={`POR APROBAR · ${pending.length}`} />
              <View style={styles.list}>
                {pending.map(t => (
                  <EventoPendingTeamCard
                    key={t.id}
                    initials={t.initials}
                    color={t.color}
                    name={t.name}
                    subtitle={`${t.org} · ${t.rosterCurrent}/${t.rosterMax} roster`}
                    onPress={() => { const t2 = find(t.id); if (t2 && onTeamDetail) onTeamDetail(t2); }}
                    onApprove={() => setApproveTeam(find(t.id))}
                    onReject={() => setRejectTeam(find(t.id))}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {active.length > 0 ? (
            <View style={styles.section}>
              <GlassSectionHeader label={`ACTIVOS · ${active.length}`} />
              <View style={styles.list}>
                {active.map(t => (
                  <GlassTeamRow
                    key={t.id}
                    initials={t.initials}
                    color={t.color}
                    name={t.name}
                    subtitle={`${t.org} · ${t.rosterCurrent}/${t.rosterMax} roster`}
                    statusColor="#34d77f"
                    onPress={() => { const t2 = find(t.id); if (t2 && onTeamDetail) onTeamDetail(t2); }}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </>
      )}

      {/* Sheets de orden y filtros */}
      {filtersOpen ? (
        <FilterSheet
          groups={FILTER_GROUPS}
          initial={advanced}
          itemNoun="equipos"
          computeCount={sel => applyFilterGroups(searched, FILTER_GROUPS, sel).length}
          onApply={sel => {
            setAdvanced(sel);
            setFiltersOpen(false);
          }}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}

      {sortOpen ? (
        <SortSheet
          options={SORT_OPTIONS}
          directions={SORT_DIRECTIONS}
          initialCriteria={sortBy}
          initialDir={sortDir}
          onApply={(c, d) => {
            setSortBy(c);
            setSortDir(d);
          }}
          onClose={() => setSortOpen(false)}
        />
      ) : null}

      {/* Sheet confirmación de aprobación */}
      {approveTeam ? (
        <AprobarEquipoSheet
          team={approveTeam}
          onConfirm={id => { confirmApprove(id); setApproveTeam(null); }}
          onClose={() => setApproveTeam(null)}
        />
      ) : null}

      {/* Sheet de rechazo */}
      {rejectTeam ? (
        <RechazarEquipoSheet
          team={rejectTeam}
          onConfirm={(id) => { confirmReject(id); setRejectTeam(null); }}
          onClose={() => setRejectTeam(null)}
        />
      ) : null}
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
