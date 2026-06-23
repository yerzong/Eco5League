/**
 * Fila de configuración: ícono opcional + etiqueta + chevron a la derecha.
 * Reutilizable en Perfil, Ajustes y cualquier lista de navegación.
 */
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { IconChevronRight, type IconProps } from '@/design-system/icons';
import { Txt } from './Txt';

type IconCmp = React.ComponentType<IconProps>;

interface SettingRowProps {
  label: string;
  onPress?: () => void;
  icon?: IconCmp;
  /** Pinta la fila en rojo (acción destructiva, ej. cerrar sesión). */
  danger?: boolean;
  style?: ViewStyle;
}

export function SettingRow({ label, onPress, icon: Icon, danger, style }: SettingRowProps) {
  const color = danger ? theme.colors.brandRed : theme.colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}>
      {Icon ? <Icon size={20} color={color} strokeWidth={1.8} /> : null}
      <Txt variant="bodyMedium" style={[styles.label, { color }]}>
        {label}
      </Txt>
      {!danger ? (
        <IconChevronRight size={18} color={theme.colors.textTertiary} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    height: 48,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
  },
  pressed: { opacity: 0.7 },
  label: { flex: 1, fontSize: 14 },
});
