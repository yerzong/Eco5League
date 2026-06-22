import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Txt, Button } from '@/design-system/components';
import { theme } from '@/design-system/theme';
import { useSession } from '@/shared/auth/SessionContext';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useSession();
  return (
    <Screen>
      <View style={styles.body}>
        <Txt variant="overline" color="brandRed">
          OB-02 · LOGIN
        </Txt>
        <Txt variant="h2">Inicia sesión</Txt>
        <Txt variant="bodySm" color="textSecondary">
          Discord · Xbox · Google · Apple · correo
        </Txt>
      </View>
      <View style={styles.actions}>
        {/* Entrar directo a la app (provisional para maquetado) */}
        <Button label="Entrar (demo)" onPress={() => signIn()} />
        <Button
          label="Crear cuenta"
          variant="secondary"
          onPress={() => navigation.navigate('CrearCuenta')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
});
