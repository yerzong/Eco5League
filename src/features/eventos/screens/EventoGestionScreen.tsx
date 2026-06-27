/**
 * EV-01 · Gestión del evento — reemplaza el detalle anterior. Pantalla con
 * pestañas (Resumen · Equipos · Staff · Brackets · Partidos). Se abre al tocar
 * una card de evento. Por ahora: Resumen completo; el resto se va portando.
 * Datos de maqueta (del diseño).
 */
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Txt } from '@/design-system/components';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconPencil,
  IconShieldLock,
  IconShare,
  IconBrandTwitch,
  IconBrandDiscord,
} from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import type { LeagueEvent } from '@/services';

const TABS = ['Resumen', 'Equipos', 'Staff', 'Brackets', 'Partidos'] as const;
type TabKey = (typeof TABS)[number];

interface EventoGestionModalProps {
  visible: boolean;
  event: LeagueEvent | null;
  onClose: () => void;
  onEdit: () => void;
}

export function EventoGestionModal({ visible, event, onClose, onEdit }: EventoGestionModalProps) {
  const [tab, setTab] = useState<TabKey>('Resumen');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaProvider>
        <View style={styles.root}>
          <SafeAreaView style={styles.flex} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.iconGhost} hitSlop={8} onPress={onClose}>
                <IconChevronLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <Txt style={styles.headerTitle}>Gestión del evento</Txt>
              <Pressable style={styles.iconBtn} hitSlop={8} onPress={onEdit}>
                <IconPencil size={20} color={theme.colors.textSecondary} strokeWidth={2} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              {/* Hero */}
              <View style={styles.hero}>
                <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor="#c8102e" stopOpacity={0.85} />
                      <Stop offset="1" stopColor="#1a0608" />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width="100%" height="100%" rx={16} fill="url(#heroGrad)" />
                </Svg>
                <View style={styles.heroTop}>
                  <View style={styles.ligaTag}>
                    <Txt style={styles.ligaText}>LIGA</Txt>
                  </View>
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <Txt style={styles.statusText}>EN CURSO</Txt>
                  </View>
                </View>
                <View style={styles.heroBottom}>
                  <Txt style={styles.heroName} numberOfLines={1}>
                    {event?.title ?? 'Copa ECO5 · Temporada 1'}
                  </Txt>
                  <Txt style={styles.heroSub}>Liga · Gears E-Day · 4v4</Txt>
                </View>
              </View>

              {/* Tabs */}
              <View style={styles.tabs}>
                {TABS.map(t => {
                  const active = t === tab;
                  return (
                    <Pressable key={t} style={styles.tab} onPress={() => setTab(t)}>
                      <Txt style={[styles.tabText, ...(active ? [styles.tabTextActive] : [])]}>{t}</Txt>
                      <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.divider} />

              {tab === 'Resumen' ? <ResumenTab /> : <Placeholder tab={tab} />}
            </ScrollView>

            {/* Footer */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
              <Pressable style={styles.footerGhost} onPress={onEdit}>
                <IconShare size={18} color={theme.colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <Pressable style={styles.footerPrimary}>
                <IconChevronDown size={18} color={theme.colors.white} strokeWidth={2} />
                <Txt style={styles.footerPrimaryText}>Estado · En curso</Txt>
              </Pressable>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

/* ---------- Resumen ---------- */

function ResumenTab() {
  return (
    <View style={styles.tabBody}>
      {/* Datos clave */}
      <View style={styles.cardSunk}>
        <SectionTitle label="DATOS CLAVE" />
        <View style={styles.statRow}>
          <Stat label="EQUIPOS" value="8 / 8" />
          <Stat label="STAFF" value="6 asignados" />
        </View>
        <View style={styles.statRow}>
          <Stat label="FORMATO" value="Grupos + Playoffs" />
          <Stat label="REGIÓN" value="México · ES" />
        </View>
        <View style={styles.statRow}>
          <Stat label="COOLDOWN TRANSF." value="48 h" />
          <Stat label="VISIBILIDAD" value="Pública" />
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.card}>
        <SectionTitle label="DESCRIPCIÓN" />
        <Txt style={styles.paragraph}>
          Liga oficial ECO5 de Gears E-Day 4v4. Fase de grupos seguida de playoffs de eliminación
          directa. Abierta a orgs registradas de la región.
        </Txt>
      </View>

      {/* Formato & roster */}
      <View style={styles.card}>
        <SectionTitle label="FORMATO & ROSTER" />
        <View style={styles.statRow}>
          <Stat small label="ROSTER" value="4 + 2 supl. + coach" />
          <Stat small label="JUGADORES MÍN." value="4 por equipo" />
        </View>
        <View style={styles.statRow}>
          <Stat small label="EQUIPOS" value="mín 6 · máx 8" />
          <Stat small label="SLOTS" value="L–V 18:00 · S–D AM" />
        </View>
      </View>

      {/* Fechas clave */}
      <View style={styles.card}>
        <SectionTitle label="FECHAS CLAVE" />
        <DateRow color={theme.colors.accentGreen} label="Apertura inscripciones" value="15 ene 2026" />
        <DateRow color={theme.colors.accentAmber} label="Cierre · roster lock" value="28 ene 2026" />
        <DateRow color={theme.colors.brandRed} label="Inicio del torneo" value="01 feb 2026" />
        <DateRow color={theme.colors.textTertiary} label="Finalización estimada" value="30 mar 2026" />
      </View>

      {/* Reglas & elegibilidad */}
      <View style={styles.card}>
        <SectionTitle label="REGLAS & ELEGIBILIDAD" />
        <Pressable style={styles.fileRow}>
          <View style={styles.fileIcon}>
            <IconShieldLock size={18} color={theme.colors.brandRed} strokeWidth={1.9} />
          </View>
          <View style={styles.flex}>
            <Txt style={styles.fileTitle}>Reglamento oficial ECO5</Txt>
            <Txt style={styles.fileSub}>PDF · v2.1 · toca para abrir</Txt>
          </View>
          <IconChevronRight size={18} color={theme.colors.textSecondary} strokeWidth={2} />
        </Pressable>
        <View style={styles.kvRow}>
          <Txt style={styles.kvLabel}>Restricciones</Txt>
          <Txt style={styles.kvValue}>Edad 16+ · MX · sin smurfs</Txt>
        </View>
      </View>

      {/* Premio */}
      <View style={styles.card}>
        <SectionTitle label="PREMIO" />
        <View style={styles.prizeRow}>
          <View style={styles.prizeIcon}>
            <Txt style={styles.prizeEmoji}>🏆</Txt>
          </View>
          <View style={styles.flex}>
            <Txt style={styles.prizeAmount}>$15,000 MXN</Txt>
            <Txt style={styles.prizeNote}>+ clasificación a Finals · solo display</Txt>
          </View>
        </View>
      </View>

      {/* Stream & comunidad */}
      <View style={styles.card}>
        <SectionTitle label="STREAM & COMUNIDAD" />
        <View style={styles.linkRow}>
          <View style={styles.linkIcon}>
            <IconBrandTwitch size={18} color="#a970ff" strokeWidth={1.9} />
          </View>
          <Txt style={styles.linkLabel}>Twitch</Txt>
          <Txt style={styles.linkValue}>/eco5esports</Txt>
        </View>
        <View style={styles.linkRow}>
          <View style={styles.linkIcon}>
            <IconBrandDiscord size={18} color="#5865f2" strokeWidth={1.9} />
          </View>
          <Txt style={styles.linkLabel}>Discord</Txt>
          <Txt style={styles.linkValue}>/eco5</Txt>
        </View>
      </View>
    </View>
  );
}

function Placeholder({ tab }: { tab: TabKey }) {
  return (
    <View style={styles.placeholder}>
      <Txt style={styles.placeholderTitle}>{tab}</Txt>
      <Txt style={styles.placeholderText}>Pestaña en construcción</Txt>
    </View>
  );
}

/* ---------- Helpers ---------- */

function SectionTitle({ label }: { label: string }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionBar} />
      <Txt style={styles.sectionLabel}>{label}</Txt>
    </View>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <View style={styles.flex}>
      <Txt style={[styles.statLabel, ...(small ? [styles.statLabelSmall] : [])]}>{label}</Txt>
      <Txt style={styles.statValue} numberOfLines={1}>
        {value}
      </Txt>
    </View>
  );
}

function DateRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.dateRow}>
      <View style={styles.dateLeft}>
        <View style={[styles.dateDot, { backgroundColor: color }]} />
        <Txt style={styles.dateLabel}>{label}</Txt>
      </View>
      <Txt style={styles.dateValue}>{value}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  iconGhost: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontFamily: fonts.heading, fontSize: 18, letterSpacing: 0.18, color: theme.colors.textPrimary },

  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: 24, gap: theme.spacing.lg },

  // Hero
  hero: { height: 128, borderRadius: 16, overflow: 'hidden', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, justifyContent: 'space-between' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ligaTag: { backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm },
  ligaText: { fontFamily: fonts.heading, fontSize: 11, letterSpacing: 0.88, color: theme.colors.white },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.brandRed, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 99 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.white },
  statusText: { fontFamily: fonts.heading, fontSize: 10, letterSpacing: 0.8, color: theme.colors.white },
  heroBottom: { gap: 3 },
  heroName: { fontFamily: fonts.headingBold, fontSize: 22, color: theme.colors.white },
  heroSub: { fontFamily: fonts.bodyMedium, fontSize: 12, color: '#f0d0d4' },

  // Tabs
  tabs: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tab: { alignItems: 'center', gap: theme.spacing.sm },
  tabText: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.brandRed },
  tabUnderline: { height: 2, width: 1, borderRadius: 2, backgroundColor: 'transparent' },
  tabUnderlineActive: { width: 28, backgroundColor: theme.colors.brandRed },
  divider: { height: 1, backgroundColor: theme.colors.borderSubtle },

  // Tab body
  tabBody: { gap: theme.spacing.lg },

  // Cards
  card: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: 16,
    gap: theme.spacing.md,
  },
  cardSunk: {
    backgroundColor: '#121416',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    padding: 16,
    gap: 14,
  },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  sectionBar: { width: 3, height: 12, borderRadius: 2, backgroundColor: theme.colors.brandRed },
  sectionLabel: { fontFamily: fonts.heading, fontSize: 12, letterSpacing: 1.2, color: theme.colors.textSecondary },

  statRow: { flexDirection: 'row', gap: theme.spacing.md },
  statLabel: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 0.5, color: theme.colors.textSecondary, marginBottom: 4 },
  statLabelSmall: { fontSize: 10, letterSpacing: 0.6, color: theme.colors.textTertiary },
  statValue: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },

  paragraph: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: theme.colors.textSecondary },

  // Fechas
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  dateDot: { width: 7, height: 7, borderRadius: 4 },
  dateLabel: { fontFamily: fonts.body, fontSize: 13, color: theme.colors.textSecondary },
  dateValue: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textPrimary },

  // Reglas
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, backgroundColor: '#1a1d23', paddingHorizontal: 12, paddingVertical: 11, borderRadius: 10 },
  fileIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: theme.colors.brandRed + '29', alignItems: 'center', justifyContent: 'center' },
  fileTitle: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textPrimary },
  fileSub: { fontFamily: fonts.body, fontSize: 11, color: theme.colors.textTertiary, marginTop: 2 },
  kvRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kvLabel: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary },
  kvValue: { fontFamily: fonts.bodyMedium, fontSize: 12, color: theme.colors.textPrimary },

  // Premio
  prizeRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  prizeIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.colors.accentAmber + '29', alignItems: 'center', justifyContent: 'center' },
  prizeEmoji: { fontSize: 20 },
  prizeAmount: { fontFamily: fonts.headingBold, fontSize: 18, color: theme.colors.accentAmber },
  prizeNote: { fontFamily: fonts.body, fontSize: 11, color: theme.colors.textTertiary, marginTop: 2 },

  // Stream
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  linkIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#1a1d23', alignItems: 'center', justifyContent: 'center' },
  linkLabel: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textPrimary },
  linkValue: { flex: 1, textAlign: 'right', fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary },

  // Placeholder
  placeholder: { alignItems: 'center', paddingVertical: theme.spacing['5xl'], gap: theme.spacing.xs },
  placeholderTitle: { fontFamily: fonts.headingBold, fontSize: 18, color: theme.colors.textPrimary },
  placeholderText: { fontFamily: fonts.body, fontSize: 13, color: theme.colors.textTertiary },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#0c0d10',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  footerGhost: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPrimaryText: { fontFamily: fonts.headingBold, fontSize: 13, letterSpacing: 0.26, color: theme.colors.white },
});
