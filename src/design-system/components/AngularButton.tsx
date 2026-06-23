/**
 * Botón "hero" con esquinas cortadas (angular) y degradado de marca.
 * Usado en Splash/Login. Para botones estándar usar <Button>.
 */
import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { Txt } from './Txt';

interface AngularButtonProps {
  label: string;
  onPress?: () => void;
  /** Tamaño del corte de esquina (px). */
  chamfer?: number;
  height?: number;
  from?: string;
  to?: string;
  /** Color del borde del polígono (opcional). */
  borderColor?: string;
  style?: ViewStyle;
}

export function AngularButton({
  label,
  onPress,
  chamfer = 12,
  height = 60,
  from = '#ec2740',
  to = '#9e0c21',
  borderColor,
  style,
}: AngularButtonProps) {
  const [w, setW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  // Polígono con esquinas superior-izquierda e inferior-derecha cortadas.
  const points = w
    ? `${chamfer},0 ${w},0 ${w},${height - chamfer} ${w - chamfer},${height} 0,${height} 0,${chamfer}`
    : '';

  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      style={({ pressed }) => [
        { height },
        styles.wrap,
        pressed && styles.pressed,
        style,
      ]}>
      {w > 0 && (
        <Svg width={w} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="angBtn" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={from} />
              <Stop offset="1" stopColor={to} />
            </LinearGradient>
          </Defs>
          <Polygon
            points={points}
            fill="url(#angBtn)"
            stroke={borderColor}
            strokeWidth={borderColor ? 1.5 : 0}
          />
        </Svg>
      )}
      <View style={styles.labelWrap}>
        <Txt variant="title" color="white" style={styles.label} numberOfLines={1}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', justifyContent: 'center' },
  pressed: { opacity: 0.9 },
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // lineHeight holgado para que los acentos (Ó, etc.) no se recorten arriba.
  label: { letterSpacing: 1, lineHeight: 26 },
});
