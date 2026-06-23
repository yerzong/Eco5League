/**
 * Navegador de la app autenticada. Envuelve la tab bar en un stack para
 * poder abrir Notificaciones y Perfil encima (desde el header), sin que
 * sean pestañas.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './tabs/AppTabs';
import { NotificacionesScreen } from '@/features/notificaciones/screens/NotificacionesScreen';
import { PerfilScreen } from '@/features/perfil/screens/PerfilScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
