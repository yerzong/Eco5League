/**
 * OB-04 · Completar perfil — fiel al diseño de Figma.
 * Paso 2 de 2 del onboarding. Footer fijo con "FINALIZAR PERFIL".
 */
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  launchCamera,
  launchImageLibrary,
  type CameraOptions,
} from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  removeBackground,
  hasBackgroundRemover,
} from '@/shared/native/backgroundRemover';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  GlowBackground,
  BackButton,
  SectionLabel,
  TextField,
  SelectField,
  AppButton,
  ConfirmModal,
  ProgressBar,
  BottomSheet,
  type BottomSheetHandle,
} from '@/design-system/components';
import { NATIONALITIES } from '@/shared/data/nationalities';
import {
  IconCamera,
  IconPhoto,
  IconCalendar,
  IconDeviceGamepad2,
  IconBrandXbox,
  IconPhone,
  IconPlus,
  IconMail,
  IconX,
  IconCircleCheck,
} from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { validateRequired, validateBirthDate } from '@/shared/utils/validation';
import { useExitConfirm } from '@/shared/hooks/useExitConfirm';
import { getNetwork, type AddedSocial } from '@/features/auth/socialNetworks';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CompletarPerfil'>;

/** Quita no-dígitos y reconstruye "dd / mm / aaaa" según cuántos dígitos hay. */
function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  let result = digits.slice(0, 2);
  if (digits.length > 2) result += ' / ' + digits.slice(2, 4);
  if (digits.length > 4) result += ' / ' + digits.slice(4);
  return result;
}

/** Etiqueta de campo con "*" o "· Opcional" para usar fuera del TextField. */
function FieldLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <View style={styles.fieldLabelRow}>
      <Txt variant="label" style={styles.fieldLabel}>
        {label.toUpperCase()}
      </Txt>
      {optional ? <Txt style={styles.optional}>· Opcional</Txt> : null}
    </View>
  );
}

export function CompletarPerfilScreen({ navigation }: Props) {
  const { signIn } = useSession();
  const exit = useExitConfirm();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fecha, setFecha] = useState('');
  const [pais, setPais] = useState('');
  const [gamertag, setGamertag] = useState('');
  const [photo, setPhoto] = useState<string>();
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [socials, setSocials] = useState<AddedSocial[]>([]);
  const [paisSheet, setPaisSheet] = useState(false);
  const paisSheetRef = useRef<BottomSheetHandle>(null);
  const [photoSheet, setPhotoSheet] = useState(false);
  const photoSheetRef = useRef<BottomSheetHandle>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(2000, 0, 1));

  const confirmDate = () => {
    const dd = String(tempDate.getDate()).padStart(2, '0');
    const mm = String(tempDate.getMonth() + 1).padStart(2, '0');
    setFecha(`${dd} / ${mm} / ${tempDate.getFullYear()}`);
    clear('fecha');
    setShowCalendar(false);
  };

  const selectPais = (label: string) => {
    setPais(label);
    clear('pais');
    paisSheetRef.current?.close();
  };

  // Aplica la foto elegida y, si se puede, le recorta el fondo (PNG limpio).
  const applyPhoto = async (uri?: string) => {
    if (!uri) return;
    setPhoto(uri); // muestra la original de inmediato
    if (hasBackgroundRemover) {
      setProcessingPhoto(true);
      try {
        const cutout = await removeBackground(uri);
        setPhoto(cutout);
      } catch {
        // sin sujeto detectado o no disponible: se queda la foto original
      } finally {
        setProcessingPhoto(false);
      }
    }
  };

  // Toma con cámara o elige de la galería según la opción del sheet.
  const pickFrom = async (source: 'camera' | 'library') => {
    photoSheetRef.current?.close();
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.9,
      saveToPhotos: false,
    };
    const res =
      source === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary({ ...options, selectionLimit: 1 });
    if (res.didCancel) return;
    await applyPhoto(res.assets?.[0]?.uri);
  };

  // Progreso = campos requeridos completados / total (correo viene precargado).
  const requiredDone = [
    !!photo,
    !!nombre.trim(),
    !!apellidos.trim(),
    !!fecha.trim(),
    !!pais.trim(),
    true, // correo (precargado)
  ];
  const progress = requiredDone.filter(Boolean).length / requiredDone.length;
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellidos?: string;
    fecha?: string;
    pais?: string;
  }>({});

  const REQUIRED = 'Este campo es requerido.';
  const clear = (k: keyof typeof errors) => {
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const handleFinalizar = () => {
    const next = {
      nombre: validateRequired(nombre, REQUIRED),
      apellidos: validateRequired(apellidos, REQUIRED),
      fecha: validateBirthDate(fecha),
      pais: validateRequired(pais, REQUIRED),
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) {
      exit.bypass();
      signIn();
    }
  };

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.0} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Header fijo (no se oculta al hacer scroll) */}
          <View style={styles.headerFixed}>
            <BackButton glass style={styles.back} />
            <Txt style={styles.eyebrow}>// PASO 2 DE 2 · TU PERFIL</Txt>
            <Txt style={styles.title}>Completa tu perfil</Txt>
            <View style={styles.progressWrap}>
              <ProgressBar progress={progress} />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Foto de perfil */}
            <View style={styles.photoRow}>
              <Pressable style={styles.photoBox} onPress={() => setPhotoSheet(true)}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoImg} />
                ) : (
                  <IconCamera size={26} color={theme.colors.textOnGlassDim} strokeWidth={1.75} />
                )}
                {processingPhoto ? (
                  <View style={styles.photoLoading}>
                    <ActivityIndicator color={theme.colors.textPrimary} />
                  </View>
                ) : null}
              </Pressable>
              <View style={styles.photoText}>
                <Txt variant="label" style={styles.fieldLabel}>
                  FOTO DE PERFIL (PNG)
                </Txt>
                <Txt style={styles.photoHint}>Quita-fondos integrado para PNG limpio.</Txt>
              </View>
            </View>

            {/* Datos personales */}
            <SectionLabel glass label="Datos personales" />
            <TextField
              glass
              label="Nombre(s)"              placeholder="Ej. Gerson"
              value={nombre}
              onChangeText={t => {
                setNombre(t);
                clear('nombre');
              }}
              error={errors.nombre}
            />
            <TextField
              glass
              label="Apellidos"              placeholder="Ej. García"
              value={apellidos}
              onChangeText={t => {
                setApellidos(t);
                clear('apellidos');
              }}
              error={errors.apellidos}
            />
            <TextField
              glass
              label="Fecha de nacimiento"              placeholder="dd / mm / aaaa"
              keyboardType="numeric"
              value={fecha}
              onChangeText={t => {
                setFecha(formatDateInput(t));
                clear('fecha');
              }}
              error={errors.fecha}
              rightAction={{ icon: IconCalendar, onPress: () => setShowCalendar(true) }}
            />
            <SelectField
              glass
              label="Nacionalidad"              placeholder="Selecciona tu país"
              value={pais}
              error={errors.pais}
              onPress={() => setPaisSheet(true)}
            />

            {/* Identidad de juego */}
            <SectionLabel glass label="Identidad de juego" />
            <TextField
              glass
              label="Gamertag"
              optional
              disabled
              icon={IconDeviceGamepad2}
              placeholder="Verifica tu Xbox para precargarlo"
              value={gamertag}
            />

            {/* Tarjeta verificación Xbox */}
            <View style={styles.xboxCard}>
              <IconBrandXbox size={22} color={EMERALD} strokeWidth={2} />
              <View style={styles.xboxInfo}>
                <Txt style={styles.xboxTitle}>Verificación de Xbox</Txt>
                <Txt style={styles.xboxHint}>Obligatorio solo si vas a competir.</Txt>
              </View>
              <Pressable
                style={styles.xboxBtn}
                onPress={() => {
                  // Maqueta: verificar Xbox precarga el gamertag.
                  setGamertag('Gerson_E5');
                }}>
                <Txt style={styles.xboxBtnText}>Verificar</Txt>
              </Pressable>
            </View>

            {/* Perfil público */}
            <SectionLabel glass label="Perfil público · Opcional" />
            <TextField
              glass
              label="Descripción / Bio"
              optional
              multiline
              placeholder="Cuéntale a la comunidad quién eres…"
            />

            {/* Teléfono + OTP */}
            <View style={styles.field}>
              <FieldLabel label="Teléfono" optional />
              <View style={styles.phoneRow}>
                <View style={styles.flex}>
                  <TextField
                    glass
                    icon={IconPhone}
                    placeholder="+52 55 0000 0000"
                    keyboardType="phone-pad"
                  />
                </View>
                <Pressable
                  style={styles.otpBtn}
                  onPress={() => navigation.navigate('VerificarOtp')}>
                  <Txt style={styles.otpBtnText}>Enviar OTP</Txt>
                </Pressable>
              </View>
            </View>

            {/* Redes sociales */}
            <View style={styles.field}>
              <FieldLabel label="Redes sociales" optional />
              {socials.map((s, i) => {
                const net = getNetwork(s.networkKey);
                if (!net) return null;
                const Icon = net.icon;
                const display =
                  net.key === 'web' || s.handle.startsWith('@')
                    ? s.handle
                    : `@${s.handle}`;
                return (
                  <View key={`${s.networkKey}-${i}`} style={styles.socialRow}>
                    <View style={styles.socialIcon}>
                      <Icon size={20} color={net.color} strokeWidth={1.9} />
                    </View>
                    <View style={styles.socialInfo}>
                      <Txt style={styles.socialNet}>{net.label}</Txt>
                      <Txt style={styles.socialHandle}>{display}</Txt>
                    </View>
                    <Pressable
                      style={styles.socialRemove}
                      onPress={() =>
                        setSocials(prev => prev.filter((_, j) => j !== i))
                      }>
                      <IconX size={14} color={theme.colors.textSecondary} strokeWidth={2} />
                    </Pressable>
                  </View>
                );
              })}
              <Pressable
                style={styles.addSocial}
                onPress={() =>
                  navigation.navigate('RedesSocialesModal', {
                    onAdd: s => setSocials(prev => [...prev, s]),
                  })
                }>
                <IconPlus size={18} color={theme.colors.textOnGlassDim} strokeWidth={2} />
                <Txt style={styles.addSocialText}>
                  {socials.length ? 'Agregar otra red' : 'Agregar red social'}
                </Txt>
              </Pressable>
            </View>

            {/* Cuenta */}
            <SectionLabel glass label="Cuenta" />
            <TextField
              glass
              label="Correo electrónico"              disabled
              icon={IconMail}
              value="gerson@gmail.com (de tu proveedor)"
            />
          </ScrollView>

          {/* Footer fijo */}
          <View style={styles.footer}>
            <AppButton label="Finalizar perfil" onPress={handleFinalizar} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ConfirmModal
        visible={exit.visible}
        title="¿Salir sin guardar?"
        body="Perderás la información ingresada. Tu perfil quedará incompleto hasta que completes este paso."
        cancelLabel="Cancelar"
        confirmLabel="Sí, regresar"
        onCancel={exit.onCancel}
        onConfirm={exit.onConfirm}
      />

      {photoSheet ? (
        <BottomSheet
          ref={photoSheetRef}
          glass
          title="Foto de perfil"
          onClose={() => setPhotoSheet(false)}>
          <Pressable style={styles.photoOption} onPress={() => pickFrom('camera')}>
            <View style={styles.photoOptionIcon}>
              <IconCamera size={22} color={theme.colors.textPrimary} strokeWidth={1.9} />
            </View>
            <Txt style={styles.optionText}>Tomar foto</Txt>
          </Pressable>
          <Pressable style={styles.photoOption} onPress={() => pickFrom('library')}>
            <View style={styles.photoOptionIcon}>
              <IconPhoto size={22} color={theme.colors.textPrimary} strokeWidth={1.9} />
            </View>
            <Txt style={styles.optionText}>Elegir de la galería</Txt>
          </Pressable>
        </BottomSheet>
      ) : null}

      {paisSheet ? (
        <BottomSheet
          ref={paisSheetRef}
          glass
          title="Selecciona tu país"
          onClose={() => setPaisSheet(false)}>
          {NATIONALITIES.map(n => {
            const active = pais === n.label;
            return (
              <Pressable
                key={n.code}
                style={styles.countryRow}
                onPress={() => selectPais(n.label)}>
                <Txt style={styles.flag}>{n.flag}</Txt>
                <Txt style={styles.optionText}>{n.label}</Txt>
                {active ? (
                  <IconCircleCheck size={20} color={theme.colors.redSoft} strokeWidth={2} />
                ) : null}
              </Pressable>
            );
          })}
        </BottomSheet>
      ) : null}

      {/* Calendario fecha de nacimiento */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}>
        <Pressable style={styles.calScrim} onPress={() => setShowCalendar(false)} />
        <View style={styles.calSheet}>
          <View style={styles.calHandle} />
          <View style={styles.calHeader}>
            <Pressable onPress={() => setShowCalendar(false)} hitSlop={8}>
              <Txt style={styles.calCancel}>Cancelar</Txt>
            </Pressable>
            <Txt style={styles.calTitle}>FECHA DE NACIMIENTO</Txt>
            <Pressable onPress={confirmDate} hitSlop={8}>
              <Txt style={styles.calDone}>Listo</Txt>
            </Pressable>
          </View>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="inline"
            maximumDate={new Date()}
            themeVariant="dark"
            accentColor={theme.colors.redBright}
            onChange={(_, d) => d && setTempDate(d)}
            style={styles.calPicker}
          />
        </View>
      </Modal>
    </View>
  );
}

const EMERALD = '#34d399';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  flex: { flex: 1 },
  safe: { flex: 1 },
  headerFixed: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  back: { marginBottom: theme.spacing.xs, alignSelf: 'flex-start' },
  eyebrow: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    color: 'rgba(255,59,82,0.9)',
    letterSpacing: 2,
  },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  progressWrap: { marginVertical: theme.spacing.sm },
  // Foto
  photoRow: { flexDirection: 'row', gap: theme.spacing.lg, alignItems: 'center' },
  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImg: { width: '100%', height: '100%' },
  photoHint: { fontFamily: fonts.glassBodyMedium, fontSize: 12, color: theme.colors.textOnGlassDim },
  photoLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  photoText: { flex: 1, gap: theme.spacing.xs },
  fieldLabelRow: { flexDirection: 'row', gap: theme.spacing.xs, alignItems: 'center' },
  fieldLabel: { fontFamily: fonts.glassBodyBold, letterSpacing: 1.5, color: theme.colors.textOnGlassDim },
  optional: { fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: theme.colors.textOnGlassFaint },
  field: { gap: theme.spacing.sm },
  // Xbox card
  xboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    minHeight: 66,
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 12,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    borderRadius: 16,
  },
  xboxInfo: { flex: 1 },
  xboxTitle: { fontFamily: fonts.glassBodySemibold, fontSize: 14, color: 'rgba(246,246,248,0.95)' },
  xboxHint: { fontFamily: fonts.glassBodyMedium, fontSize: 12, color: 'rgba(246,246,248,0.45)' },
  xboxBtn: {
    width: 80,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(52,211,153,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xboxBtnText: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: EMERALD },
  // Teléfono
  phoneRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' },
  otpBtn: {
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 16,
    backgroundColor: theme.colors.glassFillStrong,
    borderWidth: 1,
    borderColor: theme.colors.glassBorderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBtnText: { fontFamily: fonts.glassBodyBold, fontSize: 12, color: theme.colors.textPrimary },
  // Redes
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    height: 54,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    borderRadius: 16,
  },
  socialIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glassFillStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialInfo: { flex: 1, gap: 1 },
  socialNet: { fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: theme.colors.textOnGlassDim },
  socialHandle: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.textPrimary },
  socialRemove: {
    width: 28,
    height: 28,
    borderRadius: 99,
    backgroundColor: theme.colors.glassFillStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.glassBorderStrong,
    borderStyle: 'dashed',
  },
  addSocialText: { fontFamily: fonts.glassBodySemibold, fontSize: 14, color: theme.colors.textOnGlassDim },
  // Calendario
  calScrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  calSheet: {
    backgroundColor: 'rgba(18,14,16,0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing['3xl'],
  },
  calHandle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  calCancel: { fontFamily: fonts.glassBodySemibold, fontSize: 14, color: theme.colors.textOnGlassDim },
  calTitle: { fontFamily: fonts.glassBodyBold, fontSize: 11, letterSpacing: 1.2, color: theme.colors.textOnGlassDim },
  calDone: { fontFamily: fonts.glassBodyBold, fontSize: 14, color: theme.colors.redSoft },
  calPicker: { alignSelf: 'center' },
  // Selector de país / opciones de foto
  optionText: { flex: 1, fontFamily: fonts.glassBodyMedium, fontSize: 15, color: theme.colors.textPrimary },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassBorder,
  },
  flag: { fontSize: 22 },
  // Opciones del selector de foto
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassBorder,
  },
  photoOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.glassFillStrong,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Footer
  footer: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.bgDeep,
    borderTopWidth: 1,
    borderTopColor: theme.colors.glassBorder,
  },
});
