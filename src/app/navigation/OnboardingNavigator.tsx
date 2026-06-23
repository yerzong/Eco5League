/**
 * Flujo de Acceso & Onboarding (página "00 · Acceso & Onboarding" en Figma).
 * Splash → Login → Crear cuenta → Completar perfil → Verificar OTP.
 * La tab bar NO aparece aquí.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { CrearCuentaScreen } from '@/features/auth/screens/CrearCuentaScreen';
import { CompletarPerfilScreen } from '@/features/auth/screens/CompletarPerfilScreen';
import { VerificarOtpScreen } from '@/features/auth/screens/VerificarOtpScreen';
import { RedesSocialesScreen } from '@/features/auth/screens/RedesSocialesScreen';
import { RecuperarAccesoScreen } from '@/features/auth/screens/RecuperarAccesoScreen';
import { RecuperarCodigoScreen } from '@/features/auth/screens/RecuperarCodigoScreen';
import { NuevaContrasenaScreen } from '@/features/auth/screens/NuevaContrasenaScreen';
import { ContrasenaRestablecidaScreen } from '@/features/auth/screens/ContrasenaRestablecidaScreen';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CrearCuenta" component={CrearCuentaScreen} />
      <Stack.Screen name="CompletarPerfil" component={CompletarPerfilScreen} />
      <Stack.Screen name="VerificarOtp" component={VerificarOtpScreen} />
      <Stack.Screen name="RecuperarAcceso" component={RecuperarAccesoScreen} />
      <Stack.Screen name="RecuperarCodigo" component={RecuperarCodigoScreen} />
      <Stack.Screen name="NuevaContrasena" component={NuevaContrasenaScreen} />
      <Stack.Screen
        name="ContrasenaRestablecida"
        component={ContrasenaRestablecidaScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="RedesSocialesModal"
        component={RedesSocialesScreen}
        options={{ presentation: 'transparentModal', animation: 'none' }}
      />
    </Stack.Navigator>
  );
}
