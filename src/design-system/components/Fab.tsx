/**
 * Botón de acción flotante (FAB) con esquinas cortadas, anclado abajo-derecha.
 * Reutilizable para "agregar" en Eventos, Staff, Equipos…
 */
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { IconPlus } from '@/design-system/icons';

interface FabProps {
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
}

export function Fab({ onPress, size = 56, style }: FabProps) {
  const chamfer = 14;
  const points = `${chamfer},0 ${size},0 ${size},${size - chamfer} ${size - chamfer},${size} 0,${size} 0,${chamfer}`;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        { width: size, height: size },
        pressed && styles.pressed,
        style,
      ]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="fab" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#ec2740" />
            <Stop offset="1" stopColor="#9e0c21" />
          </LinearGradient>
        </Defs>
        <Polygon points={points} fill="url(#fab)" />
      </Svg>
      <View style={styles.iconWrap}>
        <IconPlus size={26} color="#ffffff" strokeWidth={2.4} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.9 },
  iconWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
