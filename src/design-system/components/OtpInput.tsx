/**
 * Entrada de código OTP de N dígitos (casillas).
 * Usa un único TextInput invisible que captura el código; las casillas
 * muestran cada dígito y resaltan la casilla activa.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface OtpInputProps {
  length?: number;
  value: string;
  onChangeText: (code: string) => void;
  autoFocus?: boolean;
  /** Marca todas las casillas en estado de error (borde rojo). */
  error?: boolean;
  /** Si es false, no se puede editar (ej. ya verificado). */
  editable?: boolean;
  /** Estilo "glass" (rediseño de acceso). */
  glass?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChangeText,
  autoFocus,
  error,
  editable = true,
  glass,
}: OtpInputProps) {
  const ref = useRef<TextInput>(null);
  const focus = () => ref.current?.focus();

  return (
    <Pressable style={[styles.row, glass && styles.rowGlass]} onPress={editable ? focus : undefined}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i] ?? '';
        const active = i === value.length;
        return (
          <View
            key={i}
            style={[
              styles.box,
              glass && styles.boxGlass,
              glass && !!char && styles.boxGlassFilled,
              active && (glass ? styles.boxActiveGlass : styles.boxActive),
              error && (glass ? styles.boxErrorGlass : styles.boxError),
            ]}>
            <Txt style={[styles.digit, ...(glass ? [styles.digitGlass] : [])]}>{char}</Txt>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={t => onChangeText(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
        editable={editable}
        autoFocus={autoFocus}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'center' },
  rowGlass: { gap: 10 },
  box: {
    flex: 1,
    maxWidth: 50,
    height: 58,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxGlass: {
    maxWidth: undefined,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: theme.colors.glassBorder,
  },
  boxGlassFilled: { backgroundColor: 'rgba(255,255,255,0.07)' },
  boxActive: { borderColor: theme.colors.brandRedHover },
  boxActiveGlass: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,59,82,0.9)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  boxError: { borderColor: theme.colors.danger },
  boxErrorGlass: { borderWidth: 1.5, borderColor: 'rgba(255,59,82,0.9)' },
  digit: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: theme.colors.textPrimary,
  },
  digitGlass: { fontFamily: fonts.glassTitle, fontSize: 22, color: '#f6f6f8' },
  hidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});
