/**
 * Pill de estado/rol: texto sobre tinte del mismo color, con punto opcional.
 * Reutilizable para estados (Activo/Pendiente) y chips de rol (Caster…).
 * - `dot`: muestra el punto de color a la izquierda.
 * - `round`: esquinas completamente redondeadas (vs radio pequeño).
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface StatusPillProps {
  label: string;
  color: string;
  dot?: boolean;
  round?: boolean;
  /** Añade borde del color al 40% (badge de rol en Usuarios). */
  bordered?: boolean;
  style?: ViewStyle;
}

export function StatusPill({ label, color, dot, round, bordered, style }: StatusPillProps) {
  return (
    <View
      style={[
        styles.pill,
        round && styles.round,
        { backgroundColor: color + '26' },
        bordered && { borderWidth: 1, borderColor: color + '66' },
        style,
      ]}>
      {dot ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}
      <Txt style={[styles.label, { color }]}>{label}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  // Chip de rol/categoría: py-3 (fiel a Figma). lineHeight fijo para que el
  // texto no infle la altura por el line-height por defecto de RN.
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  // Estado (pill redondo): py-4, pr-10.
  round: { borderRadius: 99, paddingVertical: 4, paddingRight: 10 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontFamily: fonts.label, fontSize: 11, lineHeight: 14 },
});
