/**
 * Botón "Filtros" (ícono + etiqueta + contador opcional de filtros activos).
 * Abre el panel de filtros al tocarlo.
 */
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconAdjustmentsHorizontal } from '@/design-system/icons';
import { Txt } from './Txt';

interface FiltersButtonProps {
  label?: string;
  /** Nº de filtros activos; muestra el badge rojo si es > 0. */
  count?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function FiltersButton({
  label = 'Filtros',
  count = 0,
  onPress,
  style,
}: FiltersButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed, style]}>
      <IconAdjustmentsHorizontal size={16} color={theme.colors.textPrimary} strokeWidth={2} />
      <Txt style={styles.label}>{label}</Txt>
      {count > 0 ? (
        <View style={styles.badge}>
          <Txt style={styles.badgeText}>{count}</Txt>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Alto FIJO 34px + radio 8 (fiel a Figma).
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: 8,
  },
  pressed: { opacity: 0.7 },
  label: { fontFamily: fonts.label, fontSize: 13, lineHeight: 16, color: theme.colors.textPrimary },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.label, fontSize: 10, color: theme.colors.white },
});
