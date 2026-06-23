/**
 * OB-06c · Nueva contraseña — fiel al diseño de Figma.
 * Paso 3 de 3: el usuario crea su nueva contraseña (con requisitos en vivo).
 * Incluye modal de confirmación al intentar salir ("¿SALIR SIN GUARDAR?").
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
  Eyebrow,
  TextField,
  AngularButton,
  PasswordRules,
  ConfirmModal,
} from '@/design-system/components';
import { IconLock } from '@/design-system/icons';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import {
  validateStrongPassword,
  validatePasswordMatch,
} from '@/shared/utils/validation';
import { useExitConfirm } from '@/shared/hooks/useExitConfirm';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'NuevaContrasena'>;

export function NuevaContrasenaScreen({ navigation, route }: Props) {
  const { email } = route.params;
  // Salir cancela toda la recuperación → vuelve al inicio (Login).
  const exit = useExitConfirm({
    onConfirmExit: () =>
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
  });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {},
  );

  const clear = (k: 'password' | 'confirm') => {
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const handleSave = () => {
    const next = {
      password: validateStrongPassword(password),
      confirm: validatePasswordMatch(password, confirm),
    };
    setErrors(next);
    if (!next.password && !next.confirm) {
      exit.bypass();
      navigation.navigate('ContrasenaRestablecida', { email });
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

            {/* Badge */}
            <View style={styles.badge}>
              <IconLock size={26} color={theme.colors.white} strokeWidth={2} />
            </View>

            {/* Header */}
            <Eyebrow label="// Nueva contraseña" />
            <Txt style={styles.title}>CREA TU CONTRASEÑA</Txt>
            <Txt variant="body" color="textSecondary" style={styles.subtitle}>
              Tu identidad fue verificada. Elige una contraseña segura de mínimo
              8 caracteres.
            </Txt>

            {/* Campos */}
            <View style={styles.fields}>
              <View>
                <TextField
                  label="Nueva contraseña"
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
            </View>

            {/* CTA */}
            <AngularButton
              label="GUARDAR CONTRASEÑA"
              height={54}
              borderColor="#f04d60"
              style={styles.cta}
              onPress={handleSave}
            />

            <Txt variant="caption" color="textTertiary" style={styles.note}>
              Nunca compartas tu contraseña con nadie.
            </Txt>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ConfirmModal
        visible={exit.visible}
        title="¿SALIR SIN GUARDAR?"
        body="Tu contraseña no se ha actualizado. Tendrás que reiniciar el proceso de recuperación."
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
  fields: { marginTop: theme.spacing['2xl'], gap: theme.spacing.xl },
  cta: { marginTop: theme.spacing.xl },
  note: { textAlign: 'center', marginTop: theme.spacing.lg },
});
