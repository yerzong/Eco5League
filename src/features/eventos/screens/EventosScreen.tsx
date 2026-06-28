/**
 * SAN ✦ Eventos (gestión) — rediseño "glass", fiel a Figma (589:3700).
 * Header (campana + avatar) + búsqueda + toolbar (orden + filtros) + secciones
 * "En curso" / "Próximos" con tarjetas de evento. Orden y filtros funcionales.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Txt,
  GlowBackground,
  GlassScreenHeader,
  GlassSectionHeader,
  GlassSearch,
  GlassToolbar,
  GlassEventCard,
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
import { EVENT_STATUS_LABELS, type EventStatus } from '@/shared/events/status';
import {
  applyFilterGroups,
  countSelected,
  type FilterGroupDef,
  type FilterSelection,
} from '@/shared/filters';
import { eventsService, type LeagueEvent } from '@/services';
import { filterEvents } from '../eventFilters';
import { CrearEventoModal } from './CrearEventoScreen';
import { EditarEventoModal } from './EditarEventoScreen';
import { EventoGestionModal } from './EventoGestionScreen';

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
  { key: 'fecha', label: 'Fecha' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'estado', label: 'Estado' },
  { key: 'equipos', label: 'Equipos' },
];
const SORT_DIRECTIONS: [string, string] = ['↓ Recientes', '↑ Antiguos'];
const SORT_PILL_DIR: [string, string] = ['Recientes', 'Antiguos'];

/** Color (glass) del badge de estado del evento. */
function statusColor(status: EventStatus): string {
  switch (status) {
    case 'en_curso':
      return '#34d77f';
    case 'inscripcion':
      return '#f6a623';
    case 'finalizado':
      return theme.colors.textOnGlassFaint;
    default:
      return theme.colors.textOnGlassDim;
  }
}

export function EventosScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const insets = useSafeAreaInsets();
  // pillHeight(76) + wrapPaddingTop(12) + gap(14) + safeArea
  const fabBottom = Math.max(insets.bottom, 8) + 102;
  const [events, setEvents] = useState<LeagueEvent[]>([]);
  const [search, setSearch] = useState('');
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

  // Búsqueda (base para el filtro avanzado).
  const quick = useMemo(() => filterEvents(events, search, 'todos'), [events, search]);
  const base = useMemo(
    () => applyFilterGroups(quick, FILTER_GROUPS, advanced),
    [quick, advanced],
  );
  const filtered = useMemo(() => {
    const list =
      sortBy === 'nombre' ? [...base].sort((a, b) => a.title.localeCompare(b.title)) : base;
    return sortDir === 1 ? [...list].reverse() : list;
  }, [base, sortBy, sortDir]);

  const enCurso = filtered.filter(e => e.status === 'en_curso');
  const proximos = filtered.filter(e => e.status !== 'en_curso');
  const isEmpty = filtered.length === 0;

  if (loading) return <SkeletonList variant="event" />;

  return (
    <View style={styles.root}>
      <GlowBackground size={460} centerY={0.0} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerWrap}>
          <GlassScreenHeader
            title="Eventos"
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <GlassSearch placeholder="Buscar evento, equipo o juego…" value={search} onChangeText={setSearch} />
          <GlassToolbar
            sortLabel={SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Fecha'}
            sortValue={SORT_PILL_DIR[sortDir]}
            onSort={() => setSortOpen(true)}
            filtersCount={countSelected(advanced)}
            onFilters={() => setFiltersOpen(true)}
          />

          {isEmpty ? (
            <View style={styles.empty}>
              <IconSearch size={32} color={theme.colors.textOnGlassFaint} strokeWidth={1.5} />
              <Txt style={styles.emptyTitle}>Sin resultados</Txt>
              <Txt style={styles.emptyText}>Prueba con otro término o ajusta los filtros.</Txt>
            </View>
          ) : (
            <>
              {enCurso.length > 0 ? (
                <View style={styles.section}>
                  <GlassSectionHeader label="// EN CURSO" />
                  <View style={styles.cards}>
                    {enCurso.map(ev => (
                      <EventCard key={ev.id} event={ev} onPress={() => setViewing(ev)} />
                    ))}
                  </View>
                </View>
              ) : null}

              {proximos.length > 0 ? (
                <View style={styles.section}>
                  <GlassSectionHeader label="// PRÓXIMOS" />
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

      <Fab style={{ position: 'absolute', right: theme.spacing['2xl'], bottom: fabBottom }} onPress={() => setCreating(true)} />
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
          itemNoun="eventos"
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

/** Color del texto de equipos según estado (fiel a Figma 589:3700). */
function teamsTextColor(status: EventStatus): string {
  switch (status) {
    case 'en_curso':    return '#34d77f';
    case 'inscripcion': return 'rgba(246,246,248,0.78)';
    case 'finalizado':  return 'rgba(246,246,248,0.60)';
    default:            return theme.colors.textOnGlassDim;
  }
}

/** Tarjeta de evento (glass) con props ya formateadas. */
function EventCard({ event, onPress }: { event: LeagueEvent; onPress?: () => void }) {
  const isEnCurso = event.status === 'en_curso';
  const isFinalizado = event.status === 'finalizado';
  const card = (
    <GlassEventCard
      code={event.code}
      game={event.game}
      title={event.title}
      subtitle={event.subtitle}
      accent={event.accent}
      statusLabel={EVENT_STATUS_LABELS[event.status]}
      statusColor={statusColor(event.status)}
      logoAccent={isEnCurso ? undefined : event.accent}
      showBadgeDot={!isFinalizado}
      teamsLabel={event.teamsLabel}
      teamsColor={teamsTextColor(event.status)}
      dateLabel={event.dateLabel}
      onPress={onPress}
    />
  );
  // FINALIZADO: opacidad reducida (fiel a Figma opacity-85).
  return isFinalizado ? <View style={styles.dimmed}>{card}</View> : card;
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
    gap: 18,
  },
  section: { gap: 14 },
  cards: { gap: 14 },
  dimmed: { opacity: 0.85 },

  empty: { alignItems: 'center', paddingVertical: 56, gap: 8 },
  emptyTitle: { fontFamily: fonts.glassBodySemibold, fontSize: 15, color: theme.colors.textOnGlass, marginTop: 4 },
  emptyText: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.textOnGlassDim, textAlign: 'center' },

});
