/**
 * OB-02 · Login (correo + Xbox/Discord) — fiel al diseño de Figma.
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
  HexBadge,
  GlowBackground,
  AppButton,
  TextField,
  SocialButton,
} from '@/design-system/components';
import { IconMail, IconLock, IconBrandXbox, IconBrandDiscord } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import { authService } from '@/services';
import { validateEmail, validatePassword } from '@/shared/utils/validation';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [credentialError, setCredentialError] = useState<string>();

  const clearErrors = () => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setCredentialError(undefined);
  };

  const handleSubmit = async () => {
    // 1) Validación de formato
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setCredentialError(undefined);
    if (eErr || pErr) return;

    // 2) Autenticación vía servicio (mock hoy, backend mañana)
    const result = await authService.signIn({ email, password });
    if (result.ok) {
      signIn(result.user.role);
      return;
    }
    if (result.reason === 'not_registered') {
      setEmailError('Este correo no está registrado. ¿Quieres crear una cuenta?');
    } else {
      // Correo existe pero contraseña incorrecta (OB-02c)
      setCredentialError(
        'Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.',
      );
    }
  };

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.0} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <HexBadge size={48} borderWidth={5}>
                <Txt style={styles.e5}>E5</Txt>
              </HexBadge>
              <View style={styles.headerText}>
                <Txt style={styles.eyebrow}>// ACCESO</Txt>
                <Txt style={styles.title}>Inicia sesión</Txt>
                <Txt style={styles.subtitle}>
                  Entra con tu correo, o continúa con Xbox / Discord.
                </Txt>
              </View>
            </View>

            {/* Campos */}
            <View style={styles.fields}>
              <TextField
                glass
                label="Correo"
                icon={IconMail}
                placeholder="tu@correo.com"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  if (emailError || credentialError) clearErrors();
                }}
                error={emailError}
                invalid={!!credentialError}
              />

              <View>
                <TextField
                  glass
                  label="Contraseña"
                  icon={IconLock}
                  placeholder="Tu contraseña"
                  password
                  value={password}
                  onChangeText={t => {
                    setPassword(t);
                    if (passwordError || credentialError) clearErrors();
                  }}
                  error={passwordError}
                  invalid={!!credentialError}
                />
                {credentialError ? (
                  <Txt style={styles.credError}>{credentialError}</Txt>
                ) : null}
                <Pressable
                  style={styles.forgot}
                  onPress={() => navigation.navigate('RecuperarAcceso')}>
                  <Txt style={styles.forgotText}>Recuperar acceso</Txt>
                </Pressable>
              </View>
            </View>

            {/* CTA */}
            <AppButton label="Iniciar sesión" onPress={handleSubmit} />

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Txt style={styles.dividerText}>O CONTINÚA CON</Txt>
              <View style={styles.line} />
            </View>

            {/* Sociales */}
            <View style={styles.social}>
              <SocialButton glass label="Xbox" icon={IconBrandXbox} onPress={() => signIn()} />
              <SocialButton glass label="Discord" icon={IconBrandDiscord} onPress={() => signIn()} />
            </View>

            {/* Crear cuenta */}
            <View style={styles.signupRow}>
              <Txt style={styles.signupText}>¿No tienes cuenta?</Txt>
              <Pressable onPress={() => navigation.navigate('CrearCuenta')}>
                <Txt style={styles.signupLink}>Crear cuenta</Txt>
              </Pressable>
            </View>

            <Txt style={styles.terms}>
              Al continuar aceptas los Términos y el Aviso de Privacidad.
            </Txt>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  flex: { flex: 1 },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'],
    gap: theme.spacing['2xl'],
  },
  header: { gap: theme.spacing.lg },
  headerText: { gap: theme.spacing.sm },
  e5: {
    fontFamily: fonts.headingBold,
    fontSize: 17,
    lineHeight: 22,
    color: theme.colors.white,
    textAlign: 'center',
  },
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
  },
  subtitle: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textOnGlassDim,
  },
  fields: { gap: 18 },
  credError: {
    marginTop: theme.spacing.sm,
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    color: theme.colors.redSoft,
  },
  forgot: { alignSelf: 'flex-end', marginTop: theme.spacing.md },
  forgotText: {
    fontFamily: fonts.glassBodySemibold,
    fontSize: 13,
    color: theme.colors.redSoft,
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    color: theme.colors.textOnGlassFaint,
    letterSpacing: 1.5,
  },
  social: { flexDirection: 'row', gap: theme.spacing.md },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  signupText: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 13,
    color: theme.colors.textOnGlassDim,
  },
  signupLink: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 13,
    color: theme.colors.redSoft,
  },
  terms: {
    textAlign: 'center',
    fontFamily: fonts.glassBodyMedium,
    fontSize: 11,
    color: 'rgba(246,246,248,0.35)',
  },
});
