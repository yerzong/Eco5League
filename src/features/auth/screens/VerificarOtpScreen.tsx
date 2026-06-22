/**
 * OB-05 · Verificación por teléfono (OTP) — fiel al diseño de Figma.
 */
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  GlowBackground,
  CornerBrackets,
  BackButton,
  Eyebrow,
  OtpInput,
  AngularButton,
} from '@/design-system/components';
import { IconMessage } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useSession } from '@/shared/auth/SessionContext';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'VerificarOtp'>;

const CODE_LENGTH = 6;
const RESEND_SECONDS = 42;

export function VerificarOtpScreen({ navigation }: Props) {
  const { signIn } = useSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleVerify = () => {
    if (code.length < CODE_LENGTH) {
      setError(true);
      return;
    }
    signIn();
  };

  const mmss = `0:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.04} />
      <CornerBrackets bottom={false} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <BackButton style={styles.back} />

        <View style={styles.body}>
          {/* Badge */}
          <View style={styles.badge}>
            <IconMessage size={26} color={theme.colors.white} strokeWidth={2} />
          </View>

          {/* Header */}
          <Eyebrow label="// Verificar teléfono" />
          <Txt style={styles.title}>CONFIRMA TU NÚMERO</Txt>
          <Txt variant="body" color="textSecondary" style={styles.subtitle}>
            Ingresa el código de 6 dígitos que enviamos por SMS a +52 55 1234
            5678.
          </Txt>

          {/* Casillas OTP */}
          <View style={styles.otp}>
            <OtpInput
              value={code}
              onChangeText={c => {
                setCode(c);
                if (error) setError(false);
              }}
              error={error}
              autoFocus
            />
          </View>

          {/* Reenviar */}
          {seconds > 0 ? (
            <Txt variant="bodySm" color="textSecondary" style={styles.resend}>
              Reenviar código en {mmss}
            </Txt>
          ) : (
            <Pressable onPress={() => setSeconds(RESEND_SECONDS)}>
              <Txt variant="bodySm" style={styles.resendActive}>
                Reenviar código
              </Txt>
            </Pressable>
          )}

          {/* CTA */}
          <AngularButton
            label="VERIFICAR"
            height={56}
            borderColor="#f04d60"
            style={styles.cta}
            onPress={handleVerify}
          />

          <Pressable style={styles.change} onPress={() => navigation.goBack()}>
            <Txt style={styles.changeText}>Cambiar número de teléfono</Txt>
          </Pressable>
        </View>

        <Txt variant="caption" color="textTertiary" style={styles.note}>
          El teléfono es opcional; puedes confirmarlo más tarde desde tu perfil.
        </Txt>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1, paddingHorizontal: theme.spacing['3xl'] },
  back: { marginTop: theme.spacing.md },
  body: { flex: 1, paddingTop: theme.spacing.xl },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 99,
    backgroundColor: theme.colors.brandRed,
    alignItems: 'center',
    justifyContent: 'center',
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
  otp: { marginTop: theme.spacing['2xl'] },
  resend: { textAlign: 'center', marginTop: theme.spacing.lg },
  resendActive: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.brandRedHover,
    fontFamily: fonts.button,
  },
  cta: { marginTop: theme.spacing.xl },
  change: { alignSelf: 'center', marginTop: theme.spacing.lg },
  changeText: {
    fontFamily: fonts.meta,
    fontSize: 12,
    color: theme.colors.brandRedHover,
    letterSpacing: 0.5,
  },
  note: { textAlign: 'center', paddingBottom: theme.spacing.md },
});
