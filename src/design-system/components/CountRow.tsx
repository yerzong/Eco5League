/**
 * Fila de conteo bajo los filtros: total a la izquierda, desglose a la derecha.
 * Ej. "12 eventos"  ·  "1 en curso · 8 próximos".
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface CountRowProps {
  left: string;
  right?: string;
  style?: ViewStyle;
}

export function CountRow({ left, right, style }: CountRowProps) {
  return (
    <View style={[styles.row, style]}>
      <Txt style={styles.text}>{left}</Txt>
      {right ? <Txt style={styles.text}>{right}</Txt> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary },
});
