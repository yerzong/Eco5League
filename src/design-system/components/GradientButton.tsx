/**
 * Botón de ancho completo con degradado rojo de marca y sombra (CTA principal
 * de los bottom sheets: "APLICAR ORDEN", "VER N RESULTADOS").
 */
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function GradientButton({ label, onPress, style }: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gradBtn" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ec2740" />
            <Stop offset="1" stopColor="#9e0c21" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={10} fill="url(#gradBtn)" />
      </Svg>
      <Txt style={styles.label}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: theme.colors.brandRed,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  pressed: { opacity: 0.9 },
  label: { fontFamily: fonts.headingBold, fontSize: 15, color: theme.colors.white, letterSpacing: 0.3 },
});
