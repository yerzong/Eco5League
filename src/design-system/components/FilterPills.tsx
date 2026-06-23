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
}

export function FilterPills<K extends string>({
  options,
  value,
  onChange,
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
            style={[styles.pill, active && styles.pillActive]}>
            <Txt style={active ? [styles.text, styles.textActive] : styles.text}>
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
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },
  pillActive: {
    backgroundColor: theme.colors.brandRed,
    borderColor: theme.colors.brandRed,
  },
  text: { fontFamily: fonts.button, fontSize: 12, color: theme.colors.textSecondary },
  textActive: { color: theme.colors.white },
});
