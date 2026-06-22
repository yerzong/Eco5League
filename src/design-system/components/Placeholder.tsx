/**
 * Pantalla-esqueleto temporal durante el maquetado.
 * Muestra el nombre de la pantalla y su código de Figma (ej. "OB-02").
 * Se irá reemplazando por el maquetado real de cada pantalla.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { Txt } from './Txt';
import { theme } from '@/design-system/theme';

interface PlaceholderProps {
  title: string;
  /** Código de la pantalla en Figma, ej. "OB-02 · Login". */
  figmaRef?: string;
  subtitle?: string;
}

export function Placeholder({ title, figmaRef, subtitle }: PlaceholderProps) {
  return (
    <Screen>
      <View style={styles.center}>
        {figmaRef ? (
          <Txt variant="overline" color="brandRed" style={styles.ref}>
            {figmaRef}
          </Txt>
        ) : null}
        <Txt variant="h2">{title}</Txt>
        {subtitle ? (
          <Txt variant="bodySm" color="textSecondary" style={styles.sub}>
            {subtitle}
          </Txt>
        ) : null}
        <Txt variant="caption" color="textTertiary" style={styles.todo}>
          Pendiente de maquetar
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  ref: { letterSpacing: 1.5 },
  sub: { textAlign: 'center', marginTop: theme.spacing.xs },
  todo: { marginTop: theme.spacing.lg },
});
