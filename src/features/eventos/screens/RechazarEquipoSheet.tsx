/**
 * EV ✦ Sheet para rechazar inscripción de equipo. Fiel a Figma 658:4121.
 * Chips de motivo (multi-selección) + nota opcional + botones Cancelar/Rechazar.
 */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { BottomSheet, type BottomSheetHandle } from '@/design-system/components/BottomSheet';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';
import type { EventTeam } from '@/services';

/* ─── Motivos de rechazo ─── */

const REASONS = [
  'Roster incompleto',
  'Datos inválidos',
  'Jugador en otra org',
  'Inscripción duplicada',
];

/* ─── Props ─── */

interface RechazarEquipoSheetProps {
  team: EventTeam;
  onConfirm: (id: string, reasons: string, note: string) => void;
  onClose: () => void;
}

/* ─── Componente ─── */

export function RechazarEquipoSheet({ team, onConfirm, onClose }: RechazarEquipoSheetProps) {
  const ref = useRef<BottomSheetHandle>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [note, setNote] = useState('');

  function toggle(r: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r); else next.add(r);
      return next;
    });
  }

  function handleConfirm() {
    if (selected.size === 0) return;
    onConfirm(team.id, [...selected].join(', '), note);
    ref.current?.close();
  }

  const canConfirm = selected.size > 0;

  const header = (
    <Txt style={s.title}>Rechazar inscripción</Txt>
  );

  return (
    <BottomSheet ref={ref} header={header} glass onClose={onClose}>
      <View style={s.body}>

        {/* Motivo */}
        <Txt style={s.sectionLabel}>MOTIVO</Txt>
        <View style={s.chipsWrap}>
          {REASONS.map(r => {
            const active = selected.has(r);
            return (
              <Pressable
                key={r}
                style={({ pressed }) => [s.chip, active ? s.chipActive : s.chipIdle, pressed && { opacity: 0.8 }]}
                onPress={() => toggle(r)}>
                <Txt style={active ? s.chipActiveText : s.chipIdleText}>{r}</Txt>
              </Pressable>
            );
          })}
        </View>

        {/* Nota */}
        <View style={s.noteWrap}>
          <Txt style={s.noteLabel}>NOTA (OPCIONAL)</Txt>
          <TextInput
            style={s.noteInput}
            multiline
            placeholder="Mensaje para el equipo…"
            placeholderTextColor="rgba(246,246,248,0.42)"
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
        </View>

        {/* Acciones */}
        <View style={s.actionRow}>
          <Pressable
            style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.8 }]}
            onPress={() => ref.current?.close()}>
            <Txt style={s.cancelLabel}>Cancelar</Txt>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.rechazarBtn, !canConfirm && s.rechazarDisabled, pressed && { opacity: 0.85 }]}
            onPress={handleConfirm}
            disabled={!canConfirm}>
            <Txt style={s.rechazarLabel}>Rechazar</Txt>
          </Pressable>
        </View>

      </View>
    </BottomSheet>
  );
}

/* ─── Styles ─── */

const s = StyleSheet.create({
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 22,
    color: '#f6f6f8',
    marginBottom: 2,
  },

  body: { paddingBottom: 4 },

  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: 'rgba(246,246,248,0.45)',
    marginTop: 18,
    marginBottom: 12,
  },

  /* Chips */
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chipIdle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: '#e82d42',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chipIdleText: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: 'rgba(246,246,248,0.6)',
  },
  chipActiveText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: '#ffffff',
  },

  /* Nota */
  noteWrap: { marginTop: 20, gap: 8 },
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
    paddingTop: 13,
    paddingBottom: 13,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    color: '#f6f6f8',
  },

  /* Acciones */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  rechazarBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#d11429',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  rechazarDisabled: { opacity: 0.45 },
  rechazarLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
