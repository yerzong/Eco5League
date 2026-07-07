/**
 * EV ✦ Gestión del evento — rediseño glass. Fiel a Figma 637:3563.
 * 5 tabs: Resumen (completo) · Equipos · Staff · Brackets · Partidos (placeholders).
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ConfirmDialog, Fab, Txt } from '@/design-system/components';
import {
  IconCheck,
  IconChevronLeft,
  IconPencil,
  IconRefresh,
} from '@/design-system/icons';
import { fonts } from '@/design-system/tokens/typography';
import type { EventTeam, LeagueEvent } from '@/services';
import { AgregarStaffSheet } from './AgregarStaffSheet';
import { EditarEventoModal } from './EditarEventoScreen';
import { BracketFooter, EventoBracketsTab } from './EventoBracketsTab';
import { PublicarCuadroSheet } from './PublicarCuadroSheet';
import { EventoEquiposTab } from './EventoEquiposTab';
import { EventoStaffTab } from './EventoStaffTab';
import { EventoTeamDetailModal } from './EventoTeamDetailModal';
import { EventoPartidosTab } from './EventoPartidosTab';

const TABS = ['Resumen', 'Equipos', 'Staff', 'Brackets', 'Partidos'] as const;
type TabKey = (typeof TABS)[number];

interface EventoGestionModalProps {
  visible: boolean;
  event: LeagueEvent | null;
  onClose: () => void;
  /** Se llama tras confirmar la eliminación del evento. */
  onDelete?: (event: LeagueEvent) => void;
  /** Tab que se muestra al abrir (por defecto 'Resumen'). */
  initialTab?: TabKey;
}

export function EventoGestionModal({
  visible,
  event,
  onClose,
  onDelete,
  initialTab,
}: EventoGestionModalProps) {
  // TODO: quitar cuando se termine el maquetado del módulo Staff
  const [tab, setTab] = useState<TabKey>(initialTab ?? 'Staff');
  const [editing, setEditing] = useState(false);
  const [detailTeam, setDetailTeam] = useState<EventTeam | null>(null);
  const [addingStaff, setAddingStaff] = useState(false);
  const [staffRefreshKey, setStaffRefreshKey] = useState(0);
  const [regenConfirmVisible, setRegenConfirmVisible] = useState(false);
  const [publishSheetVisible, setPublishSheetVisible] = useState(false);
  const [showBracketSuccess, setShowBracketSuccess]   = useState(false);
  const [bracketPublished, setBracketPublished]       = useState(false);
  const insets = useSafeAreaInsets();
  const activeIndex = TABS.indexOf(tab);

  // Al cerrarse la gestión, reseteamos overlays para la próxima apertura.
  useEffect(() => {
    if (!visible) {
      setEditing(false);
      setDetailTeam(null);
      setAddingStaff(false);
      setRegenConfirmVisible(false);
      setPublishSheetVisible(false);
      setShowBracketSuccess(false);
      setBracketPublished(false);
    }
  }, [visible]);

  // Subrayado deslizante: medimos cada tab y animamos un indicador único.
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>([]);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;

  const onTabLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts(prev => {
      if (prev[i]?.x === x && prev[i]?.width === width) return prev;
      const next = [...prev];
      next[i] = { x, width };
      return next;
    });
  };

  useEffect(() => {
    const l = tabLayouts[activeIndex];
    if (!l) return;
    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: l.x,
        useNativeDriver: false,
        speed: 18,
        bounciness: 6,
      }),
      Animated.spring(indicatorW, {
        toValue: l.width,
        useNativeDriver: false,
        speed: 18,
        bounciness: 6,
      }),
    ]).start();
  }, [activeIndex, tabLayouts, indicatorX, indicatorW]);

  // Transición de contenido: fade + slide direccional al cambiar de tab.
  const contentSlide = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const prevIndexRef = useRef(activeIndex);
  useEffect(() => {
    const dir = activeIndex >= prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = activeIndex;
    contentSlide.setValue(dir * 18);
    contentOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tab, activeIndex, contentSlide, contentOpacity]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <SafeAreaProvider>
        <View style={gs.root}>
          {/* Glow rojo arriba-izquierda (Figma 637:3564) */}
          <View style={gs.glow} pointerEvents="none">
            <Svg width="100%" height="100%">
              <Defs>
                <RadialGradient
                  id="evGlow"
                  gradientUnits="userSpaceOnUse"
                  cx="195"
                  cy="20"
                  r="280">
                  <Stop offset="0" stopColor="#c0152a" stopOpacity={0.65} />
                  <Stop offset="0.55" stopColor="#8a0d1c" stopOpacity={0.18} />
                  <Stop offset="1" stopColor="#060608" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#evGlow)" />
            </Svg>
          </View>

          <SafeAreaView style={gs.flex} edges={['top']}>
            {/* Encabezado (Figma 635:3564) */}
            <View style={gs.header}>
              <Pressable onPress={onClose} hitSlop={12}>
                <IconChevronLeft size={22} color="#f6f6f8" strokeWidth={2} />
              </Pressable>
              <Txt style={gs.headerTitle}>Gestión del evento</Txt>
              <Pressable onPress={() => setEditing(true)} hitSlop={12}>
                <IconPencil size={20} color="rgba(246,246,248,0.55)" strokeWidth={1.8} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={[
                gs.scroll,
                tab === 'Brackets' &&
                  !bracketPublished &&
                  event?.status !== 'inscripcion' &&
                  event?.status !== 'proximo' &&
                  { paddingBottom: 200 },
              ]}
              showsVerticalScrollIndicator={false}>
              {/* Banner evento (Figma 635:3570) */}
              <EvBanner event={event} />

              {/* Barra de tabs (Figma 636:3563) */}
              <View style={gs.tabBar}>
                {/* Riel inactivo + indicador deslizante */}
                <View style={gs.tabRail} />
                <Animated.View
                  style={[gs.indicator, { left: indicatorX, width: indicatorW }]}
                />
                {TABS.map((t, i) => {
                  const active = t === tab;
                  return (
                    <Pressable
                      key={t}
                      style={gs.tabItem}
                      onLayout={onTabLayout(i)}
                      onPress={() => setTab(t)}>
                      <Txt style={active ? gs.tabActive : gs.tabIdle}>{t}</Txt>
                    </Pressable>
                  );
                })}
              </View>

              <Animated.View
                style={{
                  opacity: contentOpacity,
                  transform: [{ translateX: contentSlide }],
                }}>
                {tab === 'Resumen' ? (
                  <ResumenTab event={event} />
                ) : tab === 'Equipos' ? (
                  <EventoEquiposTab event={event} onTeamDetail={setDetailTeam} />
                ) : tab === 'Staff' ? (
                  <EventoStaffTab event={event} refreshKey={staffRefreshKey} />
                ) : tab === 'Brackets' ? (
                  <EventoBracketsTab event={event} published={bracketPublished} />
                ) : tab === 'Partidos' ? (
                  <EventoPartidosTab event={event} />
                ) : (
                  <Placeholder tab={tab} />
                )}
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>

      {/* Footer de brackets — visible solo cuando el cuadro está generado y no publicado */}
      {tab === 'Brackets' &&
       !bracketPublished &&
       event?.status !== 'inscripcion' &&
       event?.status !== 'proximo' ? (
        <BracketFooter
          bottomInset={insets.bottom}
          onRegenerate={() => setRegenConfirmVisible(true)}
          onPublish={() => setPublishSheetVisible(true)}
        />
      ) : null}

      {/* Modal de confirmación "Regenerar cuadro" (ámbar) */}
      <ConfirmDialog
        visible={regenConfirmVisible}
        icon={<IconRefresh size={26} color="#f6a623" strokeWidth={1.8} />}
        iconBg="rgba(246,166,35,0.14)"
        iconBorder="rgba(246,166,35,0.4)"
        title="¿Regenerar cuadro?"
        body="Se recalculará el seeding y se reorganizarán los grupos. Esta acción no se puede deshacer."
        confirmLabel="Regenerar"
        confirmGradient={['#F6B833', '#D98C0D']}
        confirmShadowColor="rgba(246,166,35,0.4)"
        confirmTextDark
        onCancel={() => setRegenConfirmVisible(false)}
        onConfirm={() => setRegenConfirmVisible(false)}
      />

      {/* Bottom sheet "Publicar cuadro" */}
      {publishSheetVisible ? (
        <PublicarCuadroSheet
          onPublish={() => {
            setPublishSheetVisible(false);
            setShowBracketSuccess(true);
          }}
          onClose={() => setPublishSheetVisible(false)}
        />
      ) : null}

      {/* Overlay de éxito — transición animada antes de mostrar el cuadro */}
      <BracketSuccessOverlay
        visible={showBracketSuccess}
        onDone={() => {
          setShowBracketSuccess(false);
          setBracketPublished(true);
        }}
      />

      {/* FAB "Agregar staff" — solo visible en el tab Staff */}
      {tab === 'Staff' ? (
        <Fab
          style={{
            position: 'absolute',
            right: 24,
            bottom: Math.max(insets.bottom, 16) + 16,
          }}
          onPress={() => setAddingStaff(true)}
        />
      ) : null}

      {/* Sheet de agregar staff */}
      {addingStaff && event ? (
        <AgregarStaffSheet
          eventId={event.id}
          onAdded={() => {
            setStaffRefreshKey(k => k + 1);
            setAddingStaff(false);
          }}
          onClose={() => setAddingStaff(false)}
        />
      ) : null}

      {/* Detalle de equipo — deslizamiento derecha→izquierda sobre gestión */}
      {detailTeam ? (
        <EventoTeamDetailModal
          team={detailTeam}
          onClose={() => setDetailTeam(null)}
        />
      ) : null}

      {/* Editar evento — anidado, entra de derecha a izquierda encima */}
      <EditarEventoModal
        visible={editing}
        event={event}
        onClose={() => setEditing(false)}
        onDeleted={ev => {
          // Evento eliminado desde editar: cerramos editar y gestión → lista.
          setEditing(false);
          if (onDelete) onDelete(ev);
          onClose();
        }}
      />
    </Modal>
  );
}

/* ─────────────────── Banner ─────────────────── */

function EvBanner({ event }: { event: LeagueEvent | null }) {
  const coverUri = event?.coverUri;
  return (
    <View style={gs.banner}>
      {coverUri ? (
        <>
          {/* Foto de portada del evento */}
          <Image source={{ uri: coverUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          {/* Velo oscuro para legibilidad de badges/título */}
          <Svg
            style={StyleSheet.absoluteFill}
            viewBox="0 0 346 120"
            preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="bannerScrim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#060608" stopOpacity={0.35} />
                <Stop offset="1" stopColor="#060608" stopOpacity={0.78} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="346" height="120" fill="url(#bannerScrim)" />
          </Svg>
        </>
      ) : (
        <Svg
          style={StyleSheet.absoluteFill}
          viewBox="0 0 346 120"
          preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#17080d" />
              <Stop offset="1" stopColor="#8c1724" />
            </LinearGradient>
            {/* Glow circular centro-derecha (Figma 635:3571: 220×170 @ left200/top-50) */}
            <RadialGradient
              id="bannerCircle"
              gradientUnits="userSpaceOnUse"
              cx="300"
              cy="32"
              r="150">
              <Stop offset="0" stopColor="#ff4866" stopOpacity={0.78} />
              <Stop offset="0.45" stopColor="#d11f38" stopOpacity={0.32} />
              <Stop offset="1" stopColor="#8c1724" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="346" height="120" fill="url(#bannerGrad)" />
          <Ellipse cx="300" cy="32" rx="155" ry="128" fill="url(#bannerCircle)" />
        </Svg>
      )}
      {/* Fila superior: badge tipo + status */}
      <View style={gs.bannerTop}>
        <View style={gs.ligaBadge}>
          <Txt style={gs.ligaLabel}>LIGA</Txt>
        </View>
        <View style={gs.statusPill}>
          <Txt style={gs.statusLabel}>EN CURSO</Txt>
        </View>
      </View>
      {/* Fila inferior: título + subtítulo */}
      <View style={gs.bannerBottom}>
        <Txt style={gs.bannerTitle} numberOfLines={1}>
          {event?.title ?? 'Copa ECO5 · Temporada 1'}
        </Txt>
        <Txt style={gs.bannerSub}>Liga · Gears E-Day · 4v4</Txt>
      </View>
    </View>
  );
}

/* ─────────────────── ResumenTab ─────────────────── */

function ResumenTab({ event: _event }: { event: LeagueEvent | null }) {
  return (
    <View style={gs.tabContent}>
      {/* DATOS CLAVE */}
      <GlassCard>
        <SectionHead label="DATOS CLAVE" />
        <View style={gs.statGrid}>
          <StatItem label="Equipos" value="8 / 8" />
          <StatItem label="Staff" value="6 asignados" />
        </View>
        <View style={gs.statGrid}>
          <StatItem label="Formato" value="Grupos + Playoffs" />
          <StatItem label="Región" value="México · ES" />
        </View>
        <View style={gs.statGrid}>
          <StatItem label="Cooldown transfer." value="48 h" />
          <StatItem label="Visibilidad" value="Pública" />
        </View>
      </GlassCard>

      {/* DESCRIPCIÓN */}
      <GlassCard>
        <SectionHead label="DESCRIPCIÓN" />
        <Txt style={gs.paragraph}>
          Liga oficial ECO5 de Gears E-Day 4v4. Fase de grupos seguida de playoffs de
          eliminación directa. Abierta a orgs registradas en la región.
        </Txt>
      </GlassCard>

      {/* FORMATO & ROSTER */}
      <GlassCard>
        <SectionHead label="FORMATO & ROSTER" />
        <View style={gs.statGrid}>
          <StatItem label="Composición" value="4 + 2 supl. + coach" />
          <StatItem label="Jugadores" value="4 por equipo" />
        </View>
        <View style={gs.statGrid}>
          <StatItem label="Equipos" value="mín 8 · máx 16" />
          <StatItem label="Slots" value="L–V 18:00 · S–D AM" />
        </View>
      </GlassCard>

      {/* FECHAS CLAVE */}
      <GlassCard>
        <SectionHead label="FECHAS CLAVE" />
        <View style={gs.statGrid}>
          <StatItem label="Apertura" value="15 ene 2026" />
          <StatItem label="Cierre · roster lock" value="28 ene 2026" />
        </View>
        <View style={gs.statGrid}>
          <StatItem label="Inicio" value="01 feb 2026" />
          <StatItem label="Fin estimado" value="30 mar 2026" />
        </View>
      </GlassCard>

      {/* PREMIO */}
      <GlassCard>
        <SectionHead label="PREMIO" />
        <Txt style={gs.prizeAmount}>$15,000 MXN</Txt>
        <Txt style={gs.prizeNote}>1º lugar + Finals · entrega digital</Txt>
      </GlassCard>

      {/* STREAM & COMUNIDAD */}
      <GlassCard>
        <SectionHead label="STREAM & COMUNIDAD" />
        <View style={gs.statGrid}>
          <StatItem label="Twitch" value="twitch.tv/eco5" />
          <StatItem label="Discord" value="discord.gg/eco5" />
        </View>
      </GlassCard>
    </View>
  );
}

function Placeholder({ tab }: { tab: TabKey }) {
  return (
    <View style={gs.placeholder}>
      <Txt style={gs.placeholderTitle}>{tab}</Txt>
      <Txt style={gs.placeholderSub}>Pestaña en construcción</Txt>
    </View>
  );
}

/* ─────────────────── Helpers ─────────────────── */

function GlassCard({ children }: { children: React.ReactNode }) {
  return <View style={gs.card}>{children}</View>;
}

function SectionHead({ label }: { label: string }) {
  return (
    <View style={gs.sectionHead}>
      <View style={gs.sectionBar} />
      <Txt style={gs.sectionLabel}>{label}</Txt>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={gs.statCol}>
      <Txt style={gs.statLabel}>{label}</Txt>
      <Txt style={gs.statValue} numberOfLines={1}>{value}</Txt>
    </View>
  );
}

/* ─────────────────── Styles ─────────────────── */

const gs = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060608' },
  flex: { flex: 1 },

  // Glow (Figma 637:3564)
  glow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 350,
  },

  // Encabezado
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 6,
    height: 52,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.glassTitle,
    fontSize: 19,
    color: '#f6f6f8',
  },

  // Scroll
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 110,
    gap: 16,
  },

  // Banner (Figma 635:3570) — valores exactos del diseño
  banner: {
    aspectRatio: 346 / 120,
    borderRadius: 18,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    flexDirection: 'column',
    gap: 10,
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Badge LIGA — compacto
  ligaBadge: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  ligaLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 8.5,
    letterSpacing: 0.8,
    color: '#f6f6f8',
  },
  // Badge EN CURSO — compacto, sin punto
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52,215,127,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(52,215,127,0.45)',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 8.5,
    letterSpacing: 0.5,
    color: '#5fe49a',
  },
  bannerBottom: { gap: 3 },
  bannerTitle: {
    fontFamily: fonts.glassTitle,
    fontSize: 22,
    letterSpacing: -0.3,
    color: '#f6f6f8',
  },
  bannerSub: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.65)',
  },

  // Barra de tabs (Figma 636:3563)
  tabBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  tabItem: {
    alignItems: 'center',
    paddingBottom: 11,
  },
  tabActive: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13.5,
    color: '#ff667a',
  },
  tabIdle: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: '#999ead',
  },
  // Riel inactivo bajo todos los tabs
  tabRail: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  // Indicador deslizante del tab activo
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#ff2d46',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  // Contenido de la tab activa
  tabContent: { gap: 14 },

  // Tarjeta glass genérica
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },

  // Encabezado de sección (barra roja 12×2 + label)
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionBar: {
    width: 12,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#ff2d46',
  },
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    letterSpacing: 1.2,
    color: 'rgba(246,246,248,0.6)',
  },

  // Grid de stats 2 columnas
  statGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statCol: { flex: 1 },
  statLabel: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 11,
    color: 'rgba(246,246,248,0.45)',
    marginBottom: 3,
  },
  statValue: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 14,
    color: '#f6f6f8',
  },

  // Descripción
  paragraph: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13.5,
    lineHeight: 19.6,
    color: 'rgba(246,246,248,0.7)',
  },

  // Premio
  prizeAmount: {
    fontFamily: fonts.glassTitle,
    fontSize: 20,
    color: '#f6c878',
  },
  prizeNote: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12.5,
    color: 'rgba(246,246,248,0.55)',
  },

  // Placeholder tabs vacías
  placeholder: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  placeholderTitle: {
    fontFamily: fonts.glassTitle,
    fontSize: 18,
    color: '#f6f6f8',
  },
  placeholderSub: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.4)',
  },
});

/* ─────────────────── Overlay éxito "Cuadro publicado" ─────────────────── */

interface BracketSuccessOverlayProps {
  visible: boolean;
  onDone: () => void;
}

function BracketSuccessOverlay({ visible, onDone }: BracketSuccessOverlayProps) {
  const circleScale  = useRef(new Animated.Value(0.35)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textSlide    = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!visible) return;

    circleScale.setValue(0.35);
    checkOpacity.setValue(0);
    textOpacity.setValue(0);
    textSlide.setValue(20);

    let timer: ReturnType<typeof setTimeout>;

    Animated.sequence([
      Animated.spring(circleScale, {
        toValue: 1,
        damping: 8,
        stiffness: 150,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(textSlide, {
          toValue: 0,
          damping: 18,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      timer = setTimeout(onDone, 900);
    });

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent>
      <View style={ov.root}>
        <Animated.View style={[ov.circle, { transform: [{ scale: circleScale }] }]}>
          <Animated.View style={{ opacity: checkOpacity }}>
            <IconCheck size={40} color="#34d77f" strokeWidth={2.4} />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[ov.textBlock, { opacity: textOpacity, transform: [{ translateY: textSlide }] }]}>
          <Txt style={ov.title}>¡Cuadro publicado!</Txt>
          <Txt style={ov.subtitle}>Los equipos ya fueron notificados.</Txt>
        </Animated.View>
      </View>
    </Modal>
  );
}

const ov = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(6,6,8,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  },
  circle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(52,215,127,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(52,215,127,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34d77f',
    shadowOpacity: 0.55,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  textBlock: { alignItems: 'center', gap: 8 },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 28,
    color: '#f6f6f8',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    color: 'rgba(246,246,248,0.55)',
    textAlign: 'center',
  },
});
