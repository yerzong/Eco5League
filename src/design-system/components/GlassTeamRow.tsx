/**
 * Fila de equipo (rediseño glass): escudo coloreado + nombre/organización ·
 * roster + punto de estado + chevron. Genérica. (SAN ✦ Equipos)
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { IconChevronRight } from '@/design-system/icons';
import { Txt } from './Txt';

interface GlassTeamRowProps {
  initials: string;
  /** Color de acento del escudo (tinte + borde + iniciales). */
  color: string;
  name: string;
  /** Organización + roster ya unidos (ej. "Ozone Esports · 4/4 roster"). */
  subtitle: string;
  statusColor: string;
  onPress?: () => void;
}

export function GlassTeamRow({
  initials,
  color,
  name,
  subtitle,
  statusColor,
  onPress,
}: GlassTeamRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View
        style={[
          styles.crest,
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
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <IconChevronRight size={16} color={theme.colors.textOnGlassFaint} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  crest: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.glassTitle, fontSize: 13 },
  nameCol: { flex: 1, gap: 2 },
  name: { fontFamily: fonts.glassBodySemibold, fontSize: 14, color: '#f6f6f8' },
  sub: { fontFamily: fonts.glassBodyMedium, fontSize: 11, color: 'rgba(246,246,248,0.5)' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
});
