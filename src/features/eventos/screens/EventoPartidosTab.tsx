/**
 * EV ✦ Tab "Partidos" — Gestión del evento (Figma 645:3839).
 *
 * Filter chips → Todos / En vivo / Próximos / Finalizados.
 * Tapping cualquier partido abre PartidoDetalleModal.
 * Desde el detalle → Registrar / Editar horario / Corregir resultado.
 * El CTA de una LiveMatchCard también abre directamente el registrar.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { IconChevronRight } from '@/design-system/icons';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { Txt } from '@/design-system/components/Txt';
import {
  eventsService,
  type EventMatch,
  type LeagueEvent,
  type MatchTeam,
} from '@/services';
import { PartidoDetalleModal } from './PartidoDetalleModal';
import { RegistrarResultadoSheet } from './RegistrarResultadoSheet';
import { EditarHorarioSheet } from './EditarHorarioSheet';

/* ═══════════════════════════════════════════════════════════════════
   Tipos locales
═══════════════════════════════════════════════════════════════════ */

type FilterKey = 'all' | 'live' | 'upcoming' | 'finished';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',      label: 'Todos'       },
  { key: 'live',     label: 'En vivo'     },
  { key: 'upcoming', label: 'Próximos'    },
  { key: 'finished', label: 'Finalizados' },
];

/* ═══════════════════════════════════════════════════════════════════
   Componente raíz del tab
═══════════════════════════════════════════════════════════════════ */

export function EventoPartidosTab({ event }: { event: LeagueEvent | null }) {
  const [matches, setMatches] = useState<EventMatch[]>([]);
  const [filter, setFilter]   = useState<FilterKey>('all');

  // Navegación de pantallas / modales
  const [selectedMatch,     setSelectedMatch]     = useState<EventMatch | null>(null);
  const [showDetail,        setShowDetail]        = useState(false);
  const [showRegistrar,     setShowRegistrar]     = useState(false);
  const [registrarMode,     setRegistrarMode]     = useState<'register' | 'correct'>('register');
  const [showEditarHorario, setShowEditarHorario] = useState(false);

  useEffect(() => {
    if (!event) return;
    eventsService.getEventMatches(event.id).then(setMatches);
  }, [event]);

  const filtered        = filter === 'all' ? matches : matches.filter(m => m.status === filter);
  const liveMatches     = filtered.filter(m => m.status === 'live');
  const upcomingMatches = filtered.filter(m => m.status === 'upcoming');
  const finishedMatches = filtered.filter(m => m.status === 'finished');

  /* ── Acciones de navegación ── */

  const openDetail = useCallback((m: EventMatch) => {
    setSelectedMatch(m);
    setShowDetail(true);
  }, []);

  const openRegistrarDirect = useCallback((m: EventMatch) => {
    setSelectedMatch(m);
    setRegistrarMode('register');
    setShowRegistrar(true);
  }, []);

  const handleDetailRegistrar = useCallback((_m: EventMatch) => {
    setShowDetail(false);
    setRegistrarMode('register');
    setShowRegistrar(true);
  }, []);

  const handleDetailEditarHorario = useCallback((_m: EventMatch) => {
    setShowDetail(false);
    setShowEditarHorario(true);
  }, []);

  const handleDetailCorregir = useCallback((_m: EventMatch) => {
    setShowDetail(false);
    setRegistrarMode('correct');
    setShowRegistrar(true);
  }, []);

  const handleSaveResultado = useCallback((_winners: (0 | 1 | null)[]) => {
    setShowRegistrar(false);
  }, []);

  const handleSaveHorario = useCallback(
    (_date: string, _time: string, _notify: boolean, _note: string) => {
      setShowEditarHorario(false);
    },
    [],
  );

  return (
    <View style={s.root}>
      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}>
        {FILTERS.map(f => (
          <MatchFilterChip
            key={f.key}
            label={f.label}
            active={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </ScrollView>

      {/* ── EN VIVO ── */}
      {liveMatches.length > 0 && (
        <>
          <SectionHeader label={`EN VIVO · ${liveMatches.length}`} />
          {liveMatches.map(m => (
            <LiveMatchCard
              key={m.id}
              match={m}
              onPress={() => openDetail(m)}
              onRegister={() => openRegistrarDirect(m)}
            />
          ))}
        </>
      )}

      {/* ── PRÓXIMOS ── */}
      {upcomingMatches.length > 0 && (
        <>
          <SectionHeader label="PRÓXIMOS · JORNADA 3 · 04 feb" />
          {upcomingMatches.map(m => (
            <CompactMatchRow
              key={m.id}
              leftLabel={m.roundLabel}
              team1={m.team1}
              team2={m.team2}
              centerText={`${m.team1.initials} vs ${m.team2.initials}`}
              onPress={() => openDetail(m)}
            />
          ))}
        </>
      )}

      {/* ── FINALIZADOS ── */}
      {finishedMatches.length > 0 && (
        <>
          <SectionHeader label="FINALIZADOS" />
          {finishedMatches.map(m => (
            <CompactMatchRow
              key={m.id}
              leftLabel={m.roundLabel}
              team1={m.team1}
              team2={m.team2}
              centerText={`${m.score1} – ${m.score2}`}
              onPress={() => openDetail(m)}
            />
          ))}
        </>
      )}

      {/* ── Modales ── */}
      <PartidoDetalleModal
        visible={showDetail}
        match={selectedMatch}
        onClose={() => setShowDetail(false)}
        onRegistrar={handleDetailRegistrar}
        onEditarHorario={handleDetailEditarHorario}
        onCorregir={handleDetailCorregir}
      />
      <RegistrarResultadoSheet
        visible={showRegistrar}
        match={selectedMatch}
        mode={registrarMode}
        onClose={() => setShowRegistrar(false)}
        onSave={handleSaveResultado}
      />
      <EditarHorarioSheet
        visible={showEditarHorario}
        match={selectedMatch}
        onClose={() => setShowEditarHorario(false)}
        onSave={handleSaveHorario}
      />
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-componentes — Filter chips
═══════════════════════════════════════════════════════════════════ */

function MatchFilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [s.chip, active && s.chipActive, pressed && { opacity: 0.82 }]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
      accessibilityLabel={label}>
      {active && (
        <Svg style={StyleSheet.absoluteFill} width={200} height={38}>
          <Defs>
            <LinearGradient id={`chipGrad_${label}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff3b52" />
              <Stop offset="1" stopColor="#e11d36" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="200" height="38" rx="13" fill={`url(#chipGrad_${label})`} />
        </Svg>
      )}
      <Txt style={active ? s.chipLabelActive : s.chipLabel}>{label}</Txt>
    </Pressable>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-componentes — Section header
═══════════════════════════════════════════════════════════════════ */

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={s.sectionRow}>
      <View style={s.sectionDash} />
      <Txt style={s.sectionLabel}>{label}</Txt>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-componentes — Avatar de equipo
═══════════════════════════════════════════════════════════════════ */

function TeamAvatar({ team, size }: { team: MatchTeam; size: 'lg' | 'sm' }) {
  const dim      = size === 'lg' ? 32 : 24;
  const fontSize = size === 'lg' ? 10.5 : 8.5;
  const radius   = size === 'lg' ? 8 : 7;

  return (
    <View
      style={[
        s.avatar,
        {
          width:           dim,
          height:          dim,
          borderRadius:    radius,
          backgroundColor: withAlpha(team.color, 0.18),
          borderColor:     withAlpha(team.color, 0.5),
        },
      ]}
      accessibilityLabel={team.name}>
      <Txt style={[s.avatarText, { color: team.color, fontSize }]}>{team.initials}</Txt>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-componentes — Card de partido en vivo
═══════════════════════════════════════════════════════════════════ */

interface LiveMatchCardProps {
  match: EventMatch;
  onPress?: () => void;
  onRegister?: () => void;
}

function LiveMatchCard({ match, onPress, onRegister }: LiveMatchCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.25, duration: 560, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <Pressable
      style={({ pressed }) => [s.liveCard, pressed && { opacity: 0.92 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Partido en vivo ${match.team1.name} vs ${match.team2.name}`}>
      {/* Cabecera */}
      <View style={s.liveHeader}>
        <View style={s.liveBadge}>
          <Animated.View style={[s.liveDot, { opacity: pulseAnim }]} />
          <Txt style={s.liveBadgeText}>EN VIVO</Txt>
        </View>
        <Txt style={s.liveContext}>{match.context}</Txt>
      </View>

      {/* Marcador */}
      <View style={s.scoreRow}>
        <View style={s.teamLeft}>
          <TeamAvatar team={match.team1} size="lg" />
          <Txt style={s.teamName} numberOfLines={1}>{match.team1.name}</Txt>
        </View>
        <Txt style={s.score}>{match.score1} – {match.score2}</Txt>
        <View style={s.teamRight}>
          <Txt style={s.teamName} numberOfLines={1}>{match.team2.name}</Txt>
          <TeamAvatar team={match.team2} size="lg" />
        </View>
      </View>

      {/* CTA "Registrar resultado" — Pressable anidado captura el evento propio */}
      <Pressable
        style={({ pressed }) => [s.registerBtn, pressed && { opacity: 0.85 }]}
        onPress={onRegister}
        accessibilityRole="button"
        accessibilityLabel="Registrar resultado">
        <Svg style={StyleSheet.absoluteFill} width={400} height={54}>
          <Defs>
            <LinearGradient id={`regGrad_${match.id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff3b52" />
              <Stop offset="1" stopColor="#e11d36" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="400" height="54" rx="16" fill={`url(#regGrad_${match.id})`} />
        </Svg>
        <Txt style={s.registerBtnLabel}>Registrar resultado</Txt>
      </Pressable>
    </Pressable>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-componentes — Fila compacta (próximos + finalizados)
═══════════════════════════════════════════════════════════════════ */

interface CompactMatchRowProps {
  leftLabel: string;
  team1: MatchTeam;
  team2: MatchTeam;
  centerText: string;
  onPress?: () => void;
}

function CompactMatchRow({ leftLabel, team1, team2, centerText, onPress }: CompactMatchRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [s.compactRow, pressed && { opacity: 0.75 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${team1.name} vs ${team2.name}: ${centerText}`}>
      <Txt style={s.compactLeft}>{leftLabel}</Txt>
      <TeamAvatar team={team1} size="sm" />
      <Txt style={s.compactCenter} numberOfLines={1}>{centerText}</Txt>
      <TeamAvatar team={team2} size="sm" />
      <IconChevronRight size={14} color="rgba(246,246,248,0.35)" strokeWidth={2} />
    </Pressable>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Estilos
═══════════════════════════════════════════════════════════════════ */

const s = StyleSheet.create({
  root: { gap: 14 },

  /* Filter chips */
  filterRow: { flexDirection: 'row', gap: 9, paddingBottom: 2 },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chipActive: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.32,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chipLabel: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: 'rgba(246,246,248,0.6)',
  },
  chipLabelActive: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: '#ffffff',
  },

  /* Section header */
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionDash: { width: 14, height: 2, borderRadius: 2, backgroundColor: '#ff2d46' },
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(246,246,248,0.7)',
  },

  /* Avatar */
  avatar: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.glassBodyBold },

  /* Live match card */
  liveCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,70,0.28)',
    borderRadius: 16,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: '#ff2d46',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  liveHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#ff4d5e' },
  liveBadgeText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
    color: '#ff808f',
  },
  liveContext: { fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: 'rgba(246,246,248,0.5)' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamLeft:  { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  teamRight: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1, justifyContent: 'flex-end' },
  teamName: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: '#f6f6f8', flexShrink: 1 },
  score: { fontFamily: fonts.glassTitle, fontSize: 22, color: '#f6f6f8', paddingHorizontal: 8 },
  registerBtn: {
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
  registerBtnLabel: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ffffff', letterSpacing: 0.3 },

  /* Compact match row */
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  compactLeft: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    color: 'rgba(246,246,248,0.5)',
    width: 46,
  },
  compactCenter: {
    flex: 1,
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13,
    color: '#f6f6f8',
    textAlign: 'center',
  },
});
