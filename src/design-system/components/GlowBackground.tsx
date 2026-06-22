/**
 * Glow radial de marca (rojo) para fondos de pantallas heroicas (splash, login).
 * Se coloca de forma absoluta detrás del contenido.
 */
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { theme } from '@/design-system/theme';

interface GlowBackgroundProps {
  /** Diámetro del glow en px. */
  size?: number;
  /** Centro vertical (0–1) dentro del contenedor. Default 0.4. */
  centerY?: number;
  color?: string;
}

export function GlowBackground({
  size = 560,
  centerY = 0.4,
  color = theme.colors.brandRed,
}: GlowBackgroundProps) {
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) =>
    setDims({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      {dims.w > 0 && (
        <Svg width={dims.w} height={dims.h}>
          <Defs>
            {/* userSpaceOnUse: cx/cy/r en px reales → glow localizado, no escala al rect */}
            <RadialGradient
              id="glow"
              gradientUnits="userSpaceOnUse"
              cx={dims.w / 2}
              cy={dims.h * centerY}
              r={size / 2}>
              <Stop offset="0" stopColor={color} stopOpacity={0.45} />
              <Stop offset="0.55" stopColor={color} stopOpacity={0.08} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={dims.w} height={dims.h} fill="url(#glow)" />
        </Svg>
      )}
    </View>
  );
}
