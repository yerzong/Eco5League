import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Placeholder } from '@/design-system/components';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'VerificarOtp'>;

export function VerificarOtpScreen(_props: Props) {
  return <Placeholder figmaRef="OB-05" title="Verificación por teléfono" subtitle="Código OTP" />;
}
