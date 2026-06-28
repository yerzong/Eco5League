/**
 * SAN ✦ Equipos (gestión) — rediseño "glass", fiel a Figma (584:3487).
 * Header + búsqueda + toolbar (orden + filtros) + conteo + lista de filas glass.
 * Orden y filtros funcionales (sheets).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Txt,
  GlowBackground,
  GlassScreenHeader,
  GlassSearch,
  GlassToolbar,
  GlassCountRow,
  GlassTeamRow,
  FilterSheet,
  SortSheet,
  SkeletonList,
  type SortOption,
} from '@/design-system/components';
import { useTabLoading } from '@/shared/hooks/useTabLoading';
import { IconSearch } from '@/design-system/icons';
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
import { filterTeams } from '../teamFilters';

/** Estado → color (glass). */
const STATUS_COLOR = {
  activo: '#34d77f',
  pendiente: '#f6a623',
} as const;

/** ¿El roster está completo? ("4 / 4 jugadores" → 4 === 4). */
function isFullRoster(t: Team): boolean {
  const [a, b] = t.playersLabel.split('/').map(s => parseInt(s.trim(), 10));
  return Number.isFinite(a) && a === b;
}

/** Roster compacto para el subtítulo (ej. "4 / 4 jugadores" → "4/4"). */
function rosterShort(playersLabel: string): string {
  const [a, b] = playersLabel.split('/').map(s => parseInt(s.trim(), 10));
  return Number.isFinite(a) && Number.isFinite(b) ? `${a}/${b} roster` : playersLabel;
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
  const [search, setSearch] = useState('');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const loading = useTabLoading();

  useEffect(() => {
    teamsService.getTeams().then(setTeams);
  }, []);

  const quick = useMemo(() => filterTeams(teams, search, 'todos'), [teams, search]);
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
      <GlowBackground size={460} centerY={0.0} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerWrap}>
          <GlassScreenHeader
            title="Equipos"
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <GlassSearch placeholder="Buscar equipo u organización…" value={search} onChangeText={setSearch} />
          <GlassToolbar
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Nombre'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />
          <GlassCountRow
            count={filtered.length}
            noun="equipos"
            right={`${activos} activos · ${pendientes} ${pendientes === 1 ? 'pendiente' : 'pendientes'}`}
          />

          {filtered.length > 0 ? (
            <View style={styles.list}>
              {filtered.map(t => (
                <GlassTeamRow
                  key={t.id}
                  initials={t.initials}
                  color={theme.colors.redSoft}
                  name={t.name}
                  subtitle={`${t.org} · ${rosterShort(t.playersLabel)}`}
                  statusColor={STATUS_COLOR[t.status]}
                />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <IconSearch size={32} color={theme.colors.textOnGlassFaint} strokeWidth={1.5} />
              <Txt style={styles.emptyTitle}>Sin resultados</Txt>
              <Txt style={styles.emptyText}>Prueba con otro término o ajusta los filtros.</Txt>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  safe: { flex: 1 },
  headerWrap: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
    gap: 14,
  },
  list: { gap: 10 },

  empty: { alignItems: 'center', paddingVertical: 56, gap: 8 },
  emptyTitle: { fontFamily: fonts.glassBodySemibold, fontSize: 15, color: theme.colors.textOnGlass, marginTop: 4 },
  emptyText: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.textOnGlassDim, textAlign: 'center' },
});
