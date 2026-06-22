/**
 * Botón de regresar (chevron izquierdo). Por defecto navega hacia atrás.
 * Reutilizable en pantallas apiladas (registro, perfil, OTP…).
 */
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/design-system/theme';
import { IconChevronLeft } from '@/design-system/icons';

interface BackButtonProps {
  /** Acción al pulsar. Default: navigation.goBack(). */
  onPress?: () => void;
  color?: string;
  style?: ViewStyle;
}

export function BackButton({ onPress, color = theme.colors.textPrimary, style }: BackButtonProps) {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={onPress ?? (() => navigation.goBack())}
      hitSlop={12}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}>
      <IconChevronLeft size={28} color={color} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
});
