/**
 * Control segmentado (toggle de 2+ opciones). El segmento activo se indica
 * con un píldora animada que se desliza — igual que el tab indicator del
 * resto de la app. Genérico: recibe segmentos { key, label }.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
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
  const [layouts, setLayouts] = useState<Array<{ x: number; width: number } | null>>(
    () => segments.map(() => null),
  );
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;
  const initialized = useRef(false);

  const onSegLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts(prev => {
      const next = [...prev];
      next[i] = { x, width };
      return next;
    });
  };

  useEffect(() => {
    const idx = segments.findIndex(s => s.key === value);
    const l = layouts[idx];
    if (!l) return;
    if (!initialized.current) {
      initialized.current = true;
      indicatorX.setValue(l.x);
      indicatorW.setValue(l.width);
      return;
    }
    Animated.parallel([
      Animated.spring(indicatorX, { toValue: l.x, useNativeDriver: false, speed: 18, bounciness: 6 }),
      Animated.spring(indicatorW, { toValue: l.width, useNativeDriver: false, speed: 18, bounciness: 6 }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, layouts]);

  return (
    <View style={[styles.track, style]}>
      <Animated.View style={[styles.indicator, { left: indicatorX, width: indicatorW }]} />
      {segments.map((s, i) => {
        const active = s.key === value;
        return (
          <Pressable
            key={s.key}
            onPress={() => onChange(s.key)}
            onLayout={onSegLayout(i)}
            style={styles.seg}>
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
    gap: 5,
    height: 52,
    padding: 5,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
  },
  indicator: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    borderRadius: 12,
    backgroundColor: theme.colors.redDeep,
    shadowColor: '#ff2d46',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  seg: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  label: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5 },
  labelActive: { fontFamily: fonts.glassBodyBold, color: '#f6f6f8' },
  labelIdle: { color: 'rgba(246,246,248,0.55)' },
});
