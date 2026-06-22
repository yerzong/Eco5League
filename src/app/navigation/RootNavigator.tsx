/**
 * Raíz de navegación: si no hay sesión → Onboarding; si la hay → App (tabs).
 */
import React from 'react';
import {
  DarkTheme,
  NavigationContainer,
  Theme as NavTheme,
} from '@react-navigation/native';
import { theme } from '@/design-system/theme';
import { useSession } from '@/shared/auth/SessionContext';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppTabs } from './tabs/AppTabs';

const navTheme: NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.bgBase,
    card: theme.colors.surface1,
    primary: theme.colors.brandRed,
    text: theme.colors.textPrimary,
    border: theme.colors.borderDefault,
  },
};

export function RootNavigator() {
  const { isAuthenticated } = useSession();
  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <AppTabs /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
