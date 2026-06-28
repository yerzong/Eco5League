/**
 * Panel de Filtros (bottom sheet glass): grupos de chips multi-selección +
 * "Limpiar" + CTA con degradado y conteo dinámico. Fiel a Figma 595:4561.
 */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { fonts } from '@/design-system/tokens/typography';
import { type FilterSelection, toggleSelection } from '@/shared/filters';
import { BottomSheet, type BottomSheetHandle } from './BottomSheet';
import { Txt } from './Txt';

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
  /** Sustantivo del CTA en minúsculas: "eventos", "resultados"… */
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

  const noun = itemNoun.toLowerCase();

  return (
    <BottomSheet ref={ref} header={header} glass onClose={onClose}>
      <View style={styles.body}>
        {groups.map(g => (
          <View key={g.key}>
            <Txt style={styles.groupLabel}>{g.label}</Txt>
            <View style={styles.chips}>
              {g.options.map(o => {
                const active = (draft[g.key] ?? []).includes(o.key);
                return (
                  <Pressable
                    key={o.key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setDraft(d => toggleSelection(d, g.key, o.key))}>
                    <Txt style={active ? styles.chipLabelActive : styles.chipLabelIdle}>
                      {o.label}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => {
            onApply(draft);
            ref.current?.close();
          }}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="ctaFilter" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ff3b52" />
                <Stop offset="1" stopColor="#e11d36" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={18} fill="url(#ctaFilter)" />
          </Svg>
          <Txt style={styles.ctaLabel}>{`Ver ${computeCount(draft)} ${noun}`}</Txt>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.glassTitle, fontSize: 24, letterSpacing: -0.4, color: '#f6f6f8' },
  clear: { fontFamily: fonts.glassBodyBold, fontSize: 14, color: '#ff808f' },

  body: { paddingBottom: 8 },

  groupLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: 'rgba(246,246,248,0.4)',
    paddingTop: 22,
    paddingBottom: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#ef2b3e',
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.32,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chipLabelActive: { fontFamily: fonts.glassBodyBold, fontSize: 13.5, color: '#ffffff' },
  chipLabelIdle: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: 'rgba(246,246,248,0.6)' },

  cta: {
    height: 56,
    borderRadius: 18,
    marginTop: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  ctaPressed: { opacity: 0.88 },
  ctaLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
