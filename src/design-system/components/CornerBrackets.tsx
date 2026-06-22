/**
 * Esquinas angulares decorativas (motivo de marca ECO5).
 * Superiores en rojo, inferiores en gris. Se colocan de forma absoluta.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';

interface CornerBracketsProps {
  /** Margen desde los bordes de la pantalla. */
  inset?: number;
  /** Largo de cada brazo de la "L". */
  length?: number;
  thickness?: number;
  topColor?: string;
  bottomColor?: string;
  /** Mostrar esquinas superiores. Default true. */
  top?: boolean;
  /** Mostrar esquinas inferiores. Default true. */
  bottom?: boolean;
}

export function CornerBrackets({
  inset = 20,
  length = 34,
  thickness = 3,
  topColor = theme.colors.brandRed,
  bottomColor = theme.colors.borderStrong,
  top = true,
  bottom = true,
}: CornerBracketsProps) {
  const h = { width: length, height: thickness };
  const v = { width: thickness, height: length };
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {top && (
        <>
          {/* Superior izquierda */}
          <View style={[styles.abs, { top: inset, left: inset }]}>
            <View style={[h, { backgroundColor: topColor }]} />
            <View style={[v, { backgroundColor: topColor }]} />
          </View>
          {/* Superior derecha */}
          <View style={[styles.abs, styles.right, { top: inset, right: inset }]}>
            <View style={[h, { backgroundColor: topColor }]} />
            <View style={[v, styles.selfEnd, { backgroundColor: topColor }]} />
          </View>
        </>
      )}
      {bottom && (
        <>
          {/* Inferior izquierda */}
          <View style={[styles.abs, styles.bottom, { bottom: inset, left: inset }]}>
            <View style={[v, { backgroundColor: bottomColor }]} />
            <View style={[h, { backgroundColor: bottomColor }]} />
          </View>
          {/* Inferior derecha */}
          <View
            style={[
              styles.abs,
              styles.bottom,
              styles.right,
              { bottom: inset, right: inset },
            ]}>
            <View style={[v, styles.selfEnd, { backgroundColor: bottomColor }]} />
            <View style={[h, { backgroundColor: bottomColor }]} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
  right: { alignItems: 'flex-end' },
  bottom: { justifyContent: 'flex-end' },
  selfEnd: { alignSelf: 'flex-end' },
});
