/**
 * Botón circular con un ícono al centro (estilo "pill" sobre superficie).
 * Soporta un punto de notificación (badge) en la esquina superior derecha.
 */
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import type { IconProps } from '@/design-system/icons';

type IconCmp = React.ComponentType<IconProps>;

interface IconButtonProps {
  icon: IconCmp;
  onPress?: () => void;
  size?: number;
  iconColor?: string;
  bg?: string;
  /** Muestra un punto rojo (notificación sin leer). */
  badge?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon: Icon,
  onPress,
  size = 40,
  iconColor = theme.colors.white,
  bg = theme.colors.surfacePill,
  badge,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.btn,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        pressed && styles.pressed,
        style,
      ]}>
      <Icon size={Math.round(size * 0.5)} color={iconColor} strokeWidth={1.9} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.brandRed,
  },
});
