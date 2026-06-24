/**
 * EV-02..05 · Crear evento — wizard de 3 pasos + pantalla de éxito.
 * Se presenta como modal de pantalla completa desde el FAB de Eventos.
 * Identidad → Formato & Roster → Fechas & publicación → Evento creado.
 * Maqueta: campos pre-llenados; navegación entre pasos funcional.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Asset } from 'react-native-image-picker';
import {
  Txt,
  GlowBackground,
  StepIndicator,
  FormField,
  FormInput,
  FormSelect,
  FormDate,
  CoverUpload,
  PdfUpload,
  type PdfFile,
  SegmentedControl,
} from '@/design-system/components';
import { IconChevronLeft, IconCheck, IconEye, IconShare } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';

const STEPS = ['Identidad', 'Formato', 'Fechas'];
const CAPTIONS = [
  'Paso 1 de 3 · Identidad',
  'Paso 2 de 3 · Formato & Roster',
  'Paso 3 de 3 · Fechas & publicación',
];

// Opciones de los selects (del documento de diseño).
const TIPO_OPTS = ['Liga', 'Torneo', 'Copa', 'Relámpago'];
const JUEGO_OPTS = ['Gears E-Day', 'Gears 5 — Versus', 'Otro (próximamente)'];
const MODO_OPTS = ['1v1', '2v2', '4v4', '5v5'];
const FORMATO_OPTS = [
  'Eliminación simple',
  'Eliminación doble',
  'Grupos + Playoffs',
  'Round robin',
  'Suizo',
];
const ROSTER_OPTS = [
  '4 titulares · 2 suplentes · 1 coach',
  '5 titulares · 1 suplente',
  '3 titulares · 1 suplente',
];
const REGION_OPTS = [
  'México · Español',
  'LATAM · Español',
  'Norteamérica · Inglés',
  'Global · Inglés',
];

interface CrearEventoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CrearEventoModal({ visible, onClose }: CrearEventoModalProps) {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [visibility, setVisibility] = useState('publico');
  const [nombre, setNombre] = useState('Copa ECO5 · Temporada 2');
  const [descripcion, setDescripcion] = useState('');
  const [cover, setCover] = useState<Asset | null>(null);
  // Selects
  const [tipo, setTipo] = useState('Liga');
  const [juego, setJuego] = useState('Gears E-Day');
  const [modo, setModo] = useState('4v4');
  const [formato, setFormato] = useState('Grupos + Playoffs');
  const [roster, setRoster] = useState('4 titulares · 2 suplentes · 1 coach');
  const [region, setRegion] = useState('México · Español');
  // Numéricos
  const [minEquipos, setMinEquipos] = useState('8');
  const [maxEquipos, setMaxEquipos] = useState('16');
  const [cooldown, setCooldown] = useState('48');
  // Reglamento
  const [reglMode, setReglMode] = useState('desc');
  const [reglDesc, setReglDesc] = useState('');
  const [reglPdf, setReglPdf] = useState<PdfFile | null>(null);
  // Fechas
  const [apertura, setApertura] = useState('15/01/2026');
  const [cierre, setCierre] = useState('28/01/2026');
  const [inicio, setInicio] = useState('01/02/2026');
  const [fin, setFin] = useState('30/03/2026');

  // Cierra primero (deja que el Modal anime su salida con el contenido actual)
  // y resetea el estado DESPUÉS de ocultarse, para no ver el formulario al salir.
  const close = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setPublished(false);
    }, 300);
  };
  const back = () => (step > 0 ? setStep(s => s - 1) : close());
  const next = () => (step < 2 ? setStep(s => s + 1) : setPublished(true));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={back} statusBarTranslucent>
      <View style={styles.root}>
        {published ? (
          <SuccessView onClose={close} />
        ) : (
          <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.backBtn} hitSlop={8} onPress={back}>
                <IconChevronLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <Txt style={styles.title}>Crear evento</Txt>
            </View>

            <View style={styles.stepsWrap}>
              <StepIndicator steps={STEPS} current={step} caption={CAPTIONS[step]} />
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {step === 0 ? (
                <>
                  <FormField label="PORTADA DEL EVENTO" required>
                    <CoverUpload value={cover} onChange={setCover} />
                  </FormField>
                  <FormField label="NOMBRE DEL EVENTO" required>
                    <FormInput value={nombre} onChangeText={setNombre} />
                  </FormField>
                  <FormField label="TIPO / CATEGORÍA" required>
                    <FormSelect value={tipo} options={TIPO_OPTS} onChange={setTipo} />
                  </FormField>
                  <FormField label="JUEGO" required>
                    <FormSelect value={juego} options={JUEGO_OPTS} onChange={setJuego} />
                  </FormField>
                  <FormField label="MODO" required>
                    <FormSelect value={modo} options={MODO_OPTS} onChange={setModo} />
                  </FormField>
                  <FormField label="DESCRIPCIÓN">
                    <FormInput
                      value={descripcion}
                      onChangeText={setDescripcion}
                      placeholder="De qué trata el evento, fases, a quién va dirigido…"
                      multiline
                    />
                  </FormField>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <FormField label="FORMATO" required>
                    <FormSelect value={formato} options={FORMATO_OPTS} onChange={setFormato} />
                  </FormField>
                  <FormField label="COMPOSICIÓN DE ROSTER" required>
                    <FormSelect value={roster} options={ROSTER_OPTS} onChange={setRoster} />
                  </FormField>
                  <View style={styles.rowFields}>
                    <FormField label="MÍN. EQUIPOS" required style={styles.flex}>
                      <FormInput value={minEquipos} onChangeText={setMinEquipos} numeric maxLength={3} />
                    </FormField>
                    <FormField label="MÁX. EQUIPOS" required style={styles.flex}>
                      <FormInput value={maxEquipos} onChangeText={setMaxEquipos} numeric maxLength={3} />
                    </FormField>
                  </View>
                  <FormField label="SLOTS / HORARIOS DE PARTIDAS" required>
                    <FormInput value="L–V 18:00+ · S–D mañana / todo el día" />
                  </FormField>
                  <FormField label="COOLDOWN DE TRANSFERENCIAS (H)" required>
                    <FormInput value={cooldown} onChangeText={setCooldown} numeric maxLength={3} />
                  </FormField>
                  <FormField label="RESTRICCIONES" required>
                    <FormInput value="Edad 16+ · región MX · rank mínimo" />
                  </FormField>
                  <FormField label="REGIÓN / IDIOMA">
                    <FormSelect value={region} options={REGION_OPTS} onChange={setRegion} />
                  </FormField>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <FormField label="APERTURA DE INSCRIPCIONES" required>
                    <FormDate value={apertura} onChange={setApertura} label="APERTURA DE INSCRIPCIONES" />
                  </FormField>
                  <FormField label="CIERRE DE INSCRIPCIONES · ROSTER LOCK" required>
                    <FormDate value={cierre} onChange={setCierre} label="CIERRE · ROSTER LOCK" />
                  </FormField>
                  <View style={styles.rowFields}>
                    <FormField label="INICIO" required style={styles.flex}>
                      <FormDate value={inicio} onChange={setInicio} label="INICIO" />
                    </FormField>
                    <FormField label="FIN" required style={styles.flex}>
                      <FormDate value={fin} onChange={setFin} label="FIN" />
                    </FormField>
                  </View>
                  <FormField label="REGLAMENTO" required>
                    <SegmentedControl
                      segments={[
                        { key: 'desc', label: 'Descripción' },
                        { key: 'pdf', label: 'Subir PDF' },
                      ]}
                      value={reglMode}
                      onChange={setReglMode}
                    />
                    {reglMode === 'desc' ? (
                      <FormInput
                        value={reglDesc}
                        onChangeText={setReglDesc}
                        placeholder="Resumen de reglas, formato de partidas y sanciones…"
                        multiline
                        style={styles.reglArea}
                      />
                    ) : (
                      <PdfUpload value={reglPdf} onChange={setReglPdf} />
                    )}
                  </FormField>
                  <FormField label="PREMIO (SOLO DISPLAY)">
                    <FormInput value="$15,000 MXN + pase a Finals" />
                  </FormField>
                  <FormField label="CANAL OFICIAL DE STREAM / DISCORD" required>
                    <FormInput value="twitch.tv/eco5esports" />
                  </FormField>
                  <FormField label="VISIBILIDAD" required>
                    <SegmentedControl
                      segments={[
                        { key: 'publico', label: 'Público' },
                        { key: 'privado', label: 'Privado' },
                        { key: 'invitacion', label: 'Invitación' },
                      ]}
                      value={visibility}
                      onChange={setVisibility}
                    />
                  </FormField>
                  <Txt style={styles.draftNote}>
                    O guardar como borrador para publicar después
                  </Txt>
                </>
              ) : null}
            </ScrollView>

            {/* Footer */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
              <Pressable style={styles.secondaryBtn} onPress={back}>
                <Txt style={styles.secondaryLabel}>{step === 0 ? 'Cancelar' : 'Atrás'}</Txt>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={next}>
                <Txt style={styles.primaryLabel}>{step < 2 ? 'SIGUIENTE' : 'PUBLICAR'}</Txt>
              </Pressable>
            </SafeAreaView>
          </SafeAreaView>
        )}
      </View>
    </Modal>
  );
}

/** Pantalla de éxito tras publicar — con animación de entrada. */
function SuccessView({ onClose }: { onClose: () => void }) {
  // 0→1: check (spring/pop), ring (expande y se desvanece), content (fade+slide).
  const check = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const content = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!mounted) return;
      if (reduce) {
        // Accesibilidad: sin movimiento, todo en su estado final.
        check.setValue(1);
        ring.setValue(1);
        content.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.spring(check, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 1, duration: 700, delay: 140, useNativeDriver: true }),
        Animated.timing(content, { toValue: 1, duration: 420, delay: 240, useNativeDriver: true }),
      ]).start();
    });
    return () => {
      mounted = false;
    };
  }, [check, ring, content]);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  const contentTranslate = content.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <View style={styles.successRoot}>
      <GlowBackground size={360} centerY={0.28} color={theme.colors.accentGreen} />
      <SafeAreaView style={styles.successSafe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.successContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.checkWrap}>
            <Animated.View
              style={[styles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
            />
            <Animated.View
              style={[styles.successCheck, { opacity: check, transform: [{ scale: check }] }]}>
              <IconCheck size={36} color={theme.colors.accentGreen} strokeWidth={3} />
            </Animated.View>
          </View>

          <Animated.View
            style={[styles.successBody, { opacity: content, transform: [{ translateY: contentTranslate }] }]}>
            <Txt style={styles.successTitle}>¡Evento creado!</Txt>
            <Txt style={styles.successSubtitle}>Copa ECO5 · Temporada 2</Txt>
            <View style={styles.publishedBadge}>
              <View style={styles.publishedDot} />
              <Txt style={styles.publishedText}>PUBLICADO</Txt>
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <SummaryItem label="TIPO" value="Liga" />
                <SummaryItem label="FORMATO" value="Grupos + Playoffs" />
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <SummaryItem label="EQUIPOS" value="0 / 16 · abiertas" />
                <SummaryItem label="INICIO" value="01 feb 2026" />
              </View>
            </View>

            <Pressable style={styles.verBtn}>
              <IconEye size={18} color={theme.colors.white} strokeWidth={2} />
              <Txt style={styles.verLabel}>VER EVENTO</Txt>
            </Pressable>
            <Pressable style={styles.shareBtn}>
              <IconShare size={18} color={theme.colors.textPrimary} strokeWidth={2} />
              <Txt style={styles.shareLabel}>Compartir enlace</Txt>
            </Pressable>
            <Pressable hitSlop={8} onPress={onClose}>
              <Txt style={styles.backLink}>Volver a eventos</Txt>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.flex}>
      <Txt style={styles.summaryLabel}>{label}</Txt>
      <Txt style={styles.summaryValue}>{value}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.headingBold, fontSize: 20, letterSpacing: 0.2, color: theme.colors.textPrimary },

  stepsWrap: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md },

  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm, paddingBottom: 24, gap: theme.spacing.lg },
  rowFields: { flexDirection: 'row', gap: theme.spacing.md },
  flex: { flex: 1 },

  draftNote: { fontFamily: fonts.body, fontSize: 11, color: theme.colors.textTertiary },

  // Reglamento
  reglArea: { height: 80 },

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
    width: 110,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { fontFamily: fonts.headingBold, fontSize: 13, letterSpacing: 0.26, color: theme.colors.white },

  // Success
  successRoot: { flex: 1, backgroundColor: theme.colors.bgOuter },
  successSafe: { flex: 1 },
  successContent: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: 96,
    paddingBottom: theme.spacing['2xl'],
    alignItems: 'center',
    gap: 14,
  },
  successBody: { width: '100%', alignItems: 'center', gap: 14 },
  checkWrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: theme.colors.accentGreen,
  },
  successCheck: {
    width: 76,
    height: 76,
    borderRadius: 99,
    backgroundColor: theme.colors.accentGreen + '29',
    borderWidth: 2,
    borderColor: theme.colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontFamily: fonts.headingBold, fontSize: 28, letterSpacing: 0.28, color: theme.colors.textPrimary },
  successSubtitle: { fontFamily: fonts.bodyMedium, fontSize: 14, color: theme.colors.textSecondary },
  publishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: theme.colors.accentGreen + '29',
  },
  publishedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.accentGreen },
  publishedText: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.4, color: theme.colors.accentGreen },

  summary: {
    width: '100%',
    marginTop: 6,
    padding: theme.spacing.lg,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: 14,
  },
  summaryRow: { flexDirection: 'row', gap: theme.spacing.md },
  summaryDivider: { height: 1, backgroundColor: theme.colors.borderSubtle },
  summaryLabel: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.6, color: theme.colors.textTertiary, marginBottom: 4 },
  summaryValue: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textPrimary },

  verBtn: {
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  verLabel: { fontFamily: fonts.headingBold, fontSize: 14, letterSpacing: 0.28, color: theme.colors.white },
  shareBtn: {
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLabel: { fontFamily: fonts.label, fontSize: 14, color: theme.colors.textPrimary },
  backLink: { fontFamily: fonts.meta, fontSize: 13, letterSpacing: 0.52, color: theme.colors.textSecondary, marginTop: 6 },
});
