/**
 * EV-06 · Editar evento — formulario completo en un solo scroll, pre-llenado
 * con los datos del evento. Reutiliza los componentes de formulario del wizard.
 * Incluye estado del evento, cancelar y zona peligrosa (eliminar → EV-07).
 * Se presenta como modal de pantalla completa.
 */
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import {
  Txt,
  Eyebrow,
  FormField,
  FormInput,
  FormSelect,
  FormDate,
  SegmentedControl,
  StatusPill,
  GameArt,
  DangerConfirm,
} from '@/design-system/components';
import {
  IconChevronLeft,
  IconPhoto,
  IconCheck,
  IconBan,
  IconTrash,
  IconPlus,
} from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/shared/events/status';
import type { LeagueEvent } from '@/services';
import {
  TIPO_OPTS,
  JUEGO_MODO_OPTS,
  FORMATO_OPTS,
  ROSTER_OPTS,
  REGION_OPTS,
  ESTADO_SEGMENTS,
  VISIBILITY_SEGMENTS,
} from '../eventFormOptions';

function statusColor(status: EventStatus): string {
  switch (status) {
    case 'en_curso':
      return theme.colors.accentGreen;
    case 'inscripcion':
      return theme.colors.accentAmber;
    case 'finalizado':
      return theme.colors.textTertiary;
    default:
      return theme.colors.brandRed;
  }
}

/** Staff asignado de ejemplo (maqueta). */
const ASSIGNED_STAFF = [
  { label: 'Carlos M. · Caster', color: '#7a4fc0' },
  { label: 'Laura V. · Streamer', color: '#5865f2' },
  { label: 'Ana R. · Árbitro', color: '#e0a526' },
];

interface EditarEventoModalProps {
  visible: boolean;
  event: LeagueEvent | null;
  onClose: () => void;
  /** Se llama tras confirmar la eliminación. */
  onDeleted?: (event: LeagueEvent) => void;
}

export function EditarEventoModal({ visible, event, onClose, onDeleted }: EditarEventoModalProps) {
  const [cover, setCover] = useState<Asset | null>(null);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Liga');
  const [juegoModo, setJuegoModo] = useState('Gears E-Day · 4v4');
  const [descripcion, setDescripcion] = useState('');
  const [formato, setFormato] = useState('Grupos + Playoffs (elim. doble)');
  const [roster, setRoster] = useState('4 titulares · 2 suplentes · 1 coach');
  const [minEq, setMinEq] = useState('8');
  const [maxEq, setMaxEq] = useState('16');
  const [slots, setSlots] = useState('L–V 18:00+ · S–D mañana');
  const [cooldown, setCooldown] = useState('48');
  const [restricciones, setRestricciones] = useState('Edad 16+ · región MX · sin smurfs');
  const [region, setRegion] = useState('México · Español');
  const [apertura, setApertura] = useState('15/01/2026');
  const [cierre, setCierre] = useState('28/01/2026');
  const [inicio, setInicio] = useState('01/02/2026');
  const [fin, setFin] = useState('30/03/2026');
  const [reglamento, setReglamento] = useState('reglamento-eco5-v2.1.pdf');
  const [premio, setPremio] = useState('$15,000 MXN + pase a Finals');
  const [canal, setCanal] = useState('twitch.tv/eco5esports');
  const [visibility, setVisibility] = useState('publico');
  const [estado, setEstado] = useState<string>('en_curso');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Pre-llenado con los datos del evento al abrir.
  useEffect(() => {
    if (visible && event) {
      setNombre(event.title);
      setTipo(event.format.charAt(0).toUpperCase() + event.format.slice(1));
      setEstado(event.status);
      setCover(null);
    }
  }, [visible, event]);

  const pickCover = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (res.didCancel || !res.assets?.[0]) return;
    setCover(res.assets[0]);
  };

  const status = (event?.status ?? 'en_curso') as EventStatus;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaProvider>
        <View style={styles.root}>
          <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.backBtn} hitSlop={8} onPress={onClose}>
                <IconChevronLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <View style={styles.flex}>
                <Txt style={styles.title}>Editar evento</Txt>
                <View style={styles.subRow}>
                  <Txt style={styles.subtitle} numberOfLines={1}>
                    {event?.title ?? ''}
                  </Txt>
                  <StatusPill
                    label={EVENT_STATUS_LABELS[status]}
                    color={statusColor(status)}
                    dot
                    round
                  />
                </View>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* IDENTIDAD */}
              <Eyebrow label="Identidad" />
              <FormField label="PORTADA DEL EVENTO" required>
                <View style={styles.cover}>
                  {cover?.uri ? (
                    <Image source={{ uri: cover.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  ) : (
                    <GameArt
                      label={event?.game ?? 'VALORANT'}
                      accent={event?.accent}
                      height={90}
                      radius={0}
                      scrim
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                  <Pressable style={styles.changeBtn} onPress={pickCover}>
                    <IconPhoto size={16} color={theme.colors.white} strokeWidth={2} />
                    <Txt style={styles.changeText}>Cambiar</Txt>
                  </Pressable>
                </View>
              </FormField>
              <FormField label="NOMBRE DEL EVENTO" required>
                <FormInput value={nombre} onChangeText={setNombre} />
              </FormField>
              <FormField label="TIPO / CATEGORÍA" required>
                <FormSelect value={tipo} options={TIPO_OPTS} onChange={setTipo} />
              </FormField>
              <FormField label="JUEGO Y MODO" required>
                <FormSelect value={juegoModo} options={JUEGO_MODO_OPTS} onChange={setJuegoModo} />
              </FormField>
              <FormField label="DESCRIPCIÓN">
                <FormInput
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="De qué trata el evento, fases, a quién va dirigido…"
                  multiline
                />
              </FormField>

              {/* FORMATO & ROSTER */}
              <Eyebrow label="Formato & Roster" />
              <FormField label="FORMATO" required>
                <FormSelect value={formato} options={FORMATO_OPTS} onChange={setFormato} />
              </FormField>
              <FormField label="COMPOSICIÓN DE ROSTER" required>
                <FormSelect value={roster} options={ROSTER_OPTS} onChange={setRoster} />
              </FormField>
              <View style={styles.rowFields}>
                <FormField label="MÍN. EQUIPOS" required style={styles.flex}>
                  <FormInput value={minEq} onChangeText={setMinEq} numeric maxLength={3} />
                </FormField>
                <FormField label="MÁX. EQUIPOS" required style={styles.flex}>
                  <FormInput value={maxEq} onChangeText={setMaxEq} numeric maxLength={3} />
                </FormField>
              </View>
              <FormField label="SLOTS / HORARIOS" required>
                <FormInput value={slots} onChangeText={setSlots} />
              </FormField>
              <FormField label="COOLDOWN TRANSFERENCIAS (H)" required>
                <FormInput value={cooldown} onChangeText={setCooldown} numeric maxLength={3} />
              </FormField>
              <FormField label="RESTRICCIONES">
                <FormInput value={restricciones} onChangeText={setRestricciones} />
              </FormField>
              <FormField label="REGIÓN / IDIOMA">
                <FormSelect value={region} options={REGION_OPTS} onChange={setRegion} />
              </FormField>

              {/* FECHAS */}
              <Eyebrow label="Fechas" />
              <FormField label="APERTURA DE INSCRIPCIONES" required>
                <FormDate value={apertura} onChange={setApertura} label="APERTURA DE INSCRIPCIONES" />
              </FormField>
              <FormField label="CIERRE · ROSTER LOCK" required>
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

              {/* REGLAS & PUBLICACIÓN */}
              <Eyebrow label="Reglas & Publicación" />
              <FormField label="REGLAMENTO (PDF / LINKS)" required>
                <FormInput value={reglamento} onChangeText={setReglamento} />
              </FormField>
              <FormField label="PREMIO (SOLO DISPLAY)">
                <FormInput value={premio} onChangeText={setPremio} />
              </FormField>
              <FormField label="CANAL STREAM / DISCORD" required>
                <FormInput value={canal} onChangeText={setCanal} />
              </FormField>
              <FormField label="VISIBILIDAD">
                <SegmentedControl segments={VISIBILITY_SEGMENTS} value={visibility} onChange={setVisibility} />
              </FormField>
              <FormField label="STAFF ASIGNADO">
                <View style={styles.staffWrap}>
                  {ASSIGNED_STAFF.map(s => (
                    <View key={s.label} style={[styles.staffChip, { borderColor: s.color }]}>
                      <Txt style={styles.staffText}>{s.label}</Txt>
                    </View>
                  ))}
                  <Pressable style={styles.assignChip}>
                    <IconPlus size={15} color={theme.colors.textSecondary} strokeWidth={2} />
                    <Txt style={styles.assignText}>Asignar</Txt>
                  </Pressable>
                </View>
              </FormField>

              {/* ESTADO DEL EVENTO */}
              <Eyebrow label="Estado del evento" />
              <SegmentedControl segments={ESTADO_SEGMENTS} value={estado} onChange={setEstado} />
              <Pressable style={styles.cancelEventBtn}>
                <IconBan size={16} color={theme.colors.warning} strokeWidth={2} />
                <Txt style={styles.cancelEventText}>Cancelar evento</Txt>
              </Pressable>

              {/* ZONA PELIGROSA */}
              <View style={styles.dangerEyebrow}>
                <View style={styles.dangerBar} />
                <Txt style={styles.dangerLabel}>ZONA PELIGROSA</Txt>
              </View>
              <Pressable style={styles.deleteBtn} onPress={() => setConfirmDelete(true)}>
                <IconTrash size={18} color={theme.colors.brandRed} strokeWidth={2} />
                <Txt style={styles.deleteText}>Eliminar evento permanentemente</Txt>
              </Pressable>
            </ScrollView>

            {/* Footer */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
              <Pressable style={styles.secondaryBtn} onPress={onClose}>
                <Txt style={styles.secondaryLabel}>Cancelar</Txt>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onClose}>
                <IconCheck size={18} color={theme.colors.white} strokeWidth={2.4} />
                <Txt style={styles.primaryLabel}>GUARDAR CAMBIOS</Txt>
              </Pressable>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>

      <DangerConfirm
        visible={confirmDelete}
        title="¿Eliminar este evento?"
        subject={event?.title}
        body="Se eliminarán de forma permanente las inscripciones, brackets y resultados asociados. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          if (event) onDeleted?.(event);
          onClose();
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1 },
  flex: { flex: 1 },

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
  subRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginTop: 2 },
  subtitle: { fontFamily: fonts.body, fontSize: 12, color: theme.colors.textSecondary, flexShrink: 1 },

  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm, paddingBottom: 24, gap: theme.spacing.lg },
  rowFields: { flexDirection: 'row', gap: theme.spacing.md },

  // Cover
  cover: { height: 90, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  changeText: { fontFamily: fonts.label, fontSize: 12, color: theme.colors.white },

  // Staff chips
  staffWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  staffChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    backgroundColor: '#1a1d23',
  },
  staffText: { fontFamily: fonts.label, fontSize: 11, color: theme.colors.textPrimary },
  assignChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    borderStyle: 'dashed',
  },
  assignText: { fontFamily: fonts.label, fontSize: 11, color: theme.colors.textSecondary },

  // Cancelar evento
  cancelEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
  },
  cancelEventText: { fontFamily: fonts.button, fontSize: 13, letterSpacing: 0.52, color: theme.colors.warning },

  // Zona peligrosa
  dangerEyebrow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.xs },
  dangerBar: { width: 3, height: 13, backgroundColor: theme.colors.brandRed },
  dangerLabel: { fontFamily: fonts.button, fontSize: 12, letterSpacing: 1.44, color: theme.colors.brandRed },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.brandRed,
  },
  deleteText: { fontFamily: fonts.button, fontSize: 13, letterSpacing: 0.26, color: theme.colors.brandRed },

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
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { fontFamily: fonts.headingBold, fontSize: 13, letterSpacing: 0.26, color: theme.colors.white },
});
