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
      placeholderTextColor={theme.colors.textOnGlassFaint}
      multiline={multiline}
      keyboardType={numeric ? 'number-pad' : 'default'}
      maxLength={maxLength}
      style={[styles.input, multiline && styles.multiline, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    borderRadius: 14,
    color: '#f6f6f8',
    fontFamily: fonts.glassBodyMedium,
    fontSize: 15,
  },
  multiline: { height: 96, paddingTop: 15, textAlignVertical: 'top' },
});
