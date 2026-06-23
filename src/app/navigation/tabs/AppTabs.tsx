/**
 * Tab bar inferior. Las pestañas se generan dinámicamente según el rol
 * de la sesión (hoja "Tab bar por rol"). Pestaña activa en rojo de marca.
 *
 * Como las pestañas cambian por rol, usamos `key={role}` para forzar el
 * remontaje del navegador cuando el rol cambia (selector demo en Perfil).
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@/design-system/theme';
import {
  IconHome,
  IconSearch,
  IconUsers,
  IconUsersGroup,
  IconMailbox,
  IconDeviceGamepad2,
  IconCalendarEvent,
  IconHeadset,
  IconShield,
  IconChecklist,
  IconLayoutDashboard,
  type IconProps,
} from '@/design-system/icons';
import { useSession } from '@/shared/auth/SessionContext';
import { TABS_BY_ROLE, TAB_DEFS, TabKey } from '@/shared/auth/roles';
import { TAB_SCREENS } from './tabScreens';

const Tab = createBottomTabNavigator();

/** TabKey → ícono Tabler. */
const TAB_ICONS: Record<TabKey, React.ComponentType<IconProps>> = {
  inicio: IconHome,
  buscarOrg: IconSearch,
  miOrg: IconUsers,
  invitaciones: IconMailbox,
  partidas: IconDeviceGamepad2,
  tareas: IconChecklist,
  gestion: IconLayoutDashboard,
  eventos: IconCalendarEvent,
  staff: IconHeadset,
  equipos: IconShield,
  usuarios: IconUsersGroup,
};

export function AppTabs() {
  const { role } = useSession();
  const tabKeys = TABS_BY_ROLE[role];

  return (
    <Tab.Navigator
      key={role}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brandRedHover,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}>
      {tabKeys.map(key => {
        const def = TAB_DEFS[key];
        const ScreenComp = TAB_SCREENS[key];
        const Icon = TAB_ICONS[key];
        return (
          <Tab.Screen
            key={key}
            name={def.label}
            component={ScreenComp}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon size={24} color={color} strokeWidth={1.9} />
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
    backgroundColor: theme.colors.navBar,
    borderTopColor: theme.colors.borderDefault,
    height: 80,
    paddingTop: 8,
  },
  item: { paddingTop: 6 },
  label: { ...theme.typography.buttonSm, fontSize: 10, marginTop: 2 },
});
