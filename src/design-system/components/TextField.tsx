/**
 * Campo de texto con etiqueta, ícono izquierdo y (opcional) acción derecha.
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
import { IconEye, IconEyeOff, type IconProps } from '@/design-system/icons';
import { Txt } from './Txt';

type IconCmp = React.ComponentType<IconProps>;

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Ícono Tabler a la izquierda. */
  icon?: IconCmp;
  /** Si es contraseña: muestra ojo para alternar visibilidad. */
  password?: boolean;
  /** Mensaje de error: pinta el borde de rojo y lo muestra debajo. */
  error?: string;
}

export function TextField({
  label,
  icon: Icon,
  password,
  error,
  ...inputProps
}: TextFieldProps) {
  const [hidden, setHidden] = useState(!!password);

  return (
    <View style={styles.wrap}>
      {label ? (
        <Txt variant="label" color="textSecondary" style={styles.label}>
          {label.toUpperCase()}
        </Txt>
      ) : null}
      <View style={[styles.box, error ? styles.boxError : null]}>
        {Icon ? (
          <Icon size={20} color={theme.colors.textTertiary} strokeWidth={1.75} />
        ) : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...inputProps}
        />
        {password ? (
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
  label: { letterSpacing: 0.5 },
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
});
