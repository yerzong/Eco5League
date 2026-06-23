/**
 * OB-06a · Recuperar acceso (correo) — fiel al diseño de Figma.
 * Paso 1 de 3: el usuario escribe su correo y se le envía un código.
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
  BackButton,
  Eyebrow,
  TextField,
  AngularButton,
} from '@/design-system/components';
import { IconLock, IconMail } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { validateEmail } from '@/shared/utils/validation';
import { MOCK_USERS } from '@/shared/auth/mockUsers';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'RecuperarAcceso'>;

/** Demo: ¿el correo existe en el sistema? (mientras no hay backend). */
function emailIsRegistered(email: string): boolean {
  const n = email.trim().toLowerCase();
  return MOCK_USERS.some(u => u.email.toLowerCase() === n);
}

export function RecuperarAccesoScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

  const handleSend = () => {
    const formatErr = validateEmail(email);
    if (formatErr) {
      setError(formatErr);
      return;
    }
    if (!emailIsRegistered(email)) {
      setError('Este correo no está registrado. Verifica tus datos.');
      return;
    }
    setError(undefined);
    navigation.navigate('RecuperarCodigo', { email: email.trim() });
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

            {/* Badge */}
            <View style={styles.badge}>
              <IconLock size={26} color={theme.colors.white} strokeWidth={2} />
            </View>

            {/* Header */}
            <Eyebrow label="// Recuperar acceso" />
            <Txt style={styles.title}>RECUPERA TU CUENTA</Txt>
            <Txt variant="body" color="textSecondary" style={styles.subtitle}>
              Escribe tu correo y te enviaremos un código de 6 dígitos para
              restablecer tu contraseña.
            </Txt>

            {/* Campo correo */}
            <View style={styles.field}>
              <TextField
                label="Correo"
                icon={IconMail}
                placeholder="tu@correo.com"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  if (error) setError(undefined);
                }}
                error={error}
              />
            </View>

            {/* CTA */}
            <AngularButton
              label="ENVIAR CÓDIGO"
              height={54}
              borderColor="#f04d60"
              style={styles.cta}
              onPress={handleSend}
            />

            {/* Volver a login */}
            <Pressable style={styles.back2} onPress={() => navigation.goBack()}>
              <Txt style={styles.backText}>«  Volver a iniciar sesión</Txt>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>

        <Txt variant="caption" color="textTertiary" style={styles.note}>
          Si no recibes el código, revisa spam o espera 60s para reenviar.
        </Txt>
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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'],
  },
  back: { marginTop: theme.spacing.md },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 99,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 34,
    lineHeight: 40,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  subtitle: { marginTop: theme.spacing.sm },
  field: { marginTop: theme.spacing['2xl'] },
  cta: { marginTop: theme.spacing.xl },
  back2: { alignSelf: 'center', marginTop: theme.spacing.xl },
  backText: {
    fontFamily: fonts.button,
    fontSize: 13,
    color: theme.colors.brandRedHover,
  },
  note: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing['3xl'],
    paddingBottom: theme.spacing.md,
  },
});
