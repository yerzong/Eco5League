/**
 * Tarjeta de evento grande (rediseño glass): cover con degradado + marca de
 * agua del juego + logo + badge de estado, y cuerpo con título, subtítulo y
 * footer (equipos · fechas). Genérica: recibe props ya formateadas.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconChevronRight } from '@/design-system/icons';
import { Txt } from './Txt';

interface GlassEventCardProps {
  code: string;
  game: string;
  title: string;
  subtitle: string;
  /** Color final del degradado del cover. */
  accent?: string;
  statusLabel: string;
  statusColor: string;
  teamsLabel?: string;
  teamsColor?: string;
  dateLabel?: string;
  onPress?: () => void;
}

function withAlpha(hex: string, alpha: string): string {
  return hex.length === 7 ? `${hex}${alpha}` : hex;
}

export function GlassEventCard({
  code,
  game,
  title,
  subtitle,
  accent = '#80141f',
  statusLabel,
  statusColor,
  teamsLabel,
  teamsColor = theme.colors.textOnGlassDim,
  dateLabel,
  onPress,
}: GlassEventCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Cover */}
      <View style={styles.cover}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="evtCover" x1="0" y1="0" x2="1" y2="0.4">
              <Stop offset="0" stopColor="#14080a" />
              <Stop offset="1" stopColor={accent} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#evtCover)" />
        </Svg>
        <Txt style={styles.watermark} numberOfLines={1}>
          {game.toUpperCase()}
        </Txt>
        <View style={styles.coverTop}>
          <View style={styles.logo}>
            <Txt style={styles.logoText}>{code}</Txt>
          </View>
          <View style={[styles.badge, { backgroundColor: withAlpha(statusColor, '24'), borderColor: withAlpha(statusColor, '66') }]}>
            <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
            <Txt style={[styles.badgeText, { color: statusColor }]}>{statusLabel.toUpperCase()}</Txt>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.titleBlock}>
          <Txt style={styles.title} numberOfLines={1}>
            {title}
          </Txt>
          <Txt style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Txt>
        </View>
        <View style={styles.divider} />
        <View style={styles.footer}>
          {teamsLabel ? (
            <View style={styles.teams}>
              <View style={[styles.teamsDot, { backgroundColor: teamsColor }]} />
              <Txt style={[styles.teamsText, { color: teamsColor }]}>{teamsLabel}</Txt>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.date}>
            {dateLabel ? <Txt style={styles.dateText}>{dateLabel}</Txt> : null}
            <IconChevronRight size={14} color={theme.colors.textOnGlassFaint} strokeWidth={2} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: 'hidden',
  },
  cover: { height: 128, overflow: 'hidden' },
  watermark: {
    position: 'absolute',
    left: 40,
    top: 30,
    fontFamily: fonts.glassTitle,
    fontSize: 96,
    letterSpacing: -4,
    color: 'rgba(255,255,255,0.05)',
  },
  coverTop: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontFamily: fonts.glassTitle, fontSize: 18, color: theme.colors.white },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontFamily: fonts.glassBodyBold, fontSize: 10.5, letterSpacing: 0.6 },
  body: { padding: 20, gap: 16, backgroundColor: 'rgba(10,10,12,0.5)' },
  titleBlock: { gap: 6 },
  title: { fontFamily: fonts.glassTitle, fontSize: 24, letterSpacing: -0.3, color: '#f6f6f8' },
  subtitle: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.textOnGlassDim },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teams: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  teamsDot: { width: 7, height: 7, borderRadius: 4 },
  teamsText: { fontFamily: fonts.glassBodyBold, fontSize: 13 },
  date: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontFamily: fonts.glassBodyMedium, fontSize: 12.5, color: theme.colors.textOnGlassDim },
});
