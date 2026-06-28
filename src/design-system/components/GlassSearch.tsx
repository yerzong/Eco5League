/**
 * Buscador del rediseño glass: input de vidrio con ícono de lupa.
 * Reutilizable en las listas SA (Eventos · Staff · Equipos · Usuarios).
 */
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconSearch } from '@/design-system/icons';

interface GlassSearchProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}

export function GlassSearch({ value, onChangeText, placeholder }: GlassSearchProps) {
  return (
    <View style={styles.box}>
      <IconSearch size={18} color="rgba(246,246,248,0.5)" strokeWidth={2} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(246,246,248,0.42)"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 15,
    color: '#f6f6f8',
  },
});
