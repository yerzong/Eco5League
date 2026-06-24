/**
 * Panel de Ordenar (bottom sheet genérico): criterio (radios) + dirección
 * (segmented) + CTA "APLICAR ORDEN". Mantiene un borrador interno y, al
 * aplicar, lo confirma y cierra con animación. Reutilizable por entidad.
 */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { BottomSheet, type BottomSheetHandle } from './BottomSheet';
import { Txt } from './Txt';
import { SegmentedControl } from './SegmentedControl';
import { GradientButton } from './GradientButton';

export interface SortOption {
  key: string;
  label: string;
}

interface SortSheetProps {
  options: SortOption[];
  /** Etiquetas de las dos direcciones (índice 0 y 1). */
  directions: [string, string];
  initialCriteria: string;
  initialDir: 0 | 1;
  onApply: (criteria: string, dir: 0 | 1) => void;
  onClose: () => void;
}

export function SortSheet({
  options,
  directions,
  initialCriteria,
  initialDir,
  onApply,
  onClose,
}: SortSheetProps) {
  const ref = useRef<BottomSheetHandle>(null);
  const [criteria, setCriteria] = useState(initialCriteria);
  const [dir, setDir] = useState<0 | 1>(initialDir);

  const header = <Txt style={styles.title}>Ordenar</Txt>;

  return (
    <BottomSheet ref={ref} header={header} onClose={onClose}>
      <View style={styles.body}>
        <View style={styles.group}>
          <Txt style={styles.groupLabel}>ORDENAR POR</Txt>
          {options.map(o => {
            const active = o.key === criteria;
            return (
              <Pressable key={o.key} style={styles.option} onPress={() => setCriteria(o.key)}>
                <Txt style={[styles.optLabel, active ? styles.optActive : styles.optIdle]}>
                  {o.label}
                </Txt>
                <View style={[styles.radio, active && styles.radioOn]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.groupTight}>
          <Txt style={styles.groupLabel}>DIRECCIÓN</Txt>
          <SegmentedControl
            segments={[
              { key: '0', label: directions[0] },
              { key: '1', label: directions[1] },
            ]}
            value={String(dir)}
            onChange={k => setDir(k === '1' ? 1 : 0)}
          />
        </View>

        <GradientButton
          label="APLICAR ORDEN"
          onPress={() => {
            onApply(criteria, dir);
            ref.current?.close();
          }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.headingBold, fontSize: 22, color: theme.colors.textPrimary },
  body: { gap: theme.spacing.xl, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.lg },
  group: { gap: theme.spacing.xs },
  groupTight: { gap: theme.spacing.sm },
  groupLabel: { fontFamily: fonts.label, fontSize: 12, letterSpacing: 0.6, color: theme.colors.textSecondary },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  optLabel: { fontSize: 15 },
  optActive: { fontFamily: fonts.label, color: theme.colors.textPrimary },
  optIdle: { fontFamily: fonts.body, color: theme.colors.textSecondary },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: theme.colors.brandRed },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.brandRed },
});
