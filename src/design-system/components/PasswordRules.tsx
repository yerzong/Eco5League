/**
 * Lista de requisitos de contraseña con ✓/✗ en vivo según lo que se escribe.
 * Fiel a OB-03d. Reutilizable en registro / cambio de contraseña.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { passwordChecks } from '@/shared/utils/validation';
import { Txt } from './Txt';

const OK = '#2ea846';
const RULES: { key: 'length' | 'upper' | 'number' | 'special'; label: string }[] = [
  { key: 'length', label: 'Mínimo 8 caracteres' },
  { key: 'upper', label: 'Al menos 1 mayúscula' },
  { key: 'number', label: 'Al menos 1 número' },
  { key: 'special', label: 'Al menos 1 carácter especial' },
];

export function PasswordRules({ value }: { value: string }) {
  const checks = passwordChecks(value);
  return (
    <View style={styles.wrap}>
      {RULES.map(r => {
        const ok = checks[r.key];
        return (
          <View key={r.key} style={styles.row}>
            <Txt style={[styles.mark, { color: ok ? OK : theme.colors.danger }]}>
              {ok ? '✓' : '✗'}
            </Txt>
            <Txt style={styles.label}>{r.label}</Txt>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  mark: { fontFamily: theme.fonts.label, fontSize: 12, width: 12 },
  label: { fontFamily: theme.fonts.body, fontSize: 12, color: '#5b616b' },
});
