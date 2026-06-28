/**
 * Tarjeta KPI del panel (rediseño glass): cuadro de acento + número grande
 * (Space Grotesk) + etiqueta. Reutilizable en Inicio.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { Txt } from './Txt';

interface GlassKpiCardProps {
  value: number | string;
  label: string;
  /** Color de acento (categoría). */
  color: string;
  style?: ViewStyle;
}

export function GlassKpiCard({ value, label, color, style }: GlassKpiCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.accent, { backgroundColor: withAlpha(color, 0.2), borderColor: withAlpha(color, 0.55) }]}>
        <View style={[styles.dot, { backgroundColor: color }]} />
      </View>
      <View style={styles.textBlock}>
        <Txt style={styles.value}>{value}</Txt>
        <Txt style={styles.label}>{label}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    height: 120,
    padding: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    // Acento arriba, bloque número+etiqueta abajo (fiel a Figma 576:3271).
    justifyContent: 'space-between',
  },
  accent: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  textBlock: { gap: 2 },
  value: { fontFamily: fonts.glassTitle, fontSize: 28, lineHeight: 36, color: '#f6f6f8' },
  label: { fontFamily: fonts.glassBodyMedium, fontSize: 12, color: theme.colors.textOnGlassDim },
});
