/**
 * Campo de búsqueda con ícono de lupa. Reutilizable en Eventos, Staff,
 * Equipos, Usuarios… Ancho fluido (se adapta al contenedor).
 */
import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { IconSearch } from '@/design-system/icons';

interface SearchFieldProps {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Buscar…',
  style,
}: SearchFieldProps) {
  return (
    <View style={[styles.box, style]}>
      <IconSearch size={18} color={theme.colors.textTertiary} strokeWidth={1.9} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    height: 48,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    padding: 0,
  },
});
