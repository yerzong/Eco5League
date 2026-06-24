/**
 * Portada/arte de un juego, generada con Views + SVG (sin imágenes externas).
 * Gradiente diagonal derivado del acento + glow focal + shards rotados +
 * texto del juego difuminado + scrim inferior opcional para legibilidad.
 * Reutilizable como cover de tarjetas de evento.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface GameArtProps {
  /** Nombre/etiqueta del juego mostrado difuminado (ej. "VALORANT"). */
  label: string;
  /** Color de acento (gradiente, glow y shard). Default rojo de marca. */
  accent?: string;
  height?: number;
  /** Tamaño de fuente del texto difuminado. */
  fontSize?: number;
  /** Radio de las esquinas. */
  radius?: number;
  /** Degradado oscuro inferior para legibilidad del texto encima. */
  scrim?: boolean;
  style?: ViewStyle;
}

/** Multiplica un hex #rrggbb por un factor → rgb() oscurecido. */
function darken(hex: string, f: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

export function GameArt({
  label,
  accent = theme.colors.brandRed,
  height = 120,
  fontSize = 50,
  radius = theme.radius.md,
  scrim = false,
  style,
}: GameArtProps) {
  // id único por instancia (evita colisión de <Defs> entre varias covers).
  const uid = (accent + label).replace(/[^a-z0-9]/gi, '');
  const top = darken(accent, 0.3);
  const bottom = darken(accent, 0.06);

  return (
    <View style={[styles.wrap, { height, borderRadius: radius }, style]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`cov${uid}`} x1="0" y1="0" x2="0.7" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="0.72" stopColor={bottom} />
          </LinearGradient>
          <RadialGradient id={`foc${uid}`} cx="0.72" cy="0.1" r="0.7">
            <Stop offset="0" stopColor={accent} stopOpacity={0.28} />
            <Stop offset="1" stopColor={accent} stopOpacity={0} />
          </RadialGradient>
          {scrim ? (
            <LinearGradient id={`scr${uid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.3" stopColor="#08090b" stopOpacity={0} />
              <Stop offset="1" stopColor="#08090b" stopOpacity={0.92} />
            </LinearGradient>
          ) : null}
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#cov${uid})`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#foc${uid})`} />
        {scrim ? (
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#scr${uid})`} />
        ) : null}
      </Svg>

      {/* Shards diagonales */}
      <View style={[styles.shard, { left: '50%', width: 3, backgroundColor: '#ffffff10' }]} />
      <View style={[styles.shard, { left: '60%', width: 6, backgroundColor: '#ffffff0d' }]} />
      <View style={[styles.shard, { left: '70%', width: 2, backgroundColor: accent + '4d' }]} />

      {/* Texto difuminado del juego */}
      <Txt
        numberOfLines={1}
        style={[styles.label, { fontSize, lineHeight: fontSize * 1.05 }]}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#101218', overflow: 'hidden' },
  shard: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    transform: [{ rotate: '-18deg' }],
  },
  label: {
    position: 'absolute',
    left: '26%',
    top: '10%',
    fontFamily: fonts.headingBold,
    color: '#ffffff0f',
    letterSpacing: 1,
  },
});
