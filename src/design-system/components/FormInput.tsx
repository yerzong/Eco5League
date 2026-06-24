/**
 * Input de formulario (estilo oscuro hundido). Soporta una línea o multilínea.
 * Reutilizable en wizards/formularios (crear evento, etc.).
 */
import React from 'react';
import { StyleSheet, TextInput, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';

interface FormInputProps {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  /** Solo números: muestra el teclado numérico y filtra todo lo no-dígito. */
  numeric?: boolean;
  /** Máximo de caracteres permitidos. */
  maxLength?: number;
  style?: ViewStyle;
}

export function FormInput({
  value,
  onChangeText,
  placeholder,
  multiline,
  numeric,
  maxLength,
  style,
}: FormInputProps) {
  const handleChange = (t: string) => {
    onChangeText?.(numeric ? t.replace(/[^0-9]/g, '') : t);
  };
  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textTertiary}
      multiline={multiline}
      keyboardType={numeric ? 'number-pad' : 'default'}
      maxLength={maxLength}
      style={[styles.input, multiline && styles.multiline, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 10,
    color: theme.colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  multiline: { height: 76, paddingTop: 13, textAlignVertical: 'top' },
});
