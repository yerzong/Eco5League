/**
 * SA-M07 · Usuarios (gestión) — fiel al diseño v2 de Figma.
 * Header fijo (eyebrow + título + total + campana/avatar) + búsqueda + controles
 * (orden + filtros) + chips de rol redondeados + conteo + filas de usuario.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  FilterSheet,
  SortSheet,
  Avatar,
  type FilterOption,
  type SortOption,
} from '@/design-system/components';
import { IconChevronRight, IconSearch } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import {
  applyFilterGroups,
  countSelected,
  type FilterGroupDef,
  type FilterSelection,
} from '@/shared/filters';
import { usersService, type AppUser, type UserStatus, type UsersSummary } from '@/services';
import { filterUsers, type UserFilterKey } from '../userFilters';

const FILTERS: FilterOption<UserFilterKey>[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'jugadores', label: 'Jugadores' },
  { key: 'managers', label: 'Managers' },
  { key: 'capitanes', label: 'Capitanes' },
  { key: 'staff', label: 'Staff' },
  { key: 'admins', label: 'Admins' },
];

const STATUS: Record<UserStatus, { label: string; color: string }> = {
  activo: { label: 'Activo', color: theme.colors.success },
  pendiente: { label: 'Pendiente', color: theme.colors.warning },
  suspendido: { label: 'Suspendido', color: theme.colors.danger },
};

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
  const [filter, setFilter] = useState<UserFilterKey>('todos');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    usersService.getUsers().then(setUsers);
    usersService.getSummary().then(setSummary);
  }, []);

  const quick = useMemo(
    () => filterUsers(users, search, filter),
    [users, search, filter],
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

  const total = summary?.total ?? users.length;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader
          eyebrow="// Gestión de usuarios"
          title="Usuarios"
          meta={total ? `${total} registrados` : undefined}
          initials={initials}
          onNotifications={() => navigation.navigate('Notificaciones')}
          onProfile={() => navigation.navigate('Perfil')}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SearchField
            placeholder="Buscar por nombre, @usuario o correo…"
            value={search}
            onChangeText={setSearch}
            height={52}
          />
          <ControlsRow
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Nombre'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} round />
          <CountRow
            left={`Mostrando ${filtered.length} de ${total}`}
            right={
              summary ? `${summary.activos} activos · ${summary.pendientes} pendientes` : undefined
            }
          />

          {filtered.length > 0 ? (
            <View style={styles.list}>
              {filtered.map(u => (
                <UserRow key={u.id} user={u} />
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

/** Fila de un usuario. */
function UserRow({ user }: { user: AppUser }) {
  const status = STATUS[user.status];
  return (
    <Pressable style={styles.row}>
      <Avatar initials={user.initials} color={user.avatarColor} size={40} solid font="body" />
      <View style={styles.rowBody}>
        <View style={styles.rowLine}>
          <Txt style={styles.name} numberOfLines={1}>
            {user.name}
          </Txt>
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: user.roleColor + '29', borderColor: user.roleColor + '66' },
            ]}>
            <Txt style={[styles.roleText, { color: user.roleColor }]} numberOfLines={1}>
              {user.roleLabel}
            </Txt>
          </View>
        </View>
        <View style={styles.rowLine}>
          <Txt style={styles.username}>{user.username}</Txt>
          <View style={styles.statusWrap}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Txt style={[styles.statusText, { color: status.color }]}>{status.label}</Txt>
          </View>
        </View>
      </View>
      <View style={styles.rowRight}>
        <Txt style={styles.since}>{user.since}</Txt>
        <IconChevronRight size={18} color={theme.colors.textTertiary} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },

  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: 110,
    gap: theme.spacing.lg,
  },
  list: { gap: theme.spacing.sm },

  // User row (fiel a Figma: superficie hundida + borde sutil)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 11,
  },
  rowBody: { flex: 1, gap: 2 },
  rowLine: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  // lineHeight fijo (cajas de 17 y 15px en Figma) para que la separación
  // nombre/@usuario sea fiel y no la infle el line-height por defecto de RN.
  name: { fontFamily: fonts.label, fontSize: 14, lineHeight: 17, color: theme.colors.textPrimary, flexShrink: 1 },
  // Badge de rol: px-8 py-2, texto 10, rounded-full con borde (fiel a Figma).
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  roleText: { fontFamily: fonts.label, fontSize: 10, lineHeight: 13 },
  username: { fontFamily: fonts.body, fontSize: 12, lineHeight: 15, color: theme.colors.textTertiary },
  statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: fonts.bodyMedium, fontSize: 11 },
  rowRight: { alignItems: 'flex-end', gap: 6 },
  since: { fontFamily: fonts.body, fontSize: 10, color: theme.colors.textTertiary },

  empty: { alignItems: 'center', paddingVertical: theme.spacing['4xl'], gap: theme.spacing.sm },
  emptyTitle: { marginTop: theme.spacing.sm },
  emptyText: { textAlign: 'center' },
});
