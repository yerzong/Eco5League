/**
 * Fila de conteo del rediseño glass: "N noun" (izq.) + texto secundario (der.).
 * Reutilizable en listas SA.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface GlassCountRowProps {
  count: number | string;
  noun: string;
  right?: string;
}

export function GlassCountRow({ count, noun, right }: GlassCountRowProps) {
  return (
    <View style={styles.row}>
      <Txt style={styles.left}>
        <Txt style={styles.strong}>{count}</Txt>
        {` ${noun}`}
      </Txt>
      {right ? <Txt style={styles.right}>{right}</Txt> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { fontFamily: fonts.glassBodyMedium, fontSize: 12.5, color: theme.colors.textOnGlassDim },
  strong: { fontFamily: fonts.glassBodyBold, color: '#f6f6f8' },
  right: { fontFamily: fonts.glassBodyMedium, fontSize: 12.5, color: theme.colors.textOnGlassDim },
});
