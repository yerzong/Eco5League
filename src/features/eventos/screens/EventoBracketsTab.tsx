/**
 * EV ✦ Tab "Brackets" — dos estados según el ciclo del evento.
 *
 * Estado A — Inscripciones abiertas (Figma 665:5039):
 *   Aviso ámbar · contador de equipos · skeleton preview del cuadro.
 *
 * Estado B — Borrador generado (Figma 633:28781):
 *   Banner "BORRADOR" · segmented control de seeding · grupos A/B con
 *   seed rows · label playoffs. El footer CTA (Regenerar / Publicar) se
 *   renderiza desde EventoGestionScreen a nivel root para quedar fijo.
 *
 * Exporta también `BracketFooter` para que el padre lo monte como overlay.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { IconAlertCircle, IconCheck } from '@/design-system/icons';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { Txt } from '@/design-system/components/Txt';
import { eventsService, type EventTeam, type LeagueEvent } from '@/services';

/* ═══════════════════════════════════════════════════════════════════
   Tipos de dominio del bracket
═══════════════════════════════════════════════════════════════════ */

interface SeededTeam extends EventTeam {
  seed: number;
  record: string;
  isTopSeed: boolean;
}

interface BracketGroup {
  name: string;
  teams: SeededTeam[];
}

type SeedMode = 'ranking' | 'random';

/* ─── Helpers de lógica pura (sin UI) ─── */

/** Convierte una lista de equipos en dos grupos bracket (A: impares, B: pares). */
function buildGroups(teams: EventTeam[]): BracketGroup[] {
  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const seeded: SeededTeam[] = sorted.map((t, i) => ({
    ...t,
    seed: i + 1,
    record: '0-0-0',
    isTopSeed: i < 2,  // seeds 1 y 2 destacan en dorado
  }));

  return [
    { name: 'GRUPO A', teams: seeded.filter(t => t.seed % 2 !== 0) },
    { name: 'GRUPO B', teams: seeded.filter(t => t.seed % 2 === 0) },
  ];
}

/** Extrae la fecha de cierre del dateLabel del evento (ej. "Cierra 25 jun" → "25 jun"). */
function extractCloseDate(dateLabel?: string): string {
  return dateLabel?.replace(/^Cierra\s+/i, '') ?? '—';
}

/* ═══════════════════════════════════════════════════════════════════
   Componente raíz del tab
═══════════════════════════════════════════════════════════════════ */

export interface EventoBracketsTabProps {
  event: LeagueEvent | null;
  /** true cuando el cuadro ya fue publicado → muestra pantalla de éxito. */
  published?: boolean;
  onViewPublished?: () => void;
}

export function EventoBracketsTab({ event, published, onViewPublished }: EventoBracketsTabProps) {
  if (published) return <PublishedView event={event} onView={onViewPublished} />;

  const inscripcionesAbiertas =
    event?.status === 'inscripcion' || event?.status === 'proximo';

  return inscripcionesAbiertas
    ? <SkeletonView event={event} />
    : <DraftView event={event} />;
}

/* ═══════════════════════════════════════════════════════════════════
   Vista A — Inscripciones abiertas (skeleton)
═══════════════════════════════════════════════════════════════════ */

function SkeletonView({ event }: { event: LeagueEvent | null }) {
  const closeDate  = extractCloseDate(event?.dateLabel);
  const teamsLabel = event?.teamsLabel ?? '— / — equipos';

  return (
    <View style={s.root}>
      <View style={s.alert} accessibilityRole="alert">
        <IconAlertCircle size={22} color="#f6a623" strokeWidth={1.8} />
        <Txt style={s.alertText}>
          El cuadro se generará automáticamente al cerrar inscripciones ({closeDate}).
        </Txt>
      </View>

      <View style={s.infoCard}>
        <View style={s.infoLeft}>
          <Txt style={s.infoCount}>{teamsLabel}</Txt>
          <Txt style={s.infoSub}>inscritos · roster lock {closeDate}</Txt>
        </View>
        <AmberBadge label="Inscripciones" />
      </View>

      <Txt style={s.eyebrow}>SE GENERARÁ ASÍ</Txt>

      <View style={s.skeletonCard}>
        <Txt style={s.skeletonLabel}>GRUPO A · GRUPO B</Txt>
        {SKELETON_GROUP_WIDTHS.map((w, i) => (
          <View key={i} style={[s.skeletonBar, { width: w }]} />
        ))}
        <Txt style={[s.skeletonLabel, s.skeletonLabelGap]}>PLAYOFFS · por definir</Txt>
        {SKELETON_PLAYOFF_WIDTHS.map((w, i) => (
          <View key={i} style={[s.skeletonBar, { width: w }]} />
        ))}
      </View>
    </View>
  );
}

const SKELETON_GROUP_WIDTHS   = [200, 260, 200, 260] as const;
const SKELETON_PLAYOFF_WIDTHS = [160, 160, 160]      as const;

/* ═══════════════════════════════════════════════════════════════════
   Vista B — Borrador generado
═══════════════════════════════════════════════════════════════════ */

function DraftView({ event }: { event: LeagueEvent | null }) {
  const [teams, setTeams]       = useState<EventTeam[]>([]);
  const [seedMode, setSeedMode] = useState<SeedMode>('ranking');

  useEffect(() => {
    if (!event) return;
    eventsService.getEventTeams(event.id).then(setTeams);
  }, [event]);

  const groups = buildGroups(teams);

  return (
    <View style={s.root}>
      <DraftBanner />

      <Txt style={s.sectionLabel}>SEEDING</Txt>
      <SeedingControl value={seedMode} onChange={setSeedMode} />
      <Txt style={s.seedingDesc}>
        {SEEDING_DESCRIPTIONS[seedMode]}
      </Txt>

      {groups.map(g => (
        <GroupCard key={g.name} group={g} />
      ))}

      <Txt style={s.playoffsLabel}>PLAYOFFS · se definen al terminar grupos</Txt>
    </View>
  );
}

const SEEDING_DESCRIPTIONS: Record<SeedMode, string> = {
  ranking: '🛡 Por ranking: el #1 y #2 quedan en grupos distintos (cuadro parejo).',
  random:  '🎲 Aleatorio: los equipos se distribuyen al azar entre los grupos.',
};

/* ═══════════════════════════════════════════════════════════════════
   Sub-componentes genéricos
═══════════════════════════════════════════════════════════════════ */

/** Pill de alerta ámbar "BORRADOR · aún no es visible…". */
function DraftBanner() {
  return (
    <View style={s.draftBanner} accessibilityRole="alert">
      <View style={s.draftDot} />
      <Txt style={s.draftText}>BORRADOR · aún no es visible para los equipos</Txt>
    </View>
  );
}

/** Badge ámbar reutilizable (ej. "Inscripciones"). */
function AmberBadge({ label }: { label: string }) {
  return (
    <View style={s.amberBadge}>
      <Txt style={s.amberBadgeText}>{label}</Txt>
    </View>
  );
}

/** Segmented control "Por ranking / Aleatorio" con píldora deslizante. */
interface SeedingControlProps {
  value: SeedMode;
  onChange: (v: SeedMode) => void;
}

const SEG_PADDING = 5;
const SEG_GAP     = 5;

function SeedingControl({ value, onChange }: SeedingControlProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const pillLeft = useRef(new Animated.Value(SEG_PADDING)).current;

  const optionWidth =
    containerWidth > 0
      ? (containerWidth - SEG_PADDING * 2 - SEG_GAP) / 2
      : 0;

  useEffect(() => {
    if (containerWidth === 0) return;
    const targetLeft =
      value === 'ranking'
        ? SEG_PADDING
        : SEG_PADDING + optionWidth + SEG_GAP;

    Animated.spring(pillLeft, {
      toValue: targetLeft,
      useNativeDriver: false,   // 'left' no soporta native driver
      damping: 18,
      stiffness: 280,
      mass: 0.8,
    }).start();
  }, [value, containerWidth, optionWidth, pillLeft]);

  return (
    <View
      style={s.segmented}
      accessibilityRole="radiogroup"
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>

      {/* Píldora deslizante detrás de las opciones */}
      {containerWidth > 0 ? (
        <Animated.View
          style={[s.segPill, { width: optionWidth, left: pillLeft }]}
        />
      ) : null}

      {/* Opciones: transparentes, texto encima de la píldora */}
      {SEED_OPTIONS.map(opt => (
        <Pressable
          key={opt.value}
          style={s.segOption}
          onPress={() => onChange(opt.value)}
          accessibilityRole="radio"
          accessibilityState={{ checked: value === opt.value }}
          accessibilityLabel={opt.label}>
          <Txt style={value === opt.value ? s.segLabelActive : s.segLabel}>
            {opt.label}
          </Txt>
        </Pressable>
      ))}
    </View>
  );
}

const SEED_OPTIONS: { value: SeedMode; label: string }[] = [
  { value: 'ranking', label: 'Por ranking' },
  { value: 'random',  label: 'Aleatorio'  },
];

/** Card de un grupo con su lista de seed rows. */
function GroupCard({ group }: { group: BracketGroup }) {
  return (
    <View style={s.groupCard}>
      <Txt style={s.groupName}>{group.name}</Txt>
      {group.teams.map(t => <SeedRow key={t.id} team={t} />)}
    </View>
  );
}

/** Fila individual: seed # · avatar · nombre · record. */
function SeedRow({ team }: { team: SeededTeam }) {
  const seedColor = team.isTopSeed ? TOP_SEED_GOLD : 'rgba(246,246,248,0.45)';
  const nameColor = team.isTopSeed ? TOP_SEED_GOLD : '#f6f6f8';

  return (
    <View
      style={[s.seedRow, team.isTopSeed && s.seedRowTop]}
      accessibilityLabel={`Seed ${team.seed}: ${team.name}, record ${team.record}`}>
      <Txt style={[s.seedNum, { color: seedColor }]}>#{team.seed}</Txt>
      <View
        style={[
          s.seedAvatar,
          {
            backgroundColor: withAlpha(team.color, 0.18),
            borderColor:     withAlpha(team.color, 0.5),
          },
        ]}>
        <Txt style={[s.seedAvatarText, { color: team.color }]}>{team.initials}</Txt>
      </View>
      <Txt style={[s.seedName, { color: nameColor, flex: 1 }]} numberOfLines={1}>
        {team.name}
      </Txt>
      <Txt style={s.seedRecord}>{team.record}</Txt>
    </View>
  );
}

const TOP_SEED_GOLD = '#f6c878';

/* ═══════════════════════════════════════════════════════════════════
   Vista: Cuadro publicado — éxito (Figma 633:29507)
═══════════════════════════════════════════════════════════════════ */

interface PublishedViewProps {
  event: LeagueEvent | null;
  onView?: () => void;
}

function PublishedView({ event, onView }: PublishedViewProps) {
  const teamsCount = event?.teamsLabel?.match(/\d+/)?.[0] ?? '—';
  const startDate  = event?.dateLabel?.replace(/^Cierra\s+/i, '') ?? '—';

  return (
    <View style={s.publishedRoot}>
      {/* Ícono verde con glow */}
      <View style={s.publishedIconWrap}>
        <IconCheck size={34} color="#34d77f" strokeWidth={2.5} />
      </View>

      <Txt style={s.publishedTitle}>¡Cuadro publicado!</Txt>

      <Txt style={s.publishedDesc}>
        {`${teamsCount} equipos notificados · calendario agendado.\nEl cuadro ya es visible en "Ver evento". Inicia ${startDate}.`}
      </Txt>

      <Pressable
        style={({ pressed }) => [s.publishedBtn, pressed && { opacity: 0.85 }]}
        onPress={onView}
        accessibilityRole="button"
        accessibilityLabel="Ver cuadro publicado">
        <Svg style={StyleSheet.absoluteFill} width={320} height={52}>
          <Defs>
            <LinearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff3b52" />
              <Stop offset="1" stopColor="#e11d36" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="320" height="52" fill="url(#viewGrad)" />
        </Svg>
        <Txt style={s.publishedBtnLabel}>Ver cuadro publicado</Txt>
      </Pressable>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BracketFooter — renderizado a nivel root en EventoGestionScreen
═══════════════════════════════════════════════════════════════════ */

export interface BracketFooterProps {
  onRegenerate?: () => void;
  onPublish?: () => void;
  bottomInset?: number;
}

export function BracketFooter({
  onRegenerate,
  onPublish,
  bottomInset = 0,
}: BracketFooterProps) {
  const pb = Math.max(bottomInset, 16) + 12;

  return (
    <View style={[s.footer, { paddingBottom: pb }]}>
      <Pressable
        style={({ pressed }) => [s.regenBtn, pressed && s.pressed]}
        onPress={onRegenerate}
        accessibilityRole="button"
        accessibilityLabel="Regenerar cuadro">
        <Txt style={s.footerLabel}>↻  Regenerar</Txt>
      </Pressable>

      <Pressable
        style={({ pressed }) => [s.publishBtn, pressed && s.pressed]}
        onPress={onPublish}
        accessibilityRole="button"
        accessibilityLabel="Publicar cuadro">
        <Svg style={StyleSheet.absoluteFill} width={200} height={54}>
          <Defs>
            <LinearGradient id="publishGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff3b52" />
              <Stop offset="1" stopColor="#e11d36" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="200" height="54" fill="url(#publishGrad)" />
        </Svg>
        <Txt style={s.footerLabel}>✓  Publicar cuadro</Txt>
      </Pressable>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Estilos
═══════════════════════════════════════════════════════════════════ */

const AMBER = 'rgba(246,166,35,';

const s = StyleSheet.create({
  root: { gap: 14 },

  /* ── Vista A: skeleton ── */

  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: `${AMBER}0.1)`,
    borderWidth: 1,
    borderColor: `${AMBER}0.35)`,
    borderRadius: 14,
    padding: 14,
    minHeight: 56,
  },
  alertText: {
    flex: 1,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: '#f6c878',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
  },
  infoLeft: { gap: 3 },
  infoCount: { fontFamily: fonts.glassTitle, fontSize: 18, color: '#f6f6f8' },
  infoSub: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    color: 'rgba(246,246,248,0.5)',
  },

  amberBadge: {
    backgroundColor: `${AMBER}0.14)`,
    borderWidth: 1,
    borderColor: `${AMBER}0.3)`,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  amberBadgeText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    color: '#f6c878',
  },

  eyebrow: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: 'rgba(246,246,248,0.35)',
  },

  skeletonCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  skeletonLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 10.5,
    color: 'rgba(246,246,248,0.3)',
  },
  skeletonLabelGap: { marginTop: 6 },
  skeletonBar: {
    height: 16,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  /* ── Vista B: borrador ── */

  draftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(246,166,35,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(246,166,35,0.4)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  draftDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#f6a623',
  },
  draftText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    color: '#f6c878',
  },

  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: 'rgba(246,246,248,0.45)',
  },

  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: SEG_PADDING,
    gap: SEG_GAP,
  },
  /* Píldora absoluta que se desliza bajo las opciones */
  segPill: {
    position: 'absolute',
    top: SEG_PADDING,
    bottom: SEG_PADDING,
    borderRadius: 10,
    backgroundColor: '#e11d36',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.28,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  /* Opciones: transparentes, texto sobre la píldora con zIndex */
  segOption: {
    flex: 1,
    zIndex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segLabel:       { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: 'rgba(246,246,248,0.55)' },
  segLabelActive: { fontFamily: fonts.glassBodyBold,     fontSize: 13.5, color: '#f6f6f8' },

  seedingDesc: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(246,246,248,0.5)',
  },

  groupCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 14,
    gap: 4,
  },
  groupName: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 12.5,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.7)',
    marginBottom: 4,
  },

  seedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 7,
    borderRadius: 8,
  },
  seedRowTop: { backgroundColor: 'rgba(246,200,120,0.1)' },
  seedNum: { fontFamily: fonts.glassBodyBold, fontSize: 12, width: 24 },
  seedAvatar: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedAvatarText: { fontFamily: fonts.glassBodyBold, fontSize: 9.5 },
  seedName:   { fontFamily: fonts.glassBodySemibold, fontSize: 13, color: '#f6f6f8' },
  seedRecord: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    color: 'rgba(246,246,248,0.4)',
  },

  playoffsLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.35)',
    textAlign: 'center',
    paddingVertical: 4,
  },

  /* ── Footer fijo ── */

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 14,
    backgroundColor: 'rgba(9,9,11,0.88)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  regenBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtn: {
    flex: 1,
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
  footerLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  pressed: { opacity: 0.8 },

  /* ── Éxito: cuadro publicado ── */
  publishedRoot: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 18,
  },
  publishedIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(52,215,127,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(52,215,127,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(52,215,127,1)',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  publishedTitle: {
    fontFamily: fonts.glassTitle,
    fontSize: 26,
    color: '#f6f6f8',
    textAlign: 'center',
  },
  publishedDesc: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(246,246,248,0.55)',
    textAlign: 'center',
  },
  publishedBtn: {
    alignSelf: 'stretch',
    height: 52,
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
    marginTop: 6,
  },
  publishedBtnLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
