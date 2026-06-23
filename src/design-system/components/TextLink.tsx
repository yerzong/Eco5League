/**
 * Enlace de texto presionable (estilo botón de marca, rojo).
 * Reutilizable para "« Volver a iniciar sesión", "Cambiar número", etc.
 */
import React from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface TextLinkProps {
  label: string;
  onPress: () => void;
  /** Alineación horizontal del enlace dentro de su contenedor. */
  align?: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: number;
  style?: ViewStyle;
}

export function TextLink({
  label,
  onPress,
  align = 'center',
  color = theme.colors.brandRedHover,
  fontSize = 13,
  style,
}: TextLinkProps) {
  const alignSelf =
    align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [{ alignSelf }, pressed && styles.pressed, style]}>
      <Txt style={[styles.label, { color, fontSize }] as TextStyle[]}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.button, letterSpacing: 0.3 },
  pressed: { opacity: 0.6 },
});
