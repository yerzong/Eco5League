/**
 * Tab bar inferior. Las pestañas se generan dinámicamente según el rol
 * de la sesión (hoja "Tab bar por rol"). Pestaña activa en rojo de marca.
 *
 * Como las pestañas cambian por rol, usamos `key={role}` para forzar el
 * remontaje del navegador cuando el rol cambia (selector demo en Perfil).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@/design-system/theme';
import { Txt } from '@/design-system/components';
import { useSession } from '@/shared/auth/SessionContext';
import { TABS_BY_ROLE, TAB_DEFS } from '@/shared/auth/roles';
import { TAB_SCREENS } from './tabScreens';

const Tab = createBottomTabNavigator();

export function AppTabs() {
  const { role } = useSession();
  const tabKeys = TABS_BY_ROLE[role];

  return (
    <Tab.Navigator
      key={role}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brandRed,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
      }}>
      {tabKeys.map(key => {
        const def = TAB_DEFS[key];
        const ScreenComp = TAB_SCREENS[key];
        return (
          <Tab.Screen
            key={key}
            name={def.label}
            component={ScreenComp}
            options={{
              // Ícono provisional: punto coloreado. Se sustituye al integrar
              // la librería de íconos (def.icon ya trae el nombre Tabler/Feather).
              tabBarIcon: ({ color }) => (
                <View style={[styles.dot, { backgroundColor: color }]} />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface1,
    borderTopColor: theme.colors.borderDefault,
  },
  label: {
    ...theme.typography.buttonSm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
