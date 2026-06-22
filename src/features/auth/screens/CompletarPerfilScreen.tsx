import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Placeholder } from '@/design-system/components';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CompletarPerfil'>;

export function CompletarPerfilScreen(_props: Props) {
  return <Placeholder figmaRef="OB-04" title="Completar perfil" subtitle="Datos, foto PNG, bio" />;
}
