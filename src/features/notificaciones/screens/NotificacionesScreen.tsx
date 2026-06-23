/**
 * SA-M05 · Notificaciones (centro de alertas) — fiel al diseño de Figma.
 * Filtros por categoría + lista de alertas con badge de color por tipo.
 */
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Txt,
  GlowBackground,
  BackButton,
  Eyebrow,
} from '@/design-system/components';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import {
  CATEGORY_LABELS,
  type NotificationCategory,
} from '@/shared/notifications/categories';
import { notificationsService, type NotificationItem } from '@/services';

type Filter = 'todas' | NotificationCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'inscripcion', label: 'Inscr.' },
  { key: 'resultado', label: 'Result.' },
  { key: 'transferencia', label: 'Transfer.' },
  { key: 'sistema', label: 'Sistema' },
];

export function NotificacionesScreen() {
  const [filter, setFilter] = useState<Filter>('todas');
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    notificationsService
      .list(filter === 'todas' ? undefined : filter)
      .then(setItems);
  }, [filter]);

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <BackButton style={styles.back} />
        <Eyebrow label="// Centro de alertas" />
        <Txt style={styles.title}>Notificaciones</Txt>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.pill, active && styles.pillActive]}>
                <Txt
                  style={active ? [styles.pillText, styles.pillTextActive] : styles.pillText}>
                  {f.label}
                </Txt>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Lista */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}>
          {items.map(n => {
            const color = theme.categoryColors[n.category];
            return (
              <View key={n.id} style={styles.row}>
                <View style={[styles.badge, { backgroundColor: color + '26' }]}>
                  <Txt style={[styles.badgeText, { color }]}>{n.badge}</Txt>
                </View>
                <View style={styles.flex}>
                  <Txt style={[styles.cat, { color }]}>
                    {CATEGORY_LABELS[n.category].toUpperCase()}
                  </Txt>
                  <Txt variant="bodySm" color="textPrimary" style={styles.text}>
                    {n.text}
                  </Txt>
                  <Txt variant="caption" color="textTertiary" style={styles.time}>
                    {n.time}
                  </Txt>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1, paddingHorizontal: theme.spacing['2xl'] },
  flex: { flex: 1 },
  back: { marginTop: theme.spacing.md },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  filters: { gap: theme.spacing.sm, paddingVertical: theme.spacing.lg },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },
  pillActive: {
    backgroundColor: theme.colors.brandRed,
    borderColor: theme.colors.brandRed,
  },
  pillText: { fontFamily: fonts.button, fontSize: 12, color: theme.colors.textSecondary },
  pillTextActive: { color: theme.colors.white },
  list: { paddingBottom: theme.spacing['3xl'] },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDefault,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.headingBold, fontSize: 15 },
  cat: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.5 },
  text: { marginTop: 3 },
  time: { marginTop: 3 },
});
