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
  AngularButton,
  TextField,
  SocialButton,
  Eyebrow,
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
      <GlowBackground size={440} centerY={0.04} />

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
              <HexBadge size={56} borderWidth={6}>
                <Txt style={styles.e5}>E5</Txt>
              </HexBadge>
              <View style={styles.headerText}>
                <Eyebrow label="// Acceso" />
                <Txt style={styles.title}>INICIA SESIÓN</Txt>
                <Txt variant="body" color="textSecondary">
                  Entra con tu correo, o continúa con Xbox / Discord.
                </Txt>
              </View>
            </View>

            {/* Campos */}
            <TextField
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
                <Txt variant="caption" color="danger" style={styles.credError}>
                  {credentialError}
                </Txt>
              ) : null}
              <Pressable
                style={styles.forgot}
                onPress={() => navigation.navigate('RecuperarAcceso')}>
                <Txt style={styles.forgotText}>Recuperar acceso</Txt>
              </Pressable>
            </View>

            {/* CTA */}
            <AngularButton
              label="INICIAR SESIÓN"
              height={54}
              onPress={handleSubmit}
            />

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Txt style={styles.dividerText}>O CONTINÚA CON</Txt>
              <View style={styles.line} />
            </View>

            {/* Sociales */}
            <View style={styles.social}>
              <SocialButton
                label="Xbox"
                icon={IconBrandXbox}
                color={theme.providerColors.xbox}
                onPress={() => signIn()}
              />
              <SocialButton
                label="Discord"
                icon={IconBrandDiscord}
                color={theme.providerColors.discord}
                onPress={() => signIn()}
              />
            </View>

            {/* Crear cuenta */}
            <View style={styles.signupRow}>
              <Txt variant="bodySm" color="textSecondary">
                ¿No tienes cuenta?
              </Txt>
              <Pressable onPress={() => navigation.navigate('CrearCuenta')}>
                <Txt style={styles.signupLink}>Crear cuenta</Txt>
              </Pressable>
            </View>

            <Txt variant="caption" color="textTertiary" style={styles.terms}>
              Al continuar aceptas los Términos y el Aviso de Privacidad.
            </Txt>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    gap: theme.spacing.xl,
  },
  header: { gap: theme.spacing.lg },
  headerText: { gap: theme.spacing.xs },
  e5: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    lineHeight: 26,
    color: theme.colors.white,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 38,
    lineHeight: 44,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  credError: { marginTop: theme.spacing.sm },
  forgot: { alignSelf: 'flex-end', marginTop: theme.spacing.md },
  forgotText: {
    fontFamily: fonts.meta,
    fontSize: 12,
    color: theme.colors.brandRedHover,
    letterSpacing: 0.5,
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.borderDefault },
  dividerText: {
    fontFamily: fonts.meta,
    fontSize: 10,
    color: theme.colors.textTertiary,
    letterSpacing: 1.5,
  },
  social: { flexDirection: 'row', gap: theme.spacing.md },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  signupLink: {
    fontFamily: fonts.button,
    fontSize: 13,
    color: theme.colors.brandRedHover,
  },
  terms: { textAlign: 'center' },
});
