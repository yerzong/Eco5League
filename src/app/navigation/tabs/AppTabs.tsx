/**
 * Tab bar inferior. Las pestañas se generan dinámicamente según el rol
 * de la sesión (hoja "Tab bar por rol"). Pestaña activa en rojo de marca.
 *
 * Usa una tab bar PERSONALIZADA con un indicador rojo que se desliza (spring)
 * a la pestaña activa y un leve rebote del ícono activo.
 *
 * Como las pestañas cambian por rol, usamos `key={role}` para forzar el
 * remontaje del navegador cuando el rol cambia (selector demo en Perfil).
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from '@/design-system/components';
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

const INDICATOR_W = 28;

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

/** Ícono de una pestaña con rebote sutil al activarse. */
function TabIcon({ Icon, focused, color }: { Icon: React.ComponentType<IconProps>; focused: boolean; color: string }) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0,
      friction: 6,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [focused, scale]);
  const s = scale.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  return (
    <Animated.View style={{ transform: [{ scale: s }] }}>
      <Icon size={24} color={color} strokeWidth={1.9} />
    </Animated.View>
  );
}

/** Tab bar personalizada con indicador deslizante. */
function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const count = state.routes.length;
  const tabW = width > 0 ? width / count : 0;

  const indicator = useRef(new Animated.Value(state.index)).current;
  useEffect(() => {
    Animated.spring(indicator, {
      toValue: state.index,
      friction: 14,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [state.index, indicator]);

  const translateX =
    count > 1 && tabW > 0
      ? indicator.interpolate({
          inputRange: state.routes.map((_, i) => i),
          outputRange: state.routes.map((_, i) => i * tabW + (tabW - INDICATOR_W) / 2),
        })
      : (tabW - INDICATOR_W) / 2;

  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom }]}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      {tabW > 0 ? (
        <Animated.View style={[styles.indicator, { transform: [{ translateX }] }]} />
      ) : null}

      <View style={styles.row}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const color = focused ? theme.colors.brandRedHover : theme.colors.textTertiary;
          const key = route.name as TabKey;
          const Icon = TAB_ICONS[key] ?? IconHome;
          const label = TAB_DEFS[key]?.label ?? route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable key={route.key} style={styles.item} onPress={onPress}>
              <TabIcon Icon={Icon} focused={focused} color={color} />
              <Txt style={[styles.label, { color }]}>{label}</Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AppTabs() {
  const { role } = useSession();
  const tabKeys = TABS_BY_ROLE[role];

  return (
    <Tab.Navigator
      key={role}
      screenOptions={{ headerShown: false, animation: 'shift' }}
      tabBar={AppTabBar}>
      {tabKeys.map(key => (
        <Tab.Screen key={key} name={key} component={TAB_SCREENS[key]} />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.navBar,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderDefault,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: INDICATOR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.brandRed,
  },
  row: { flexDirection: 'row', height: 80, paddingTop: 12, paddingBottom: 10 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 6 },
  label: { fontFamily: fonts.label, fontSize: 10, letterSpacing: 0.1 },
});
