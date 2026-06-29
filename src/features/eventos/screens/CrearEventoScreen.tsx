/**
 * EV-02..05 · Crear evento — wizard 3 pasos + éxito, rediseño glass.
 * Figma: sección 618-4395, pantallas 621:4395 / 622:4441 / 623:4492 / 624:4551,
 *        uploader cargado 629:4322.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import { Txt, GlowBackground, PdfUpload, type PdfFile } from '@/design-system/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconChevronLeft, IconCheck, IconChevronDown, IconX, IconCalendar } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import {
  TIPO_OPTS,
  JUEGO_OPTS,
  MODO_OPTS,
  FORMATO_OPTS,
  ROSTER_OPTS,
  REGION_OPTS,
} from '../eventFormOptions';

const STEP_LABELS = ['Identidad', 'Formato & Roster', 'Fechas & Publicación'];

const SLOTS_OPTS = ['L–V 18:00 · S–D 10:00 AM', 'L–V 20:00 · S–D mañana', 'S–D todo el día'];
const IDIOMA_OPTS = ['Español', 'Inglés', 'Español / Inglés'];

/** Máscara DD/MM/YYYY para el campo de fecha. */
function maskDate(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  let r = d.slice(0, 2);
  if (d.length > 2) r += '/' + d.slice(2, 4);
  if (d.length > 4) r += '/' + d.slice(4);
  return r;
}

function dateToStr(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ─── GlassSelect ─────────────────────────────────────────────────────────────

interface GlassSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  flex?: boolean;
}

function GlassSelect({ label, value, options, onChange, flex }: GlassSelectProps) {
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  };

  return (
    <View style={[gs.field, flex && gs.flex]}>
      <Txt style={gs.fieldLabel}>{label}</Txt>
      <Pressable ref={triggerRef} style={gs.selectBox} onPress={openMenu} hitSlop={4}>
        <Txt style={gs.fieldValue} numberOfLines={1}>{value}</Txt>
        <View style={open ? gs.chevUp : undefined}>
          <IconChevronDown size={18} color="rgba(246,246,248,0.55)" strokeWidth={2} />
        </View>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
        <View style={[gs.menu, { top: anchor.y + anchor.h + 6, left: anchor.x, width: anchor.w }]}>
          {options.map(opt => {
            const selected = opt === value;
            return (
              <Pressable
                key={opt}
                style={[gs.menuOpt, selected && gs.menuOptSel]}
                onPress={() => { onChange(opt); setOpen(false); }}>
                <Txt style={[gs.menuOptText, ...(selected ? [gs.menuOptTextSel] : [])]} numberOfLines={1}>
                  {opt}
                </Txt>
                {selected ? <Txt style={gs.menuCheck}>✓</Txt> : null}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}

// ─── GlassInput ──────────────────────────────────────────────────────────────

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
    <View style={[gs.field, flex && gs.flex]}>
      {label ? <Txt style={gs.fieldLabel}>{label}</Txt> : null}
      <View style={[gs.inputBox, multiline && gs.inputBoxMulti]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(246,246,248,0.42)"
          keyboardType={keyboardType}
          multiline={multiline}
          style={[gs.textInput, multiline && gs.textInputMulti]}
        />
      </View>
    </View>
  );
}

// ─── GlassSegmented (con píldora deslizante animada) ─────────────────────────

const SEG_P = 5;
const SEG_G = 5;

function GlassSegmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (k: string) => void;
}) {
  const [segWidth, setSegWidth] = useState(0);
  const n = options.length;
  const initialIdx = Math.max(0, options.findIndex(o => o.key === value));
  const slideAnim = useRef(new Animated.Value(initialIdx)).current;

  const pillW = segWidth > 0 ? (segWidth - SEG_P * 2 - SEG_G * (n - 1)) / n : 0;
  const pillX = slideAnim.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => i * (pillW + SEG_G)),
  });

  const handleChange = (key: string) => {
    const idx = options.findIndex(o => o.key === key);
    onChange(key);
    Animated.spring(slideAnim, {
      toValue: idx,
      useNativeDriver: true,
      damping: 20,
      stiffness: 280,
      mass: 0.8,
    }).start();
  };

  return (
    <View style={gs.seg} onLayout={e => setSegWidth(e.nativeEvent.layout.width)}>
      {pillW > 0 && (
        <Animated.View
          style={[gs.segPill, { width: pillW, transform: [{ translateX: pillX }] }]}
        />
      )}
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable key={o.key} style={gs.segTab} onPress={() => handleChange(o.key)}>
            <Txt style={active ? gs.segLabelActive : gs.segLabelIdle}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── GlassDateInput ──────────────────────────────────────────────────────────

function GlassDateInput({
  label,
  value,
  onChange,
  flex,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  flex?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(new Date(2026, 0, 15));
  const translateY = useRef(new Animated.Value(600)).current;
  const scrimAnim  = useRef(new Animated.Value(0)).current;

  const openSheet = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }),
      Animated.timing(scrimAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const closeSheet = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 600, duration: 220, useNativeDriver: true }),
      Animated.timing(scrimAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => { setOpen(false); cb?.(); });
  };

  const confirm = () => closeSheet(() => onChange(dateToStr(temp)));

  return (
    <View style={[gs.field, flex && gs.flex]}>
      <Txt style={gs.fieldLabel}>{label}</Txt>
      <View style={gs.dateBox}>
        <TextInput
          value={value}
          onChangeText={t => onChange(maskDate(t))}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="rgba(246,246,248,0.35)"
          keyboardType="number-pad"
          maxLength={10}
          style={gs.dateInput}
        />
        <Pressable onPress={openSheet} hitSlop={12}>
          <IconCalendar size={18} color="rgba(246,246,248,0.55)" strokeWidth={2} />
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closeSheet()}>
        {/* Scrim fade — ocupa toda la pantalla detrás del sheet */}
        <Animated.View
          style={[StyleSheet.absoluteFill, gs.dateScrim, { opacity: scrimAnim }]}
          pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()} />
        </Animated.View>

        {/* Sheet slide — solo sube el panel */}
        <View style={gs.dateAnchor} pointerEvents="box-none">
          <Animated.View style={[gs.dateSheet, { transform: [{ translateY }] }]}>
            <View style={gs.dateSheetHeader}>
              <Pressable onPress={() => closeSheet()} hitSlop={8}>
                <Txt style={gs.dateSheetCancel}>Cancelar</Txt>
              </Pressable>
              <Txt style={gs.dateSheetTitle}>{label}</Txt>
              <Pressable onPress={confirm} hitSlop={8}>
                <Txt style={gs.dateSheetOk}>Listo</Txt>
              </Pressable>
            </View>
            <DateTimePicker
              value={temp}
              mode="date"
              display="inline"
              themeVariant="dark"
              accentColor="#ff2d46"
              onChange={(_, d) => d && setTemp(d)}
              style={gs.datePicker}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

// ─── GlassUploader ───────────────────────────────────────────────────────────

function GlassUploader({
  value,
  onChange,
}: {
  value: Asset | null;
  onChange: (a: Asset | null) => void;
}) {
  const pick = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (res.didCancel || !res.assets?.[0]) return;
    onChange(res.assets[0]);
  };

  const meta = value
    ? `${value.fileName ?? 'portada.jpg'}${value.width ? ` · ${value.width}×${value.height}` : ''}${value.fileSize ? ` · ${(value.fileSize / 1048576).toFixed(1)} MB` : ''}`
    : '';

  return (
    <View style={gs.field}>
      <Txt style={gs.fieldLabel}>PORTADA DEL EVENTO</Txt>

      {value?.uri ? (
        /* Estado cargado — Figma 629:4322 */
        <View style={gs.uploaderWrap}>
          <View style={gs.preview}>
            <Image source={{ uri: value.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            {/* Botones de acción superpuestos */}
            <View style={gs.previewActions}>
              <Pressable style={gs.changeBtn} onPress={pick}>
                <Txt style={gs.changeBtnLabel}>Cambiar</Txt>
              </Pressable>
              <Pressable style={gs.removeBtn} onPress={() => onChange(null)}>
                <IconX size={14} color="#f6f6f8" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>
          <View style={gs.metaRow}>
            <Txt style={gs.metaText} numberOfLines={1}>{meta}</Txt>
            <View style={gs.uploadedBadge}>
              <Txt style={gs.uploadedText}>✓ Subida</Txt>
            </View>
          </View>
        </View>
      ) : (
        /* Estado vacío */
        <Pressable style={gs.uploadBox} onPress={pick}>
          <View style={gs.uploadIcon}>
            {/* Flecha de subida con SVG */}
            <Txt style={gs.uploadArrow}>↑</Txt>
          </View>
          <Txt style={gs.uploadTitle}>Subir imagen</Txt>
          <Txt style={gs.uploadHint}>PNG · JPG · 1200×400 · máx 2 MB</Txt>
        </Pressable>
      )}
    </View>
  );
}

// ─── PrimaryButton ───────────────────────────────────────────────────────────

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [gs.primaryBtn, pressed && gs.pressed]}
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
      <Txt style={gs.primaryLabel}>{label}</Txt>
    </Pressable>
  );
}

// ─── GlassStepper ────────────────────────────────────────────────────────────

function GlassStepper({ step }: { step: number }) {
  return (
    <View style={gs.stepper}>
      <View style={gs.stepSegs}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[gs.stepSeg, i <= step && gs.stepSegActive]} />
        ))}
      </View>
      <View style={gs.stepLabelRow}>
        <Txt style={gs.stepCounter}>PASO {step + 1} DE 3</Txt>
        <Txt style={gs.stepName}>{STEP_LABELS[step]}</Txt>
      </View>
    </View>
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
  const [formato, setFormato] = useState('Grupos + Playoffs (elim. doble)');
  const [roster, setRoster] = useState('4 titulares · 2 suplentes · 1 coach');
  const [minEquipos, setMinEquipos] = useState('8');
  const [maxEquipos, setMaxEquipos] = useState('16');
  const [slots, setSlots] = useState('L–V 18:00 · S–D 10:00 AM');
  const [cooldown, setCooldown] = useState('48 h');
  const [restricciones, setRestricciones] = useState('Edad 16+ · región MX');
  const [idioma, setIdioma] = useState('Español');

  // Paso 3 — Fechas & Publicación
  const [apertura, setApertura] = useState('15/01/2026');
  const [cierre, setCierre] = useState('28/01/2026');
  const [inicio, setInicio] = useState('01/02/2026');
  const [fin, setFin] = useState('30/03/2026');
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
          <View style={gs.root}>
            <GlowBackground size={470} centerY={-0.05} />
            <SafeAreaView style={gs.flex} edges={['top']}>
              <ScrollView
                contentContainerStyle={gs.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

                {/* Form Header */}
                <Pressable style={gs.formHeader} onPress={back} hitSlop={8}>
                  <IconChevronLeft size={22} color="#f6f6f8" strokeWidth={2} />
                  <Txt style={gs.formTitle}>Crear evento</Txt>
                </Pressable>

                <GlassStepper step={step} />

                {/* ── Paso 1: Identidad ── */}
                {step === 0 && (
                  <>
                    <GlassUploader value={cover} onChange={setCover} />
                    <GlassInput
                      label="NOMBRE DEL EVENTO"
                      value={nombre}
                      onChangeText={setNombre}
                    />
                    <GlassSelect
                      label="TIPO / CATEGORÍA"
                      value={tipo}
                      options={TIPO_OPTS}
                      onChange={setTipo}
                    />
                    <View style={gs.row}>
                      <GlassSelect
                        label="JUEGO"
                        value={juego}
                        options={JUEGO_OPTS}
                        onChange={setJuego}
                        flex
                      />
                      <GlassSelect
                        label="MODO"
                        value={modo}
                        options={MODO_OPTS}
                        onChange={setModo}
                        flex
                      />
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
                    <GlassSelect label="FORMATO" value={formato} options={FORMATO_OPTS} onChange={setFormato} />
                    <GlassSelect label="COMPOSICIÓN DE ROSTER" value={roster} options={ROSTER_OPTS} onChange={setRoster} />
                    <View style={gs.row}>
                      <GlassInput label="MÍN. EQUIPOS" value={minEquipos} onChangeText={setMinEquipos} keyboardType="numeric" flex />
                      <GlassInput label="MÁX. EQUIPOS" value={maxEquipos} onChangeText={setMaxEquipos} keyboardType="numeric" flex />
                    </View>
                    <GlassSelect label="SLOTS / HORARIOS" value={slots} options={SLOTS_OPTS} onChange={setSlots} />
                    <GlassInput label="COOLDOWN DE TRANSFERENCIAS" value={cooldown} onChangeText={setCooldown} />
                    <GlassInput label="RESTRICCIONES" value={restricciones} onChangeText={setRestricciones} />
                    <GlassSelect label="IDIOMA" value={idioma} options={IDIOMA_OPTS} onChange={setIdioma} />
                  </>
                )}

                {/* ── Paso 3: Fechas & Publicación ── */}
                {step === 2 && (
                  <>
                    <GlassDateInput label="APERTURA DE INSCRIPCIONES" value={apertura} onChange={setApertura} />
                    <GlassDateInput label="CIERRE · ROSTER LOCK" value={cierre} onChange={setCierre} />
                    <View style={gs.row}>
                      <GlassDateInput label="INICIO" value={inicio} onChange={setInicio} flex />
                      <GlassDateInput label="FIN" value={fin} onChange={setFin} flex />
                    </View>
                    <View style={gs.section}>
                      <Txt style={gs.fieldLabel}>REGLAMENTO</Txt>
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
                    <View style={gs.section}>
                      <Txt style={gs.fieldLabel}>VISIBILIDAD</Txt>
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

            {/* Footer */}
            <SafeAreaView edges={['bottom']} style={gs.footerSafe}>
              <View style={gs.footer}>
                <Pressable style={gs.secondaryBtn} onPress={back}>
                  <Txt style={gs.secondaryLabel}>{step === 0 ? 'Cancelar' : 'Atrás'}</Txt>
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

// ─── Pantalla de éxito ────────────────────────────────────────────────────────

function SuccessView({
  nombre, tipo, formato, maxEquipos, inicio, fin, visibility, onClose,
}: {
  nombre: string; tipo: string; formato: string; maxEquipos: string;
  inicio: string; fin: string; visibility: string; onClose: () => void;
}) {
  const checkAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!mounted) return;
      if (reduce) { checkAnim.setValue(1); ringAnim.setValue(1); contentAnim.setValue(1); return; }
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
  const contentY = contentAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  const visLabel = visibility === 'publica' ? 'Pública' : visibility === 'privada' ? 'Privada' : 'Invitación';

  return (
    <View style={gs.root}>
      <GlowBackground size={460} centerY={-0.05} />
      <SafeAreaView style={gs.flex} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={gs.successContent} showsVerticalScrollIndicator={false}>
          <View style={gs.checkWrap}>
            <Animated.View style={[gs.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
            <Animated.View style={[gs.check, { opacity: checkAnim, transform: [{ scale: checkAnim }] }]}>
              <IconCheck size={34} color="#34d77f" strokeWidth={2.5} />
            </Animated.View>
          </View>

          <Animated.View style={[gs.successBody, { opacity: contentAnim, transform: [{ translateY: contentY }] }]}>
            <Txt style={gs.successTitle}>¡Evento creado!</Txt>
            <Txt style={gs.successDesc}>{nombre} ya está publicada y visible para los equipos.</Txt>

            <View style={gs.summaryCard}>
              <SummaryRow label="Tipo" value={`${tipo} · 4v4`} />
              <SummaryRow label="Formato" value={formato} />
              <SummaryRow label="Equipos" value={`${maxEquipos} máx · roster 4/4`} />
              <SummaryRow label="Fechas" value={`${inicio} – ${fin}`} />
              <SummaryRow label="Visibilidad" value={visLabel} />
            </View>

            <View style={gs.successActions}>
              <PrimaryButton label="Ver evento" onPress={() => {}} />
              <Pressable style={gs.secondaryBtn} onPress={() => {}}>
                <Txt style={gs.secondaryLabel}>Compartir enlace</Txt>
              </Pressable>
              <Pressable hitSlop={12} onPress={onClose}>
                <Txt style={gs.createAnotherLink}>Crear otro evento</Txt>
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
    <View style={gs.summaryRow}>
      <Txt style={gs.summaryLabel}>{label}</Txt>
      <Txt style={gs.summaryValue} numberOfLines={1}>{value}</Txt>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const FIELD_BOX_BG = 'rgba(255,255,255,0.05)';
const FIELD_BOX_BORDER = 'rgba(255,255,255,0.10)';

const gs = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  flex: { flex: 1 },

  // Scroll
  scrollContent: { paddingHorizontal: 22, paddingTop: 6, paddingBottom: 24, gap: 18 },

  // Form Header
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 40 },
  formTitle: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  // Stepper
  stepper: { gap: 10 },
  stepSegs: { flexDirection: 'row', gap: 6 },
  stepSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)' },
  stepSegActive: { backgroundColor: '#ff2d46' },
  stepLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepCounter: { fontFamily: fonts.glassBodyBold, fontSize: 11, letterSpacing: 1, color: 'rgba(246,246,248,0.5)' },
  stepName: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#ff808f' },

  // Campos
  field: { gap: 8 },
  fieldLabel: { fontFamily: fonts.glassBodyBold, fontSize: 11.5, letterSpacing: 1, color: 'rgba(246,246,248,0.5)' },
  fieldValue: { fontFamily: fonts.glassBodyMedium, fontSize: 15, color: '#f6f6f8', flex: 1 },

  // Select box
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
  chevUp: { transform: [{ rotate: '180deg' }] },

  // Dropdown menu glass
  menu: {
    position: 'absolute',
    backgroundColor: '#0d0d10',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 14,
    padding: 6,
    gap: 2,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
    zIndex: 9999,
  },
  menuOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  menuOptSel: { backgroundColor: 'rgba(255,45,70,0.12)' },
  menuOptText: { fontFamily: fonts.glassBodyMedium, fontSize: 14.5, color: 'rgba(246,246,248,0.8)', flex: 1 },
  menuOptTextSel: { fontFamily: fonts.glassBodyBold, color: '#ff808f' },
  menuCheck: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#ff808f', marginLeft: 8 },

  // Input box
  inputBox: {
    backgroundColor: FIELD_BOX_BG,
    borderWidth: 1,
    borderColor: FIELD_BOX_BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 17,
  },
  inputBoxMulti: { height: 96, paddingVertical: 13, alignItems: 'flex-start' },
  textInput: { fontFamily: fonts.glassBodyMedium, fontSize: 15, color: '#f6f6f8', padding: 0, margin: 0, flex: 1 },
  textInputMulti: { textAlignVertical: 'top', height: 70, width: '100%' },

  // Uploader — vacío
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
  },
  uploadIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArrow: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 24,
    color: 'rgba(246,246,248,0.85)',
    lineHeight: 30,
  },
  uploadTitle: { fontFamily: fonts.glassBodyBold, fontSize: 14, color: 'rgba(246,246,248,0.85)' },
  uploadHint: { fontFamily: fonts.glassBodyMedium, fontSize: 11, color: 'rgba(246,246,248,0.4)' },

  // Uploader — cargado (Figma 629:4322)
  uploaderWrap: { gap: 8 },
  preview: { height: 118, borderRadius: 14, overflow: 'hidden', backgroundColor: '#14080a' },
  previewActions: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeBtn: {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBtnLabel: { fontFamily: fonts.glassBodyBold, fontSize: 12.5, color: '#f6f6f8' },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaText: { flex: 1, fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: 'rgba(246,246,248,0.5)' },
  uploadedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 8 },
  uploadedText: { fontFamily: fonts.glassBodyBold, fontSize: 11.5, color: '#5fe49a' },

  // GlassDateInput
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FIELD_BOX_BG,
    borderWidth: 1,
    borderColor: FIELD_BOX_BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 17,
    gap: 10,
  },
  dateInput: {
    flex: 1,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 15,
    color: '#f6f6f8',
    padding: 0,
    margin: 0,
  },
  dateScrim: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  dateAnchor: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dateSheet: {
    backgroundColor: '#0d0d10',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  dateSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  dateSheetCancel: { fontFamily: fonts.glassBodyMedium, fontSize: 15, color: 'rgba(246,246,248,0.55)' },
  dateSheetTitle: { fontFamily: fonts.glassBodyBold, fontSize: 13, letterSpacing: 1, color: 'rgba(246,246,248,0.45)' },
  dateSheetOk: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ff5f73' },
  datePicker: { alignSelf: 'center' },

  // Fila
  row: { flexDirection: 'row', gap: 12 },

  // Sección con label propio
  section: { gap: 8 },

  // Segmented
  seg: {
    flexDirection: 'row', gap: 5, padding: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16, height: 52,
  },
  segPill: {
    position: 'absolute',
    top: SEG_P,
    bottom: SEG_P,
    left: SEG_P,
    borderRadius: 12,
    backgroundColor: '#ef2b3e',
  },
  segTab: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  segLabelActive: { fontFamily: fonts.glassBodyBold, fontSize: 13.5, color: '#f6f6f8' },
  segLabelIdle: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: 'rgba(246,246,248,0.55)' },

  // Footer
  footerSafe: {
    backgroundColor: 'rgba(9,9,11,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 28 },
  secondaryBtn: {
    flex: 1, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryLabel: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ffffff', letterSpacing: 0.3 },
  primaryBtn: {
    flex: 1, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#ff2d46', shadowOpacity: 0.4, shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  pressed: { opacity: 0.88 },
  primaryLabel: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ffffff', letterSpacing: 0.3 },

  // Success
  successContent: { paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40, alignItems: 'center', gap: 18 },
  checkWrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 76, height: 76, borderRadius: 38, borderWidth: 1.5, borderColor: '#34d77f' },
  check: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(52,215,127,0.14)',
    borderWidth: 1.5, borderColor: 'rgba(52,215,127,0.45)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#34d77f', shadowOpacity: 0.4, shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  successBody: { width: '100%', alignItems: 'center', gap: 8 },
  successTitle: { fontFamily: fonts.glassTitle, fontSize: 26, letterSpacing: -0.3, color: '#f6f6f8', marginTop: 10 },
  successDesc: { fontFamily: fonts.glassBodyMedium, fontSize: 14, color: 'rgba(246,246,248,0.55)', textAlign: 'center', lineHeight: 20 },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18, padding: 18, gap: 12, marginTop: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: 'rgba(246,246,248,0.5)' },
  summaryValue: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#f6f6f8', textAlign: 'right', flex: 1, marginLeft: 12 },
  successActions: { width: '100%', gap: 10, paddingTop: 8 },
  createAnotherLink: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ff5f73', letterSpacing: 0.3, textAlign: 'center', paddingVertical: 15 },
});
