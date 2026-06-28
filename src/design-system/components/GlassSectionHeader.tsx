/**
 * Encabezado de sección del rediseño glass: guion rojo + "// LABEL".
 * Reutilizable en las pantallas principales SA.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

export function GlassSectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.tick} />
      <Txt style={styles.label}>{label}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  tick: { width: 14, height: 2, borderRadius: 2, backgroundColor: '#ff2d46' },
  label: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(246,246,248,0.7)',
  },
});
