/**
 * Campo de texto con etiqueta, ícono izquierdo y (opcional) acción derecha.
 * Soporta: requerido (*), error, contraseña (ojo), deshabilitado (candado), multilínea.
 * Reutilizable en todos los formularios (login, registro, perfil…).
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '@/design-system/theme';
import { IconEye, IconEyeOff, IconLock, type IconProps } from '@/design-system/icons';
import { Txt } from './Txt';

type IconCmp = React.ComponentType<IconProps>;

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Marca el campo como obligatorio (asterisco rojo). */
  required?: boolean;
  /** Muestra "· Opcional" junto a la etiqueta. */
  optional?: boolean;
  /** Ícono Tabler a la izquierda. */
  icon?: IconCmp;
  /** Si es contraseña: muestra ojo para alternar visibilidad. */
  password?: boolean;
  /** Mensaje de error: pinta el borde de rojo y lo muestra debajo. */
  error?: string;
  /** Solo pinta el borde de rojo, sin mensaje (para errores compartidos). */
  invalid?: boolean;
  /** Deshabilitado: fondo más oscuro, no editable, candado a la derecha. */
  disabled?: boolean;
  /** Área de texto multilínea (bio). */
  multiline?: boolean;
}

export function TextField({
  label,
  required,
  optional,
  icon: Icon,
  password,
  error,
  invalid,
  disabled,
  multiline,
  ...inputProps
}: TextFieldProps) {
  const [hidden, setHidden] = useState(!!password);

  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Txt variant="label" color="textSecondary" style={styles.label}>
            {label.toUpperCase()}
          </Txt>
          {required ? <Txt style={styles.req}>*</Txt> : null}
          {optional ? (
            <Txt variant="caption" color="textTertiary">
              · Opcional
            </Txt>
          ) : null}
        </View>
      ) : null}
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          disabled && styles.boxDisabled,
          (error || invalid) ? styles.boxError : null,
        ]}>
        {Icon ? (
          <Icon size={20} color={theme.colors.textTertiary} strokeWidth={1.75} />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={hidden}
          autoCapitalize="none"
          editable={!disabled}
          multiline={multiline}
          {...inputProps}
        />
        {disabled ? (
          <IconLock size={18} color={theme.colors.textTertiary} strokeWidth={1.75} />
        ) : password ? (
          <TouchableOpacity onPress={() => setHidden(h => !h)} hitSlop={8}>
            {hidden ? (
              <IconEye size={20} color={theme.colors.textSecondary} strokeWidth={1.75} />
            ) : (
              <IconEyeOff size={20} color={theme.colors.textSecondary} strokeWidth={1.75} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
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
  req: { color: theme.colors.brandRedHover, fontFamily: theme.fonts.label, fontSize: 12 },
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
  boxMultiline: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
  },
  boxDisabled: {
    backgroundColor: '#101216',
  },
  boxError: {
    borderColor: theme.colors.danger,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    padding: 0,
  },
  inputMultiline: {
    height: '100%',
    textAlignVertical: 'top',
  },
});
