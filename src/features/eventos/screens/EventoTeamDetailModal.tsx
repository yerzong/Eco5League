/**
 * EV ✦ Detalle de equipo — modal pantalla completa, solo lectura. Fiel a Figma 659:4234.
 * Se abre al tocar una fila de equipo activo (GlassTeamRow).
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

const SCREEN_W = Dimensions.get('window').width;
import Svg, { Defs, LinearGradient as SvgGrad, Rect, Stop } from 'react-native-svg';
import { IconBrandXbox, IconChevronLeft } from '@/design-system/icons';
import { withAlpha } from '@/design-system/colorUtils';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components/Txt';
import type { EventTeam } from '@/services';
import { JugadorDetallePanel, type RosterPlayer } from './JugadorDetallePanel';

/* ─── Config de roles (colores por tipo) ─── */

const ROLE_CFG = {
  CAPITÁN: {
    text: '#f6c878',
    avatarBg: 'rgba(178,128,26,0.2)',
    avatarBorder: 'rgba(246,200,120,0.5)',
    badgeBg: 'rgba(178,128,26,0.9)',
    gradEnd: '#b2801a',
    cardBorder: 'rgba(246,200,120,0.25)',
  },
  TITULAR: {
    text: '#ff7385',
    avatarBg: 'rgba(128,20,31,0.2)',
    avatarBorder: 'rgba(255,115,133,0.5)',
    badgeBg: 'rgba(128,20,31,0.9)',
    gradEnd: '#80141f',
    cardBorder: 'rgba(255,115,133,0.25)',
  },
  COACH: {
    text: '#80c7fa',
    avatarBg: 'rgba(31,89,153,0.2)',
    avatarBorder: 'rgba(128,199,250,0.5)',
    badgeBg: 'rgba(31,89,153,0.9)',
    gradEnd: '#1f5999',
    cardBorder: 'rgba(128,199,250,0.25)',
  },
} as const;

type RoleKey = keyof typeof ROLE_CFG;

/* ─── Mock data (maqueta) ─── */

const MOCK_STATS = [
  { label: 'PJ', value: '3', green: false },
  { label: 'V',  value: '3', green: false },
  { label: 'D',  value: '0', green: false },
  { label: 'PTS', value: '9', green: true },
];

const MOCK_ROSTER: (RosterPlayer & { suffix: string })[] = [
  { role: 'CAPITÁN', initials: 'OS', suffix: '_Striker', gamertag: 'Oz_Striker', name: 'Luis Méndez',  teamName: 'Team Ozone', twitch: '/oz_striker',  twitter: '@oz_striker',  instagram: '@oz.striker', discord: 'oz_striker#1234', country: 'México', since: '2024', xboxVerified: true  },
  { role: 'TITULAR', initials: 'AB', suffix: '_Blaze',   gamertag: 'AriBlaze',   name: 'Ari García',   teamName: 'Team Ozone', twitch: '/ariblaze',   discord: 'ariblaze#5678',                                                                    country: 'México', since: '2024', xboxVerified: true  },
  { role: 'TITULAR', initials: 'DF', suffix: '_Frost',   gamertag: 'DanFrost',   name: 'Daniel Pérez', teamName: 'Team Ozone', twitter: '@danfrost_gg',                                                                                               country: 'México', since: '2025', xboxVerified: false },
  { role: 'COACH',   initials: 'SV', suffix: '_Mentor',  gamertag: 'Sr.Vega',    name: 'Carlos Vega',  teamName: 'Team Ozone', discord: 'srvega#9012',                                                                                                country: 'México', since: '2023', xboxVerified: true  },
];

const MOCK_INFO = [
  { label: 'Manager', value: 'Carla Ruiz'   },
  { label: 'Inscrito', value: '12 ene 2026' },
  { label: 'Región',  value: 'México'       },
];

/* ─── Sub-componentes internos ─── */

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={s.sectionRow}>
      <View style={s.sectionTick} />
      <Txt style={s.sectionLabel}>{label}</Txt>
    </View>
  );
}

function PlayerCard({
  role,
  initials,
  gamertag,
  name,
  idx,
  onPress,
}: {
  role: RoleKey;
  initials: string;
  gamertag: string;
  name: string;
  idx: number;
  onPress?: () => void;
}) {
  const cfg = ROLE_CFG[role];
  const gradId = `pgrad${idx}`;
  return (
    <Pressable
      style={({ pressed }) => [s.playerCard, { borderColor: cfg.cardBorder }, pressed && { opacity: 0.75 }]}
      onPress={onPress}
      disabled={!onPress}>
      <Svg width="140" height="212" style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGrad id={gradId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#0f0f12" stopOpacity="1" />
            <Stop offset="1" stopColor={cfg.gradEnd} stopOpacity="0.5" />
          </SvgGrad>
        </Defs>
        <Rect x="0" y="0" width="140" height="212" rx={16} fill={`url(#${gradId})`} />
      </Svg>

      {/* Badge de rol */}
      <View style={[s.roleBadge, { backgroundColor: cfg.badgeBg }]}>
        <Txt style={s.roleBadgeText}>{role}</Txt>
      </View>

      {/* Ícono Xbox */}
      <View style={s.xboxIcon}>
        <IconBrandXbox size={14} color="rgba(246,246,248,0.35)" strokeWidth={1.5} />
      </View>

      {/* Avatar del jugador */}
      <View style={[s.playerAvatar, { backgroundColor: cfg.avatarBg, borderColor: cfg.avatarBorder }]}>
        <Txt style={[s.playerInitials, { color: cfg.text }]}>{initials}</Txt>
      </View>

      {/* Gamertag y nombre real (anclados al fondo) */}
      <View style={s.playerBottom}>
        <Txt style={s.gamertag} numberOfLines={1}>{gamertag}</Txt>
        <Txt style={s.playerName} numberOfLines={1}>{name}</Txt>
      </View>
    </Pressable>
  );
}

/* ─── Props ─── */

interface EventoTeamDetailModalProps {
  team: EventTeam | null;
  onClose: () => void;
}

/* ─── Componente principal ─── */

export function EventoTeamDetailModal({ team, onClose }: EventoTeamDetailModalProps) {
  const insets = useSafeAreaInsets();
  const slideX = useRef(new Animated.Value(SCREEN_W)).current;
  const [detailPlayer, setDetailPlayer] = useState<RosterPlayer | null>(null);

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

  if (!team) return null;

  const isPending    = team.status === 'pending';
  const statusColor  = isPending ? '#f6c878' : '#5fe49a';
  const statusDotBg  = isPending ? 'rgba(246,166,35,0.9)' : '#34d77f';
  const statusLabel  = isPending ? 'Pendiente' : 'Activo';

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.root, { transform: [{ translateX: slideX }] }]}>

      {/* Header fijo — paddingTop dinámico para respetar status bar */}
      <View style={[s.headerWrap, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <Pressable onPress={handleClose} hitSlop={12}>
            <IconChevronLeft size={24} color="#f6f6f8" strokeWidth={2} />
          </Pressable>
          <Txt style={s.headerTitle}>Detalle de equipo</Txt>
        </View>
      </View>

        {/* Contenido desplazable */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}>

            {/* Tarjeta del equipo */}
            <View style={s.teamCard}>
              <View style={s.teamRow}>
                <View style={[
                  s.crest,
                  { backgroundColor: withAlpha(team.color, 0.18), borderColor: withAlpha(team.color, 0.55) },
                ]}>
                  <Txt style={[s.crestText, { color: team.color }]}>{team.initials}</Txt>
                </View>
                <View style={s.teamNameCol}>
                  <Txt style={s.teamName}>{team.name}</Txt>
                  <Txt style={s.teamOrg}>{team.org}</Txt>
                </View>
                <View style={s.statusBadge}>
                  <View style={[s.statusDot, { backgroundColor: statusDotBg }]} />
                  <Txt style={[s.statusText, { color: statusColor }]}>{statusLabel}</Txt>
                </View>
              </View>

              {/* Chips de info */}
              <View style={s.tagsRow}>
                <View style={s.tagRed}>
                  <Txt style={s.tagRedText}>Grupo A · 1º</Txt>
                </View>
                <View style={s.tagAmber}>
                  <Txt style={s.tagAmberText}>Seed #1</Txt>
                </View>
                <View style={s.tagGreen}>
                  <Txt style={s.tagGreenText}>Roster {team.rosterCurrent}/{team.rosterMax}</Txt>
                </View>
              </View>
            </View>

            {/* Desempeño */}
            <SectionHeader label="DESEMPEÑO EN EL EVENTO" />
            <View style={s.statsRow}>
              {MOCK_STATS.map(stat => (
                <View key={stat.label} style={s.statBox}>
                  <Txt style={stat.green ? [s.statValue, s.statGreen] : s.statValue}>{stat.value}</Txt>
                  <Txt style={s.statLabel}>{stat.label}</Txt>
                </View>
              ))}
            </View>

            {/* Roster */}
            <SectionHeader label="ROSTER" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.rosterScroll}
              contentContainerStyle={s.rosterContent}>
              {MOCK_ROSTER.map((p, i) => (
                <PlayerCard
                  key={i}
                  idx={i}
                  role={p.role}
                  initials={p.initials}
                  gamertag={p.gamertag}
                  name={p.name}
                  onPress={() => setDetailPlayer(p)}
                />
              ))}
            </ScrollView>

            {/* Información */}
            <SectionHeader label="INFORMACIÓN" />
            <View style={s.infoCard}>
              <View style={s.infoRow}>
                <Txt style={s.infoLabel}>Organización</Txt>
                <Txt style={s.infoValue}>{team.org}</Txt>
              </View>
              {MOCK_INFO.map(row => (
                <View key={row.label} style={s.infoRow}>
                  <Txt style={s.infoLabel}>{row.label}</Txt>
                  <Txt style={s.infoValue}>{row.value}</Txt>
                </View>
              ))}
            </View>

        </ScrollView>
        <View style={{ height: insets.bottom }} />

      {/* Detalle de jugador — deslizamiento derecha→izquierda encima */}
      {detailPlayer ? (
        <JugadorDetallePanel
          player={detailPlayer}
          onClose={() => setDetailPlayer(null)}
        />
      ) : null}
    </Animated.View>
  );
}

/* ─── Styles ─── */

const s = StyleSheet.create({
  root: { backgroundColor: '#060608' },

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 18,
  },

  /* Header fijo */
  headerWrap: { backgroundColor: '#060608' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 48,
    paddingHorizontal: 22,
  },
  headerTitle: {
    fontFamily: fonts.glassTitle,
    fontSize: 20,
    color: '#f6f6f8',
  },

  /* Team card */
  teamCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  crest: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: { fontFamily: fonts.glassTitle, fontSize: 18 },
  teamNameCol: { flex: 1, gap: 3 },
  teamName: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },
  teamOrg: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: 'rgba(246,246,248,0.55)' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontFamily: fonts.glassBodyBold, fontSize: 12 },

  /* Tags */
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tagRed: {
    backgroundColor: 'rgba(255,45,70,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,70,0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagRedText: { fontFamily: fonts.glassBodyBold, fontSize: 11, color: '#ff2d46' },
  tagAmber: {
    backgroundColor: 'rgba(246,200,120,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(246,200,120,0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagAmberText: { fontFamily: fonts.glassBodyBold, fontSize: 11, color: '#f6c878' },
  tagGreen: {
    backgroundColor: 'rgba(52,215,127,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52,215,127,0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagGreenText: { fontFamily: fonts.glassBodyBold, fontSize: 11, color: '#34d77f' },

  /* Section header */
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTick: { width: 12, height: 2, borderRadius: 2, backgroundColor: '#ff2d46' },
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    color: 'rgba(246,246,248,0.6)',
    letterSpacing: 1.2,
  },

  /* Stats */
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontFamily: fonts.glassTitle, fontSize: 22, color: '#f6f6f8' },
  statGreen: { color: '#5fe49a' },
  statLabel: { fontFamily: fonts.glassBodyMedium, fontSize: 11, color: 'rgba(246,246,248,0.5)' },

  /* Roster */
  rosterScroll: { height: 212 },
  rosterContent: { gap: 12 },

  /* Player card */
  playerCard: {
    width: 140,
    height: 212,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  roleBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 8.5,
    color: '#f6f6f8',
    letterSpacing: 0.5,
  },
  xboxIcon: { position: 'absolute', top: 9, right: 9 },
  playerAvatar: {
    position: 'absolute',
    top: 43,
    left: 35,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: { fontFamily: fonts.glassTitle, fontSize: 20 },
  playerBottom: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 4,
  },
  gamertag: { fontFamily: fonts.glassTitle, fontSize: 14, color: '#f6f6f8' },
  playerName: { fontFamily: fonts.glassBodyMedium, fontSize: 10.5, color: 'rgba(246,246,248,0.5)' },

  /* Información */
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
