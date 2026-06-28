/**
 * Campo "tappable" (no editable a mano): fecha, selección de país, etc.
 * Muestra valor o placeholder + ícono derecho (chevron por defecto).
 * Reutilizable para date pickers y selects.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { IconChevronDown, type IconProps } from '@/design-system/icons';
import { Txt } from './Txt';

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  placeholder: string;
  /** Valor seleccionado; si está vacío se muestra el placeholder. */
  value?: string;
  error?: string;
  icon?: React.ComponentType<IconProps>;
  /** Ícono derecho. Default: chevron. */
  rightIcon?: React.ComponentType<IconProps>;
  /** Estilo "glass" (rediseño de acceso). */
  glass?: boolean;
  onPress?: () => void;
}

export function SelectField({
  label,
  required,
  placeholder,
  value,
  error,
  icon: Icon,
  rightIcon: RightIcon = IconChevronDown,
  glass,
  onPress,
}: SelectFieldProps) {
  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Txt
            variant="label"
            color={glass ? undefined : 'textSecondary'}
            style={[styles.label, ...(glass ? [styles.labelGlass] : [])]}>
            {label.toUpperCase()}
          </Txt>
          {required ? <Txt style={styles.req}>*</Txt> : null}
        </View>
      ) : null}
      <Pressable
        onPress={onPress}
        style={[styles.box, glass && styles.boxGlass, error ? styles.boxError : null]}>
        {Icon ? (
          <Icon
            size={20}
            color={glass ? 'rgba(246,246,248,0.5)' : theme.colors.textTertiary}
            strokeWidth={1.75}
          />
        ) : null}
        <Txt
          variant="body"
          color={value ? 'textPrimary' : 'textTertiary'}
          style={[styles.value, ...(glass && value ? [styles.valueGlass] : [])]}>
          {value || placeholder}
        </Txt>
        <RightIcon size={18} color={theme.colors.textSecondary} strokeWidth={1.75} />
      </Pressable>
      {error ? (
        <Txt variant="caption" color="danger">
          {error}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  labelRow: { flexDirection: 'row', gap: theme.spacing.xs },
  label: { letterSpacing: 0.5 },
  labelGlass: { fontFamily: theme.fonts.glassBodyBold, color: theme.colors.textOnGlassDim, letterSpacing: 1.5 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.sm,
  },
  boxGlass: {
    backgroundColor: theme.colors.glassFill,
    borderColor: theme.colors.glassBorder,
    borderRadius: 18,
    paddingHorizontal: 18,
  },
  boxError: { borderColor: theme.colors.danger },
  value: { flex: 1, fontSize: 14 },
  valueGlass: { fontFamily: theme.fonts.glassBodyMedium, fontSize: 15 },
  req: { color: theme.colors.brandRedHover, fontFamily: theme.fonts.label, fontSize: 12 },
});
