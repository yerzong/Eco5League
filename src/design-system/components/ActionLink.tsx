/**
 * Enlace de acción compacto (texto + chevron), rojo de marca por defecto.
 * Reutilizable en footers de cards: "Gestionar ›", "Ver equipo ›".
 */
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconChevronRight } from '@/design-system/icons';
import { Txt } from './Txt';

interface ActionLinkProps {
  label: string;
  onPress?: () => void;
  color?: string;
  style?: ViewStyle;
}

export function ActionLink({
  label,
  onPress,
  color = theme.colors.brandRed,
  style,
}: ActionLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}>
      <Txt style={[styles.label, { color }]}>{label}</Txt>
      <IconChevronRight size={14} color={color} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  pressed: { opacity: 0.6 },
  label: { fontFamily: fonts.label, fontSize: 12 },
});
