/**
 * Tarjeta de tarea pendiente (rediseño glass): barra de acento + chip + texto
 * + chevron. Reutilizable en Inicio ("// Requiere tu acción").
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconChevronRight } from '@/design-system/icons';
import { Txt } from './Txt';

interface GlassTaskCardProps {
  tag: string;
  text: string;
  /** Color de acento (categoría). */
  color: string;
  onPress?: () => void;
}

function withAlpha(hex: string, alpha: string): string {
  return hex.length === 7 ? `${hex}${alpha}` : hex;
}

export function GlassTaskCard({ tag, text, color, onPress }: GlassTaskCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.accent, { backgroundColor: color }]} />
      <View style={styles.body}>
        <View style={[styles.chip, { backgroundColor: withAlpha(color, '24'), borderColor: withAlpha(color, '4d') }]}>
          <Txt style={[styles.chipText, { color }]}>{tag.toUpperCase()}</Txt>
        </View>
        <Txt style={styles.text} numberOfLines={1}>
          {text}
        </Txt>
      </View>
      <IconChevronRight size={16} color={theme.colors.textOnGlassFaint} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 72,
    paddingRight: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: 'hidden',
  },
  accent: { width: 4, alignSelf: 'stretch' },
  body: { flex: 1, gap: 6, paddingVertical: 14 },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  chipText: { fontFamily: fonts.glassBodyBold, fontSize: 9.5, letterSpacing: 0.5 },
  text: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: 'rgba(246,246,248,0.85)' },
});
