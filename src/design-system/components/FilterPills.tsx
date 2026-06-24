/**
 * Fila horizontal de "pills" de filtro (scroll horizontal). El seleccionado
 * se pinta en rojo de marca. Genérico: recibe opciones { key, label }.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

export interface FilterOption<K extends string = string> {
  key: K;
  label: string;
}

interface FilterPillsProps<K extends string> {
  options: FilterOption<K>[];
  value: K;
  onChange: (key: K) => void;
  /** Pills completamente redondeados (rounded-full), como en Usuarios. */
  round?: boolean;
}

export function FilterPills<K extends string>({
  options,
  value,
  onChange,
  round,
}: FilterPillsProps<K>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.pill, round && styles.pillRound, active && styles.pillActive]}>
            <Txt
              style={[
                styles.text,
                ...(round ? [styles.textRound] : []),
                ...(active ? [styles.textActive] : []),
              ]}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: theme.spacing.sm, paddingVertical: 2 },
  // Padding de Figma (px-12 py-7). Como todos los chips usan la misma fuente
  // (Inter SemiBold), quedan a la misma altura sin recortar el texto.
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },
  // Variante redondeada (fiel a Figma 333:2396): alto FIJO 31px, px-14, texto 12,
  // rounded-full. Alto fijo + centrado para que no crezca por el line-height de RN.
  pillRound: {
    height: 31,
    paddingVertical: 0,
    paddingHorizontal: 14,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: theme.colors.brandRed,
    borderColor: theme.colors.brandRed,
  },
  // Todos en Inter SemiBold (fiel a v2). No seleccionado: gris. Seleccionado: blanco.
  text: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textSecondary },
  textRound: { fontSize: 12 },
  textActive: { color: theme.colors.white },
});
