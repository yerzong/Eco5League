/**
 * Campo de fecha de formulario (estilo oscuro). Editable con teclado numérico
 * (máscara DD/MM/YYYY) y un ícono de calendario que abre un DateTimePicker en
 * un bottom sheet. Genérico: reutilizable en cualquier formulario.
 */
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconCalendar } from '@/design-system/icons';
import { Txt } from './Txt';

/** Enmascara dígitos como "01/01/2026". */
export function maskDate(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  let r = d.slice(0, 2);
  if (d.length > 2) r += '/' + d.slice(2, 4);
  if (d.length > 4) r += '/' + d.slice(4);
  return r;
}

/** Date → "01/01/2026". */
function dateToString(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

interface FormDateProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Título del sheet del calendario (ej. "INICIO"). */
  label?: string;
  style?: ViewStyle;
}

export function FormDate({
  value,
  onChange,
  placeholder = 'DD/MM/AAAA',
  label,
  style,
}: FormDateProps) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(new Date(2026, 0, 1));

  const confirm = () => {
    onChange?.(dateToString(temp));
    setOpen(false);
  };

  return (
    <View style={style}>
      <View style={styles.box}>
        <TextInput
          value={value}
          onChangeText={t => onChange?.(maskDate(t))}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
        />
        <Pressable onPress={() => setOpen(true)} hitSlop={10}>
          <IconCalendar size={18} color={theme.colors.textSecondary} strokeWidth={2} />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable onPress={() => setOpen(false)} hitSlop={8}>
              <Txt variant="button" color="textSecondary">Cancelar</Txt>
            </Pressable>
            {label ? <Txt variant="label" color="textSecondary">{label}</Txt> : null}
            <Pressable onPress={confirm} hitSlop={8}>
              <Txt variant="button" color="brandRedHover">Listo</Txt>
            </Pressable>
          </View>
          <DateTimePicker
            value={temp}
            mode="date"
            display="inline"
            themeVariant="dark"
            accentColor={theme.colors.brandRed}
            onChange={(_, d) => d && setTemp(d)}
            style={styles.picker}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    height: 50,
    paddingLeft: 14,
    paddingRight: 12,
    backgroundColor: theme.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: 10,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: theme.colors.textPrimary, padding: 0 },

  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: theme.colors.surface1,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderColor: theme.colors.borderDefault,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  picker: { alignSelf: 'center' },
});
