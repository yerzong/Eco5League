/**
 * Bloque de carga (skeleton) con pulso de opacidad animado (hilo nativo).
 * Pieza base para construir pantallas de carga progresiva.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, type ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height = 12, radius = 6, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: theme.colors.skeleton },
        style,
        { opacity },
      ]}
    />
  );
}
