/**
 * OB-03 · Crear cuenta (registro) — fiel al diseño de Figma.
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
  AngularButton,
  TextField,
  SocialButton,
  Eyebrow,
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
      <GlowBackground size={440} centerY={0.04} />

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
            <View style={styles.headerText}>
              <Eyebrow label="// Crear cuenta" />
              <Txt style={styles.title}>CREA TU CUENTA</Txt>
              <Txt variant="body" color="textSecondary">
                Regístrate para competir en la liga ECO5.
              </Txt>
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
                clear('email');
              }}
              error={errors.email}
            />
            <View>
              <TextField
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

            {/* CTA */}
            <AngularButton
              label="CREAR CUENTA"
              height={54}
              onPress={handleSubmit}
            />

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Txt style={styles.dividerText}>O REGÍSTRATE CON</Txt>
              <View style={styles.line} />
            </View>

            {/* Sociales */}
            <View style={styles.social}>
              <SocialButton
                label="Xbox"
                icon={IconBrandXbox}
                color={theme.providerColors.xbox}
                onPress={() => navigation.navigate('CompletarPerfil')}
              />
              <SocialButton
                label="Discord"
                icon={IconBrandDiscord}
                color={theme.providerColors.discord}
                onPress={() => navigation.navigate('CompletarPerfil')}
              />
            </View>

            {/* Ir a login */}
            <View style={styles.signupRow}>
              <Txt variant="bodySm" color="textSecondary">
                ¿Ya tienes cuenta?
              </Txt>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Txt style={styles.signupLink}>Inicia sesión</Txt>
              </Pressable>
            </View>

            <Txt variant="caption" color="textTertiary" style={styles.note}>
              Después de crear tu cuenta, completas tu perfil de jugador.
            </Txt>
            <Txt variant="caption" color="textTertiary" style={styles.note}>
              Al registrarte aceptas los Términos y el Aviso de Privacidad.
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
  back: { marginBottom: -theme.spacing.sm },
  headerText: { gap: theme.spacing.xs },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 38,
    lineHeight: 44,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
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
  note: { textAlign: 'center' },
});
