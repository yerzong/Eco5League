/**
 * Control de ordenamiento: ícono + criterio (ej. "Fecha"/"Nombre") + valor
 * (ej. "Recientes"/"A–Z") + chevron. Abre el selector de orden al tocarlo.
 */
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconArrowsSort, IconChevronDown } from '@/design-system/icons';
import { Txt } from './Txt';

interface SortControlProps {
  /** Criterio de orden (ej. "Fecha", "Nombre"). */
  label: string;
  /** Valor/dirección (ej. "Recientes", "A–Z"). */
  value: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SortControl({ label, value, onPress, style }: SortControlProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed, style]}>
      <IconArrowsSort size={16} color={theme.colors.textPrimary} strokeWidth={2} />
      <Txt style={styles.label}>{label}</Txt>
      <Txt style={styles.value}>{value}</Txt>
      <IconChevronDown size={14} color={theme.colors.textSecondary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Alto FIJO 34px + radio 8 (fiel a Figma).
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: 8,
  },
  pressed: { opacity: 0.7 },
  label: { fontFamily: fonts.label, fontSize: 13, lineHeight: 16, color: theme.colors.textPrimary },
  value: { fontFamily: fonts.body, fontSize: 13, lineHeight: 16, color: theme.colors.textSecondary },
});
