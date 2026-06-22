/**
 * Contenedor base de pantalla: fondo del tema + safe area.
 * Úsalo como raíz de toda pantalla para fondo y paddings consistentes.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/design-system/theme';

interface ScreenProps {
  children: React.ReactNode;
  /** Bordes a respetar en el safe area. Default: top + bottom. */
  edges?: Edge[];
  /** Padding horizontal estándar. Default: true. */
  padded?: boolean;
  style?: ViewStyle;
}

export function Screen({
  children,
  edges = ['top', 'bottom'],
  padded = true,
  style,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.container, padded && styles.padded, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bgBase,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
  },
});
