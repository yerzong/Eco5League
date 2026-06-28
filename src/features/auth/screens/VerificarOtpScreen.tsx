/**
 * OB-05 · Verificación por teléfono (OTP) — rediseño "glass".
 * Fiel a Figma "📱 Verificar número ✦ glass". Misma lógica (verificar, reenviar,
 * intentos, verificado, salir con confirmación).
 */
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  GlowBackground,
  BackButton,
  OtpInput,
  AppButton,
  ConfirmModal,
} from '@/design-system/components';
import { IconPhone } from '@/design-system/icons';
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
    setVerified(true);
    setError(false);
    setErrorMsg(undefined);
  };

  const mmss = `0:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.0} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <BackButton glass />

          {/* Badge */}
          <View style={styles.badge}>
            <IconPhone size={26} color={theme.colors.redBright} strokeWidth={2} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Txt style={styles.eyebrow}>// VERIFICAR TELÉFONO</Txt>
            <Txt style={styles.title}>Confirma tu número</Txt>
            <Txt style={styles.subtitle}>
              Ingresa el código de 6 dígitos que enviamos por SMS a +52 55 1234 5678.
            </Txt>
          </View>

          {/* Casillas OTP */}
          <OtpInput
            glass
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

          {/* Estado: verificado / error / reenviar */}
          {verified ? (
            <Txt style={styles.verified}>✓  Número verificado</Txt>
          ) : errorMsg ? (
            <Txt style={styles.errorText}>{errorMsg}</Txt>
          ) : seconds > 0 ? (
            <Txt style={styles.resend}>Reenviar código en {mmss}</Txt>
          ) : (
            <Pressable onPress={() => setSeconds(RESEND_SECONDS)}>
              <Txt style={styles.resendActive}>Reenviar código</Txt>
            </Pressable>
          )}

          {/* CTA */}
          <AppButton
            label={verified ? 'Continuar' : 'Verificar'}
            onPress={
              verified
                ? () => {
                    exit.bypass();
                    navigation.goBack();
                  }
                : handleVerify
            }
          />

          <Pressable
            style={styles.change}
            onPress={() => {
              exit.bypass();
              navigation.goBack();
            }}>
            <Txt style={styles.changeText}>Cambiar número de teléfono</Txt>
          </Pressable>
        </View>

        <View style={styles.flex} />
        <Txt style={styles.note}>
          El teléfono es opcional; puedes confirmarlo más tarde desde tu perfil.
        </Txt>
      </SafeAreaView>

      <ConfirmModal
        visible={exit.visible}
        title="¿Cancelar verificación?"
        body="Tu número de teléfono no quedará verificado. Podrás verificarlo más tarde desde tu perfil."
        cancelLabel="Cancelar"
        confirmLabel="Sí, regresar"
        onCancel={exit.onCancel}
        onConfirm={exit.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  safe: { flex: 1, paddingHorizontal: theme.spacing['2xl'] },
  flex: { flex: 1 },
  content: { paddingTop: theme.spacing.md, gap: 22 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,59,82,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,82,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { gap: 6 },
  eyebrow: {
    fontFamily: fonts.glassBodyBold,
    fontSize: 11,
    color: 'rgba(255,59,82,0.9)',
    letterSpacing: 2,
  },
  title: {
    fontFamily: fonts.glassTitle,
    fontSize: 28,
    letterSpacing: -0.5,
    color: '#f6f6f8',
  },
  subtitle: {
    fontFamily: fonts.glassBodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textOnGlassDim,
  },
  resend: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.textOnGlassFaint },
  resendActive: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: theme.colors.redSoft },
  errorText: { fontFamily: fonts.glassBodyMedium, fontSize: 13, color: theme.colors.redSoft },
  verified: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: theme.colors.accentGreen },
  change: { alignSelf: 'center' },
  changeText: { fontFamily: fonts.glassBodyBold, fontSize: 13, color: theme.colors.redSoft },
  note: {
    textAlign: 'center',
    fontFamily: fonts.glassBodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(246,246,248,0.35)',
    paddingBottom: theme.spacing.md,
  },
});
