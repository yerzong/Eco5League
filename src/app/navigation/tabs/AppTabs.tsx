/**
 * Tab bar inferior (rediseño "glass", fiel a Figma 580:3366). Las pestañas se
 * generan dinámicamente según el rol de la sesión (hoja "Tab bar por rol").
 *
 * Es una PÍLDORA FLOTANTE de vidrio (rounded 26, fondo translúcido, borde
 * sutil y sombra) que se superpone al contenido. La pestaña activa va en rojo
 * (Manrope Bold) y las inactivas en gris (Manrope SemiBold); el ícono activo
 * tiene un leve rebote (spring). Sin barra-indicador (no existe en el diseño).
 *
 * Como las pestañas cambian por rol, usamos `key={role}` para forzar el
 * remontaje del navegador cuando el rol cambia (selector demo en Perfil).
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
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

/** Colores del navbar glass (fieles a Figma). */
const ACTIVE_COLOR = '#ff5f73';
const INACTIVE_COLOR = '#5b616b';

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
  const s = scale.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  return (
    <Animated.View style={{ transform: [{ scale: s }] }}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.2 : 1.9} />
    </Animated.View>
  );
}

/** Tab bar personalizada: píldora flotante de vidrio (sin indicador). */
function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}
      pointerEvents="box-none">
      {/* Contenedor de la píldora: borde + sombra + overflow:hidden para el blur. */}
      <View style={styles.pillContainer}>
        {/* Capa de blur (backdrop-blur-[14px] de Figma). */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={14}
          reducedTransparencyFallbackColor="rgba(20,20,24,0.92)"
        />
        {/* Tinte de color encima del blur (rgba(20,20,24,0.55) de Figma). */}
        <View style={styles.pillTint} />
        {/* Highlight interior superior (inset 1px de Figma). */}
        <View style={styles.innerHighlight} pointerEvents="none" />

        {/* Items de las pestañas. */}
        <View style={styles.pillRow}>
          {state.routes.map((route, i) => {
            const focused = state.index === i;
            const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;
            const key = route.name as TabKey;
            const Icon = TAB_ICONS[key] ?? IconHome;
            const label = TAB_DEFS[key]?.label ?? route.name;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            return (
              <Pressable key={route.key} style={styles.item} onPress={onPress} hitSlop={6}>
                <TabIcon Icon={Icon} focused={focused} color={color} />
                <Txt
                  style={[
                    styles.label,
                    { color, fontFamily: focused ? fonts.glassBodyBold : fonts.glassBodySemibold },
                  ]}>
                  {label}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/** Render estable de la tab bar (a nivel de módulo: se monta como componente
 *  — hooks válidos — y no se recrea en cada render). */
const renderTabBar = (props: BottomTabBarProps) => <AppTabBar {...props} />;

export function AppTabs() {
  const { role } = useSession();
  const tabKeys = TABS_BY_ROLE[role];

  return (
    <Tab.Navigator
      key={role}
      screenOptions={{ headerShown: false, animation: 'shift' }}
      tabBar={renderTabBar}>
      {tabKeys.map(key => (
        <Tab.Screen key={key} name={key} component={TAB_SCREENS[key]} />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Contenedor flotante: sin fondo, deja pasar los toques fuera de la píldora.
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Contenedor externo: borde, sombra, overflow:hidden (necesario para que el
  // BlurView quede recortado al borderRadius del pill).
  pillContainer: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 24,
    overflow: 'hidden',
  },
  // Tinte de color sobre el blur (rgba(20,20,24,0.55) de Figma 580:3366).
  pillTint: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20,20,24,0.40)',
  },
  // Highlight de 1px en el borde superior — simula el inset shadow de Figma.
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  // Fila real de items (encima de todas las capas de fondo).
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  label: { fontSize: 10, lineHeight: 13, letterSpacing: 0.1 },
});
