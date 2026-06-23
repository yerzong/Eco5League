/**
 * OB-06d · Contraseña restablecida (éxito) — fiel al diseño de Figma.
 * Pantalla terminal del flujo de recuperación. "INICIAR SESIÓN" limpia el
 * stack y regresa a Login (sin pasar por los modales de los pasos previos).
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  GlowBackground,
  Eyebrow,
  TextField,
  AngularButton,
} from '@/design-system/components';
import { IconCircleCheck, IconMail } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
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
          {/* Badge éxito */}
          <View style={styles.badge}>
            <IconCircleCheck size={30} color={theme.colors.white} strokeWidth={2} />
          </View>

          {/* Header */}
          <Eyebrow label="// Acceso recuperado" />
          <Txt style={styles.title}>¡LISTO!</Txt>
          <Txt variant="body" color="textSecondary" style={styles.subtitle}>
            Tu contraseña fue actualizada exitosamente. Ya puedes iniciar sesión
            con tu nueva contraseña.
          </Txt>

          {/* Correo (solo lectura) */}
          <View style={styles.field}>
            <TextField
              label="Correo"
              icon={IconMail}
              disabled
              value={email}
            />
          </View>

          {/* CTA */}
          <AngularButton
            label="INICIAR SESIÓN"
            height={54}
            borderColor="#f04d60"
            style={styles.cta}
            onPress={goToLogin}
          />

          {/* Volver a login */}
          <Pressable style={styles.back} onPress={goToLogin}>
            <Txt style={styles.backText}>«  Volver a iniciar sesión</Txt>
          </Pressable>
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
  field: { marginTop: theme.spacing['2xl'] },
  cta: { marginTop: theme.spacing.xl },
  back: { alignSelf: 'center', marginTop: theme.spacing.xl },
  backText: {
    fontFamily: fonts.button,
    fontSize: 13,
    color: theme.colors.brandRedHover,
  },
  note: { textAlign: 'center', paddingBottom: theme.spacing.md },
});
