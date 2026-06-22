/**
 * Barra de progreso. `progress` de 0 a 1. Se anima suavemente al cambiar.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';

export function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.max(0, Math.min(1, progress));
  const anim = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: clamped,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [clamped, anim]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    borderRadius: 99,
    backgroundColor: theme.colors.surface2,
    overflow: 'hidden',
  },
  fill: {
    height: 5,
    borderRadius: 99,
    backgroundColor: theme.colors.brandRedHover,
  },
});
