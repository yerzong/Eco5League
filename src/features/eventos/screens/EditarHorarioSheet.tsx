/**
 * EV-01 · Editar horario (Figma 633-31044)
 *
 * Permite cambiar la fecha y hora de un partido próximo.
 * Toggle "Notificar a los equipos del cambio".
 * Textarea de nota opcional.
 */
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { IconChevronLeft } from '@/design-system/icons';
import { Txt } from '@/design-system/components/Txt';
import { FormDate } from '@/design-system/components/FormDate';
import { FormTime } from '@/design-system/components/FormTime';
import { fonts } from '@/design-system/tokens/typography';
import type { EventMatch } from '@/services';

/* ═══════════════════════════════════════════════════════════════════
   Props
═══════════════════════════════════════════════════════════════════ */

export interface EditarHorarioSheetProps {
  visible: boolean;
  match: EventMatch | null;
  onClose: () => void;
  onSave: (date: string, time: string, notify: boolean, note: string) => void;
}

/* ═══════════════════════════════════════════════════════════════════
   Componente principal
═══════════════════════════════════════════════════════════════════ */

export function EditarHorarioSheet({
  visible, match, onClose, onSave,
}: EditarHorarioSheetProps) {
  const [date, setDate]     = useState('');
  const [time, setTime]     = useState('');
  const [notify, setNotify] = useState(true);
  const [note, setNote]     = useState('');

  useEffect(() => {
    if (!match) return;
    setDate(match.scheduledDate);
    setTime(match.scheduledTime);
    setNotify(true);
    setNote('');
  }, [match]);

  if (!match) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent>
      <SafeAreaProvider>
      <SafeAreaView style={s.root}>

        {/* ── Contenido scrollable ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={s.header}>
            <Pressable onPress={onClose} hitSlop={14} style={s.backBtn}>
              <IconChevronLeft size={22} color="#f6f6f8" strokeWidth={2.5} />
            </Pressable>
            <Txt style={s.headerTitle}>Editar horario</Txt>
          </View>

          {/* Equipos */}
          <View style={s.teamsPill}>
            <Txt style={s.teamsPillText}>
              {match.team1.name}
              {'  '}
              <Txt style={s.teamsPillVs}>vs</Txt>
              {'  '}
              {match.team2.name}
            </Txt>
          </View>

          {/* Fecha + Hora (2 columnas) */}
          <View style={s.dateRow}>
            <View style={s.fieldWrapper}>
              <Txt style={s.fieldLabel}>FECHA</Txt>
              <FormDate
                value={date}
                onChange={setDate}
                placeholder="DD/MM/AAAA"
                label="Selecciona fecha"
              />
            </View>
            <View style={s.fieldWrapper}>
              <Txt style={s.fieldLabel}>HORA</Txt>
              <FormTime
                value={time}
                onChange={setTime}
                placeholder="HH:MM"
                label="Selecciona hora"
              />
            </View>
          </View>

          {/* Notificar toggle */}
          <View style={s.toggleRow}>
            <Txt style={s.toggleLabel}>Notificar a los equipos del cambio</Txt>
            <Switch
              value={notify}
              onValueChange={setNotify}
              trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#ff3b52' }}
              thumbColor="#ffffff"
              ios_backgroundColor="rgba(255,255,255,0.15)"
            />
          </View>

          {/* Nota */}
          <View style={s.noteContainer}>
            <Txt style={s.noteLabel}>NOTA (OPCIONAL)</Txt>
            <TextInput
              style={s.noteInput}
              multiline
              value={note}
              onChangeText={setNote}
              placeholder="Motivo del cambio de horario…"
              placeholderTextColor="rgba(246,246,248,0.42)"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* ── Footer fijo ── */}
        <View style={s.footer}>
          {/* Cancelar */}
          <Pressable
            style={({ pressed }) => [s.footerBtnGhost, pressed && { opacity: 0.75 }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancelar">
            <Txt style={s.footerBtnLabel}>Cancelar</Txt>
          </Pressable>

          {/* Guardar */}
          <Pressable
            style={({ pressed }) => [s.footerBtnPrimary, pressed && { opacity: 0.85 }]}
            onPress={() => onSave(date, time, notify, note)}
            accessibilityRole="button"
            accessibilityLabel="Guardar horario">
            <Svg style={StyleSheet.absoluteFill} width={300} height={54}>
              <Defs>
                <LinearGradient id="ehs_footerGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ff3b52" />
                  <Stop offset="1" stopColor="#e11d36" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="300" height="54" rx="16" fill="url(#ehs_footerGrad)" />
            </Svg>
            <Txt style={s.footerBtnLabel}>Guardar horario</Txt>
          </Pressable>
        </View>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Estilos
═══════════════════════════════════════════════════════════════════ */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060608' },
  content: {
    gap: 16,
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 20,
  },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', height: 40, gap: 14 },
  backBtn: { padding: 2 },
  headerTitle: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  /* Equipos */
  teamsPill: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsPillText: { fontFamily: fonts.glassBodyBold, fontSize: 14, color: '#f6f6f8' },
  teamsPillVs: { fontFamily: fonts.glassBodyBold, fontSize: 12, color: 'rgba(246,246,248,0.4)' },

  /* Fecha + Hora */
  dateRow: { flexDirection: 'row', gap: 12 },
  fieldWrapper: { flex: 1, gap: 8 },
  fieldLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.5)',
  },

  /* Toggle notificar */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  toggleLabel: {
    flex: 1,
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: '#f6f6f8',
  },

  /* Nota */
  noteContainer: { gap: 8 },
  noteLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.5)',
  },
  noteInput: {
    height: 96,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    color: '#f6f6f8',
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(9,9,11,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footerBtnGhost: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnPrimary: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  footerBtnLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
