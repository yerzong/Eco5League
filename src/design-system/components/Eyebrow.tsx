/**
 * Etiqueta de sección con barra roja: "▎ // ACCESO".
 * Patrón de marca que encabeza secciones/pantallas.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

export function Eyebrow({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.bar} />
      <Txt style={styles.text}>{label.toUpperCase()}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  bar: { width: 4, height: 16, backgroundColor: theme.colors.brandRed },
  text: {
    fontFamily: theme.fonts.meta,
    fontSize: 12,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
});
