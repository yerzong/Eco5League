/**
 * Emblema hexagonal (pointy-top). Motivo de marca ECO5.
 * Reutilizable para logos de equipos/orgs y avatares.
 * Dibuja un hexágono exterior (borde) + uno interior (relleno) y centra el contenido.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { theme } from '@/design-system/theme';

interface HexBadgeProps {
  size?: number;
  /** Color del borde/exterior. */
  borderColor?: string;
  /** Color del relleno interior. */
  fill?: string;
  /** Grosor del anillo de borde, en px del lado. */
  borderWidth?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

/** Vértices de un hexágono pointy-top inscrito en un cuadrado de lado `s`. */
function hexPoints(s: number, inset = 0): string {
  const c = s / 2;
  const r = c - inset;
  const angles = [-90, -30, 30, 90, 150, 210];
  return angles
    .map(a => {
      const rad = (a * Math.PI) / 180;
      return `${c + r * Math.cos(rad)},${c + r * Math.sin(rad)}`;
    })
    .join(' ');
}

export function HexBadge({
  size = 140,
  borderColor = theme.colors.brandRed,
  fill = theme.colors.bgOuter,
  borderWidth = 14,
  children,
  style,
}: HexBadgeProps) {
  return (
    <View style={[{ width: size, height: size }, styles.wrap, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Polygon points={hexPoints(size)} fill={borderColor} />
        <Polygon points={hexPoints(size, borderWidth)} fill={fill} />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
