/**
 * SA-M01 · Inicio (panel de Super-admin) — fiel al diseño de Figma.
 * Dashboard: saludo + métricas (KPIs) + tareas pendientes + actividad reciente.
 * El header (campana + avatar) abre Notificaciones y Perfil.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Txt,
  GlowBackground,
  Eyebrow,
  HeaderActions,
  StatCard,
  Tag,
} from '@/design-system/components';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { dashboardService, type DashboardData } from '@/services';

export function InicioScreen() {
  const navigation = useNavigation<any>();
  const { initials } = useSession();
  const [data, setData] = useState<DashboardData>();

  useEffect(() => {
    dashboardService.getOverview().then(setData);
  }, []);

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header fijo */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Eyebrow label="// Panel super-admin" />
            <Txt style={styles.greeting}>Hola, Gerson</Txt>
          </View>
          <HeaderActions
            initials={initials}
            onNotifications={() => navigation.navigate('Notificaciones')}
            onProfile={() => navigation.navigate('Perfil')}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* KPIs */}
          <View style={styles.statsGrid}>
            {(data?.stats ?? []).map(s => (
              <StatCard
                key={s.key}
                value={s.value}
                label={s.label}
                color={theme.categoryColors[s.category]}
                style={styles.statHalf}
              />
            ))}
          </View>

          {/* Tareas pendientes */}
          <View style={styles.divider} />
          <Eyebrow label="// Tareas pendientes" />
          <View style={styles.section}>
            {(data?.tasks ?? []).map(t => {
              const color = theme.categoryColors[t.category];
              return (
                <View key={t.id} style={styles.taskCard}>
                  <View style={[styles.taskAccent, { backgroundColor: color }]} />
                  <Tag label={t.tagLabel} color={color} />
                  <Txt variant="bodySm" color="textPrimary" style={styles.taskText}>
                    {t.text}
                  </Txt>
                </View>
              );
            })}
          </View>

          {/* Actividad reciente */}
          <View style={styles.divider} />
          <Eyebrow label="// Actividad reciente" />
          <View style={styles.activity}>
            {(data?.activity ?? []).map(a => (
              <View key={a.id} style={styles.activityRow}>
                <View
                  style={[styles.dot, { backgroundColor: theme.categoryColors[a.category] }]}
                />
                <Txt variant="bodySm" color="textPrimary" style={styles.flex}>
                  {a.text}
                </Txt>
                <Txt variant="caption" color="textTertiary">
                  {a.time}
                </Txt>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statHalf: { flexBasis: '47%' },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderDefault,
    marginVertical: theme.spacing.xl,
  },
  section: { gap: theme.spacing.md, marginTop: theme.spacing.md },
  taskCard: {
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.md,
    gap: 6,
    overflow: 'hidden',
  },
  taskAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  taskText: {},
  activity: { gap: theme.spacing.lg, marginTop: theme.spacing.lg },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
