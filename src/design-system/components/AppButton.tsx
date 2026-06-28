/**
 * Botón del nuevo sistema "glass" (Figma · "🔘 Botones nuevo estilo").
 * Variantes: primary (degradado + glow) · secondary (vidrio) · ghost · danger.
 * Estados: default · pressed · disabled · loading.
 * Genérico y reutilizable; reemplaza a AngularButton en el flujo de acceso.
 */
import React, { useId, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import type { IconProps } from '@/design-system/icons';
import { Txt } from './Txt';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  /** Ícono opcional a la izquierda de la etiqueta. */
  icon?: React.ComponentType<IconProps>;
  /** Ocupa todo el ancho disponible (default true). */
  fullWidth?: boolean;
  style?: ViewStyle;
}

/** Color del contenido (texto/ícono) por variante y estado. */
function contentColor(variant: AppButtonVariant, disabled?: boolean): string {
  if (disabled) {
    return variant === 'ghost' || variant === 'secondary'
      ? 'rgba(255,255,255,0.28)'
      : 'rgba(255,255,255,0.32)';
  }
  if (variant === 'ghost') return theme.colors.redSoft;
  return theme.colors.white;
}

/** Estilo del contenedor según variante / estado (sin el degradado, que va en SVG). */
function containerStyle(
  variant: AppButtonVariant,
  disabled: boolean,
  pressed: boolean,
): ViewStyle {
  if (disabled) {
    if (variant === 'secondary') {
      return { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1 };
    }
    if (variant === 'ghost') return {};
    return { backgroundColor: 'rgba(255,255,255,0.08)' };
  }
  switch (variant) {
    case 'primary':
      return {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        ...glow,
      };
    case 'danger':
      return {
        backgroundColor: pressed ? '#a60d1f' : theme.colors.redDanger,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
        ...(pressed ? null : glow),
      };
    case 'secondary':
      return {
        backgroundColor: pressed ? 'rgba(255,255,255,0.04)' : theme.colors.glassFillStrong,
        borderWidth: 1,
        borderColor: theme.colors.glassBorderStrong,
      };
    case 'ghost':
      return pressed ? { backgroundColor: 'rgba(255,255,255,0.08)' } : {};
  }
}

const glow: ViewStyle = {
  shadowColor: '#ff2d46',
  shadowOpacity: 0.4,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon: Icon,
  fullWidth = true,
  style,
}: AppButtonProps) {
  const gradId = useId();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) =>
    setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const inactive = disabled || loading;
  const showGradient = variant === 'primary' && !disabled;
  const color = contentColor(variant, disabled);

  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        containerStyle(variant, disabled, pressed),
        style,
      ]}>
      {({ pressed }) => (
        <>
          {showGradient && size.w > 0 ? (
            <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={pressed ? '#e02a40' : theme.colors.redBright} />
                  <Stop offset="1" stopColor={pressed ? '#b80e20' : theme.colors.redDeep} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width={size.w} height={size.h} rx={16} fill={`url(#${gradId})`} />
            </Svg>
          ) : null}
          <View style={styles.row}>
            {loading ? (
              <ActivityIndicator size="small" color={color} />
            ) : Icon ? (
              <Icon size={20} color={color} strokeWidth={2} />
            ) : null}
            <Txt style={[styles.label, { color }]}>{loading ? 'Cargando' : label}</Txt>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  label: { fontFamily: fonts.label, fontSize: 15, letterSpacing: 0.3 },
});
