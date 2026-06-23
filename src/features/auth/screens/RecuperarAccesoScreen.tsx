/**
 * OB-06a · Recuperar acceso (correo) — fiel al diseño de Figma.
 * Paso 1 de 3: el usuario escribe su correo y se le envía un código.
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
  AuthHeader,
  TextField,
  AngularButton,
  TextLink,
} from '@/design-system/components';
import { IconLock, IconMail } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { validateEmail } from '@/shared/utils/validation';
import { authService } from '@/services';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'RecuperarAcceso'>;

export function RecuperarAccesoScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const formatErr = validateEmail(email);
    if (formatErr) {
      setError(formatErr);
      return;
    }
    setLoading(true);
    try {
      const registered = await authService.isEmailRegistered(email);
      if (!registered) {
        setError('Este correo no está registrado. Verifica tus datos.');
        return;
      }
      await authService.requestPasswordReset(email);
      setError(undefined);
      navigation.navigate('RecuperarCodigo', { email: email.trim() });
    } finally {
      setLoading(false);
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
            <BackButton style={styles.back} />

            <AuthHeader
              style={styles.header}
              icon={IconLock}
              eyebrow="// Recuperar acceso"
              title="RECUPERA TU CUENTA"
              subtitle="Escribe tu correo y te enviaremos un código de 6 dígitos para restablecer tu contraseña."
            />

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

            <AngularButton
              label={loading ? 'ENVIANDO…' : 'ENVIAR CÓDIGO'}
              height={54}
              style={styles.cta}
              onPress={handleSend}
            />

            <TextLink
              label="«  Volver a iniciar sesión"
              onPress={() => navigation.goBack()}
              style={styles.link}
            />
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
  header: { marginTop: theme.spacing.xl },
  field: { marginTop: theme.spacing['2xl'] },
  cta: { marginTop: theme.spacing.xl },
  link: { marginTop: theme.spacing.xl },
  note: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing['3xl'],
    paddingBottom: theme.spacing.md,
  },
});
