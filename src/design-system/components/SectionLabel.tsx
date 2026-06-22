/**
 * Encabezado de sección dentro de un formulario: barra roja + texto rojo.
 * Ej: "▎ DATOS PERSONALES". Reutilizable en perfil, gestión, etc.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

export function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.bar} />
      <Txt style={styles.text}>{label.toUpperCase()}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  bar: { width: 4, height: 14, backgroundColor: theme.colors.brandRed },
  text: {
    fontFamily: theme.fonts.button,
    fontSize: 12,
    color: theme.colors.brandRed,
    letterSpacing: 0.5,
  },
});
