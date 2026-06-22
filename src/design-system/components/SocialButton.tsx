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
  /** Color de fondo (usar theme.providerColors). */
  color: string;
  /** Color de ícono/texto. Default blanco. */
  contentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SocialButton({
  label,
  icon: Icon,
  color,
  contentColor = theme.colors.white,
  onPress,
  style,
}: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: color },
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
  pressed: { opacity: 0.88 },
  label: { letterSpacing: 0.5 },
});
