/**
 * SA-M02 · Eventos (gestión) — v2 redISeñado, fiel a Figma.
 * Header fijo + búsqueda + fila de controles (orden + filtros) + chips por
 * estado + fila de conteo + secciones "En curso" / "Próximos" con cards.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Txt,
  GlowBackground,
  ScreenHeader,
  Eyebrow,
  SearchField,
  ControlsRow,
  CountRow,
  FilterPills,
  FilterSheet,
  SortSheet,
  StatusPill,
  GameArt,
  Fab,
  SkeletonList,
  type FilterOption,
  type SortOption,
} from '@/design-system/components';
import { useTabLoading } from '@/shared/hooks/useTabLoading';
import { IconChevronRight, IconSearch } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/shared/events/status';
import {
  applyFilterGroups,
  countSelected,
  type FilterGroupDef,
  type FilterSelection,
} from '@/shared/filters';
import { eventsService, type LeagueEvent } from '@/services';
import { filterEvents, type EventFilterKey } from '../eventFilters';
import { CrearEventoModal } from './CrearEventoScreen';
import { EditarEventoModal } from './EditarEventoScreen';
import { EventoGestionModal } from './EventoGestionScreen';

const FILTERS: FilterOption<EventFilterKey>[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'en_curso', label: 'En curso' },
  { key: 'inscripcion', label: 'Inscripciones' },
  { key: 'finalizado', label: 'Finalizados' },
];

/** Grupos del panel de Filtros (con predicados de datos). */
const FILTER_GROUPS: FilterGroupDef<LeagueEvent>[] = [
  {
    key: 'estado',
    label: 'ESTADO',
    options: [
      { key: 'borrador', label: 'Borrador', test: () => false },
      { key: 'insc_open', label: 'Inscripciones abiertas', test: e => e.status === 'inscripcion' },
      { key: 'insc_closed', label: 'Inscripciones cerradas', test: () => false },
      { key: 'en_curso', label: 'En curso', test: e => e.status === 'en_curso' },
      { key: 'finalizado', label: 'Finalizado', test: e => e.status === 'finalizado' },
      { key: 'cancelado', label: 'Cancelado', test: () => false },
    ],
  },
  {
    key: 'tipo',
    label: 'TIPO',
    options: [
      { key: 'liga', label: 'Liga', test: e => e.format === 'liga' },
      { key: 'torneo', label: 'Torneo', test: e => e.format === 'torneo' },
      { key: 'copa', label: 'Copa', test: e => e.format === 'copa' },
    ],
  },
  {
    key: 'juego',
    label: 'JUEGO',
    options: [
      { key: 'valorant', label: 'Valorant', test: e => e.game.toUpperCase().startsWith('VAL') },
      { key: 'lol', label: 'League of Legends', test: e => e.game.toUpperCase() === 'LOL' },
      { key: 'gears', label: 'Gears', test: e => e.game.toUpperCase() === 'GEARS' },
      {
        key: 'otros',
        label: 'Otros',
        test: e => !['VALORANT', 'VAL', 'LOL', 'GEARS'].includes(e.game.toUpperCase()),
      },
    ],
  },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'fecha', label: 'Fecha de inicio' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'estado', label: 'Estado' },
  { key: 'equipos', label: 'Nº de equipos' },
];
const SORT_DIRECTIONS: [string, string] = ['↓ Recientes primero', '↑ Antiguos primero'];
const SORT_PILL_DIR: [string, string] = ['Recientes', 'Antiguos'];

/** Color del badge de estado (dot + texto). */
function statusColor(status: EventStatus): string {
  switch (status) {
    case 'en_curso':
      return theme.colors.accentGreen;
    case 'inscripcion':
      return theme.colors.accentAmber;
    case 'finalizado':
      return theme.colors.textTertiary;
    default:
      return theme.colors.textSecondary;
  }
}

/** Color del texto de equipos del footer (solo "en curso" se resalta). */
function teamsColor(status: EventStatus): string {
  switch (status) {
    case 'en_curso':
      return theme.colors.accentGreen;
    case 'finalizado':
      return theme.colors.textTertiary;
    default:
      return theme.colors.textSecondary;
  }
}

export function EventosScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [events, setEvents] = useState<LeagueEvent[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<EventFilterKey>('todos');
  const [advanced, setAdvanced] = useState<FilterSelection>({});
  const [sortBy, setSortBy] = useState('fecha');
  const [sortDir, setSortDir] = useState<0 | 1>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<LeagueEvent | null>(null);
  const [editing, setEditing] = useState<LeagueEvent | null>(null);
  const loading = useTabLoading();

  useEffect(() => {
    eventsService.getEvents().then(setEvents);
  }, []);

  // Búsqueda + chips rápidos (sin filtros avanzados) → base para el contador.
  const quick = useMemo(
    () => filterEvents(events, search, filter),
    [events, search, filter],
  );
  // + filtros avanzados (sheet).
  const base = useMemo(
    () => applyFilterGroups(quick, FILTER_GROUPS, advanced),
    [quick, advanced],
  );

  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre'
        ? [...base].sort((a, b) => a.title.localeCompare(b.title))
        : base;
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const enCurso = filtered.filter(e => e.status === 'en_curso');
  const proximos = filtered.filter(e => e.status !== 'en_curso');
  const isEmpty = filtered.length === 0;

  if (loading) return <SkeletonList variant="event" />;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader
          eyebrow="// Gestión de eventos"
          title="Eventos"
          initials={initials}
          onNotifications={() => navigation.navigate('Notificaciones')}
          onProfile={() => navigation.navigate('Perfil')}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SearchField placeholder="Buscar evento..." value={search} onChangeText={setSearch} height={52} />
          <ControlsRow
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Fecha de inicio'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} round />
          <CountRow
            left={`${filtered.length} eventos`}
            right={`${enCurso.length} en curso · ${proximos.length} próximos`}
          />

          {isEmpty ? (
            <View style={styles.empty}>
              <IconSearch size={32} color={theme.colors.textTertiary} strokeWidth={1.5} />
              <Txt variant="bodyMedium" color="textSecondary" style={styles.emptyTitle}>
                Sin resultados
              </Txt>
              <Txt variant="caption" color="textTertiary" style={styles.emptyText}>
                Prueba con otro término o cambia el filtro.
              </Txt>
            </View>
          ) : (
            <>
              {enCurso.length > 0 ? (
                <View style={styles.section}>
                  <Eyebrow label="// En curso" />
                  <View style={styles.cards}>
                    {enCurso.map(ev => (
                      <EventCard key={ev.id} event={ev} onPress={() => setViewing(ev)} />
                    ))}
                  </View>
                </View>
              ) : null}

              {proximos.length > 0 ? (
                <View style={styles.section}>
                  <Eyebrow label="// Próximos" />
                  <View style={styles.cards}>
                    {proximos.map(ev => (
                      <EventCard key={ev.id} event={ev} onPress={() => setViewing(ev)} />
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <Fab style={styles.fab} onPress={() => setCreating(true)} />
      <CrearEventoModal visible={creating} onClose={() => setCreating(false)} />
      <EventoGestionModal
        visible={!!viewing}
        event={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => setEditing(viewing)}
      />
      <EditarEventoModal
        visible={!!editing}
        event={editing}
        onClose={() => setEditing(null)}
        onDeleted={ev => {
          setEvents(es => es.filter(e => e.id !== ev.id));
          setViewing(null);
        }}
      />

      {filtersOpen ? (
        <FilterSheet
          groups={FILTER_GROUPS}
          initial={advanced}
          itemNoun="EVENTOS"
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

/** Card de evento: cover (logo + badge) + cuerpo (título, subtítulo, footer). */
function EventCard({ event, onPress }: { event: LeagueEvent; onPress?: () => void }) {
  const badge = statusColor(event.status);
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cover}>
        <GameArt
          label={event.game}
          accent={event.accent}
          height={120}
          radius={0}
          scrim
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.coverTop}>
          <View style={styles.logo}>
            <Txt style={styles.logoText}>{event.code}</Txt>
          </View>
          <StatusPill label={EVENT_STATUS_LABELS[event.status]} color={badge} dot round />
        </View>
      </View>

      <View style={styles.body}>
        <Txt style={styles.cardTitle} numberOfLines={1}>
          {event.title}
        </Txt>
        <Txt style={styles.cardSubtitle} numberOfLines={1}>
          {event.subtitle}
        </Txt>
        <View style={styles.divider} />
        <View style={styles.footer}>
          {event.teamsLabel ? (
            <View style={styles.teams}>
              <View style={[styles.teamsDot, { backgroundColor: teamsColor(event.status) }]} />
              <Txt style={[styles.teamsText, { color: teamsColor(event.status) }]}>
                {event.teamsLabel}
              </Txt>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.footRight}>
            {event.dateLabel ? <Txt style={styles.footMeta}>{event.dateLabel}</Txt> : null}
            <IconChevronRight size={18} color={theme.colors.textTertiary} strokeWidth={2} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const CARD_RADIUS = 12;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  section: { gap: theme.spacing.md },
  cards: { gap: theme.spacing.lg },

  // Card
  card: {
    backgroundColor: theme.colors.surface1,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    overflow: 'hidden',
  },
  cover: { height: 120 },
  coverTop: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#0c0c10d9',
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontFamily: fonts.headingBold, fontSize: 16, color: theme.colors.textPrimary },

  body: { padding: theme.spacing.lg, gap: theme.spacing.md },
  cardTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.2,
    color: theme.colors.textPrimary,
  },
  cardSubtitle: { fontFamily: fonts.body, fontSize: 13, lineHeight: 17, color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: theme.colors.borderDefault },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teams: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teamsDot: { width: 8, height: 8, borderRadius: 4 },
  teamsText: { fontFamily: fonts.label, fontSize: 13 },
  footRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  footMeta: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary },

  // Estado vacío
  empty: { alignItems: 'center', paddingVertical: theme.spacing['4xl'], gap: theme.spacing.sm },
  emptyTitle: { marginTop: theme.spacing.sm },
  emptyText: { textAlign: 'center' },

  fab: { position: 'absolute', right: theme.spacing['2xl'], bottom: theme.spacing['2xl'] },
});
