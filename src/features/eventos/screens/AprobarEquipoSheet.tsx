/**
 * EV ✦ Sheet de confirmación para aprobar inscripción. Fiel a Figma 658:4040.
 * Muestra mini-card del equipo + texto de aviso + botones Cancelar / ✓ Aprobar.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomSheet, type BottomSheetHandle } from '@/design-system/components/BottomSheet';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';
import { withAlpha } from '@/design-system/colorUtils';
import type { EventTeam } from '@/services';

interface AprobarEquipoSheetProps {
  team: EventTeam;
  onConfirm: (id: string) => void;
  onClose: () => void;
}

export function AprobarEquipoSheet({ team, onConfirm, onClose }: AprobarEquipoSheetProps) {
  const ref = useRef<BottomSheetHandle>(null);

  function handleConfirm() {
    onConfirm(team.id);
    ref.current?.close();
  }

  const header = <Txt style={s.title}>Aprobar equipo</Txt>;

  return (
    <BottomSheet ref={ref} header={header} glass onClose={onClose}>
      <View style={s.body}>

        {/* Mini-card del equipo */}
        <View style={s.teamCard}>
          <View style={[
            s.crest,
            { backgroundColor: withAlpha(team.color, 0.18), borderColor: withAlpha(team.color, 0.6) },
          ]}>
            <Txt style={[s.crestText, { color: team.color }]}>{team.initials}</Txt>
          </View>

          <View style={s.nameCol}>
            <Txt style={s.teamName}>{team.name}</Txt>
            <Txt style={s.teamOrg}>{team.org}</Txt>
          </View>

          <View style={s.rosterBadge}>
            <Txt style={s.rosterBadgeText}>Roster {team.rosterCurrent}/{team.rosterMax}</Txt>
          </View>
        </View>

        {/* Aviso */}
        <Txt style={s.description}>
          Al aprobar, {team.name} ocupa un cupo del evento y entra al sorteo del cuadro.
        </Txt>

        {/* Botones */}
        <View style={s.actionRow}>
          <Pressable
            style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.8 }]}
            onPress={() => ref.current?.close()}>
            <Txt style={s.cancelLabel}>Cancelar</Txt>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.approveBtn, pressed && { opacity: 0.85 }]}
            onPress={handleConfirm}>
            <Txt style={s.approveLabel}>✓ Aprobar</Txt>
          </Pressable>
        </View>

      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 22,
    color: '#f6f6f8',
    marginBottom: 2,
  },

  body: { paddingBottom: 20 },

  /* Mini-card */
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  crest: {
    width: 44,
    height: 44,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: { fontFamily: fonts.glassTitle, fontSize: 14 },
  nameCol: { flex: 1, gap: 3 },
  teamName: { fontFamily: fonts.glassBodySemibold, fontSize: 15, color: '#f6f6f8' },
  teamOrg: { fontFamily: fonts.glassBodyMedium, fontSize: 12, color: 'rgba(246,246,248,0.5)' },
  rosterBadge: {
    backgroundColor: 'rgba(52,215,127,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52,215,127,0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rosterBadgeText: { fontFamily: fonts.glassBodyBold, fontSize: 11.5, color: '#5fe49a' },

  /* Aviso */
  description: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.55)',
    lineHeight: 18,
    marginTop: 14,
  },

  /* Acciones */
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
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
  cancelLabel: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ffffff', letterSpacing: 0.3 },
  approveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(52,215,127,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(52,215,127,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveLabel: { fontFamily: fonts.glassBodyBold, fontSize: 14.5, color: '#5fe49a', letterSpacing: 0.3 },
});
