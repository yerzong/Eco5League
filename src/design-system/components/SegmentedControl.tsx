/**
 * Control segmentado (toggle de 2+ opciones). El segmento activo se pinta
 * en rojo de marca. Genérico: recibe segmentos { key, label }.
 */
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

export interface Segment {
  key: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
  style?: ViewStyle;
}

export function SegmentedControl({ segments, value, onChange, style }: SegmentedControlProps) {
  return (
    <View style={[styles.track, style]}>
      {segments.map(s => {
        const active = s.key === value;
        return (
          <Pressable
            key={s.key}
            onPress={() => onChange(s.key)}
            style={[styles.seg, active && styles.segActive]}>
            <Txt style={[styles.label, active ? styles.labelActive : styles.labelIdle]}>
              {s.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    height: 46,
    padding: 4,
    backgroundColor: theme.colors.surfacePill,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.sm,
  },
  seg: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.sm },
  segActive: { backgroundColor: theme.colors.brandRed },
  label: { fontFamily: fonts.label, fontSize: 14 },
  labelActive: { color: theme.colors.white },
  labelIdle: { color: theme.colors.textSecondary },
});
