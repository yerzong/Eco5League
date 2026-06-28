/**
 * Panel de Ordenar (bottom sheet glass): criterio (radios) + dirección
 * (segmented con píldora deslizante animada) + CTA. Fiel a Figma 594:4574.
 */
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { fonts } from '@/design-system/tokens/typography';
import { BottomSheet, type BottomSheetHandle } from './BottomSheet';
import { Txt } from './Txt';

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

const SEG_PADDING = 5;
const SEG_GAP = 5;

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
  const [segWidth, setSegWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(initialDir)).current;

  // Ancho de la píldora = mitad del espacio interior del seg control.
  const pillW = segWidth > 0 ? (segWidth - SEG_PADDING * 2 - SEG_GAP) / 2 : 0;

  // Desplazamiento: 0 = izquierda, pillW + gap = derecha.
  const pillX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, pillW + SEG_GAP],
  });

  const handleDirChange = (i: 0 | 1) => {
    setDir(i);
    Animated.spring(slideAnim, {
      toValue: i,
      useNativeDriver: true,
      damping: 20,
      stiffness: 280,
      mass: 0.8,
    }).start();
  };

  const header = <Txt style={styles.title}>Ordenar</Txt>;

  return (
    <BottomSheet ref={ref} header={header} glass onClose={onClose}>
      <View style={styles.body}>
        {/* ORDENAR POR */}
        <View>
          <Txt style={styles.groupLabel}>ORDENAR POR</Txt>
          {options.map(o => {
            const active = o.key === criteria;
            return (
              <Pressable key={o.key} style={styles.row} onPress={() => setCriteria(o.key)}>
                <Txt style={[styles.rowLabel, active ? styles.rowActive : styles.rowIdle]}>
                  {o.label}
                </Txt>
                <View style={[styles.radio, active && styles.radioOn]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* DIRECCIÓN con píldora deslizante */}
        <View>
          <Txt style={[styles.groupLabel, styles.groupLabelDir]}>DIRECCIÓN</Txt>
          <View
            style={styles.seg}
            onLayout={e => setSegWidth(e.nativeEvent.layout.width)}>
            {/* Píldora deslizante (debajo de los textos) */}
            {pillW > 0 && (
              <Animated.View
                style={[
                  styles.segPill,
                  { width: pillW, transform: [{ translateX: pillX }] },
                ]}
              />
            )}
            {/* Tabs */}
            {([0, 1] as const).map(i => (
              <Pressable key={i} style={styles.segTab} onPress={() => handleDirChange(i)}>
                <Txt style={dir === i ? styles.segLabelActive : styles.segLabelIdle}>
                  {directions[i]}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => {
            onApply(criteria, dir);
            ref.current?.close();
          }}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="ctaSort" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ff3b52" />
                <Stop offset="1" stopColor="#e11d36" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={18} fill="url(#ctaSort)" />
          </Svg>
          <Txt style={styles.ctaLabel}>Aplicar orden</Txt>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 24,
    letterSpacing: -0.4,
    color: '#f6f6f8',
  },
  body: { paddingBottom: 8 },

  groupLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: 'rgba(246,246,248,0.4)',
    paddingTop: 20,
    paddingBottom: 4,
  },
  groupLabelDir: { paddingTop: 22 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  rowLabel: { fontSize: 16 },
  rowActive: { fontFamily: fonts.glassBodyBold, color: '#f6f6f8' },
  rowIdle: { fontFamily: fonts.glassBodyMedium, color: 'rgba(246,246,248,0.5)' },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(246,246,246,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderWidth: 2, borderColor: '#ff2d46' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff2d46' },

  seg: {
    flexDirection: 'row',
    gap: SEG_GAP,
    padding: SEG_PADDING,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    marginTop: 8,
  },
  // Píldora que desliza detrás de las etiquetas.
  segPill: {
    position: 'absolute',
    top: SEG_PADDING,
    bottom: SEG_PADDING,
    left: SEG_PADDING,
    borderRadius: 12,
    backgroundColor: '#ef2b3e',
  },
  segTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  segLabelActive: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: '#f6f6f8',
  },
  segLabelIdle: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: 'rgba(246,246,246,0.55)',
  },

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
