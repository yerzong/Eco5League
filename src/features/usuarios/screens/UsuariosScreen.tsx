/**
 * SAN ✦ Usuarios (gestión) — rediseño "glass", fiel a Figma (585:3591).
 * Header + búsqueda + toolbar (orden + filtros) + conteo + filas de usuario glass.
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
  GlassUserRow,
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
import { usersService, type AppUser, type UsersSummary } from '@/services';
import { filterUsers } from '../userFilters';

const role = (u: AppUser, label: string) => u.roleLabel === label;

const FILTER_GROUPS: FilterGroupDef<AppUser>[] = [
  {
    key: 'rol',
    label: 'ROL',
    options: [
      { key: 'jugador', label: 'Jugador', test: u => role(u, 'Jugador') },
      { key: 'manager', label: 'Manager', test: u => role(u, 'Manager') },
      { key: 'capitan', label: 'Capitán', test: u => role(u, 'Capitán') },
      { key: 'coach', label: 'Coach / Suplente', test: u => role(u, 'Coach') },
      { key: 'staff', label: 'Staff', test: u => role(u, 'Staff') },
      { key: 'admin', label: 'Admin', test: u => role(u, 'Admin') },
      { key: 'superadmin', label: 'Super-admin', test: u => role(u, 'Super-admin') },
      { key: 'visitante', label: 'Visitante', test: u => role(u, 'Visitante') },
    ],
  },
  {
    key: 'cuenta',
    label: 'ESTADO DE CUENTA',
    options: [
      { key: 'activo', label: 'Activo', test: u => u.status === 'activo' },
      { key: 'pendiente', label: 'Pendiente', test: u => u.status === 'pendiente' },
      { key: 'suspendido', label: 'Suspendido', test: u => u.status === 'suspendido' },
    ],
  },
  {
    key: 'xbox',
    label: 'VERIFICACIÓN XBOX',
    options: [
      { key: 'verificado', label: 'Verificado', test: u => u.verified },
      { key: 'sin', label: 'Sin verificar', test: u => !u.verified },
    ],
  },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'registro', label: 'Fecha de registro' },
  { key: 'rol', label: 'Rol' },
  { key: 'estado', label: 'Estado' },
];
const SORT_DIRECTIONS: [string, string] = ['↑ A → Z', '↓ Z → A'];
const SORT_PILL_DIR: [string, string] = ['A–Z', 'Z–A'];

export function UsuariosScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [search, setSearch] = useState('');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const loading = useTabLoading();

  useEffect(() => {
    usersService.getUsers().then(setUsers);
    usersService.getSummary().then(setSummary);
  }, []);

  const quick = useMemo(() => filterUsers(users, search, 'todos'), [users, search]);
  const base = useMemo(
    () => applyFilterGroups(quick, FILTER_GROUPS, advanced),
    [quick, advanced],
  );
  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre' ? [...base].sort((a, b) => a.name.localeCompare(b.name)) : base;
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const total = summary?.total ?? users.length;
  const verificados = filtered.filter(u => u.verified).length;

  if (loading) return <SkeletonList variant="user" />;

  return (
    <View style={styles.root}>
      <GlowBackground size={460} centerY={0.0} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerWrap}>
          <GlassScreenHeader
            title="Usuarios"
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <GlassSearch
            placeholder="Buscar por nombre, @usuario o correo…"
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
          <GlassCountRow
            count={filtered.length === total ? total : filtered.length}
            noun="usuarios"
            right={`${verificados} verificados`}
          />

          {filtered.length > 0 ? (
            <View style={styles.list}>
              {filtered.map(u => (
                <GlassUserRow
                  key={u.id}
                  initials={u.initials}
                  color={u.roleColor}
                  name={u.name}
                  verified={u.verified}
                  subtitle={u.username}
                  roleLabel={u.roleLabel}
                  roleColor={u.roleColor}
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
          itemNoun="USUARIOS"
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
    paddingBottom: 110,
    gap: 14,
  },
  list: { gap: 10 },

  empty: { alignItems: 'center', paddingVertical: 56, gap: 8 },
  emptyTitle: { fontFamily: fonts.glassBodySemibold, fontSize: 15, color: theme.colors.textOnGlass, marginTop: 4 },
  emptyText: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.textOnGlassDim, textAlign: 'center' },
});
