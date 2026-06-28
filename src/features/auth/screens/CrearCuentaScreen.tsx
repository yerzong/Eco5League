/**
 * OB-03 · Crear cuenta (registro) — rediseño "glass".
 * Fiel a Figma "📝 Crear cuenta ✦ glass". Misma lógica (validación, checklist
 * de contraseña, correo registrado, contraseñas que no coinciden).
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
  AppButton,
  TextField,
  SocialButton,
  BackButton,
  PasswordRules,
} from '@/design-system/components';
import { IconMail, IconLock, IconBrandXbox, IconBrandDiscord } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import {
  validateEmail,
  validateStrongPassword,
  validatePasswordMatch,
} from '@/shared/utils/validation';
import { authService } from '@/services';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CrearCuenta'>;

export function CrearCuentaScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const handleSubmit = async () => {
    let emailErr = validateEmail(email);
    if (!emailErr && (await authService.isEmailRegistered(email))) {
      emailErr = 'Este correo ya está registrado. Intenta iniciar sesión.';
    }
    const next = {
      email: emailErr,
      password: validateStrongPassword(password),
      confirm: validatePasswordMatch(password, confirm),
    };
    setErrors(next);
    if (!next.email && !next.password && !next.confirm) {
      navigation.navigate('CompletarPerfil');
    }
  };

  const clear = (k: 'email' | 'password' | 'confirm') => {
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
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
            <BackButton glass style={styles.back} />

            {/* Header */}
            <View style={styles.headerText}>
              <Txt style={styles.eyebrow}>// CREAR CUENTA</Txt>
              <Txt style={styles.title}>Crea tu cuenta</Txt>
              <Txt style={styles.subtitle}>Regístrate para competir en la liga ECO5.</Txt>
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
                  clear('email');
                }}
                error={errors.email}
              />
              <View>
                <TextField
                  glass
                  label="Contraseña"
                  icon={IconLock}
                  placeholder="Mínimo 8 caracteres"
                  password
                  value={password}
                  onChangeText={t => {
                    setPassword(t);
                    clear('password');
                  }}
                  error={errors.password}
                />
                {password.length > 0 ? <PasswordRules value={password} /> : null}
              </View>
              <TextField
                glass
                label="Confirmar contraseña"
                icon={IconLock}
                placeholder="Repite tu contraseña"
                password
                value={confirm}
                onChangeText={t => {
                  setConfirm(t);
                  clear('confirm');
                }}
                error={errors.confirm}
              />
            </View>

            {/* CTA */}
            <AppButton label="Crear cuenta" onPress={handleSubmit} />

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Txt style={styles.dividerText}>O REGÍSTRATE CON</Txt>
              <View style={styles.line} />
            </View>

            {/* Sociales */}
            <View style={styles.social}>
              <SocialButton
                glass
                label="Xbox"
                icon={IconBrandXbox}
                onPress={() => navigation.navigate('CompletarPerfil')}
              />
              <SocialButton
                glass
                label="Discord"
                icon={IconBrandDiscord}
                onPress={() => navigation.navigate('CompletarPerfil')}
              />
            </View>

            {/* Ir a login */}
            <View style={styles.signupRow}>
              <Txt style={styles.signupText}>¿Ya tienes cuenta?</Txt>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Txt style={styles.signupLink}>Inicia sesión</Txt>
              </Pressable>
            </View>

            <Txt style={styles.note}>
              Después de crear tu cuenta, completas tu perfil de jugador.
            </Txt>
            <Txt style={styles.terms}>
              Al registrarte aceptas los Términos y el Aviso de Privacidad.
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
  back: { marginBottom: -theme.spacing.sm },
  headerText: { gap: theme.spacing.sm },
  eyebrow: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: 'rgba(255,59,82,0.9)',
    letterSpacing: 2,
  },
  title: {
    fontFamily: fonts.label,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textOnGlassDim,
  },
  fields: { gap: 18 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: {
    fontFamily: fonts.label,
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
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: theme.colors.textOnGlassDim,
  },
  signupLink: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: theme.colors.redSoft,
  },
  note: {
    textAlign: 'center',
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: theme.colors.textOnGlassDim,
  },
  terms: {
    textAlign: 'center',
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: 'rgba(246,246,248,0.35)',
  },
});
