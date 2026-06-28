/**
 * Botón de acción flotante (FAB) — fiel a Figma 589:3829.
 * Rounded rect 58×58, borderRadius 20, gradiente rojo top→bottom,
 * borde sutil blanco y sombra roja difuminada.
 */
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { IconPlus } from '@/design-system/icons';

interface FabProps {
  onPress?: () => void;
  style?: ViewStyle;
}

export function Fab({ onPress, style }: FabProps) {
  return (
    // Capa exterior: lleva la sombra roja (no puede tener overflow:hidden).
    <View style={[styles.shadow, style]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
        {/* Gradiente de fondo (top #ff3b52 → bottom #e11d36). */}
        <Svg width={58} height={58} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="fabG" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff3b52" />
              <Stop offset="1" stopColor="#e11d36" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="58" height="58" fill="url(#fabG)" />
        </Svg>
        <View style={styles.iconWrap}>
          <IconPlus size={26} color="#ffffff" strokeWidth={2.5} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: 58,
    height: 58,
    borderRadius: 20,
    shadowColor: '#ff2d46',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  btn: {
    width: 58,
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88 },
  iconWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
