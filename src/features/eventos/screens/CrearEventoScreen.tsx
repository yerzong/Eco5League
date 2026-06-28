/**
 * EV-02..05 · Crear evento — wizard 3 pasos + éxito, rediseño glass.
 * Figma: nodo 618-4395 (sección), pantallas 621:4395, 622:4441, 623:4492, 624:4551.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { Asset } from 'react-native-image-picker';
import { Txt, GlowBackground, PdfUpload, type PdfFile } from '@/design-system/components';
import { IconChevronLeft, IconCheck, IconChevronDown, IconUpload } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';

const STEP_LABELS = ['Identidad', 'Formato & Roster', 'Fechas & Publicación'];

// ─── Componentes glass del formulario ────────────────────────────────────────

function GlassSelect({
  label,
  value,
  onPress,
  flex,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  flex?: boolean;
}) {
  return (
    <View style={[s.field, flex && s.flex]}>
      <Txt style={s.fieldLabel}>{label}</Txt>
      <Pressable style={s.selectBox} onPress={onPress} hitSlop={4}>
        <Txt style={s.fieldValue} numberOfLines={1}>{value}</Txt>
        <IconChevronDown size={18} color="rgba(246,246,248,0.6)" strokeWidth={2} />
      </Pressable>
    </View>
  );
}

function GlassInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline,
  flex,
}: {
  label?: string;
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  flex?: boolean;
}) {
  return (
    <View style={[s.field, flex && s.flex]}>
      {label ? <Txt style={s.fieldLabel}>{label}</Txt> : null}
      <View style={[s.inputBox, multiline && s.inputBoxMulti]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(246,246,248,0.42)"
          keyboardType={keyboardType}
          multiline={multiline}
          style={[s.textInput, multiline && s.textInputMulti]}
        />
      </View>
    </View>
  );
}

function GlassSegmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (k: string) => void;
}) {
  return (
    <View style={s.seg}>
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            style={[s.segTab, active && s.segTabActive]}
            onPress={() => onChange(o.key)}>
            <Txt style={active ? s.segLabelActive : s.segLabelIdle}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

function GlassUploader({ onPress }: { onPress: () => void }) {
  return (
    <View style={s.field}>
      <Txt style={s.fieldLabel}>PORTADA DEL EVENTO</Txt>
      <Pressable style={s.uploadBox} onPress={onPress}>
        <IconUpload size={26} color="rgba(246,246,248,0.85)" strokeWidth={1.8} />
        <Txt style={s.uploadTitle}>Subir imagen</Txt>
        <Txt style={s.uploadHint}>PNG · JPG · 1200×400 · máx 2 MB</Txt>
      </Pressable>
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
      onPress={onPress}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="evtBtnGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ff3b52" />
            <Stop offset="1" stopColor="#e11d36" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={16} fill="url(#evtBtnGrad)" />
      </Svg>
      <Txt style={s.primaryLabel}>{label}</Txt>
    </Pressable>
  );
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export function CrearEventoModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);

  // Paso 1 — Identidad
  const [cover, setCover] = useState<Asset | null>(null);
  const [nombre, setNombre] = useState('Copa ECO5 · Temporada 2');
  const [tipo, setTipo] = useState('Liga');
  const [juego, setJuego] = useState('Gears E-Day');
  const [modo, setModo] = useState('4v4');
  const [descripcion, setDescripcion] = useState('');

  // Paso 2 — Formato & Roster
  const [formato, setFormato] = useState('Grupos + Playoffs (elim. directa)');
  const [roster, setRoster] = useState('4 titulares · 2 suplentes · 1 coach');
  const [minEquipos, setMinEquipos] = useState('8');
  const [maxEquipos, setMaxEquipos] = useState('16');
  const [slots, setSlots] = useState('L–V 18:00 · S–D 10:00 AM');
  const [cooldown, setCooldown] = useState('48 h');
  const [restricciones, setRestricciones] = useState('Edad 16+ · región MX');
  const [idioma, setIdioma] = useState('Español');

  // Paso 3 — Fechas & Publicación
  const [apertura, setApertura] = useState('15 ene 2026');
  const [cierre, setCierre] = useState('28 ene 2026');
  const [inicio, setInicio] = useState('01 feb 2026');
  const [fin, setFin] = useState('30 mar 2026');
  const [reglMode, setReglMode] = useState('desc');
  const [reglDesc, setReglDesc] = useState('');
  const [reglPdf, setReglPdf] = useState<PdfFile | null>(null);
  const [premio, setPremio] = useState('$15,000 MXN · 1º lugar + Finals');
  const [stream, setStream] = useState('twitch.tv/eco5 · discord.gg/eco5');
  const [visibility, setVisibility] = useState('publica');

  const close = () => {
    onClose();
    setTimeout(() => { setStep(0); setPublished(false); }, 320);
  };
  const back = () => (step > 0 ? setStep(p => p - 1) : close());
  const next = () => (step < 2 ? setStep(p => p + 1) : setPublished(true));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={back} statusBarTranslucent>
      <SafeAreaProvider>
        {published ? (
          <SuccessView
            nombre={nombre}
            tipo={tipo}
            formato={formato}
            maxEquipos={maxEquipos}
            inicio={inicio}
            fin={fin}
            visibility={visibility}
            onClose={close}
          />
        ) : (
          <View style={s.root}>
            <GlowBackground size={470} centerY={-0.05} />
            <SafeAreaView style={s.flex} edges={['top']}>
              <ScrollView
                contentContainerStyle={s.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

                {/* Form Header */}
                <Pressable style={s.formHeader} onPress={back} hitSlop={8}>
                  <IconChevronLeft size={22} color="#f6f6f8" strokeWidth={2} />
                  <Txt style={s.formTitle}>Crear evento</Txt>
                </Pressable>

                {/* Stepper */}
                <GlassStepper step={step} />

                {/* ── Paso 1: Identidad ── */}
                {step === 0 && (
                  <>
                    <GlassUploader onPress={() => {}} />
                    <GlassInput
                      label="NOMBRE DEL EVENTO"
                      value={nombre}
                      onChangeText={setNombre}
                    />
                    <GlassSelect label="TIPO / CATEGORÍA" value={tipo} />
                    <View style={s.row}>
                      <GlassSelect label="JUEGO" value={juego} flex />
                      <GlassSelect label="MODO" value={modo} flex />
                    </View>
                    <GlassInput
                      label="DESCRIPCIÓN"
                      value={descripcion}
                      onChangeText={setDescripcion}
                      placeholder="Resumen del evento, formato y reglas…"
                      multiline
                    />
                  </>
                )}

                {/* ── Paso 2: Formato & Roster ── */}
                {step === 1 && (
                  <>
                    <GlassSelect label="FORMATO" value={formato} />
                    <GlassSelect label="COMPOSICIÓN DE ROSTER" value={roster} />
                    <View style={s.row}>
                      <GlassInput
                        label="MÍN. EQUIPOS"
                        value={minEquipos}
                        onChangeText={setMinEquipos}
                        keyboardType="numeric"
                        flex
                      />
                      <GlassInput
                        label="MÁX. EQUIPOS"
                        value={maxEquipos}
                        onChangeText={setMaxEquipos}
                        keyboardType="numeric"
                        flex
                      />
                    </View>
                    <GlassSelect label="SLOTS / HORARIOS" value={slots} />
                    <GlassInput
                      label="COOLDOWN DE TRANSFERENCIAS"
                      value={cooldown}
                      onChangeText={setCooldown}
                    />
                    <GlassInput
                      label="RESTRICCIONES"
                      value={restricciones}
                      onChangeText={setRestricciones}
                    />
                    <GlassSelect label="IDIOMA" value={idioma} />
                  </>
                )}

                {/* ── Paso 3: Fechas & Publicación ── */}
                {step === 2 && (
                  <>
                    <GlassSelect label="APERTURA DE INSCRIPCIONES" value={apertura} />
                    <GlassSelect label="CIERRE · ROSTER LOCK" value={cierre} />
                    <View style={s.row}>
                      <GlassSelect label="INICIO" value={inicio} flex />
                      <GlassSelect label="FIN" value={fin} flex />
                    </View>
                    <View style={s.section}>
                      <Txt style={s.fieldLabel}>REGLAMENTO</Txt>
                      <GlassSegmented
                        options={[
                          { key: 'desc', label: 'Descripción' },
                          { key: 'pdf', label: 'Subir PDF' },
                        ]}
                        value={reglMode}
                        onChange={setReglMode}
                      />
                      {reglMode === 'desc' ? (
                        <GlassInput
                          value={reglDesc}
                          onChangeText={setReglDesc}
                          placeholder="Reglas, formato de partidas y sanciones…"
                          multiline
                        />
                      ) : (
                        <PdfUpload value={reglPdf} onChange={setReglPdf} />
                      )}
                    </View>
                    <GlassInput label="PREMIO" value={premio} onChangeText={setPremio} />
                    <GlassInput label="STREAM / DISCORD" value={stream} onChangeText={setStream} />
                    <View style={s.section}>
                      <Txt style={s.fieldLabel}>VISIBILIDAD</Txt>
                      <GlassSegmented
                        options={[
                          { key: 'publica', label: 'Pública' },
                          { key: 'privada', label: 'Privada' },
                          { key: 'invitacion', label: 'Invitación' },
                        ]}
                        value={visibility}
                        onChange={setVisibility}
                      />
                    </View>
                  </>
                )}
              </ScrollView>
            </SafeAreaView>

            {/* Footer fijo */}
            <SafeAreaView edges={['bottom']} style={s.footerSafe}>
              <View style={s.footer}>
                <Pressable style={s.secondaryBtn} onPress={back}>
                  <Txt style={s.secondaryLabel}>{step === 0 ? 'Cancelar' : 'Atrás'}</Txt>
                </Pressable>
                <PrimaryButton label={step < 2 ? 'Siguiente' : 'Publicar'} onPress={next} />
              </View>
            </SafeAreaView>
          </View>
        )}
      </SafeAreaProvider>
    </Modal>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function GlassStepper({ step }: { step: number }) {
  return (
    <View style={s.stepper}>
      <View style={s.stepSegs}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[s.stepSeg, i <= step && s.stepSegActive]} />
        ))}
      </View>
      <View style={s.stepLabelRow}>
        <Txt style={s.stepCounter}>PASO {step + 1} DE 3</Txt>
        <Txt style={s.stepName}>{STEP_LABELS[step]}</Txt>
      </View>
    </View>
  );
}

// ─── Pantalla de éxito ────────────────────────────────────────────────────────

function SuccessView({
  nombre,
  tipo,
  formato,
  maxEquipos,
  inicio,
  fin,
  visibility,
  onClose,
}: {
  nombre: string;
  tipo: string;
  formato: string;
  maxEquipos: string;
  inicio: string;
  fin: string;
  visibility: string;
  onClose: () => void;
}) {
  const checkAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!mounted) return;
      if (reduce) {
        checkAnim.setValue(1); ringAnim.setValue(1); contentAnim.setValue(1); return;
      }
      Animated.parallel([
        Animated.spring(checkAnim, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 1, duration: 700, delay: 140, useNativeDriver: true }),
        Animated.timing(contentAnim, { toValue: 1, duration: 420, delay: 240, useNativeDriver: true }),
      ]).start();
    });
    return () => { mounted = false; };
  }, [checkAnim, ringAnim, contentAnim]);

  const ringScale = ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] });
  const ringOpacity = ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const contentTranslate = contentAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  const visLabel =
    visibility === 'publica' ? 'Pública' : visibility === 'privada' ? 'Privada' : 'Invitación';

  return (
    <View style={s.root}>
      <GlowBackground size={460} centerY={-0.05} />
      <SafeAreaView style={s.flex} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={s.successContent}
          showsVerticalScrollIndicator={false}>
          {/* Check animado */}
          <View style={s.checkWrap}>
            <Animated.View
              style={[s.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
            />
            <Animated.View
              style={[s.check, { opacity: checkAnim, transform: [{ scale: checkAnim }] }]}>
              <IconCheck size={34} color="#34d77f" strokeWidth={2.5} />
            </Animated.View>
          </View>

          <Animated.View
            style={[s.successBody, { opacity: contentAnim, transform: [{ translateY: contentTranslate }] }]}>
            <Txt style={s.successTitle}>¡Evento creado!</Txt>
            <Txt style={s.successDesc}>
              {nombre} ya está publicada y visible para los equipos.
            </Txt>

            <View style={s.summaryCard}>
              <SummaryRow label="Tipo" value={`${tipo} · 4v4`} />
              <SummaryRow label="Formato" value={formato} />
              <SummaryRow label="Equipos" value={`${maxEquipos} máx · roster 4/4`} />
              <SummaryRow label="Fechas" value={`${inicio} – ${fin}`} />
              <SummaryRow label="Visibilidad" value={visLabel} />
            </View>

            <View style={s.successActions}>
              <PrimaryButton label="Ver evento" onPress={() => {}} />
              <Pressable style={s.secondaryBtn} onPress={() => {}}>
                <Txt style={s.secondaryLabel}>Compartir enlace</Txt>
              </Pressable>
              <Pressable hitSlop={12} onPress={onClose}>
                <Txt style={s.createAnotherLink}>Crear otro evento</Txt>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.summaryRow}>
      <Txt style={s.summaryLabel}>{label}</Txt>
      <Txt style={s.summaryValue} numberOfLines={1}>{value}</Txt>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const FIELD_BOX_BG = 'rgba(255,255,255,0.05)';
const FIELD_BOX_BORDER = 'rgba(255,255,255,0.10)';

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  flex: { flex: 1 },

  // Scroll
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 18,
  },

  // Form Header
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 40 },
  formTitle: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  // Stepper
  stepper: { gap: 10 },
  stepSegs: { flexDirection: 'row', gap: 6 },
  stepSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  stepSegActive: { backgroundColor: '#ff2d46' },
  stepLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepCounter: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.5)',
  },
  stepName: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#ff808f' },

  // Campos genéricos
  field: { gap: 8 },
  fieldLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11.5,
    letterSpacing: 1,
    color: 'rgba(246,246,248,0.5)',
  },
  fieldValue: { fontFamily: fonts.glassBodyMedium, fontSize: 15, color: '#f6f6f8', flex: 1 },

  // Select box (chevron a la derecha)
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: FIELD_BOX_BG,
    borderWidth: 1,
    borderColor: FIELD_BOX_BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 17,
  },

  // Input box
  inputBox: {
    backgroundColor: FIELD_BOX_BG,
    borderWidth: 1,
    borderColor: FIELD_BOX_BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 17,
  },
  inputBoxMulti: {
    height: 96,
    paddingVertical: 13,
    alignItems: 'flex-start',
  },
  textInput: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 15,
    color: '#f6f6f8',
    padding: 0,
    margin: 0,
    flex: 1,
  },
  textInputMulti: {
    textAlignVertical: 'top',
    height: 70,
    width: '100%',
  },

  // Uploader
  uploadBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    borderStyle: 'dashed',
    borderRadius: 14,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  uploadTitle: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 14,
    color: 'rgba(246,246,248,0.85)',
  },
  uploadHint: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 11,
    color: 'rgba(246,246,248,0.4)',
  },

  // Fila de campos (lado a lado)
  row: { flexDirection: 'row', gap: 12 },

  // Sección con label propio
  section: { gap: 8 },

  // Segmented
  seg: {
    flexDirection: 'row',
    gap: 5,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    height: 52,
  },
  segTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  segTabActive: { backgroundColor: '#ef2b3e' },
  segLabelActive: { fontFamily: fonts.glassBodyBold, fontSize: 13.5, color: '#f6f6f8' },
  segLabelIdle: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13.5,
    color: 'rgba(246,246,248,0.55)',
  },

  // Footer
  footerSafe: {
    backgroundColor: 'rgba(9,9,11,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 28,
  },
  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pressed: { opacity: 0.88 },
  primaryLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // Success
  successContent: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 18,
  },
  checkWrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: '#34d77f',
  },
  check: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(52,215,127,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(52,215,127,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34d77f',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  successBody: { width: '100%', alignItems: 'center', gap: 8 },
  successTitle: {
    fontFamily: fonts.glassTitle,
    fontSize: 26,
    letterSpacing: -0.3,
    color: '#f6f6f8',
    marginTop: 10,
  },
  successDesc: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    color: 'rgba(246,246,248,0.55)',
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18,
    padding: 18,
    gap: 12,
    marginTop: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.5)',
  },
  summaryValue: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13,
    color: '#f6f6f8',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  successActions: { width: '100%', gap: 10, paddingTop: 8 },
  createAnotherLink: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 15,
    color: '#ff5f73',
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingVertical: 15,
  },
});
