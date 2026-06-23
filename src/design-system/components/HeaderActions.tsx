/**
 * Acciones del encabezado (esquina superior derecha): campana de
 * notificaciones (con punto de no leídas) + avatar del usuario.
 * Reutilizable en todas las pantallas con barra superior.
 */
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { IconBell } from '@/design-system/icons';
import { IconButton } from './IconButton';
import { Avatar } from './Avatar';

interface HeaderActionsProps {
  initials: string;
  onNotifications?: () => void;
  onProfile?: () => void;
  /** Punto rojo en la campana si hay notificaciones sin leer. */
  hasUnread?: boolean;
  style?: ViewStyle;
}

export function HeaderActions({
  initials,
  onNotifications,
  onProfile,
  hasUnread = true,
  style,
}: HeaderActionsProps) {
  return (
    <View style={[styles.row, style]}>
      <IconButton icon={IconBell} onPress={onNotifications} badge={hasUnread} />
      <Pressable onPress={onProfile} hitSlop={6} style={styles.avatarBtn}>
        <Avatar initials={initials} size={40} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  avatarBtn: { borderRadius: 20 },
});
