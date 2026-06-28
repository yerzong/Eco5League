/**
 * OB-06b · Verificar código — fiel al diseño de Figma.
 * Paso 2 de 3: el usuario ingresa el código de 6 dígitos enviado a su correo.
 * Incluye modal de confirmación al intentar salir ("¿CANCELAR RECUPERACIÓN?").
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
import { IconMail } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { useExitConfirm } from '@/shared/hooks/useExitConfirm';
import { authService } from '@/services';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'RecuperarCodigo'>;

const CODE_LENGTH = 6;
const RESEND_SECONDS = 42;

export function RecuperarCodigoScreen({ navigation, route }: Props) {
  const { email } = route.params;
  // Cancelar la verificación → vuelve al inicio (Login).
  const exit = useExitConfirm({
    onConfirmExit: () =>
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [attempts, setAttempts] = useState(3);
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
    // Código correcto → crear nueva contraseña.
    navigation.navigate('NuevaContrasena', { email });
  };

  const mmss = `0:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.04} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <BackButton style={styles.back} />

        <View style={styles.body}>
          <AuthHeader
            icon={IconMail}
            eyebrow="// Verificar código"
            title="INGRESA TU CÓDIGO"
            subtitle={`Ingresa el código de 6 dígitos que enviamos a ${email}.`}
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
              autoFocus
            />
          </View>

          {/* Estado: error / reenviar */}
          {errorMsg ? (
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
            label="VERIFICAR"
            height={56}
            style={styles.cta}
            onPress={handleVerify}
          />

          <TextLink
            label="Cambiar correo electrónico"
            fontSize={12}
            style={styles.change}
            onPress={() => {
              exit.bypass();
              navigation.goBack();
            }}
          />
        </View>

        <Txt variant="caption" color="textTertiary" style={styles.note}>
          Revisa tu carpeta de spam si no ves el código en tu bandeja de entrada.
        </Txt>
      </SafeAreaView>

      <ConfirmModal
        visible={exit.visible}
        title="¿Cancelar recuperación?"
        body="Si sales ahora tendrás que solicitar un nuevo código para recuperar tu cuenta."
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
