/**
 * OB-04 · Completar perfil — fiel al diseño de Figma.
 * Paso 2 de 2 del onboarding. Footer fijo con "FINALIZAR PERFIL".
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  GlowBackground,
  CornerBrackets,
  BackButton,
  Eyebrow,
  SectionLabel,
  TextField,
  SelectField,
  AngularButton,
  ConfirmModal,
} from '@/design-system/components';
import {
  IconCamera,
  IconCalendar,
  IconDeviceGamepad2,
  IconBrandXbox,
  IconPhone,
  IconPlus,
  IconMail,
} from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { validateRequired, validateBirthDate } from '@/shared/utils/validation';
import { useExitConfirm } from '@/shared/hooks/useExitConfirm';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CompletarPerfil'>;

/** Etiqueta de campo con "*" o "· Opcional" para usar fuera del TextField. */
function FieldLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <View style={styles.fieldLabelRow}>
      <Txt variant="label" color="textSecondary" style={styles.fieldLabel}>
        {label.toUpperCase()}
      </Txt>
      {optional ? (
        <Txt variant="caption" color="textTertiary">
          · Opcional
        </Txt>
      ) : null}
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
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellidos?: string;
    fecha?: string;
    pais?: string;
    gamertag?: string;
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
      gamertag: validateRequired(gamertag, REQUIRED),
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) {
      exit.bypass();
      signIn();
    }
  };

  return (
    <View style={styles.root}>
      <GlowBackground size={420} centerY={0.03} />
      <CornerBrackets bottom={false} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <BackButton style={styles.back} />

            {/* Header */}
            <Eyebrow label="// Paso 2 de 2 · Tu perfil" />
            <Txt style={styles.title}>COMPLETA TU PERFIL</Txt>
            <View style={styles.track}>
              <View style={styles.fill} />
            </View>

            {/* Foto de perfil */}
            <View style={styles.photoRow}>
              <Pressable style={styles.photoBox}>
                <IconCamera size={26} color={theme.colors.textSecondary} strokeWidth={1.75} />
              </Pressable>
              <View style={styles.photoText}>
                <View style={styles.fieldLabelRow}>
                  <Txt variant="label" color="textSecondary" style={styles.fieldLabel}>
                    FOTO DE PERFIL (PNG)
                  </Txt>
                  <Txt style={styles.req}>*</Txt>
                </View>
                <Txt variant="caption" color="textSecondary">
                  Quita-fondos integrado para PNG limpio.
                </Txt>
              </View>
            </View>

            {/* Datos personales */}
            <SectionLabel label="Datos personales" />
            <TextField
              label="Nombre(s)"
              required
              placeholder="Ej. Gerson"
              value={nombre}
              onChangeText={t => {
                setNombre(t);
                clear('nombre');
              }}
              error={errors.nombre}
            />
            <TextField
              label="Apellidos"
              required
              placeholder="Ej. García"
              value={apellidos}
              onChangeText={t => {
                setApellidos(t);
                clear('apellidos');
              }}
              error={errors.apellidos}
            />
            <SelectField
              label="Fecha de nacimiento"
              required
              icon={IconCalendar}
              placeholder="dd / mm / aaaa"
              value={fecha}
              error={errors.fecha}
              onPress={() => {
                // Maqueta: simula la selección de una fecha.
                setFecha('15 / 03 / 2001');
                clear('fecha');
              }}
            />
            <SelectField
              label="Nacionalidad"
              required
              placeholder="Selecciona tu país"
              value={pais}
              error={errors.pais}
              onPress={() => {
                // Maqueta: simula la selección de país.
                setPais('México');
                clear('pais');
              }}
            />

            {/* Identidad de juego */}
            <SectionLabel label="Identidad de juego" />
            <TextField
              label="Gamertag"
              required
              disabled
              icon={IconDeviceGamepad2}
              placeholder="Verifica tu Xbox para precargarlo"
              value={gamertag}
              error={errors.gamertag}
            />

            {/* Tarjeta verificación Xbox */}
            <View style={styles.xboxCard}>
              <View style={styles.xboxAvatar}>
                <IconBrandXbox size={22} color={theme.colors.white} strokeWidth={2} />
              </View>
              <View style={styles.xboxInfo}>
                <Txt variant="label" color="textPrimary">
                  Verificación de Xbox
                </Txt>
                <Txt variant="caption" color="textSecondary">
                  Obligatorio solo si vas a competir en un roster.
                </Txt>
              </View>
              <Pressable
                style={styles.xboxBtn}
                onPress={() => {
                  // Maqueta: verificar Xbox precarga el gamertag.
                  setGamertag('Gerson_E5');
                  clear('gamertag');
                }}>
                <Txt style={styles.xboxBtnText}>Verificar</Txt>
              </Pressable>
            </View>

            {/* Perfil público */}
            <SectionLabel label="Perfil público · Opcional" />
            <TextField
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
              <Pressable
                style={styles.addSocial}
                onPress={() => navigation.navigate('RedesSocialesModal')}>
                <IconPlus size={18} color={theme.colors.textSecondary} strokeWidth={2} />
                <Txt variant="button" color="textSecondary">
                  Agregar red social
                </Txt>
              </Pressable>
            </View>

            {/* Cuenta */}
            <SectionLabel label="Cuenta" />
            <TextField
              label="Correo electrónico"
              required
              disabled
              icon={IconMail}
              value="gerson@gmail.com (de tu proveedor)"
            />
          </ScrollView>

          {/* Footer fijo */}
          <View style={styles.footer}>
            <AngularButton
              label="FINALIZAR PERFIL"
              height={56}
              borderColor="#f04d60"
              onPress={handleFinalizar}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ConfirmModal
        visible={exit.visible}
        title="¿SALIR SIN GUARDAR?"
        body="Perderás la información ingresada. Tu perfil quedará incompleto hasta que completes este paso."
        cancelLabel="Cancelar"
        confirmLabel="Sí, regresar"
        onCancel={exit.onCancel}
        onConfirm={exit.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  flex: { flex: 1 },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing['3xl'],
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  back: { marginBottom: -theme.spacing.xs },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    lineHeight: 38,
    color: theme.colors.textPrimary,
  },
  track: {
    height: 5,
    borderRadius: 99,
    backgroundColor: theme.colors.surface2,
    marginVertical: theme.spacing.sm,
  },
  fill: {
    width: '66%',
    height: 5,
    borderRadius: 99,
    backgroundColor: theme.colors.brandRedHover,
  },
  // Foto
  photoRow: { flexDirection: 'row', gap: theme.spacing.lg, alignItems: 'center' },
  photoBox: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: { flex: 1, gap: theme.spacing.xs },
  fieldLabelRow: { flexDirection: 'row', gap: theme.spacing.xs, alignItems: 'center' },
  fieldLabel: { letterSpacing: 0.5 },
  req: { color: theme.colors.brandRedHover, fontFamily: fonts.label, fontSize: 12 },
  field: { gap: theme.spacing.sm },
  // Xbox card
  xboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.providerColors.xbox,
    borderRadius: theme.radius.sm,
  },
  xboxAvatar: {
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: theme.providerColors.xbox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xboxInfo: { flex: 1, gap: 2 },
  xboxBtn: {
    height: 36,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.providerColors.xbox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xboxBtnText: { fontFamily: fonts.button, fontSize: 12, color: theme.colors.white },
  // Teléfono
  phoneRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' },
  otpBtn: {
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBtnText: { fontFamily: fonts.button, fontSize: 12, color: theme.colors.textPrimary },
  // Redes
  addSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    height: 48,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderStyle: 'dashed',
  },
  // Footer
  footer: {
    paddingHorizontal: theme.spacing['3xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.bgBase,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderDefault,
  },
});
