/**
 * Detalle de evento (Ver evento) — pantalla con pestañas: Resumen · Equipos ·
 * Staff · Brackets · Partidos. Se abre al tocar una card de evento.
 * Datos de maqueta (del diseño). El botón "Editar" abre el flujo de edición.
 */
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Txt,
  Eyebrow,
  GameArt,
  Avatar,
  StatusPill,
  ActionLink,
} from '@/design-system/components';
import {
  IconChevronLeft,
  IconPencil,
  IconBrandTwitch,
  IconBrandDiscord,
} from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import type { LeagueEvent } from '@/services';

const TABS = ['Resumen', 'Equipos', 'Staff', 'Brackets', 'Partidos'] as const;
type TabKey = (typeof TABS)[number];

const GREEN = theme.colors.accentGreen;
const AMBER = theme.colors.accentAmber;

interface EventoDetalleModalProps {
  visible: boolean;
  event: LeagueEvent | null;
  onClose: () => void;
  onEdit: () => void;
}

export function EventoDetalleModal({ visible, event, onClose, onEdit }: EventoDetalleModalProps) {
  const [tab, setTab] = useState<TabKey>('Resumen');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaProvider>
        <View style={styles.root}>
          <SafeAreaView style={styles.flex} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.iconBtn} hitSlop={8} onPress={onClose}>
                <IconChevronLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <Txt style={styles.headerTitle}>Detalle de evento</Txt>
              <Pressable style={styles.iconBtn} hitSlop={8} onPress={onEdit}>
                <IconPencil size={20} color={theme.colors.textSecondary} strokeWidth={2} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              {/* Hero */}
              <View style={styles.hero}>
                <View style={styles.cover}>
                  <GameArt
                    label={event?.game ?? 'GEARS'}
                    accent={event?.accent}
                    height={104}
                    radius={0}
                    scrim
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.coverTop}>
                    <View style={styles.ligaTag}>
                      <Txt style={styles.ligaText}>LIGA</Txt>
                    </View>
                    <StatusPill label="EN CURSO" color={GREEN} dot round />
                  </View>
                  <View style={styles.coverBottom}>
                    <Txt style={styles.heroName} numberOfLines={1}>
                      {event?.title ?? 'Copa ECO5 · Temporada 1'}
                    </Txt>
                    <Txt style={styles.heroSub}>Liga · Gears E-Day · 4v4</Txt>
                  </View>
                </View>
                <View style={styles.metaGrid}>
                  <View style={styles.metaRow}>
                    <Meta label="EQUIPOS" value="16 / 16" />
                    <Meta label="FORMATO" value="Grupos + Playoffs" />
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaRow}>
                    <Meta label="REGIÓN" value="México · ES" />
                    <Meta label="COOLDOWN" value="48 h" />
                  </View>
                </View>
              </View>

              {/* Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabs}>
                {TABS.map(t => {
                  const active = t === tab;
                  return (
                    <Pressable key={t} style={styles.tab} onPress={() => setTab(t)}>
                      <Txt style={[styles.tabText, ...(active ? [styles.tabTextActive] : [])]}>{t}</Txt>
                      {active ? <View style={styles.tabUnderline} /> : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View style={styles.tabsDivider} />

              {/* Tab content */}
              {tab === 'Resumen' && <ResumenTab />}
              {tab === 'Equipos' && <EquiposTab />}
              {tab === 'Staff' && <StaffTab />}
              {tab === 'Brackets' && <BracketsTab />}
              {tab === 'Partidos' && <PartidosTab />}
            </ScrollView>

            {/* Footer */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
              <Pressable style={styles.secondaryBtn} onPress={onEdit}>
                <IconPencil size={16} color={theme.colors.textPrimary} strokeWidth={2} />
                <Txt style={styles.secondaryLabel}>Editar</Txt>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onClose}>
                <Txt style={styles.primaryLabel}>GESTIONAR</Txt>
              </Pressable>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

/* ---------- Helpers ---------- */

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.flex}>
      <Txt style={styles.metaLabel}>{label}</Txt>
      <Txt style={styles.metaValue} numberOfLines={1}>
        {value}
      </Txt>
    </View>
  );
}

/** Fila etiqueta/valor (Fechas clave, etc.). */
function KV({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.kvRow}>
      <Txt style={styles.kvLabel}>{label}</Txt>
      <Txt style={[styles.kvValue, ...(color ? [{ color }] : [])]}>{value}</Txt>
    </View>
  );
}

/* ---------- Tabs ---------- */

const ROSTER_AVATARS = [
  { i: 'TO', c: GREEN },
  { i: 'VG', c: '#2a6fdb' },
  { i: 'RG', c: theme.colors.brandRed },
  { i: 'SL', c: AMBER },
];

function ResumenTab() {
  return (
    <View style={styles.tabBody}>
      <Eyebrow label="Equipos" />
      <View style={styles.card}>
        <View style={styles.teamsRow}>
          <View style={styles.avatars}>
            {ROSTER_AVATARS.map((a, idx) => (
              <View key={a.i} style={[styles.avatarWrap, idx > 0 && styles.avatarOverlap]}>
                <Avatar initials={a.i} color={a.c} size={32} font="body" />
              </View>
            ))}
            <View style={[styles.avatarWrap, styles.avatarOverlap, styles.moreAvatar]}>
              <Txt style={styles.moreText}>+12</Txt>
            </View>
          </View>
          <ActionLink label="Gestionar" />
        </View>
        <View style={styles.divider} />
        <View style={styles.teamsMetaRow}>
          <Txt style={styles.teamsMeta}>16 inscritos</Txt>
          <Txt style={[styles.teamsMeta, { color: AMBER }]}>3 por aprobar</Txt>
        </View>
      </View>

      <Eyebrow label="Descripción" />
      <Txt style={styles.paragraph}>
        Liga oficial ECO5 de Gears E-Day 4v4. Fase de grupos seguida de playoffs de eliminación
        doble. Abierta a orgs registradas de la región.
      </Txt>

      <Eyebrow label="Formato & Roster" />
      <View style={styles.card}>
        <View style={styles.metaRow}>
          <Meta label="ROSTER" value="4 + 2 supl. + coach" />
          <Meta label="JUGADORES MÍN." value="4 por equipo" />
        </View>
        <View style={styles.divider} />
        <View style={styles.metaRow}>
          <Meta label="EQUIPOS" value="mín 8 · máx 16" />
          <Meta label="SLOTS" value="L–V 18:00 · S–D AM" />
        </View>
      </View>

      <Eyebrow label="Fechas clave" />
      <View style={styles.card}>
        <KV label="Apertura inscripciones" value="15 ene 2026" />
        <KV label="Cierre · roster lock" value="28 ene 2026" />
        <KV label="Inicio del torneo" value="01 feb 2026" />
        <KV label="Finalización estimada" value="30 mar 2026" />
      </View>

      <Eyebrow label="Reglas & Elegibilidad" />
      <View style={styles.card}>
        <KV label="Reglamento oficial ECO5" value="PDF · v2.1" color={theme.colors.brandRedBorder} />
        <View style={styles.divider} />
        <KV label="Restricciones" value="Edad 16+ · MX" />
      </View>

      <Eyebrow label="Premio" />
      <View style={[styles.card, styles.prizeCard]}>
        <Txt style={styles.prizeEmoji}>🏆</Txt>
        <View style={styles.flex}>
          <Txt style={styles.prizeAmount}>$15,000 MXN</Txt>
          <Txt style={styles.prizeNote}>+ clasificación a Finals · solo display</Txt>
        </View>
      </View>

      <Eyebrow label="Stream & Comunidad" />
      <View style={styles.card}>
        <View style={styles.linkRow}>
          <IconBrandTwitch size={18} color="#a970ff" strokeWidth={1.9} />
          <Txt style={styles.linkLabel}>Twitch</Txt>
          <Txt style={styles.linkValue}>/eco5esports</Txt>
        </View>
        <View style={styles.divider} />
        <View style={styles.linkRow}>
          <IconBrandDiscord size={18} color="#5865f2" strokeWidth={1.9} />
          <Txt style={styles.linkLabel}>Discord</Txt>
          <Txt style={styles.linkValue}>/eco5</Txt>
        </View>
      </View>

      <Eyebrow label="Staff asignado" />
      <View style={styles.card}>
        {STAFF.map((s, i) => (
          <View key={s.name}>
            {i > 0 ? <View style={styles.divider} /> : null}
            <View style={styles.staffRow}>
              <Avatar initials={s.initials} color={s.color} size={36} font="body" />
              <View style={styles.flex}>
                <Txt style={styles.staffName}>{s.name}</Txt>
                <Txt style={styles.staffRole}>{s.role}</Txt>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const STAFF = [
  { initials: 'CM', name: 'Carlos M.', role: 'Caster', color: '#7a3fb0' },
  { initials: 'LV', name: 'Laura V.', role: 'Streamer', color: '#5865f2' },
  { initials: 'AR', name: 'Ana R.', role: 'Árbitro', color: AMBER },
];

const PENDING = [
  { i: 'NW', name: 'NightWolves', org: 'Independiente · 3/4 jugadores', c: '#8a9099' },
  { i: 'ST', name: 'Steel Titans', org: 'Steel Org · 4/4 jugadores', c: '#2a6fdb' },
  { i: 'PX', name: 'Phoenix X', org: 'Phoenix Esports · 4/4 jugadores', c: theme.colors.brandRed },
];
const ACTIVE_TEAMS = [
  { i: 'TO', name: 'Team Ozone', org: 'Ozone Esports · 4/4 roster', c: GREEN },
  { i: 'VG', name: 'Viral GG', org: 'Viral Gaming · 4/4 roster', c: '#2a6fdb' },
  { i: 'RG', name: 'Red Gaming', org: 'Red Org · 4/4 roster', c: theme.colors.brandRed },
  { i: 'SL', name: 'Steel Legion', org: 'Steel Org · 4/4 roster', c: AMBER },
];

function EquiposTab() {
  return (
    <View style={styles.tabBody}>
      <View style={styles.rowBetween}>
        <Eyebrow label="Equipos inscritos" />
      </View>
      <Txt style={styles.subtleNote}>16 inscritos · 3 pend.</Txt>

      <Txt style={styles.groupLabel}>POR APROBAR · 3</Txt>
      <View style={styles.list}>
        {PENDING.map(t => (
          <View key={t.i} style={[styles.card, styles.pendingCard]}>
            <View style={styles.teamHead}>
              <Avatar initials={t.i} color={t.c} size={40} font="body" />
              <View style={styles.flex}>
                <Txt style={styles.teamName}>{t.name}</Txt>
                <Txt style={styles.teamOrg}>{t.org}</Txt>
              </View>
            </View>
            <View style={styles.approveRow}>
              <Pressable style={styles.approveBtn}>
                <Txt style={styles.approveText}>Aprobar</Txt>
              </Pressable>
              <Pressable style={styles.rejectBtn}>
                <Txt style={styles.rejectText}>Rechazar</Txt>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <Txt style={styles.groupLabel}>ACTIVOS · 13</Txt>
      <View style={styles.list}>
        {ACTIVE_TEAMS.map(t => (
          <View key={t.i} style={[styles.card, styles.teamRowCard]}>
            <Avatar initials={t.i} color={t.c} size={40} font="body" />
            <View style={styles.flex}>
              <Txt style={styles.teamName}>{t.name}</Txt>
              <Txt style={styles.teamOrg}>{t.org}</Txt>
            </View>
            <StatusPill label="Activo" color={GREEN} dot round />
          </View>
        ))}
      </View>
    </View>
  );
}

function StaffTab() {
  return (
    <View style={styles.tabBody}>
      <View style={styles.rowBetween}>
        <Eyebrow label="Staff del evento" />
        <ActionLink label="Agregar" />
      </View>
      <View style={styles.list}>
        {STAFF.map(s => (
          <View key={s.name} style={[styles.card, styles.teamRowCard]}>
            <Avatar
              initials={s.initials}
              color={s.color}
              size={44}
              font="body"
              style={{ borderWidth: 1.5, borderColor: s.color }}
            />
            <View style={styles.flex}>
              <Txt style={styles.teamName}>{s.name}</Txt>
              <Txt style={styles.teamOrg}>{s.role}</Txt>
            </View>
            <StatusPill label="Activo" color={GREEN} dot round />
          </View>
        ))}
      </View>
    </View>
  );
}

const GROUP_A = [
  { i: 'TO', n: 'Team Ozone', pj: 3, v: 3, d: 0, pts: 9 },
  { i: 'RG', n: 'Red Gaming', pj: 3, v: 2, d: 1, pts: 6 },
  { i: 'KX', n: 'Kraken X', pj: 3, v: 1, d: 2, pts: 3 },
  { i: 'NV', n: 'Nova Carry', pj: 3, v: 0, d: 3, pts: 0 },
];
const GROUP_B = [
  { i: 'SL', n: 'Steel Legion', pj: 3, v: 3, d: 0, pts: 9 },
  { i: 'NW', n: 'NightWolves', pj: 3, v: 2, d: 1, pts: 6 },
  { i: 'VG', n: 'Viral GG', pj: 3, v: 1, d: 2, pts: 3 },
  { i: 'PX', n: 'Phoenix X', pj: 3, v: 0, d: 3, pts: 0 },
];

function Standings({ title, rows }: { title: string; rows: typeof GROUP_A }) {
  return (
    <View style={styles.card}>
      <Txt style={styles.standTitle}>{title}</Txt>
      <View style={styles.standHead}>
        <Txt style={[styles.standH, styles.flex]}> </Txt>
        <Txt style={styles.standCol}>PJ</Txt>
        <Txt style={styles.standCol}>V</Txt>
        <Txt style={styles.standCol}>D</Txt>
        <Txt style={styles.standCol}>PTS</Txt>
      </View>
      {rows.map((r, idx) => (
        <View key={r.i} style={styles.standRow}>
          <View style={[styles.standTeam, styles.flex]}>
            <View style={[styles.rankDot, idx < 2 && styles.rankTop]}>
              <Txt style={[styles.rankNum, ...(idx < 2 ? [styles.rankNumTop] : [])]}>{idx + 1}</Txt>
            </View>
            <Txt style={styles.standName} numberOfLines={1}>
              {r.n}
            </Txt>
          </View>
          <Txt style={styles.standCol}>{r.pj}</Txt>
          <Txt style={styles.standCol}>{r.v}</Txt>
          <Txt style={styles.standCol}>{r.d}</Txt>
          <Txt style={[styles.standCol, styles.standPts]}>{r.pts}</Txt>
        </View>
      ))}
    </View>
  );
}

function BracketsTab() {
  return (
    <View style={styles.tabBody}>
      <View style={styles.rowBetween}>
        <Eyebrow label="Fase de grupos" />
        <Txt style={styles.subtleNote}>Top 2 clasifica</Txt>
      </View>
      <Standings title="GRUPO A" rows={GROUP_A} />
      <Standings title="GRUPO B" rows={GROUP_B} />

      <View style={styles.rowBetween}>
        <Eyebrow label="Playoffs" />
        <Txt style={styles.subtleNote}>Eliminación directa</Txt>
      </View>
      <Txt style={styles.groupLabel}>SEMIFINALES</Txt>
      <MatchCard tag="SF1 · BO5" when="Hoy 19:00" a="Team Ozone" b="Red Gaming" />
      <MatchCard tag="SF2 · BO5" when="Hoy 21:00" a="Steel Legion" b="NightWolves" />
      <Txt style={styles.groupLabel}>GRAN FINAL</Txt>
      <MatchCard tag="FINAL · BO5" when="02 feb · 20:00" a="Por definir" b="Por definir" />
    </View>
  );
}

function MatchCard({ tag, when, a, b, sa, sb, live }: { tag: string; when: string; a: string; b: string; sa?: string; sb?: string; live?: boolean }) {
  return (
    <View style={styles.card}>
      <View style={styles.matchHead}>
        <Txt style={styles.matchTag}>{tag}</Txt>
        {live ? (
          <View style={styles.liveTag}>
            <Txt style={styles.liveText}>EN VIVO</Txt>
          </View>
        ) : (
          <Txt style={styles.matchWhen}>{when}</Txt>
        )}
      </View>
      <View style={styles.matchTeam}>
        <Txt style={styles.matchName} numberOfLines={1}>{a}</Txt>
        {sa ? <Txt style={styles.matchScore}>{sa}</Txt> : null}
      </View>
      <View style={styles.matchTeam}>
        <Txt style={styles.matchName} numberOfLines={1}>{b}</Txt>
        {sb ? <Txt style={styles.matchScore}>{sb}</Txt> : null}
      </View>
    </View>
  );
}

function PartidosTab() {
  return (
    <View style={styles.tabBody}>
      <View style={styles.rowBetween}>
        <Eyebrow label="Partidos" />
        <Txt style={[styles.subtleNote, { color: theme.colors.brandRed }]}>2 en vivo ahora</Txt>
      </View>

      <Txt style={styles.groupLabel}>EN VIVO · 2</Txt>
      <View style={styles.list}>
        <LiveMatch tag="Semifinal · BO3" a="Team Ozone" sa="1" b="Red Gaming" sb="1" map="Mapa 2 de 3 · Ascent" />
        <LiveMatch tag="Semifinal · BO3" a="Steel Legion" sa="0" b="NightWolves" sb="1" map="Mapa 1 de 3 · Bind" />
      </View>

      <Txt style={styles.groupLabel}>PRÓXIMOS</Txt>
      <MatchCard tag="Gran Final · BO5" when="02 feb 2026 · 20:00" a="Por definir" b="Por definir" />

      <Txt style={styles.groupLabel}>FINALIZADOS</Txt>
      <View style={styles.list}>
        <FinishedMatch a="Team Ozone" sa="2" b="Nova Carry" sb="1" date="31 ene 2026" />
        <FinishedMatch a="Red Gaming" sa="2" b="Kraken X" sb="0" date="31 ene 2026" />
      </View>
    </View>
  );
}

function LiveMatch({ tag, a, sa, b, sb, map }: { tag: string; a: string; sa: string; b: string; sb: string; map: string }) {
  return (
    <View style={[styles.card, styles.liveCard]}>
      <View style={styles.matchHead}>
        <Txt style={styles.matchTag}>{tag}</Txt>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Txt style={styles.liveText}>EN VIVO</Txt>
        </View>
      </View>
      <View style={styles.matchTeam}>
        <Txt style={styles.matchName}>{a}</Txt>
        <Txt style={styles.matchScore}>{sa}</Txt>
      </View>
      <View style={styles.matchTeam}>
        <Txt style={styles.matchName}>{b}</Txt>
        <Txt style={styles.matchScore}>{sb}</Txt>
      </View>
      <View style={styles.divider} />
      <View style={styles.rowBetween}>
        <Txt style={styles.matchMap}>{map}</Txt>
        <ActionLink label="Registrar resultado" />
      </View>
    </View>
  );
}

function FinishedMatch({ a, sa, b, sb, date }: { a: string; sa: string; b: string; sb: string; date: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.matchHead}>
        <Txt style={styles.matchTagMuted}>Cuartos · BO3 · FINAL</Txt>
        <Txt style={styles.matchWhen}>{date}</Txt>
      </View>
      <View style={styles.matchTeam}>
        <Txt style={styles.matchName}>{a}</Txt>
        <Txt style={[styles.matchScore, { color: GREEN }]}>{sa}</Txt>
      </View>
      <View style={styles.matchTeam}>
        <Txt style={styles.matchNameMuted}>{b}</Txt>
        <Txt style={styles.matchScoreMuted}>{sb}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontFamily: fonts.headingBold, fontSize: 20, letterSpacing: 0.2, color: theme.colors.textPrimary },

  content: { paddingBottom: 24 },

  // Hero
  hero: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    overflow: 'hidden',
  },
  cover: { height: 104 },
  coverTop: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  ligaTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.radius.sm, backgroundColor: '#0c0c10d9', borderWidth: 1, borderColor: theme.colors.borderDefault },
  ligaText: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.6, color: theme.colors.textSecondary },
  coverBottom: { position: 'absolute', left: 14, right: 14, bottom: 12, gap: 2 },
  heroName: { fontFamily: fonts.headingBold, fontSize: 20, color: theme.colors.textPrimary },
  heroSub: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary },
  metaGrid: { padding: 14, gap: 14 },
  metaRow: { flexDirection: 'row', gap: theme.spacing.md },
  metaDivider: { height: 1, backgroundColor: theme.colors.borderDefault },
  metaLabel: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.5, color: theme.colors.textTertiary, marginBottom: 4 },
  metaValue: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },

  // Tabs
  tabs: { paddingHorizontal: theme.spacing.lg, gap: theme.spacing.xl, paddingTop: theme.spacing.lg },
  tab: { alignItems: 'center', paddingBottom: theme.spacing.sm },
  tabText: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textTertiary },
  tabTextActive: { color: theme.colors.textPrimary },
  tabUnderline: { position: 'absolute', bottom: 0, width: 28, height: 2, borderRadius: 2, backgroundColor: theme.colors.brandRed },
  tabsDivider: { height: 1, backgroundColor: theme.colors.borderDefault, marginTop: -1 },

  // Tab body
  tabBody: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg, gap: theme.spacing.md },
  list: { gap: theme.spacing.sm },

  card: {
    backgroundColor: theme.colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    padding: 14,
    gap: 12,
  },
  divider: { height: 1, backgroundColor: theme.colors.borderDefault },
  paragraph: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: theme.colors.textSecondary },

  // Resumen · equipos avatars
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatars: { flexDirection: 'row' },
  avatarWrap: { borderWidth: 2, borderColor: theme.colors.surface1, borderRadius: 99 },
  avatarOverlap: { marginLeft: -10 },
  moreAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.surface2, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontFamily: fonts.label, fontSize: 11, color: theme.colors.textSecondary },
  teamsMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  teamsMeta: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textSecondary },

  // KV
  kvRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kvLabel: { fontFamily: fonts.body, fontSize: 13, color: theme.colors.textSecondary, flexShrink: 1 },
  kvValue: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textPrimary },

  // Prize
  prizeCard: { flexDirection: 'row', alignItems: 'center' },
  prizeEmoji: { fontSize: 28 },
  prizeAmount: { fontFamily: fonts.headingBold, fontSize: 18, color: theme.colors.textPrimary },
  prizeNote: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 },

  // Links
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  linkLabel: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textPrimary },
  linkValue: { flex: 1, textAlign: 'right', fontFamily: fonts.body, fontSize: 13, color: theme.colors.textSecondary },

  // Staff
  staffRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  staffName: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  staffRole: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 1 },

  // Equipos tab
  subtleNote: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary },
  groupLabel: { fontFamily: fonts.label, fontSize: 11, letterSpacing: 0.5, color: theme.colors.textTertiary, marginTop: theme.spacing.xs },
  pendingCard: { borderColor: AMBER + '55' },
  teamHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  teamRowCard: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  teamName: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  teamOrg: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary, marginTop: 1 },
  approveRow: { flexDirection: 'row', gap: theme.spacing.sm },
  approveBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, backgroundColor: GREEN + '24', alignItems: 'center' },
  approveText: { fontFamily: fonts.label, fontSize: 13, color: GREEN },
  rejectBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.borderDefault, alignItems: 'center' },
  rejectText: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textSecondary },

  // Standings
  standTitle: { fontFamily: fonts.label, fontSize: 12, letterSpacing: 0.5, color: theme.colors.textSecondary },
  standHead: { flexDirection: 'row', alignItems: 'center' },
  standH: { },
  standCol: { width: 30, textAlign: 'center', fontFamily: fonts.label, fontSize: 12, color: theme.colors.textTertiary },
  standRow: { flexDirection: 'row', alignItems: 'center' },
  standTeam: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  rankDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: theme.colors.surface2, alignItems: 'center', justifyContent: 'center' },
  rankTop: { backgroundColor: GREEN + '24' },
  rankNum: { fontFamily: fonts.label, fontSize: 10, color: theme.colors.textTertiary },
  rankNumTop: { color: GREEN },
  standName: { fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.colors.textPrimary, flexShrink: 1 },
  standPts: { fontFamily: fonts.label, color: theme.colors.textPrimary },

  // Match cards
  matchHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchTag: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.textSecondary },
  matchTagMuted: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.textTertiary },
  matchWhen: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary },
  matchTeam: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchName: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  matchNameMuted: { fontFamily: fonts.body, fontSize: 14, color: theme.colors.textSecondary },
  matchScore: { fontFamily: fonts.headingBold, fontSize: 16, color: theme.colors.textPrimary },
  matchScoreMuted: { fontFamily: fonts.headingBold, fontSize: 16, color: theme.colors.textTertiary },
  matchMap: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textTertiary },
  liveCard: { borderColor: theme.colors.brandRed + '55' },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: theme.colors.brandRed + '24' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.brandRed },
  liveText: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.4, color: theme.colors.brandRed },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#0c0d10',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  secondaryBtn: {
    width: 120,
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  primaryBtn: { flex: 1, height: 48, borderRadius: 10, backgroundColor: theme.colors.brandRed, alignItems: 'center', justifyContent: 'center' },
  primaryLabel: { fontFamily: fonts.headingBold, fontSize: 13, letterSpacing: 0.26, color: theme.colors.white },
});
