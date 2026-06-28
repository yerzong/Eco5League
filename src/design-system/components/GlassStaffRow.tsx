/**
 * Fila de staff (rediseño glass): avatar coloreado + nombre/sub-roles + chip de
 * estado. Genérica: recibe props ya formateadas. (SAN ✦ Staff)
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { Txt } from './Txt';

interface GlassStaffRowProps {
  initials: string;
  /** Color de acento del avatar (tinte + borde + iniciales). */
  color: string;
  name: string;
  /** Sub-roles ya unidos (ej. "Caster · Moderador"). */
  subtitle: string;
  statusLabel: string;
  statusColor: string;
  onPress?: () => void;
}

export function GlassStaffRow({
  initials,
  color,
  name,
  subtitle,
  statusLabel,
  statusColor,
  onPress,
}: GlassStaffRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: withAlpha(color, 0.16), borderColor: withAlpha(color, 0.6) },
        ]}>
        <Txt style={[styles.initials, { color }]}>{initials}</Txt>
      </View>
      <View style={styles.nameCol}>
        <Txt style={styles.name} numberOfLines={1}>
          {name}
        </Txt>
        <Txt style={styles.sub} numberOfLines={1}>
          {subtitle}
        </Txt>
      </View>
      <View
        style={[
          styles.status,
          { backgroundColor: withAlpha(statusColor, 0.14), borderColor: withAlpha(statusColor, 0.35) },
        ]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Txt style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.glassTitle, fontSize: 15 },
  nameCol: { flex: 1, gap: 3 },
  name: { fontFamily: fonts.glassBodySemibold, fontSize: 15, color: '#f6f6f8' },
  sub: { fontFamily: fonts.glassBodyMedium, fontSize: 12, color: 'rgba(246,246,248,0.5)' },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 9,
    paddingRight: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: fonts.glassBodyBold, fontSize: 10.5 },
});
