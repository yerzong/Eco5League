/**
 * Tarjeta de equipo pendiente de aprobación (rediseño glass).
 * Borde ámbar, escudo con tinte de color, botones Aprobar / Rechazar.
 * Reutilizable fuera del módulo de eventos. Fiel a Figma 641:3671.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { withAlpha } from '@/design-system/colorUtils';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';

interface EventoPendingTeamCardProps {
  initials: string;
  /** Color de acento del escudo (tinte + borde + iniciales). */
  color: string;
  name: string;
  /** Línea secundaria debajo del nombre (ej. "Org · 4/4 roster"). */
  subtitle: string;
  onPress?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function EventoPendingTeamCard({
  initials,
  color,
  name,
  subtitle,
  onPress,
  onApprove,
  onReject,
}: EventoPendingTeamCardProps) {
  return (
    <View style={styles.card}>
      {/* Fila superior: escudo + nombre — tappable para ver detalle */}
      <Pressable
        style={({ pressed }) => [styles.topRow, pressed && { opacity: 0.7 }]}
        onPress={onPress}
        disabled={!onPress}>
        <View
          style={[
            styles.crest,
            {
              backgroundColor: withAlpha(color, 0.16),
              borderColor: withAlpha(color, 0.55),
            },
          ]}>
          <Txt style={[styles.initials, { color }]}>{initials}</Txt>
        </View>
        <View style={styles.nameCol}>
          <Txt style={styles.name} numberOfLines={1}>
            {name}
          </Txt>
          <Txt style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Txt>
        </View>
      </Pressable>

      {/* Fila de acciones */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnApprove, pressed && styles.pressed]}
          onPress={onApprove}>
          <Txt style={styles.btnApproveLabel}>✓ Aprobar</Txt>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnReject, pressed && styles.pressed]}
          onPress={onReject}>
          <Txt style={styles.btnRejectLabel}>✕ Rechazar</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(246,166,35,0.3)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crest: {
    width: 42,
    height: 42,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.glassTitle,
    fontSize: 15,
  },
  nameCol: { flex: 1, gap: 2 },
  name: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 15,
    lineHeight: 18,
    color: '#f6f6f8',
  },
  subtitle: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    lineHeight: 15,
    color: 'rgba(246,246,248,0.5)',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnApprove: {
    backgroundColor: 'rgba(52,215,127,0.16)',
    borderColor: 'rgba(52,215,127,0.4)',
  },
  btnReject: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  btnApproveLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: '#5fe49a',
  },
  btnRejectLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: 'rgba(246,246,248,0.6)',
  },
  pressed: { opacity: 0.72 },
});
