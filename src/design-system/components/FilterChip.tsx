/**
 * Chip de filtro multi-selección. Seleccionado: rojo de marca con ✓.
 * No seleccionado: superficie con borde. Usado en el panel de Filtros.
 */
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSel : styles.chipUnsel]}>
      {selected ? <Txt style={styles.check}>✓</Txt> : null}
      <Txt style={[styles.label, selected ? styles.labelSel : styles.labelUnsel]}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 9,
    borderRadius: theme.radius.sm,
  },
  chipSel: { backgroundColor: theme.colors.brandRed },
  chipUnsel: {
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },
  check: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.white },
  label: { fontFamily: fonts.label, fontSize: 13 },
  labelSel: { color: theme.colors.white },
  labelUnsel: { color: theme.colors.textSecondary },
});
