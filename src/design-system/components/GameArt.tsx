/**
 * Arte decorativo de un juego (banner o miniatura), generado con Views —
 * sin imágenes externas. Texto del juego difuminado + franjas de acento.
 * Reutilizable en tarjetas de evento (grande) y filas/miniaturas (compacto).
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface GameArtProps {
  /** Nombre/etiqueta del juego mostrado difuminado (ej. "VALORANT"). */
  label: string;
  /** Color de acento de las franjas. Default rojo de marca. */
  accent?: string;
  height?: number;
  /** Tamaño de fuente del texto difuminado. */
  fontSize?: number;
  /** Radio de las esquinas superiores (banner) o todas (miniatura). */
  radius?: number;
  style?: ViewStyle;
}

export function GameArt({
  label,
  accent = theme.colors.brandRed,
  height = 132,
  fontSize = 48,
  radius = theme.radius.md,
  style,
}: GameArtProps) {
  return (
    <View style={[styles.wrap, { height, borderRadius: radius }, style]}>
      {/* Franjas de acento */}
      <View style={[styles.stripe, { left: '38%', backgroundColor: '#ffffff10' }]} />
      <View style={[styles.stripe, { left: '52%', width: 6, backgroundColor: '#ffffff0d' }]} />
      <View style={[styles.stripe, { left: '64%', width: 2, backgroundColor: accent + '40' }]} />
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
  wrap: {
    backgroundColor: '#101218',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  stripe: { position: 'absolute', top: 0, bottom: 0, width: 3 },
  label: {
    fontFamily: fonts.headingBold,
    color: '#ffffff0f',
    letterSpacing: 1,
    paddingHorizontal: 12,
  },
});
