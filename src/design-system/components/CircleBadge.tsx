/**
 * Insignia circular con un ícono al centro. Usada en los headers de
 * onboarding/auth (correo, candado, check…). Reemplaza el badge 60×60
 * que antes se repetía en cada pantalla.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import type { IconProps } from '@/design-system/icons';

type IconCmp = React.ComponentType<IconProps>;

interface CircleBadgeProps {
  icon: IconCmp;
  /** Diámetro del círculo (px). Default 60. */
  size?: number;
  /** Color de fondo. Default rojo de marca. */
  color?: string;
  /** Color del ícono. Default blanco. */
  iconColor?: string;
  style?: ViewStyle;
}

export function CircleBadge({
  icon: Icon,
  size = 60,
  color = theme.colors.brandRed,
  iconColor = theme.colors.white,
  style,
}: CircleBadgeProps) {
  const iconSize = Math.round(size * 0.44);
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, backgroundColor: color },
        style,
      ]}>
      <Icon size={iconSize} color={iconColor} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
