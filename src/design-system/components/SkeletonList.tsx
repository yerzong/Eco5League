/**
 * Pantalla de carga (skeleton) para los listados SA. Recrea el layout de cada
 * módulo con bloques animados: header + búsqueda + controles + chips + conteo +
 * tarjetas. La forma de las tarjetas cambia según `variant`.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/design-system/theme';
import { GlowBackground } from './GlowBackground';
import { Skeleton } from './Skeleton';

export type SkeletonVariant = 'event' | 'staff' | 'team' | 'user';

interface SkeletonListProps {
  variant: SkeletonVariant;
}

/** Tarjeta de evento: cover + título/subtítulo/divisor/footer. */
function EventCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={120} radius={0} />
      <View style={styles.cardBody}>
        <Skeleton width={170} height={18} />
        <Skeleton width="70%" height={12} />
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={14} />
        </View>
      </View>
    </View>
  );
}

/** Tarjeta de staff: avatar + nombre + chips + estado + footer. */
function StaffCardSkeleton() {
  return (
    <View style={styles.cardPadded}>
      <View style={styles.headerRow}>
        <Skeleton width={48} height={48} radius={24} />
        <View style={styles.flex}>
          <Skeleton width={140} height={16} />
          <View style={styles.chipsRow}>
            <Skeleton width={60} height={18} radius={5} />
            <Skeleton width={70} height={18} radius={5} />
          </View>
        </View>
        <Skeleton width={72} height={24} radius={99} />
      </View>
      <View style={styles.divider} />
      <View style={styles.rowBetween}>
        <Skeleton width={120} height={12} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
}

/** Tarjeta de equipo: barra de acento + escudo + nombre + badge + footer. */
function TeamCardSkeleton() {
  return (
    <View style={styles.cardRow}>
      <Skeleton width={4} height="100%" radius={0} />
      <View style={[styles.cardPadded, styles.flex]}>
        <View style={styles.headerRow}>
          <Skeleton width={48} height={48} radius={10} />
          <View style={styles.flex}>
            <Skeleton width={120} height={16} />
            <Skeleton width={90} height={12} style={styles.mt6} />
          </View>
          <Skeleton width={72} height={24} radius={99} />
        </View>
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={14} />
        </View>
      </View>
    </View>
  );
}

/** Fila de usuario: avatar + nombre/rol + @/estado + fecha. */
function UserRowSkeleton() {
  return (
    <View style={styles.userRow}>
      <Skeleton width={40} height={40} radius={20} />
      <View style={styles.flex}>
        <View style={styles.userLine}>
          <Skeleton width={120} height={14} />
          <Skeleton width={64} height={16} radius={99} />
        </View>
        <View style={styles.userLine}>
          <Skeleton width={70} height={12} />
          <Skeleton width={56} height={12} />
        </View>
      </View>
      <Skeleton width={34} height={10} />
    </View>
  );
}

export function SkeletonList({ variant }: SkeletonListProps) {
  const cards =
    variant === 'event' ? (
      <View style={styles.gapLg}>
        <EventCardSkeleton />
        <EventCardSkeleton />
      </View>
    ) : variant === 'staff' ? (
      <View style={styles.gapMd}>
        <StaffCardSkeleton />
        <StaffCardSkeleton />
        <StaffCardSkeleton />
      </View>
    ) : variant === 'team' ? (
      <View style={styles.gapMd}>
        <TeamCardSkeleton />
        <TeamCardSkeleton />
        <TeamCardSkeleton />
      </View>
    ) : (
      <View style={styles.gapSm}>
        {Array.from({ length: 8 }).map((_, i) => (
          <UserRowSkeleton key={i} />
        ))}
      </View>
    );

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.02} />
      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Skeleton width={120} height={10} />
            <Skeleton width={150} height={28} style={styles.mt8} />
          </View>
          <View style={styles.headerActions}>
            <Skeleton width={40} height={40} radius={20} />
            <Skeleton width={40} height={40} radius={20} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Skeleton width="100%" height={48} radius={10} />
          <View style={styles.rowBetween}>
            <Skeleton width={150} height={34} radius={8} />
            <Skeleton width={110} height={34} radius={8} />
          </View>
          <View style={styles.chipsRow}>
            <Skeleton width={60} height={31} radius={99} />
            <Skeleton width={80} height={31} radius={99} />
            <Skeleton width={96} height={31} radius={99} />
            <Skeleton width={70} height={31} radius={99} />
          </View>
          <Skeleton width={150} height={12} />
          {cards}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  headerActions: { flexDirection: 'row', gap: theme.spacing.sm },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  chipsRow: { flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gapLg: { gap: theme.spacing.lg },
  gapMd: { gap: theme.spacing.md },
  gapSm: { gap: theme.spacing.sm },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },

  // Cards
  card: {
    backgroundColor: theme.colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: theme.colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    overflow: 'hidden',
  },
  cardPadded: {
    backgroundColor: theme.colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cardBody: { padding: theme.spacing.lg, gap: theme.spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  divider: { height: 1, backgroundColor: theme.colors.borderDefault },

  // User row
  userRow: {
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
  userLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
});
