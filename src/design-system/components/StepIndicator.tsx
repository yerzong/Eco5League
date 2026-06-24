/**
 * Indicador de pasos de un wizard: círculos numerados conectados por líneas
 * (completado = rojo con ✓, actual = rojo con nº, futuro = gris), etiquetas y
 * leyenda "Paso X de N · …". Genérico por nº de pasos.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconCheck } from '@/design-system/icons';
import { Txt } from './Txt';

interface StepIndicatorProps {
  /** Etiquetas de cada paso (ej. ["Identidad", "Formato", "Fechas"]). */
  steps: string[];
  /** Índice del paso actual (0-based). */
  current: number;
  /** Leyenda inferior (ej. "Paso 1 de 3 · Identidad"). */
  caption: string;
}

export function StepIndicator({ steps, current, caption }: StepIndicatorProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {steps.map((_, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <React.Fragment key={i}>
              {i > 0 ? (
                <View style={[styles.line, i <= current && styles.lineDone]} />
              ) : null}
              <View style={[styles.circle, (done || active) && styles.circleOn]}>
                {done ? (
                  <IconCheck size={15} color={theme.colors.white} strokeWidth={3} />
                ) : (
                  <Txt style={[styles.num, ...(active ? [styles.numOn] : [])]}>{i + 1}</Txt>
                )}
              </View>
            </React.Fragment>
          );
        })}
      </View>

      <View style={styles.labels}>
        {steps.map((s, i) => (
          <Txt key={s} style={[styles.label, ...(i === current ? [styles.labelOn] : [])]}>
            {s}
          </Txt>
        ))}
      </View>

      <Txt style={styles.caption}>{caption}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', height: 28 },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1d23',
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
  },
  circleOn: { backgroundColor: theme.colors.brandRed, borderWidth: 0 },
  num: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.textTertiary },
  numOn: { color: theme.colors.white },
  line: { flex: 1, height: 2, backgroundColor: theme.colors.borderSubtle },
  lineDone: { backgroundColor: theme.colors.brandRed },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: fonts.bodyMedium, fontSize: 10, color: theme.colors.textTertiary },
  labelOn: { color: theme.colors.textPrimary },
  caption: { fontFamily: fonts.body, fontSize: 11, color: theme.colors.textTertiary },
});
