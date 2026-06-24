/**
 * SA-M03 · Staff (gestión) — v2 rediseñado, fiel a Figma.
 * Header fijo + búsqueda + fila de controles (orden + filtros) + chips por rol
 * + fila de conteo + lista de tarjetas de staff. Funcional + estado vacío.
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
  Avatar,
  StatusPill,
  ActionLink,
  FilterSheet,
  SortSheet,
  Fab,
  type FilterOption,
  type SortOption,
} from '@/design-system/components';
import { IconCalendar, IconSearch } from '@/design-system/icons';
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
import { filterStaff, type StaffFilterKey } from '../staffFilters';

const FILTERS: FilterOption<StaffFilterKey>[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'caster', label: 'Caster' },
  { key: 'streamer', label: 'Streamer' },
  { key: 'moderador', label: 'Moderador' },
];

const STATUS = {
  activo: { label: 'Activo', color: theme.colors.accentGreen },
  inactivo: { label: 'Inactivo', color: theme.colors.textTertiary },
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
  const [filter, setFilter] = useState<StaffFilterKey>('todos');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    staffService.getStaff().then(setStaff);
  }, []);

  const quick = useMemo(
    () => filterStaff(staff, search, filter),
    [staff, search, filter],
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

  const activos = filtered.filter(m => m.status === 'activo').length;
  const inactivos = filtered.length - activos;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader
          eyebrow="// Gestión de staff"
          title="Staff"
          initials={initials}
          onNotifications={() => navigation.navigate('Notificaciones')}
          onProfile={() => navigation.navigate('Perfil')}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SearchField placeholder="Buscar staff..." value={search} onChangeText={setSearch} height={52} />
          <ControlsRow
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Nombre'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} round />
          <CountRow
            left={`Mostrando ${filtered.length} de ${staff.length}`}
            right={`${activos} activos · ${inactivos} ${inactivos === 1 ? 'inactivo' : 'inactivos'}`}
          />

          {filtered.length > 0 ? (
            <View style={styles.list}>
              {filtered.map(m => (
                <StaffCard key={m.id} member={m} />
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

/** Tarjeta de un miembro del staff. */
function StaffCard({ member }: { member: StaffMember }) {
  const status = STATUS[member.status];
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar
          initials={member.initials}
          color={member.color}
          size={48}
          font="body"
          style={{ borderWidth: 1.5, borderColor: member.color }}
        />
        <View style={styles.nameCol}>
          <Txt style={styles.name} numberOfLines={1}>
            {member.name}
          </Txt>
          <View style={styles.roles}>
            {member.roles.map(r => (
              <StatusPill key={r.label} label={r.label} color={r.color} />
            ))}
          </View>
        </View>
        <StatusPill label={status.label} color={status.color} dot round />
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.scope}>
          <IconCalendar size={13} color={theme.colors.textTertiary} strokeWidth={2} />
          <Txt style={styles.scopeText} numberOfLines={1}>
            {member.scope}
          </Txt>
        </View>
        <ActionLink label="Gestionar" />
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
    backgroundColor: theme.colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  nameCol: { flex: 1, gap: 6 },
  name: { fontFamily: fonts.label, fontSize: 16, color: theme.colors.textPrimary },
  roles: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  divider: { height: 1, backgroundColor: theme.colors.borderDefault },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scope: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 },
  scopeText: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary },

  empty: { alignItems: 'center', paddingVertical: theme.spacing['4xl'], gap: theme.spacing.sm },
  emptyTitle: { marginTop: theme.spacing.sm },
  emptyText: { textAlign: 'center' },

  fab: { position: 'absolute', right: theme.spacing['2xl'], bottom: theme.spacing['2xl'] },
});
