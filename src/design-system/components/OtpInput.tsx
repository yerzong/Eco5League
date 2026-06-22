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
}

export function OtpInput({
  length = 6,
  value,
  onChangeText,
  autoFocus,
  error,
}: OtpInputProps) {
  const ref = useRef<TextInput>(null);
  const focus = () => ref.current?.focus();

  return (
    <Pressable style={styles.row} onPress={focus}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i] ?? '';
        const active = i === value.length;
        return (
          <View
            key={i}
            style={[
              styles.box,
              active && styles.boxActive,
              error && styles.boxError,
            ]}>
            <Txt style={styles.digit}>{char}</Txt>
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
        autoFocus={autoFocus}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'center' },
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
  boxActive: { borderColor: theme.colors.brandRedHover },
  boxError: { borderColor: theme.colors.danger },
  digit: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: theme.colors.textPrimary,
  },
  hidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});
