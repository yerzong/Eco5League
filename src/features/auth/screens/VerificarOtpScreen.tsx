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
  BackButton,
  AuthHeader,
  OtpInput,
  AngularButton,
  ConfirmModal,
  TextLink,
} from '@/design-system/components';
import { IconMessage } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useExitConfirm } from '@/shared/hooks/useExitConfirm';
import { authService } from '@/services';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'VerificarOtp'>;

const CODE_LENGTH = 6;
const RESEND_SECONDS = 42;

export function VerificarOtpScreen({ navigation }: Props) {
  const exit = useExitConfirm();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [attempts, setAttempts] = useState(3);
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleVerify = async () => {
    if (code.length < CODE_LENGTH) {
      setError(true);
      return;
    }
    const valid = await authService.verifyCode(code);
    if (!valid) {
      const left = Math.max(attempts - 1, 0);
      setAttempts(left);
      setError(true);
      setErrorMsg(`Código incorrecto. Quedan ${left} intentos.`);
      return;
    }
    // Código correcto → número verificado.
    setVerified(true);
    setError(false);
    setErrorMsg(undefined);
  };

  const mmss = `0:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.04} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <BackButton style={styles.back} />

        <View style={styles.body}>
          <AuthHeader
            icon={IconMessage}
            eyebrow="// Verificar teléfono"
            title="CONFIRMA TU NÚMERO"
            subtitle="Ingresa el código de 6 dígitos que enviamos por SMS a +52 55 1234 5678."
          />

          {/* Casillas OTP */}
          <View style={styles.otp}>
            <OtpInput
              value={code}
              onChangeText={c => {
                setCode(c);
                if (error) {
                  setError(false);
                  setErrorMsg(undefined);
                }
              }}
              error={error}
              editable={!verified}
              autoFocus
            />
          </View>

          {/* Estado: verificado / error / reenviar */}
          {verified ? (
            <Txt variant="bodySm" style={styles.verified}>
              ✓  Número verificado
            </Txt>
          ) : errorMsg ? (
            <Txt variant="bodySm" color="danger" style={styles.resend}>
              {errorMsg}
            </Txt>
          ) : seconds > 0 ? (
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
            label={verified ? 'CONTINUAR' : 'VERIFICAR'}
            height={56}
            style={styles.cta}
            onPress={
              verified
                ? () => {
                    exit.bypass();
                    navigation.goBack();
                  }
                : handleVerify
            }
          />

          <TextLink
            label="Cambiar número de teléfono"
            fontSize={12}
            style={styles.change}
            onPress={() => {
              exit.bypass();
              navigation.goBack();
            }}
          />
        </View>

        <Txt variant="caption" color="textTertiary" style={styles.note}>
          El teléfono es opcional; puedes confirmarlo más tarde desde tu perfil.
        </Txt>
      </SafeAreaView>

      <ConfirmModal
        visible={exit.visible}
        title="¿Cancelar verificación?"
        body="Tu número de teléfono no quedará verificado. Podrás verificarlo más tarde desde tu perfil."
        cancelLabel="Cancelar"
        confirmLabel="Sí, salir"
        onCancel={exit.onCancel}
        onConfirm={exit.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1, paddingHorizontal: theme.spacing['3xl'] },
  back: { marginTop: theme.spacing.md },
  body: { flex: 1, paddingTop: theme.spacing.xl },
  otp: { marginTop: theme.spacing['2xl'] },
  resend: { textAlign: 'center', marginTop: theme.spacing.lg },
  verified: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.success,
    fontFamily: fonts.button,
  },
  resendActive: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.brandRedHover,
    fontFamily: fonts.button,
  },
  cta: { marginTop: theme.spacing.xl },
  change: { marginTop: theme.spacing.lg },
  note: { textAlign: 'center', paddingBottom: theme.spacing.md },
});
