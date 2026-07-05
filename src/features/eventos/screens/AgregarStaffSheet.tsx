/**
 * EV ✦ Sheet de 2 pasos para asignar un usuario como staff del evento.
 *   Paso 1 (662:4352): buscar y seleccionar usuario.
 *   Paso 2 (633:28310): elegir sub-roles y confirmar.
 *   Estado de éxito: animación spring con checkmark al confirmar.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BottomSheet, type BottomSheetHandle } from '@/design-system/components/BottomSheet';
import { IconCheck, IconChevronRight, IconSearch } from '@/design-system/icons';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { Txt } from '@/design-system/components/Txt';
import { eventsService, type StaffCandidate } from '@/services';

/* ─── Constantes ─── */

type Step = 'search' | 'roles' | 'success';

const SUB_ROLES = [
  'Caster',
  'Streamer',
  'Moderador/Árbitro',
  'Diseñador',
  'Redes sociales',
  'Observer',
  'Coordinador general',
] as const;

/* ─── Props ─── */

interface AgregarStaffSheetProps {
  eventId: string;
  onAdded: () => void;
  onClose: () => void;
}

/* ─── Componente principal ─── */

export function AgregarStaffSheet({ eventId, onAdded, onClose }: AgregarStaffSheetProps) {
  const sheetRef = useRef<BottomSheetHandle>(null);

  const [candidates, setCandidates] = useState<StaffCandidate[]>([]);
  const [search, setSearch]         = useState('');
  const [step, setStep]             = useState<Step>('search');
  const [selected, setSelected]     = useState<StaffCandidate | null>(null);
  const [subRoles, setSubRoles]     = useState<string[]>([]);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    eventsService.getStaffCandidates(eventId).then(setCandidates);
  }, [eventId]);

  const filtered = search
    ? candidates.filter(
        c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()),
      )
    : candidates;

  const selectUser = useCallback((c: StaffCandidate) => {
    setSelected(c);
    setSubRoles([]);
    setStep('roles');
  }, []);

  const goBack = useCallback(() => {
    setStep('search');
    setSearch('');
  }, []);

  const toggleRole = useCallback((r: string) => {
    setSubRoles(prev => (prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]));
  }, []);

  const handleAsignar = useCallback(async () => {
    if (!selected || subRoles.length === 0 || saving) return;
    setSaving(true);
    await eventsService.addEventStaff(eventId, selected, subRoles.join(' · '));
    setSaving(false);
    setStep('success');
  }, [selected, subRoles, saving, eventId]);

  /* ─── Header dinámico por paso ─── */

  const headerTitle =
    step === 'success' ? '¡Staff asignado!' :
    step === 'roles'   ? 'Asignar roles de staff' :
                         'Asignar staff';

  const headerSub =
    step === 'success' ? (selected?.name ?? '') :
    step === 'roles'   ? 'Paso 2 de 2 · Usuario seleccionado' :
                         'Paso 1 de 2 · Selecciona un usuario';

  const header = (
    <View style={s.headerBlock}>
      <Txt style={s.title}>{headerTitle}</Txt>
      <Txt style={step === 'success' ? [s.stepLabel, s.stepLabelSuccess] : s.stepLabel}>
        {headerSub}
      </Txt>
    </View>
  );

  return (
    <BottomSheet ref={sheetRef} header={header} glass onClose={onClose}>
      <View style={s.body}>
        {step === 'search' ? (
          <Step1
            search={search}
            onSearch={setSearch}
            candidates={filtered}
            onSelect={selectUser}
          />
        ) : step === 'roles' && selected ? (
          <Step2
            selected={selected}
            subRoles={subRoles}
            saving={saving}
            onToggleRole={toggleRole}
            onCambiar={goBack}
            onCancel={() => sheetRef.current?.close()}
            onAsignar={handleAsignar}
          />
        ) : step === 'success' && selected ? (
          <SuccessView
            selected={selected}
            onDone={() => {
              onAdded();
              sheetRef.current?.close();
            }}
          />
        ) : null}
      </View>
    </BottomSheet>
  );
}

/* ─────────────────── Paso 1 — Seleccionar usuario ─────────────────── */

interface Step1Props {
  search: string;
  onSearch: (v: string) => void;
  candidates: StaffCandidate[];
  onSelect: (c: StaffCandidate) => void;
}

function Step1({ search, onSearch, candidates, onSelect }: Step1Props) {
  return (
    <>
      <View style={s.searchRow}>
        <IconSearch size={18} color="rgba(246,246,248,0.4)" strokeWidth={1.8} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar por nombre o correo…"
          placeholderTextColor="rgba(246,246,248,0.35)"
          value={search}
          onChangeText={onSearch}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Buscar usuario por nombre o correo"
          accessibilityRole="search"
        />
      </View>

      <View style={s.sortRow}>
        <Txt style={s.sortLabel}>↑↓  Nombre · A–Z</Txt>
        <Txt style={s.countLabel}>{candidates.length} cuentas</Txt>
      </View>

      <ScrollView
        style={s.list}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {candidates.length === 0 ? (
          <Txt style={s.emptyText}>Sin resultados</Txt>
        ) : (
          candidates.map(c => (
            <CandidateRow key={c.id} candidate={c} onSelect={onSelect} />
          ))
        )}
      </ScrollView>
    </>
  );
}

/* ─── Fila de candidato ─── */

interface CandidateRowProps {
  candidate: StaffCandidate;
  onSelect: (c: StaffCandidate) => void;
}

function CandidateRow({ candidate: c, onSelect }: CandidateRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [s.userRow, pressed && { opacity: 0.75 }]}
      onPress={() => onSelect(c)}
      accessibilityRole="button"
      accessibilityLabel={`Seleccionar ${c.name}, ${c.email}`}>
      <View style={s.userAvatar}>
        <Txt style={s.userAvatarText}>{c.initials}</Txt>
      </View>
      <View style={s.userNameCol}>
        <Txt style={s.userName}>{c.name}</Txt>
        <Txt style={s.userEmail}>{c.email}</Txt>
      </View>
      <IconChevronRight size={16} color="rgba(246,246,248,0.35)" strokeWidth={2} />
    </Pressable>
  );
}

/* ─────────────────── Paso 2 — Roles ─────────────────── */

interface Step2Props {
  selected: StaffCandidate;
  subRoles: string[];
  saving: boolean;
  onToggleRole: (r: string) => void;
  onCambiar: () => void;
  onCancel: () => void;
  onAsignar: () => void;
}

function Step2({ selected, subRoles, saving, onToggleRole, onCambiar, onCancel, onAsignar }: Step2Props) {
  const canAssign = subRoles.length > 0 && !saving;

  return (
    <ScrollView
      style={s.step2Scroll}
      contentContainerStyle={s.step2Content}
      showsVerticalScrollIndicator={false}>

      {/* Card usuario seleccionado */}
      <View style={s.selectedCard}>
        <View style={s.selectedAvatar}>
          <Txt style={s.selectedAvatarText}>{selected.initials}</Txt>
        </View>
        <View style={s.userNameCol}>
          <Txt style={s.userName}>{selected.name}</Txt>
          <Txt style={s.userEmail}>{selected.email}</Txt>
        </View>
        <Pressable
          onPress={onCambiar}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Cambiar usuario seleccionado">
          <Txt style={s.cambiarLabel}>Cambiar</Txt>
        </Pressable>
      </View>

      {/* Sub-roles */}
      <Txt style={s.sectionLabel}>SUB-ROLES</Txt>
      <View style={s.chipRow} accessibilityLabel="Sub-roles disponibles">
        {SUB_ROLES.map(r => (
          <RoleChip
            key={r}
            label={r}
            active={subRoles.includes(r)}
            onToggle={() => onToggleRole(r)}
          />
        ))}
      </View>

      {/* Botones */}
      <View style={s.actionRow}>
        <Pressable
          style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.8 }]}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar asignación">
          <Txt style={s.cancelLabel}>Cancelar</Txt>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            s.asignarBtn,
            !canAssign && s.asignarBtnDisabled,
            pressed && canAssign && { opacity: 0.85 },
          ]}
          disabled={!canAssign}
          onPress={onAsignar}
          accessibilityRole="button"
          accessibilityLabel={saving ? 'Asignando…' : 'Asignar al staff'}
          accessibilityState={{ disabled: !canAssign }}>
          {canAssign ? (
            <Svg style={StyleSheet.absoluteFill} width={200} height={52}>
              <Defs>
                <LinearGradient id="asignarG" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#ff3b52" />
                  <Stop offset="1" stopColor="#e11d36" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="200" height="52" fill="url(#asignarG)" />
            </Svg>
          ) : null}
          <Txt style={canAssign ? s.asignarLabel : s.asignarLabelDisabled}>
            {saving ? 'Asignando…' : 'Asignar'}
          </Txt>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ─── Chip de sub-rol ─── */

interface RoleChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function RoleChip({ label, active, onToggle }: RoleChipProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={[s.chip, active && s.chipActiveOverride]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      accessibilityLabel={label}>
      <Txt style={active ? s.chipTextActive : s.chipText}>{label}</Txt>
    </Pressable>
  );
}

/* ─────────────────── Éxito — Animación spring ─────────────────── */

interface SuccessViewProps {
  selected: StaffCandidate;
  onDone: () => void;
}

function SuccessView({ selected, onDone }: SuccessViewProps) {
  const circleScale  = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    Animated.sequence([
      // El círculo aparece con spring: rebote suave, se siente vivo
      Animated.spring(circleScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 150,
        mass: 0.9,
      }),
      // El check aparece al terminar el círculo
      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      // El texto sube + aparece
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
        }),
      ]),
    ]).start(() => {
      timer = setTimeout(onDone, 900);
    });

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accent = selected.color;

  return (
    <View
      style={s.successRoot}
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${selected.name} asignado al staff del evento`}>
      {/* Círculo con spring */}
      <Animated.View
        style={[
          s.successCircle,
          {
            transform: [{ scale: circleScale }],
            backgroundColor: withAlpha(accent, 0.14),
            borderColor: withAlpha(accent, 0.45),
          },
        ]}>
        <Animated.View style={{ opacity: checkOpacity }}>
          <IconCheck size={42} color={accent} strokeWidth={2.5} />
        </Animated.View>
      </Animated.View>

      {/* Nombre + subtítulo se deslizan desde abajo */}
      <Animated.View
        style={[
          s.successTextBlock,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}>
        <Txt style={[s.successName, { color: accent }]}>{selected.name}</Txt>
        <Txt style={s.successDesc}>asignado al staff del evento</Txt>
      </Animated.View>
    </View>
  );
}

/* ─────────────────── Styles ─────────────────── */

const s = StyleSheet.create({
  /* Header */
  headerBlock: { gap: 4 },
  title: { fontFamily: fonts.glassTitle, fontSize: 22, color: '#f6f6f8' },
  stepLabel: { fontFamily: fonts.glassBodySemibold, fontSize: 12.5, color: '#ff808f' },
  stepLabelSuccess: { color: 'rgba(246,246,248,0.5)' },

  body: { paddingBottom: 12 },

  /* Búsqueda (Paso 1) */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18,
    paddingHorizontal: 18,
    height: 52,
    marginTop: 14,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 15,
    color: '#f6f6f8',
    padding: 0,
  },

  /* Fila sort + count */
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortLabel: { fontFamily: fonts.glassBodySemibold, fontSize: 12.5, color: 'rgba(246,246,248,0.7)' },
  countLabel: { fontFamily: fonts.glassBodyMedium, fontSize: 12, color: 'rgba(246,246,248,0.5)' },

  /* Lista */
  list: { maxHeight: 260 },
  listContent: { gap: 10 },
  emptyText: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: 'rgba(246,246,248,0.4)',
    textAlign: 'center',
    paddingVertical: 20,
  },

  /* Fila de candidato */
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 68,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(128,135,148,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(128,135,148,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { fontFamily: fonts.glassTitle, fontSize: 13, color: 'rgba(246,246,248,0.85)' },
  userNameCol: { flex: 1, gap: 2 },
  userName:  { fontFamily: fonts.glassBodySemibold, fontSize: 14.5, color: '#f6f6f8' },
  userEmail: { fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: 'rgba(246,246,248,0.45)' },

  /* ─── Paso 2 ─── */
  step2Scroll: {},
  step2Content: { gap: 14, paddingTop: 14, paddingBottom: 8 },

  /* Card usuario seleccionado */
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,45,70,0.5)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectedAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,45,70,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,45,70,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAvatarText: { fontFamily: fonts.glassTitle, fontSize: 13, color: '#ff808f' },
  cambiarLabel: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: '#ff808f' },

  /* Etiqueta de sección */
  sectionLabel: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: 'rgba(246,246,248,0.45)',
  },

  /* Chips de sub-rol */
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActiveOverride: {
    backgroundColor: '#e82038',
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#ff2d46',
    shadowOpacity: 0.32,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chipText:       { fontFamily: fonts.glassBodySemibold, fontSize: 13.5, color: 'rgba(246,246,248,0.6)' },
  chipTextActive: { fontFamily: fonts.glassBodyBold,     fontSize: 13.5, color: '#ffffff' },

  /* Botones finales */
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel:  { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ffffff', letterSpacing: 0.3 },
  asignarBtn: {
    flex: 1,
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
  },
  asignarBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  asignarLabel:         { fontFamily: fonts.glassBodyBold, fontSize: 15, color: '#ffffff', letterSpacing: 0.3 },
  asignarLabelDisabled: { fontFamily: fonts.glassBodyBold, fontSize: 15, color: 'rgba(246,246,248,0.3)', letterSpacing: 0.3 },

  /* ─── Éxito ─── */
  successRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 24,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextBlock: { alignItems: 'center', gap: 6 },
  successName: {
    fontFamily: fonts.glassTitle,
    fontSize: 20,
    letterSpacing: 0.2,
  },
  successDesc: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    color: 'rgba(246,246,248,0.55)',
  },
});
