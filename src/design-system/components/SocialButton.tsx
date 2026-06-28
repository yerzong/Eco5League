/**
 * Botón de proveedor de login (Xbox, Discord, Google, Apple…).
 * Color de fondo = color oficial del proveedor; ícono + etiqueta en mayúsculas.
 */
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import type { IconProps } from '@/design-system/icons';
import { Txt } from './Txt';

interface SocialButtonProps {
  label: string;
  icon: React.ComponentType<IconProps>;
  /** Color de fondo (usar theme.providerColors). Ignorado si glass. */
  color?: string;
  /** Color de ícono/texto. Default blanco. */
  contentColor?: string;
  /** Estilo "glass" (rediseño de acceso): vidrio translúcido. */
  glass?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SocialButton({
  label,
  icon: Icon,
  color,
  contentColor = theme.colors.white,
  glass,
  onPress,
  style,
}: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        glass ? styles.glass : { backgroundColor: color },
        pressed && styles.pressed,
        style,
      ]}>
      <Icon size={22} color={contentColor} strokeWidth={2} />
      <Txt variant="button" style={[styles.label, { color: contentColor }]}>
        {label.toUpperCase()}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  glass: {
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    borderRadius: 16,
    height: 52,
  },
  pressed: { opacity: 0.88 },
  label: { letterSpacing: 0.84 },
});
