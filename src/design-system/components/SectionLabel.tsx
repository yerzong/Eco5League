/**
 * Encabezado de sección dentro de un formulario: barra roja + texto rojo.
 * Ej: "▎ DATOS PERSONALES". Reutilizable en perfil, gestión, etc.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

export function SectionLabel({ label, glass }: { label: string; glass?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={[styles.bar, glass && styles.barGlass]} />
      <Txt style={[styles.text, ...(glass ? [styles.textGlass] : [])]}>{label.toUpperCase()}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  bar: { width: 4, height: 14, backgroundColor: theme.colors.brandRed },
  barGlass: { borderRadius: 2, backgroundColor: theme.colors.redBright },
  text: {
    fontFamily: theme.fonts.button,
    fontSize: 12,
    color: theme.colors.brandRed,
    letterSpacing: 0.5,
  },
  textGlass: {
    fontFamily: theme.fonts.glassBodyBold,
    color: 'rgba(255,59,82,0.95)',
    letterSpacing: 1.5,
  },
});
