/**
 * Header de las pantallas principales SA (rediseño glass).
 * Título (Space Grotesk) + botón campana + botón avatar (con iniciales).
 * Reutilizable en Inicio · Eventos · Staff · Equipos · Usuarios.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { IconBell } from '@/design-system/icons';
import { Txt } from './Txt';

interface GlassScreenHeaderProps {
  title: string;
  initials: string;
  notifDot?: boolean;
  onNotifications?: () => void;
  onProfile?: () => void;
}

export function GlassScreenHeader({
  title,
  initials,
  notifDot = true,
  onNotifications,
  onProfile,
}: GlassScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <Txt style={styles.title} numberOfLines={1}>
        {title}
      </Txt>
      <View style={styles.actions}>
        <Pressable style={styles.bell} hitSlop={6} onPress={onNotifications}>
          <IconBell size={20} color={theme.colors.textOnGlass} strokeWidth={1.9} />
          {notifDot ? <View style={styles.dot} /> : null}
        </Pressable>
        <Pressable style={styles.avatar} hitSlop={6} onPress={onProfile}>
          <Txt style={styles.initials}>{initials}</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    flex: 1,
    fontFamily: fonts.glassTitle,
    fontSize: 34,
    letterSpacing: -0.5,
    color: '#f6f6f8',
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.redBright,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(82,18,28,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,70,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.glassTitle, fontSize: 13, letterSpacing: 0.5, color: '#ff808f' },
});
