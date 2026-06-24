/**
 * Panel de Filtros (bottom sheet genérico): grupos de chips multi-selección +
 * "Limpiar" + CTA "VER N …". Mantiene un borrador interno; al aplicar, lo
 * confirma y cierra con animación. Reutilizable en todas las entidades.
 */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { type FilterSelection, toggleSelection } from '@/shared/filters';
import { BottomSheet, type BottomSheetHandle } from './BottomSheet';
import { Txt } from './Txt';
import { FilterChip } from './FilterChip';
import { GradientButton } from './GradientButton';

interface DisplayOption {
  key: string;
  label: string;
}
interface DisplayGroup {
  key: string;
  label: string;
  options: DisplayOption[];
}

interface FilterSheetProps {
  groups: DisplayGroup[];
  /** Selección aplicada al abrir (borrador inicial). */
  initial: FilterSelection;
  /** Sustantivo del CTA: "EVENTOS", "RESULTADOS"… */
  itemNoun: string;
  /** Calcula el nº de resultados para el borrador (etiqueta del CTA). */
  computeCount: (sel: FilterSelection) => number;
  onApply: (sel: FilterSelection) => void;
  onClose: () => void;
}

export function FilterSheet({
  groups,
  initial,
  itemNoun,
  computeCount,
  onApply,
  onClose,
}: FilterSheetProps) {
  const ref = useRef<BottomSheetHandle>(null);
  const [draft, setDraft] = useState<FilterSelection>(initial);

  const header = (
    <View style={styles.header}>
      <Txt style={styles.title}>Filtros</Txt>
      <Pressable onPress={() => setDraft({})} hitSlop={8}>
        <Txt style={styles.clear}>Limpiar</Txt>
      </Pressable>
    </View>
  );

  return (
    <BottomSheet ref={ref} header={header} onClose={onClose}>
      <View style={styles.body}>
        {groups.map(g => (
          <View key={g.key} style={styles.group}>
            <Txt style={styles.groupLabel}>{g.label}</Txt>
            <View style={styles.chips}>
              {g.options.map(o => (
                <FilterChip
                  key={o.key}
                  label={o.label}
                  selected={(draft[g.key] ?? []).includes(o.key)}
                  onPress={() => setDraft(d => toggleSelection(d, g.key, o.key))}
                />
              ))}
            </View>
          </View>
        ))}
        <GradientButton
          label={`VER ${computeCount(draft)} ${itemNoun}`}
          onPress={() => {
            onApply(draft);
            ref.current?.close();
          }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.headingBold, fontSize: 22, color: theme.colors.textPrimary },
  clear: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.brandRed },
  body: { gap: theme.spacing['2xl'], paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.lg },
  group: { gap: theme.spacing.md },
  groupLabel: { fontFamily: fonts.label, fontSize: 12, letterSpacing: 0.6, color: theme.colors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
});
