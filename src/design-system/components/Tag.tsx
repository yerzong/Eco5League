/**
 * Etiqueta/pill pequeña con color de categoría (texto sólido sobre tinte
 * del mismo color al 15%). Reutilizable para categorías, estados, roles.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

interface TagProps {
  label: string;
  /** Color base de la etiqueta. Default rojo de marca. */
  color?: string;
  style?: ViewStyle;
}

export function Tag({ label, color = theme.colors.brandRed, style }: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '26' }, style]}>
      <Txt style={[styles.label, { color }]}>{label.toUpperCase()}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  label: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
