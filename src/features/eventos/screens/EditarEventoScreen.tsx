/**
 * EV-01 · Editar evento — rediseño glass (Figma 633:31148). Formulario en un
 * solo scroll, pre-llenado con los datos del evento. Secciones con encabezado
 * rosado, chips de estado, zona peligrosa y footer Cancelar / Guardar.
 * Entra deslizándose de derecha a izquierda ENCIMA de Gestión del evento.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { type Asset } from 'react-native-image-picker';
import {
  Txt,
  AppButton,
  CoverUpload,
  FormField,
  FormInput,
  FormSelect,
  FormDate,
  GlowBackground,
  SegmentedControl,
  ConfirmModal,
} from '@/design-system/components';
import { IconChevronLeft } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import type { LeagueEvent } from '@/services';
import {
  TIPO_OPTS,
  JUEGO_OPTS,
  MODO_OPTS,
  FORMATO_OPTS,
  ROSTER_OPTS,
  VISIBILITY_SEGMENTS,
} from '../eventFormOptions';

/** Chips de estado del evento (Figma 633:31186). */
const STATUS_CHIPS = [
  { key: 'borrador', label: 'Borrador' },
  { key: 'inscripcion', label: 'Inscripciones' },
  { key: 'en_curso', label: 'En curso' },
  { key: 'finalizado', label: 'Finalizado' },
  { key: 'cancelado', label: 'Cancelado' },
];

interface EditarEventoModalProps {
  visible: boolean;
  event: LeagueEvent | null;
  onClose: () => void;
  /** Se llama tras confirmar la eliminación. */
  onDeleted?: (event: LeagueEvent) => void;
  /** Se llama cuando el modal terminó de cerrarse (iOS). */
  onDismiss?: () => void;
}

/** Encabezado de sección (rosado). */
function SectionLabel({ label }: { label: string }) {
  return <Txt style={styles.sectionLabel}>{label}</Txt>;
}

const DEFAULT_INIT = {
  nombre: '',
  tipo: 'Liga',
  juego: 'Gears E-Day',
  modo: '4v4',
  descripcion: '',
  formato: 'Grupos + Playoffs (elim. doble)',
  composicion: '4 titulares · 2 suplentes · 1 coach',
  minEq: '8',
  maxEq: '16',
  cooldown: '48',
  apertura: '15/01/2026',
  cierre: '28/01/2026',
  inicio: '01/02/2026',
  fin: '30/03/2026',
  premio: '$15,000 MXN · 1º + Finals',
  canal: 'twitch.tv/eco5',
  visibility: 'publico',
  estado: 'en_curso',
};

export function EditarEventoModal({ visible, event, onClose, onDeleted, onDismiss }: EditarEventoModalProps) {
  const [initial, setInitial] = useState(DEFAULT_INIT);
  const [cover, setCover] = useState<Asset | null>(null);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Liga');
  const [juego, setJuego] = useState('Gears E-Day');
  const [modo, setModo] = useState('4v4');
  const [descripcion, setDescripcion] = useState('');
  const [formato, setFormato] = useState('Grupos + Playoffs (elim. doble)');
  const [composicion, setComposicion] = useState('4 titulares · 2 suplentes · 1 coach');
  const [minEq, setMinEq] = useState('8');
  const [maxEq, setMaxEq] = useState('16');
  const [cooldown, setCooldown] = useState('48');
  const [apertura, setApertura] = useState('15/01/2026');
  const [cierre, setCierre] = useState('28/01/2026');
  const [inicio, setInicio] = useState('01/02/2026');
  const [fin, setFin] = useState('30/03/2026');
  const [premio, setPremio] = useState('$15,000 MXN · 1º + Finals');
  const [canal, setCanal] = useState('twitch.tv/eco5');
  const [visibility, setVisibility] = useState('publico');
  const [estado, setEstado] = useState<string>('en_curso');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUnsaved, setConfirmUnsaved] = useState(false);

  // Pre-llenado con los datos del evento al abrir.
  useEffect(() => {
    if (visible && event) {
      const init = {
        ...DEFAULT_INIT,
        nombre: event.title,
        tipo: event.format.charAt(0).toUpperCase() + event.format.slice(1),
        estado: event.status,
      };
      setInitial(init);
      setNombre(init.nombre);
      setTipo(init.tipo);
      setEstado(init.estado);
      setCover(null);
    }
  }, [visible, event]);

  const hasChanges = useMemo(() => (
    cover !== null ||
    nombre !== initial.nombre ||
    tipo !== initial.tipo ||
    juego !== initial.juego ||
    modo !== initial.modo ||
    descripcion !== initial.descripcion ||
    formato !== initial.formato ||
    composicion !== initial.composicion ||
    minEq !== initial.minEq ||
    maxEq !== initial.maxEq ||
    cooldown !== initial.cooldown ||
    apertura !== initial.apertura ||
    cierre !== initial.cierre ||
    inicio !== initial.inicio ||
    fin !== initial.fin ||
    premio !== initial.premio ||
    canal !== initial.canal ||
    visibility !== initial.visibility ||
    estado !== initial.estado
  ), [cover, nombre, tipo, juego, modo, descripcion, formato, composicion,
      minEq, maxEq, cooldown, apertura, cierre, inicio, fin, premio, canal,
      visibility, estado, initial]);

  const handleClose = () => {
    if (hasChanges) {
      setConfirmUnsaved(true);
    } else {
      onClose();
    }
  };

  // Push horizontal: editar entra de derecha a izquierda ENCIMA de gestión
  // (que se queda montada detrás). Modal transparente + slide del panel.
  const screenW = Dimensions.get('window').width;
  const tx = useRef(new Animated.Value(screenW)).current;
  const [mounted, setMounted] = useState(visible);
  const wasVisible = useRef(false);

  useEffect(() => {
    if (visible) {
      wasVisible.current = true;
      setMounted(true);
      tx.setValue(screenW);
      Animated.timing(tx, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (wasVisible.current) {
      wasVisible.current = false;
      Animated.timing(tx, {
        toValue: screenW,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          onDismiss?.();
        }
      });
    }
  }, [visible, screenW, tx, onDismiss]);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={handleClose} statusBarTranslucent>
      <SafeAreaProvider>
        <Animated.View style={[styles.root, { transform: [{ translateX: tx }] }]}>
          <GlowBackground size={480} centerY={0} />
          <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.backBtn} hitSlop={8} onPress={handleClose}>
                <IconChevronLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <Txt style={styles.title}>Editar evento</Txt>
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* Portada */}
              <FormField label="PORTADA DEL EVENTO">
                <CoverUpload value={cover} onChange={setCover} />
              </FormField>

              {/* IDENTIDAD */}
              <SectionLabel label="IDENTIDAD" />
              <FormField label="NOMBRE DEL EVENTO">
                <FormInput value={nombre} onChangeText={setNombre} />
              </FormField>
              <FormField label="TIPO / CATEGORÍA">
                <FormSelect value={tipo} options={TIPO_OPTS} onChange={setTipo} />
              </FormField>
              <View style={styles.rowFields}>
                <FormField label="JUEGO" style={styles.flex}>
                  <FormSelect value={juego} options={JUEGO_OPTS} onChange={setJuego} />
                </FormField>
                <FormField label="MODO" style={styles.flex}>
                  <FormSelect value={modo} options={MODO_OPTS} onChange={setModo} />
                </FormField>
              </View>
              <FormField label="DESCRIPCIÓN">
                <FormInput
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Liga oficial de Gears E-Day 4v4…"
                  multiline
                />
              </FormField>

              {/* FORMATO & ROSTER */}
              <SectionLabel label="FORMATO & ROSTER" />
              <FormField label="FORMATO">
                <FormSelect value={formato} options={FORMATO_OPTS} onChange={setFormato} />
              </FormField>
              <FormField label="COMPOSICIÓN">
                <FormSelect value={composicion} options={ROSTER_OPTS} onChange={setComposicion} />
              </FormField>
              <View style={styles.rowFields}>
                <FormField label="MÍN. EQUIPOS" style={styles.flex}>
                  <FormInput value={minEq} onChangeText={setMinEq} numeric maxLength={3} />
                </FormField>
                <FormField label="MÁX. EQUIPOS" style={styles.flex}>
                  <FormInput value={maxEq} onChangeText={setMaxEq} numeric maxLength={3} />
                </FormField>
              </View>
              <FormField label="COOLDOWN TRANSFERENCIAS">
                <FormInput value={cooldown} onChangeText={setCooldown} />
              </FormField>

              {/* FECHAS */}
              <SectionLabel label="FECHAS" />
              <View style={styles.rowFields}>
                <FormField label="APERTURA" style={styles.flex}>
                  <FormDate value={apertura} onChange={setApertura} label="APERTURA" />
                </FormField>
                <FormField label="CIERRE" style={styles.flex}>
                  <FormDate value={cierre} onChange={setCierre} label="CIERRE" />
                </FormField>
              </View>
              <View style={styles.rowFields}>
                <FormField label="INICIO" style={styles.flex}>
                  <FormDate value={inicio} onChange={setInicio} label="INICIO" />
                </FormField>
                <FormField label="FIN" style={styles.flex}>
                  <FormDate value={fin} onChange={setFin} label="FIN" />
                </FormField>
              </View>

              {/* PUBLICACIÓN */}
              <SectionLabel label="PUBLICACIÓN" />
              <FormField label="PREMIO">
                <FormInput value={premio} onChangeText={setPremio} />
              </FormField>
              <FormField label="STREAM / DISCORD">
                <FormInput value={canal} onChangeText={setCanal} />
              </FormField>
              <FormField label="VISIBILIDAD">
                <SegmentedControl segments={VISIBILITY_SEGMENTS} value={visibility} onChange={setVisibility} />
              </FormField>

              {/* ESTADO DEL EVENTO */}
              <SectionLabel label="ESTADO DEL EVENTO" />
              <View style={styles.chipsWrap}>
                {STATUS_CHIPS.map(c => {
                  const active = estado === c.key;
                  return (
                    <Pressable
                      key={c.key}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setEstado(c.key)}>
                      <Txt style={active ? styles.chipTextActive : styles.chipText}>{c.label}</Txt>
                    </Pressable>
                  );
                })}
              </View>

              {/* ZONA PELIGROSA */}
              <SectionLabel label="ZONA PELIGROSA" />
              <View style={styles.dangerCard}>
                <Txt style={styles.dangerText}>
                  Eliminar este evento borra equipos, partidos y brackets. No se puede deshacer.
                </Txt>
                <AppButton
                  label="Eliminar evento"
                  variant="danger"
                  onPress={() => setConfirmDelete(true)}
                />
              </View>
            </ScrollView>

            {/* Footer */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
              <AppButton
                label="Cancelar"
                variant="secondary"
                fullWidth={false}
                onPress={handleClose}
                style={styles.footerBtn}
              />
              <AppButton
                label="Guardar"
                fullWidth={false}
                disabled={!hasChanges}
                onPress={onClose}
                style={styles.footerBtn}
              />
            </SafeAreaView>
          </SafeAreaView>
        </Animated.View>
      </SafeAreaProvider>

      <ConfirmModal
        visible={confirmDelete}
        title="¿Eliminar este evento?"
        body={`Se eliminará ${event?.title ?? 'este evento'} y todos sus datos (equipos, partidos, brackets). Esta acción no se puede deshacer.`}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          setTimeout(() => { if (event) onDeleted?.(event); onClose(); }, 280);
        }}
      />

      <ConfirmModal
        visible={confirmUnsaved}
        title="¿Salir sin guardar?"
        body="Perderás los cambios no guardados. El evento quedará como estaba antes de editar."
        cancelLabel="Cancelar"
        confirmLabel="Sí, regresar"
        cancelVariant="danger-outline"
        onCancel={() => setConfirmUnsaved(false)}
        onConfirm={() => {
          setConfirmUnsaved(false);
          setTimeout(onClose, 280);
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060608' },
  safe: { flex: 1 },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  title: { fontFamily: fonts.glassTitle, fontSize: 20, color: '#f6f6f8' },

  content: { paddingHorizontal: 22, paddingTop: 6, paddingBottom: 28, gap: 14 },
  rowFields: { flexDirection: 'row', gap: 12 },

  // Encabezado de sección (rosado)
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#ff808f',
    width: '100%',
    paddingTop: 8,
  },

  // Chips de estado
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: theme.colors.redDeep,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.32,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chipText: { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: 'rgba(246,246,248,0.6)' },
  chipTextActive: { fontFamily: fonts.glassBodyBold, fontSize: 13.5, color: '#ffffff' },

  // Zona peligrosa
  dangerCard: {
    backgroundColor: 'rgba(255,45,70,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,70,0.3)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  dangerText: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12.5,
    lineHeight: 17.5,
    color: 'rgba(246,246,248,0.6)',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: 'rgba(9,9,11,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footerBtn: { flex: 1 },
});
