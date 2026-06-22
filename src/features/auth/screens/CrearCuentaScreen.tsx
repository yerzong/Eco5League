import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Placeholder } from '@/design-system/components';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CrearCuenta'>;

export function CrearCuentaScreen(_props: Props) {
  return <Placeholder figmaRef="OB-03" title="Crear cuenta" subtitle="Registro de usuario" />;
}
