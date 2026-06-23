/**
 * SA-M02 · Eventos (gestión) — fiel al diseño de Figma.
 * Búsqueda + filtros (funcionales) + evento destacado + próximos eventos + FAB.
 *
 * Vista por defecto (sin búsqueda ni filtro): destacado + próximos.
 * Al buscar o filtrar: una sola lista filtrada (con estado vacío si no hay).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Txt,
  GlowBackground,
  Eyebrow,
  HeaderActions,
  SearchField,
  FilterPills,
  Tag,
  Fab,
  GameArt,
  type FilterOption,
} from '@/design-system/components';
import { IconChevronRight, IconSearch } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/shared/events/status';
import { eventsService, type LeagueEvent } from '@/services';
import { filterEvents, type EventFilterKey } from '../eventFilters';

const FILTERS: FilterOption<EventFilterKey>[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'liga', label: 'Liga' },
  { key: 'torneo', label: 'Torneo' },
  { key: 'copa', label: 'Copa' },
  { key: 'en_curso', label: 'En curso' },
];

/** Color de marca para cada estado de evento. */
function statusColor(status: EventStatus): string {
  switch (status) {
    case 'en_curso':
      return theme.colors.accentGreen;
    case 'inscripcion':
      return theme.colors.accentAmber;
    case 'finalizado':
      return theme.colors.textTertiary;
    default:
      return theme.colors.brandRed;
  }
}

export function EventosScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [events, setEvents] = useState<LeagueEvent[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<EventFilterKey>('todos');

  useEffect(() => {
    eventsService.getEvents().then(setEvents);
  }, []);

  // Vista por defecto = sin búsqueda ni filtro: muestra destacado + próximos.
  const isDefaultView = filter === 'todos' && !search.trim();
  const filtered = useMemo(
    () => filterEvents(events, search, filter),
    [events, search, filter],
  );
  const featured = events.find(e => e.featured);
  const upcoming = events.filter(e => !e.featured);

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header fijo */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Eyebrow label="// Gestión de eventos" />
            <Txt style={styles.title}>Eventos</Txt>
          </View>
          <HeaderActions
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SearchField
            placeholder="Buscar evento..."
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.filters}>
            <FilterPills options={FILTERS} value={filter} onChange={setFilter} />
          </View>

          {isDefaultView ? (
            <>
              {/* Evento destacado */}
              {featured ? (
                <>
                  <Eyebrow label="// Evento destacado" />
                  <FeaturedCard event={featured} style={styles.afterEyebrow} />
                </>
              ) : null}

              {/* Próximos eventos */}
              <View style={styles.sectionGap}>
                <Eyebrow label="// Próximos eventos" />
              </View>
              <View style={styles.rows}>
                {upcoming.map(ev => (
                  <EventRow key={ev.id} event={ev} />
                ))}
              </View>
            </>
          ) : filtered.length > 0 ? (
            /* Resultado de búsqueda / filtro */
            <View style={styles.rows}>
              <Txt variant="caption" color="textTertiary" style={styles.resultCount}>
                {filtered.length}{' '}
                {filtered.length === 1 ? 'resultado' : 'resultados'}
              </Txt>
              {filtered.map(ev => (
                <EventRow key={ev.id} event={ev} />
              ))}
            </View>
          ) : (
            /* Estado vacío */
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
    </View>
  );
}

/** Tarjeta del evento destacado (banner + datos + CTA). */
function FeaturedCard({ event, style }: { event: LeagueEvent; style?: any }) {
  const color = statusColor(event.status);
  return (
    <View style={[styles.featured, style]}>
      <View>
        <GameArt label={event.game} accent={theme.colors.brandRed} height={132} radius={0} />
        <View style={styles.codeBadge}>
          <Txt style={styles.codeText}>{event.code}</Txt>
        </View>
        <View style={[styles.statusPill, { backgroundColor: color }]}>
          <Txt style={styles.statusText}>{EVENT_STATUS_LABELS[event.status].toUpperCase()}</Txt>
        </View>
      </View>
      <View style={styles.featuredBody}>
        <Txt style={styles.featuredTitle}>{event.title}</Txt>
        <Txt variant="caption" color="textSecondary">
          {event.subtitle}
        </Txt>
        <View style={styles.featuredFooter}>
          <View style={styles.flex}>
            {event.teamsLabel ? (
              <View style={styles.teamsRow}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <Txt style={[styles.teamsText, { color }]}>{event.teamsLabel}</Txt>
              </View>
            ) : null}
            {event.dateLabel ? (
              <Txt variant="caption" color="textTertiary" style={styles.dateText}>
                {event.dateLabel}
              </Txt>
            ) : null}
          </View>
          <Pressable style={styles.detailBtn}>
            <Txt style={styles.detailText}>Ver detalle</Txt>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** Fila de un evento (miniatura + datos + estado + chevron). */
function EventRow({ event }: { event: LeagueEvent }) {
  const color = statusColor(event.status);
  return (
    <Pressable style={styles.row}>
      <GameArt
        label={event.game}
        accent={color}
        height={62}
        fontSize={20}
        radius={theme.radius.sm}
        style={styles.thumb}
      />
      <View style={styles.rowBody}>
        <Txt variant="bodyMedium" color="textPrimary" numberOfLines={1}>
          {event.title}
        </Txt>
        <Txt variant="caption" color="textTertiary" numberOfLines={1}>
          {event.subtitle}
        </Txt>
      </View>
      <Tag label={EVENT_STATUS_LABELS[event.status]} color={color} />
      <IconChevronRight size={18} color={theme.colors.textTertiary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
  },
  filters: { marginTop: theme.spacing.md, marginBottom: theme.spacing.xl },
  afterEyebrow: { marginTop: theme.spacing.md },
  sectionGap: { marginTop: theme.spacing.xl },
  rows: { gap: theme.spacing.md, marginTop: theme.spacing.md },
  resultCount: { marginBottom: theme.spacing.xs },
  // Featured
  featured: {
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  codeBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: '#0c0c10d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: { fontFamily: fonts.headingBold, fontSize: 16, color: theme.colors.textPrimary },
  statusPill: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
  },
  statusText: { fontFamily: fonts.label, fontSize: 11, color: theme.colors.white, letterSpacing: 0.5 },
  featuredBody: { padding: theme.spacing.lg, gap: 4 },
  featuredTitle: { fontFamily: fonts.headingBold, fontSize: 24, lineHeight: 30, color: theme.colors.textPrimary },
  featuredFooter: { flexDirection: 'row', alignItems: 'flex-end', marginTop: theme.spacing.md },
  teamsRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  teamsText: { fontFamily: fonts.label, fontSize: 13 },
  dateText: { marginTop: 4 },
  detailBtn: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.brandRed,
    borderRadius: theme.radius.sm,
  },
  detailText: { fontFamily: fonts.button, fontSize: 12, color: theme.colors.white },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  thumb: { width: 64 },
  rowBody: { flex: 1, gap: 2 },
  // Empty state
  empty: { alignItems: 'center', paddingVertical: theme.spacing['4xl'], gap: theme.spacing.sm },
  emptyTitle: { marginTop: theme.spacing.sm },
  emptyText: { textAlign: 'center' },
  // FAB
  fab: { position: 'absolute', right: theme.spacing['2xl'], bottom: theme.spacing['2xl'] },
});
