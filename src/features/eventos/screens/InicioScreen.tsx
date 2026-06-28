/**
 * SA ✦ Inicio (panel Super-admin) — rediseño "glass".
 * Header (campana + avatar) + KPIs + "Requiere tu acción" + evento "En curso".
 * Datos vía dashboardService + eventsService (mock).
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  GlowBackground,
  GlassScreenHeader,
  GlassSectionHeader,
  GlassKpiCard,
  GlassTaskCard,
  GlassEventCard,
} from '@/design-system/components';
import { theme } from '@/design-system/theme';
import { useSession } from '@/shared/auth/SessionContext';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/shared/events/status';
import {
  dashboardService,
  eventsService,
  type DashboardData,
  type LeagueEvent,
} from '@/services';

/** Agrupa en pares para la grilla 2×2. */
function chunkPairs<T>(arr: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
  return out;
}

/** Color de acento (glass) por categoría de notificación. */
const CAT_COLOR: Record<string, string> = {
  inscripcion: '#2e8fd6',
  transferencia: '#f6a623',
  resultado: '#ff2d46',
  sistema: '#34d77f',
};

/** Color del badge de estado del evento. */
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

export function InicioScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [data, setData] = useState<DashboardData>();
  const [event, setEvent] = useState<LeagueEvent>();

  useEffect(() => {
    dashboardService.getOverview().then(setData);
    eventsService.getEvents().then(evs => {
      setEvent(evs.find(e => e.status === 'en_curso') ?? evs[0]);
    });
  }, []);

  return (
    <View style={styles.root}>
      <GlowBackground size={460} centerY={0.0} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerWrap}>
          <GlassScreenHeader
            title="Inicio"
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* KPIs (2×2) */}
          <View style={styles.kpis}>
            {chunkPairs(data?.stats ?? []).map((pair, i) => (
              <View key={i} style={styles.kpiRow}>
                {pair.map(s => (
                  <GlassKpiCard key={s.key} value={s.value} label={s.label} color={s.accent} />
                ))}
                {pair.length === 1 ? <View style={styles.kpiSpacer} /> : null}
              </View>
            ))}
          </View>

          {/* Requiere tu acción */}
          {data?.tasks?.length ? (
            <>
              <GlassSectionHeader label="// REQUIERE TU ACCIÓN" />
              <View style={styles.tasks}>
                {data.tasks.map(t => (
                  <GlassTaskCard
                    key={t.id}
                    tag={t.tagLabel}
                    text={t.text}
                    color={CAT_COLOR[t.category] ?? '#ff2d46'}
                  />
                ))}
              </View>
            </>
          ) : null}

          {/* En curso */}
          {event ? (
            <>
              <GlassSectionHeader label="// EN CURSO" />
              <GlassEventCard
                code={event.code}
                game={event.game}
                title={event.title}
                subtitle={event.subtitle}
                accent={event.accent}
                statusLabel={EVENT_STATUS_LABELS[event.status]}
                statusColor={statusColor(event.status)}
                teamsLabel={event.teamsLabel}
                teamsColor={event.status === 'en_curso' ? '#34d77f' : theme.colors.textOnGlassDim}
                dateLabel={event.dateLabel}
              />
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
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
    gap: 18,
  },
  kpis: { gap: 12 },
  kpiRow: { flexDirection: 'row', gap: 12 },
  kpiSpacer: { flex: 1 },
  tasks: { gap: 10 },
});
