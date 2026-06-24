/**
 * SA-M04 · Equipos (gestión) — v2 rediseñado, fiel a Figma.
 * Header fijo (con total) + búsqueda + fila de controles (orden + filtros) +
 * chips + fila de conteo + lista de tarjetas de equipo. Funcional + vacío.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Txt,
  GlowBackground,
  ScreenHeader,
  SearchField,
  ControlsRow,
  CountRow,
  FilterPills,
  StatusPill,
  ActionLink,
  FilterSheet,
  SortSheet,
  Fab,
  SkeletonList,
  type FilterOption,
  type SortOption,
} from '@/design-system/components';
import { useTabLoading } from '@/shared/hooks/useTabLoading';
import { IconUsers, IconSearch } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import {
  applyFilterGroups,
  countSelected,
  type FilterGroupDef,
  type FilterSelection,
} from '@/shared/filters';
import { teamsService, type Team } from '@/services';
import { filterTeams, type TeamFilterKey } from '../teamFilters';

const FILTERS: FilterOption<TeamFilterKey>[] = [{ key: 'todos', label: 'Todos' }];

const STATUS = {
  activo: { label: 'Activo', color: theme.colors.accentGreen },
  pendiente: { label: 'Pendiente', color: theme.colors.accentAmber },
} as const;

/** ¿El roster está completo? ("4 / 4 jugadores" → 4 === 4). */
function isFullRoster(t: Team): boolean {
  const [a, b] = t.playersLabel.split('/').map(s => parseInt(s.trim(), 10));
  return Number.isFinite(a) && a === b;
}

const FILTER_GROUPS: FilterGroupDef<Team>[] = [
  {
    key: 'estado',
    label: 'ESTADO',
    options: [
      { key: 'activo', label: 'Activo', test: t => t.status === 'activo' },
      { key: 'pendiente', label: 'Pendiente', test: t => t.status === 'pendiente' },
      { key: 'suspendido', label: 'Suspendido', test: () => false },
    ],
  },
  {
    key: 'roster',
    label: 'ROSTER',
    options: [
      { key: 'completo', label: 'Completo', test: isFullRoster },
      { key: 'incompleto', label: 'Incompleto', test: t => !isFullRoster(t) },
    ],
  },
  {
    key: 'evento',
    label: 'EVENTO / TORNEO',
    options: [
      { key: 'copa', label: 'Copa ECO5 T1', test: t => t.eventTag === 'Copa T1' },
      { key: 'torneo', label: 'Torneo Relámpago #4', test: t => t.eventTag === 'Torneo #4' },
      { key: 'temporada', label: 'Temporada 5', test: t => t.eventTag === 'T #5' },
    ],
  },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'jugadores', label: 'Nº de jugadores' },
  { key: 'estado', label: 'Estado' },
];
const SORT_DIRECTIONS: [string, string] = ['↑ A → Z', '↓ Z → A'];
const SORT_PILL_DIR: [string, string] = ['A–Z', 'Z–A'];

export function EquiposScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TeamFilterKey>('todos');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const loading = useTabLoading();

  useEffect(() => {
    teamsService.getTeams().then(setTeams);
    teamsService.getRegisteredCount().then(setTotal);
  }, []);

  const quick = useMemo(
    () => filterTeams(teams, search, filter),
    [teams, search, filter],
  );
  const base = useMemo(
    () => applyFilterGroups(quick, FILTER_GROUPS, advanced),
    [quick, advanced],
  );
  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre' ? [...base].sort((a, b) => a.name.localeCompare(b.name)) : base;
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const activos = filtered.filter(t => t.status === 'activo').length;
  const pendientes = filtered.length - activos;

  if (loading) return <SkeletonList variant="team" />;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader
          eyebrow="// Gestión de equipos"
          title="Equipos"
          meta={total ? `${total} registrados` : undefined}
          initials={initials}
          onNotifications={() => navigation.navigate('Notificaciones')}
          onProfile={() => navigation.navigate('Perfil')}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SearchField placeholder="Buscar equipo..." value={search} onChangeText={setSearch} height={52} />
          <ControlsRow
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Nombre'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} round />
          <CountRow
            left={`Mostrando ${filtered.length} de ${total || filtered.length}`}
            right={`${activos} activos · ${pendientes} ${pendientes === 1 ? 'pendiente' : 'pendientes'}`}
          />

          {filtered.length > 0 ? (
            <View style={styles.list}>
              {filtered.map(t => (
                <TeamCard key={t.id} team={t} />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <IconSearch size={32} color={theme.colors.textTertiary} strokeWidth={1.5} />
              <Txt variant="bodyMedium" color="textSecondary" style={styles.emptyTitle}>
                Sin resultados
              </Txt>
              <Txt variant="caption" color="textTertiary" style={styles.emptyText}>
                Prueba con otro término o cambia el filtro.
              </Txt>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <Fab style={styles.fab} onPress={() => {}} />

      {filtersOpen ? (
        <FilterSheet
          groups={FILTER_GROUPS}
          initial={advanced}
          itemNoun="EQUIPOS"
          computeCount={sel => applyFilterGroups(quick, FILTER_GROUPS, sel).length}
          onApply={setAdvanced}
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
    </View>
  );
}

/** Tarjeta de un equipo. */
function TeamCard({ team }: { team: Team }) {
  const status = STATUS[team.status];
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: status.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.header}>
          <View style={styles.crest}>
            <Txt style={styles.crestText}>{team.initials}</Txt>
          </View>
          <View style={styles.nameCol}>
            <Txt style={styles.name} numberOfLines={1}>
              {team.name}
            </Txt>
            <Txt style={styles.org} numberOfLines={1}>
              {team.org}
            </Txt>
          </View>
          <StatusPill label={status.label} color={status.color} dot round />
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.players}>
            <IconUsers size={14} color={status.color} strokeWidth={2} />
            <Txt style={[styles.playersText, { color: status.color }]}>
              {team.playersLabel}
            </Txt>
          </View>
          <ActionLink label="Ver equipo" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  list: { gap: theme.spacing.md },

  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: theme.colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    overflow: 'hidden',
  },
  accent: { width: 4 },
  cardBody: { flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  crest: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1.5,
    borderColor: theme.colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: { fontFamily: fonts.headingBold, fontSize: 16, color: theme.colors.textSecondary },
  nameCol: { flex: 1, gap: 2 },
  name: { fontFamily: fonts.headingBold, fontSize: 18, letterSpacing: 0.18, color: theme.colors.textPrimary },
  org: { fontFamily: fonts.body, fontSize: 13, color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: theme.colors.borderDefault },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  players: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  playersText: { fontFamily: fonts.label, fontSize: 13 },

  empty: { alignItems: 'center', paddingVertical: theme.spacing['4xl'], gap: theme.spacing.sm },
  emptyTitle: { marginTop: theme.spacing.sm },
  emptyText: { textAlign: 'center' },

  fab: { position: 'absolute', right: theme.spacing['2xl'], bottom: theme.spacing['2xl'] },
});
