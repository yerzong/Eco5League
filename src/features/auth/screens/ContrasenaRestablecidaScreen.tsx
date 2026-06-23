/**
 * OB-06d · Contraseña restablecida (éxito) — fiel al diseño de Figma.
 * Pantalla terminal del flujo de recuperación. "INICIAR SESIÓN" limpia el
 * stack y regresa a Login (sin pasar por los modales de los pasos previos).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  GlowBackground,
  AuthHeader,
  TextField,
  AngularButton,
  TextLink,
} from '@/design-system/components';
import { IconCircleCheck, IconMail } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'ContrasenaRestablecida'
>;

export function ContrasenaRestablecidaScreen({ navigation, route }: Props) {
  const { email } = route.params;

  // Limpia todo el flujo de recuperación y deja Login como única pantalla.
  const goToLogin = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  return (
    <View style={styles.root}>
      <GlowBackground size={440} centerY={0.04} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.body}>
          <AuthHeader
            icon={IconCircleCheck}
            eyebrow="// Acceso recuperado"
            title="¡LISTO!"
            subtitle="Tu contraseña fue actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña."
          />

          {/* Correo (solo lectura) */}
          <View style={styles.field}>
            <TextField label="Correo" icon={IconMail} disabled value={email} />
          </View>

          {/* CTA */}
          <AngularButton
            label="INICIAR SESIÓN"
            height={54}
            style={styles.cta}
            onPress={goToLogin}
          />

          <TextLink
            label="«  Volver a iniciar sesión"
            onPress={goToLogin}
            style={styles.link}
          />
        </View>

        <Txt variant="caption" color="textTertiary" style={styles.note}>
          Si no realizaste este cambio, contacta a soporte de inmediato.
        </Txt>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  safe: { flex: 1, paddingHorizontal: theme.spacing['3xl'] },
  body: { flex: 1, paddingTop: theme.spacing['4xl'] },
  field: { marginTop: theme.spacing['2xl'] },
  cta: { marginTop: theme.spacing.xl },
  link: { marginTop: theme.spacing.xl },
  note: { textAlign: 'center', paddingBottom: theme.spacing.md },
});
