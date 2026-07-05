/**
 * EV ✦ Detalle del jugador — panel de pantalla completa, solo lectura.
 * Deslizamiento derecha→izquierda sobre EventoTeamDetailModal.
 * Fiel a Figma 660:4244.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgGrad, RadialGradient, Rect, Stop } from 'react-native-svg';
import { IconBrandXbox, IconChevronLeft, IconChevronRight } from '@/design-system/icons';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';

const SCREEN_W = Dimensions.get('window').width;

/* ─── Tipos exportados ─── */

export type PlayerRole = 'CAPITÁN' | 'TITULAR' | 'COACH';

export interface RosterPlayer {
  role: PlayerRole;
  initials: string;
  gamertag: string;
  name: string;
  teamName: string;
  twitch?: string;
  twitter?: string;
  instagram?: string;
  discord?: string;
  country: string;
  since: string;
  xboxVerified: boolean;
}

/* ─── Gradiente de hero por rol ─── */

const ROLE_GRAD: Record<PlayerRole, {
  from: string; to: string;
  avatarBg: string; avatarBorder: string; avatarText: string;
}> = {
  CAPITÁN: { from: '#171205', to: '#73520f', avatarBg: 'rgba(246,200,120,0.2)', avatarBorder: 'rgba(246,200,120,0.6)', avatarText: '#f6c878' },
  TITULAR: { from: '#17080d', to: '#5c1020', avatarBg: 'rgba(255,115,133,0.18)', avatarBorder: 'rgba(255,115,133,0.5)', avatarText: '#ff7385' },
  COACH:   { from: '#0a0e1a', to: '#122040', avatarBg: 'rgba(128,199,250,0.18)', avatarBorder: 'rgba(128,199,250,0.5)', avatarText: '#80c7fa' },
};

/* ─── Config de redes sociales ─── */

const SOCIAL_CFG = {
  twitch:    { label: 'Twitch',    badge: 'T',  color: '#9445f5', bg: 'rgba(148,69,245,0.18)',  border: 'rgba(148,69,245,0.4)'  },
  twitter:   { label: 'X',         badge: 'X',  color: '#ccd1db', bg: 'rgba(204,209,219,0.18)', border: 'rgba(204,209,219,0.4)' },
  instagram: { label: 'Instagram', badge: 'IG', color: '#e84594', bg: 'rgba(232,69,148,0.18)',  border: 'rgba(232,69,148,0.4)'  },
  discord:   { label: 'Discord',   badge: 'D',  color: '#5966f2', bg: 'rgba(89,102,242,0.18)',  border: 'rgba(89,102,242,0.4)'  },
} as const;

type SocialKey = keyof typeof SOCIAL_CFG;

/* ─── Props ─── */

interface JugadorDetallePanelProps {
  player: RosterPlayer | null;
  onClose: () => void;
}

/* ─── Componente ─── */

export function JugadorDetallePanel({ player, onClose }: JugadorDetallePanelProps) {
  const insets = useSafeAreaInsets();
  const slideX = useRef(new Animated.Value(SCREEN_W)).current;
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    Animated.spring(slideX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 120,
      friction: 18,
    }).start();
  }, []);

  function handleClose() {
    Animated.timing(slideX, {
      toValue: SCREEN_W,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onClose());
  }

  if (!player) return null;

  const grad = ROLE_GRAD[player.role];

  const socials = (['twitch', 'twitter', 'instagram', 'discord'] as SocialKey[]).filter(
    k => !!player[k],
  );

  const info = [
    { label: 'Gamertag Xbox', value: player.gamertag },
    { label: 'País',          value: player.country },
    { label: 'Rol',           value: player.role },
    { label: 'Antigüedad',    value: `Desde ${player.since}` },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.root, { transform: [{ translateX: slideX }] }]}>

      {/* Glow ámbar arriba (Figma 660:4245) */}
      <View style={s.glowWrap} pointerEvents="none">
        <Svg width={500} height={300}>
          <Defs>
            <RadialGradient id="jGlow" gradientUnits="userSpaceOnUse" cx="220" cy="0" r="280">
              <Stop offset="0"    stopColor="#c08012" stopOpacity={0.5} />
              <Stop offset="0.55" stopColor="#8a5a0a" stopOpacity={0.15} />
              <Stop offset="1"    stopColor="#060608" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="500" height="300" fill="url(#jGlow)" />
        </Svg>
      </View>

      {/* Header fijo */}
      <View style={[s.headerWrap, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <Pressable onPress={handleClose} hitSlop={12}>
            <IconChevronLeft size={24} color="#f6f6f8" strokeWidth={2} />
          </Pressable>
          <Txt style={s.headerTitle}>Detalle del jugador</Txt>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Hero card — onLayout para dimensiones exactas al SVG */}
        <View
          style={s.heroCard}
          onLayout={e => {
            const { width, height } = e.nativeEvent.layout;
            setCardSize({ w: width, h: height });
          }}>
          {cardSize.w > 0 && (
            <Svg
              width={cardSize.w}
              height={cardSize.h}
              style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgGrad id="heroGrad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={grad.from} />
                  <Stop offset="1" stopColor={grad.to} />
                </SvgGrad>
              </Defs>
              <Rect x="0" y="0" width={cardSize.w} height={cardSize.h} fill="url(#heroGrad)" />
            </Svg>
          )}

          <View style={[s.avatar, { backgroundColor: grad.avatarBg, borderColor: grad.avatarBorder }]}>
            <Txt style={[s.avatarInitials, { color: grad.avatarText }]}>{player.initials}</Txt>
          </View>

          <Txt style={s.heroGamertag}>{player.gamertag}</Txt>
          <Txt style={s.heroSubtitle} numberOfLines={2}>
            {player.name} · {player.role} · {player.teamName}
          </Txt>

          {player.xboxVerified && (
            <View style={s.xboxBadge}>
              <IconBrandXbox size={13} color="#5fe49a" strokeWidth={1.8} />
              <Txt style={s.xboxBadgeText}>Xbox verificado</Txt>
            </View>
          )}
        </View>

        {/* Redes sociales */}
        {socials.length > 0 && (
          <>
            <View style={s.sectionRow}>
              <View style={s.sectionTick} />
              <Txt style={s.sectionLabel}>REDES SOCIALES</Txt>
            </View>

            <View style={s.socialList}>
              {socials.map(key => {
                const cfg = SOCIAL_CFG[key];
                return (
                  <View key={key} style={s.socialRow}>
                    <View style={[s.socialBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                      <Txt style={[s.socialBadgeText, { color: cfg.color }]}>{cfg.badge}</Txt>
                    </View>
                    <View style={s.socialInfo}>
                      <Txt style={s.socialName} numberOfLines={1}>{cfg.label}</Txt>
                      <Txt style={s.socialHandle} numberOfLines={1}>{player[key]}</Txt>
                    </View>
                    <IconChevronRight size={16} color="rgba(246,246,248,0.35)" strokeWidth={2} />
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Información */}
        <View style={s.sectionRow}>
          <View style={s.sectionTick} />
          <Txt style={s.sectionLabel}>INFORMACIÓN</Txt>
        </View>

        <View style={s.infoCard}>
          {info.map(row => (
            <View key={row.label} style={s.infoRow}>
              <Txt style={s.infoLabel}>{row.label}</Txt>
              <Txt style={s.infoValue}>{row.value}</Txt>
            </View>
          ))}
        </View>

      </ScrollView>
      <View style={{ height: insets.bottom }} />
    </Animated.View>
  );
}

/* ─── Styles ─── */

const s = StyleSheet.create({
  root: { backgroundColor: '#060608' },

  glowWrap: { position: 'absolute', left: -30, top: -60, width: 500, height: 300 },

  headerWrap: { backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 48,
    paddingHorizontal: 22,
  },
  headerTitle: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  scroll: { paddingHorizontal: 22, paddingTop: 6, paddingBottom: 32, gap: 18 },

  /* Hero card — fiel a Figma: sin paddingHorizontal, gap 8 */
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 22,
    gap: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarInitials: { fontFamily: fonts.glassTitle, fontSize: 30 },
  heroGamertag: { fontFamily: fonts.glassTitle, fontSize: 24, color: '#f6f6f8' },
  heroSubtitle: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.7)',
    textAlign: 'center',
  },
  xboxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(52,215,127,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(52,215,127,0.4)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  xboxBadgeText: { fontFamily: fonts.glassBodyBold, fontSize: 11.5, color: '#5fe49a' },

  /* Section header */
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTick: { width: 12, height: 2, borderRadius: 2, backgroundColor: '#ff2d46' },
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    color: 'rgba(246,246,248,0.6)',
    letterSpacing: 1.2,
  },

  /* Social */
  socialList: { gap: 10 },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  socialBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBadgeText: { fontFamily: fonts.glassTitle, fontSize: 14 },
  socialInfo: { flex: 1, gap: 2, overflow: 'hidden' },
  socialName: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, lineHeight: 17, color: '#f6f6f8' },
  socialHandle: { fontFamily: fonts.glassBodyMedium, fontSize: 12, lineHeight: 15, color: 'rgba(246,246,248,0.5)' },

  /* Info card */
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: 'rgba(246,246,248,0.5)' },
  infoValue: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#f6f6f8' },
});
