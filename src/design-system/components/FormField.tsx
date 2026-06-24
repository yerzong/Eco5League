/**
 * Campo de formulario: etiqueta en mayúsculas (con asterisco opcional de
 * requerido) + el control hijo. Reutilizable en wizards y formularios.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FormField({ label, required, children, style }: FormFieldProps) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.labelRow}>
        <Txt style={styles.label}>{label}</Txt>
        {required ? <Txt style={styles.star}>*</Txt> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  label: { fontFamily: fonts.label, fontSize: 12, letterSpacing: 0.48, color: theme.colors.textSecondary },
  star: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.brandRed },
});
