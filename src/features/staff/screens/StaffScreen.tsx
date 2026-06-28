/**
 * SAN ✦ Staff (gestión) — rediseño "glass", fiel a Figma (581:3408).
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
  GlassStaffRow,
  FilterSheet,
  SortSheet,
  Fab,
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
import { staffService, type StaffMember } from '@/services';
import { filterStaff } from '../staffFilters';

/** Estado → etiqueta + color (glass). */
const STATUS = {
  activo: { label: 'Activo', color: '#34d77f' },
  inactivo: { label: 'Inactivo', color: theme.colors.textOnGlassFaint },
} as const;

/** ¿El staff tiene alguno de estos roles? */
const hasRole = (m: StaffMember, ...labels: string[]) =>
  m.roles.some(r => labels.includes(r.label));

const FILTER_GROUPS: FilterGroupDef<StaffMember>[] = [
  {
    key: 'subrol',
    label: 'SUB-ROL',
    options: [
      { key: 'caster', label: 'Caster', test: m => hasRole(m, 'Caster') },
      { key: 'streamer', label: 'Streamer', test: m => hasRole(m, 'Streamer') },
      { key: 'moderador', label: 'Moderador / árbitro', test: m => hasRole(m, 'Moderador', 'Árbitro') },
      { key: 'disenador', label: 'Diseñador', test: m => hasRole(m, 'Diseñador') },
      { key: 'redes', label: 'Redes sociales', test: m => hasRole(m, 'Redes') },
      { key: 'observer', label: 'Observer / producción', test: m => hasRole(m, 'Observer') },
      { key: 'coordinador', label: 'Coordinador general', test: () => false },
    ],
  },
  {
    key: 'estado',
    label: 'ESTADO',
    options: [
      { key: 'activo', label: 'Activo', test: m => m.status === 'activo' },
      { key: 'inactivo', label: 'Inactivo', test: m => m.status === 'inactivo' },
    ],
  },
  {
    key: 'alcance',
    label: 'ALCANCE',
    options: [
      { key: 'todos', label: 'Todos los eventos', test: m => m.scope === 'Todos los eventos' },
      { key: 'por_evento', label: 'Por evento', test: m => m.scope !== 'Todos los eventos' },
    ],
  },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'alta', label: 'Fecha de alta' },
  { key: 'rol', label: 'Rol' },
  { key: 'estado', label: 'Estado' },
];
const SORT_DIRECTIONS: [string, string] = ['↑ A → Z', '↓ Z → A'];
const SORT_PILL_DIR: [string, string] = ['A–Z', 'Z–A'];

export function StaffScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState('');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const loading = useTabLoading();

  useEffect(() => {
    staffService.getStaff().then(setStaff);
  }, []);

  const quick = useMemo(() => filterStaff(staff, search, 'todos'), [staff, search]);
  const base = useMemo(
    () => applyFilterGroups(quick, FILTER_GROUPS, advanced),
    [quick, advanced],
  );
  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre' ? [...base].sort((a, b) => a.name.localeCompare(b.name)) : base;
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const activos = filtered.filter(m => m.status === 'activo').length;
  const inactivos = filtered.length - activos;

  if (loading) return <SkeletonList variant="staff" />;

  return (
    <View style={styles.root}>
      <GlowBackground size={460} centerY={0.0} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerWrap}>
          <GlassScreenHeader
            title="Staff"
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <GlassSearch placeholder="Buscar staff…" value={search} onChangeText={setSearch} />
          <GlassToolbar
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Nombre'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />
          <GlassCountRow
            count={filtered.length}
            noun="staff"
            right={`${activos} activos · ${inactivos} ${inactivos === 1 ? 'inactivo' : 'inactivos'}`}
          />

          {filtered.length > 0 ? (
            <View style={styles.list}>
              {filtered.map(m => {
                const st = STATUS[m.status];
                return (
                  <GlassStaffRow
                    key={m.id}
                    initials={m.initials}
                    color={m.color}
                    name={m.name}
                    subtitle={m.roles.map(r => r.label).join(' · ')}
                    statusLabel={st.label}
                    statusColor={st.color}
                  />
                );
              })}
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

      <Fab style={styles.fab} onPress={() => {}} />

      {filtersOpen ? (
        <FilterSheet
          groups={FILTER_GROUPS}
          initial={advanced}
          itemNoun="RESULTADOS"
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

  fab: { position: 'absolute', right: theme.spacing['2xl'], bottom: theme.spacing['2xl'] },
});
