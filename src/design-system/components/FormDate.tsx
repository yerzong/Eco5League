/**
 * Campo de fecha de formulario (estilo glass). Editable con teclado numérico
 * (máscara DD/MM/YYYY) y un ícono de calendario que abre un DateTimePicker en
 * un bottom sheet animado manualmente (scrim fade + sheet slide) — igual que
 * GlassDateInput en CrearEventoScreen para evitar el corte negro de animationType="slide".
 */
import React, { useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fonts } from '@/design-system/tokens/typography';
import { IconCalendar } from '@/design-system/icons';
import { Txt } from './Txt';

export function maskDate(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  let r = d.slice(0, 2);
  if (d.length > 2) r += '/' + d.slice(2, 4);
  if (d.length > 4) r += '/' + d.slice(4);
  return r;
}

function dateToString(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

interface FormDateProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  style?: ViewStyle;
}

export function FormDate({ value, onChange, placeholder = 'DD/MM/AAAA', label, style }: FormDateProps) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(new Date(2026, 0, 1));
  const translateY = useRef(new Animated.Value(600)).current;
  const scrimAnim = useRef(new Animated.Value(0)).current;

  const openSheet = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }),
      Animated.timing(scrimAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const closeSheet = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 600, duration: 220, useNativeDriver: true }),
      Animated.timing(scrimAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => { setOpen(false); cb?.(); });
  };

  const confirm = () => closeSheet(() => onChange?.(dateToString(temp)));

  return (
    <View style={style}>
      <View style={styles.box}>
        <TextInput
          value={value}
          onChangeText={t => onChange?.(maskDate(t))}
          placeholder={placeholder}
          placeholderTextColor="rgba(246,246,248,0.35)"
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
        />
        <Pressable onPress={openSheet} hitSlop={12}>
          <IconCalendar size={18} color="rgba(246,246,248,0.55)" strokeWidth={2} />
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closeSheet()}>
        {/* Scrim — fade independiente, cubre toda la pantalla */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.scrim, { opacity: scrimAnim }]}
          pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()} />
        </Animated.View>

        {/* Sheet — sube desde abajo, sin afectar al scrim */}
        <View style={styles.anchor} pointerEvents="box-none">
          <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
            <View style={styles.header}>
              <Pressable onPress={() => closeSheet()} hitSlop={8}>
                <Txt style={styles.headerCancel}>Cancelar</Txt>
              </Pressable>
              {label ? <Txt style={styles.headerLabel}>{label}</Txt> : null}
              <Pressable onPress={confirm} hitSlop={8}>
                <Txt style={styles.headerConfirm}>Listo</Txt>
              </Pressable>
            </View>
            <DateTimePicker
              value={temp}
              mode="date"
              display="inline"
              themeVariant="dark"
              accentColor="#ff2d46"
              onChange={(_, d) => d && setTemp(d)}
              style={styles.picker}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 54,
    paddingLeft: 16,
    paddingRight: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 14,
  },
  input: { flex: 1, fontFamily: fonts.glassBodyMedium, fontSize: 15, color: '#f6f6f8', padding: 0 },

  scrim: { backgroundColor: 'rgba(0,0,0,0.55)' },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#0d0d10',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  headerCancel: { fontFamily: fonts.glassBodyMedium, fontSize: 15, color: 'rgba(246,246,248,0.55)' },
  headerLabel: { fontFamily: fonts.glassBodyBold, fontSize: 13, letterSpacing: 1, color: 'rgba(246,246,248,0.45)' },
  headerConfirm: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ff5f73' },
  picker: { alignSelf: 'center' },
});
