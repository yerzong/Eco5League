/**
 * Tarjeta de métrica del dashboard: número grande + etiqueta, con barra
 * de acento a la izquierda. Reutilizable en cualquier panel con KPIs.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

interface StatCardProps {
  value: string | number;
  label: string;
  /** Color del número y de la barra de acento. Default rojo de marca. */
  color?: string;
  style?: ViewStyle;
}

export function StatCard({ value, label, color = theme.colors.brandRed, style }: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.accent, { backgroundColor: color }]} />
      <Txt style={[styles.value, { color }]}>{value}</Txt>
      <Txt variant="caption" color="textSecondary" style={styles.label}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 84,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    paddingLeft: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  value: { fontFamily: theme.fonts.headingBold, fontSize: 30, lineHeight: 36 },
  label: { marginTop: 2 },
});
