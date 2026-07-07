/**
 * EV-01 · Detalle de partido (Figma 671-5335 · 671-5389 · 671-5440)
 *
 * Un solo modal maneja los 3 estados:
 *  · EN VIVO     — borde rojo, marcador, CTA "Registrar resultado"
 *  · PROGRAMADO  — borde ámbar, VS, CTA "Editar horario"
 *  · FINALIZADO  — borde verde, marcador final, CTA "Corregir resultado"
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { IconChevronLeft } from '@/design-system/icons';
import { Txt } from '@/design-system/components/Txt';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import type { EventMatch, MapStatus } from '@/services';

/* ═══════════════════════════════════════════════════════════════════
   Props
═══════════════════════════════════════════════════════════════════ */

export interface PartidoDetalleModalProps {
  visible: boolean;
  match: EventMatch | null;
  onClose: () => void;
  onRegistrar: (m: EventMatch) => void;
  onEditarHorario: (m: EventMatch) => void;
  onCorregir: (m: EventMatch) => void;
}

/* ═══════════════════════════════════════════════════════════════════
   Config por estado
═══════════════════════════════════════════════════════════════════ */

const STATUS_CFG = {
  live: {
    badgeLabel: 'EN VIVO',
    badgeBg: 'rgba(255,45,70,0.16)',
    badgeBorder: 'rgba(255,45,70,0.4)',
    badgeText: '#ff808f',
    dotColor: '#ff4d5e',
    cardBorder: 'rgba(255,45,70,0.25)',
  },
  upcoming: {
    badgeLabel: 'PROGRAMADO',
    badgeBg: 'rgba(246,166,35,0.16)',
    badgeBorder: 'rgba(246,166,35,0.4)',
    badgeText: '#f6c878',
    dotColor: '#f6a623',
    cardBorder: 'rgba(246,166,35,0.25)',
  },
  finished: {
    badgeLabel: 'FINALIZADO',
    badgeBg: 'rgba(52,215,127,0.16)',
    badgeBorder: 'rgba(52,215,127,0.4)',
    badgeText: '#5fe49a',
    dotColor: '#34d77f',
    cardBorder: 'rgba(52,215,127,0.25)',
  },
} as const;

function mapResultLabel(
  status: MapStatus,
  t1: string,
  t2: string,
): { text: string; color: string } {
  switch (status) {
    case 'won_t1': return { text: `Ganó ${t1}`,   color: '#5fe49a' };
    case 'won_t2': return { text: `Ganó ${t2}`,   color: 'rgba(246,246,248,0.65)' };
    case 'live':   return { text: 'En juego',      color: '#ff808f' };
    case 'pending':return { text: 'Pendiente',     color: '#ffffff' };
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Componente principal
═══════════════════════════════════════════════════════════════════ */

export function PartidoDetalleModal({
  visible, match, onClose, onRegistrar, onEditarHorario, onCorregir,
}: PartidoDetalleModalProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible || match?.status !== 'live') {
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.25, duration: 560, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, match?.status, pulseAnim]);

  if (!match) return null;

  const cfg = STATUS_CFG[match.status];
  const isLive     = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';
  const isFinished = match.status === 'finished';
  const t1WonSeries = (match.score1 ?? 0) > (match.score2 ?? 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent>
      <SafeAreaProvider>
      <SafeAreaView style={s.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled">

          {/* ── Header ── */}
          <View style={s.header}>
            <Pressable onPress={onClose} hitSlop={14} style={s.backBtn}>
              <IconChevronLeft size={22} color="#f6f6f8" strokeWidth={2.5} />
            </Pressable>
            <Txt style={s.headerTitle}>Detalle de partido</Txt>
          </View>

          {/* ── Hero card ── */}
          <View style={[s.heroCard, { borderColor: cfg.cardBorder }]}>
            {/* Badge de estado */}
            <View style={[s.badge, { backgroundColor: cfg.badgeBg, borderColor: cfg.badgeBorder }]}>
              {isLive ? (
                <Animated.View style={[s.dot, { backgroundColor: cfg.dotColor, opacity: pulseAnim }]} />
              ) : (
                <View style={[s.dot, { backgroundColor: cfg.dotColor }]} />
              )}
              <Txt style={[s.badgeText, { color: cfg.badgeText }]}>{cfg.badgeLabel}</Txt>
            </View>

            {/* Equipos + marcador / VS */}
            <View style={s.teamsRow}>
              {/* Equipo 1 */}
              <View style={s.teamCol}>
                <View style={[s.teamAvatarBox, {
                  backgroundColor: withAlpha(match.team1.color, 0.18),
                  borderColor:     withAlpha(match.team1.color, 0.5),
                }]}>
                  <Txt style={[s.teamAvatarText, { color: match.team1.color }]}>
                    {match.team1.initials}
                  </Txt>
                </View>
                <Txt style={isFinished && t1WonSeries ? [s.teamName, s.teamNameBold] : s.teamName}>
                  {match.team1.name}
                </Txt>
              </View>

              {/* Centro */}
              {isUpcoming ? (
                <Txt style={s.vsText}>VS</Txt>
              ) : (
                <Txt style={s.scoreText}>{match.score1} – {match.score2}</Txt>
              )}

              {/* Equipo 2 */}
              <View style={s.teamCol}>
                <View style={[s.teamAvatarBox, {
                  backgroundColor: withAlpha(match.team2.color, 0.18),
                  borderColor:     withAlpha(match.team2.color, 0.5),
                }]}>
                  <Txt style={[s.teamAvatarText, { color: match.team2.color }]}>
                    {match.team2.initials}
                  </Txt>
                </View>
                <Txt style={isFinished && !t1WonSeries ? [s.teamName, s.teamNameBold] : s.teamName}>
                  {match.team2.name}
                </Txt>
              </View>
            </View>

            <Txt style={s.heroContext}>{match.detailContext}</Txt>
          </View>

          {/* ── MAPAS ── */}
          <Txt style={s.sectionEyebrow}>MAPAS</Txt>
          <View style={s.dataCard}>
            {isUpcoming
              ? match.maps.map(m => (
                  <View key={m.number} style={s.dataRow}>
                    <Txt style={s.dataKey}>Mapa {m.number}</Txt>
                    <Txt style={[s.dataVal, { color: '#ffffff' }]}>Se define al iniciar</Txt>
                  </View>
                ))
              : match.maps.map(m => {
                  const { text, color } = mapResultLabel(m.status, match.team1.name, match.team2.name);
                  return (
                    <View key={m.number} style={s.dataRow}>
                      <Txt style={s.dataKey}>Mapa {m.number}</Txt>
                      <Txt style={[s.dataVal, { color }]}>{text}</Txt>
                    </View>
                  );
                })}
          </View>

          {/* ── INFORMACIÓN ── */}
          <Txt style={s.sectionEyebrow}>INFORMACIÓN</Txt>
          <View style={s.dataCard}>
            <View style={s.dataRow}>
              <Txt style={s.dataKeyGhost}>Fecha</Txt>
              <Txt style={s.dataValInfo}>{match.dateLabel}</Txt>
            </View>
            <View style={s.dataRow}>
              <Txt style={s.dataKeyGhost}>Formato</Txt>
              <Txt style={s.dataValInfo}>{match.format}</Txt>
            </View>
            <View style={s.dataRow}>
              <Txt style={s.dataKeyGhost}>Transmisión</Txt>
              <Txt style={s.dataValInfo}>{match.streamLabel}</Txt>
            </View>
          </View>

          {/* ── CTA ── */}
          {isLive && (
            <Pressable
              style={({ pressed }) => [s.ctaPrimary, pressed && { opacity: 0.85 }]}
              onPress={() => onRegistrar(match)}
              accessibilityRole="button"
              accessibilityLabel="Registrar resultado">
              <Svg style={StyleSheet.absoluteFill} width={400} height={54}>
                <Defs>
                  <LinearGradient id="pdm_ctaGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#ff3b52" />
                    <Stop offset="1" stopColor="#e11d36" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="400" height="54" rx="16" fill="url(#pdm_ctaGrad)" />
              </Svg>
              <Txt style={s.ctaLabel}>Registrar resultado</Txt>
            </Pressable>
          )}
          {isUpcoming && (
            <Pressable
              style={({ pressed }) => [s.ctaGhost, pressed && { opacity: 0.75 }]}
              onPress={() => onEditarHorario(match)}
              accessibilityRole="button"
              accessibilityLabel="Editar horario">
              <Txt style={s.ctaLabel}>Editar horario</Txt>
            </Pressable>
          )}
          {isFinished && (
            <Pressable
              style={({ pressed }) => [s.ctaGhost, pressed && { opacity: 0.75 }]}
              onPress={() => onCorregir(match)}
              accessibilityRole="button"
              accessibilityLabel="Corregir resultado">
              <Txt style={s.ctaLabel}>Corregir resultado</Txt>
            </Pressable>
          )}
        </ScrollView>
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
    paddingBottom: 40,
  },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', height: 40, gap: 14 },
  backBtn: { padding: 2 },
  headerTitle: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  /* Hero card */
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 14,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 11,
    paddingRight: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontFamily: fonts.glassBodyBold, fontSize: 10.5, letterSpacing: 0.5 },

  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    width: '100%',
  },
  teamCol: { flex: 1, alignItems: 'center', gap: 8 },
  teamAvatarBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: { fontFamily: fonts.glassTitle, fontSize: 14.72 },
  teamName: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13,
    color: '#f6f6f8',
    textAlign: 'center',
  },
  teamNameBold: { fontFamily: fonts.glassBodyBold },
  scoreText: { fontFamily: fonts.glassTitle, fontSize: 30, color: '#f6f6f8' },
  vsText: { fontFamily: fonts.glassTitle, fontSize: 22, color: '#f6f6f8' },
  heroContext: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    color: 'rgba(246,246,248,0.5)',
  },

  /* Section label */
  sectionEyebrow: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: 'rgba(246,246,248,0.45)',
  },

  /* Data card (mapas e información) */
  dataCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataKey: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: 'rgba(246,246,248,0.85)',
  },
  dataKeyGhost: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.5)',
  },
  dataVal: { fontFamily: fonts.glassBodyBold, fontSize: 12.5 },
  dataValInfo: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#f6f6f8' },

  /* CTAs */
  ctaPrimary: {
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
  ctaGhost: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
