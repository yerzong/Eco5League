/**
 * Botón base. Variantes: primary (rojo marca), secondary (superficie), ghost.
 */
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.textPrimary} />
      ) : (
        <Txt
          variant="button"
          color={variant === 'secondary' ? 'textPrimary' : 'white'}
          style={styles.label}>
          {label.toUpperCase()}
        </Txt>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  label: {
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: theme.colors.brandRed },
  secondary: {
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },
  ghost: { backgroundColor: 'transparent' },
};
