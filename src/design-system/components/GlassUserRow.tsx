/**
 * Fila de usuario (rediseño glass): avatar coloreado + nombre (con verificado) /
 * correo + chip de rol + chevron. Genérica. (SAN ✦ Usuarios)
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { withAlpha } from '@/design-system/colorUtils';
import { IconChevronRight, IconCircleCheck } from '@/design-system/icons';
import { Txt } from './Txt';

interface GlassUserRowProps {
  initials: string;
  /** Color de acento del avatar (tinte + borde + iniciales). */
  color: string;
  name: string;
  verified?: boolean;
  /** Texto secundario (correo o @usuario). */
  subtitle: string;
  roleLabel: string;
  roleColor: string;
  onPress?: () => void;
}

export function GlassUserRow({
  initials,
  color,
  name,
  verified,
  subtitle,
  roleLabel,
  roleColor,
  onPress,
}: GlassUserRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: withAlpha(color, 0.16), borderColor: withAlpha(color, 0.5) },
        ]}>
        <Txt style={[styles.initials, { color }]}>{initials}</Txt>
      </View>
      <View style={styles.nameCol}>
        <View style={styles.nameRow}>
          <Txt style={styles.name} numberOfLines={1}>
            {name}
          </Txt>
          {verified ? <IconCircleCheck size={14} color="#34d77f" strokeWidth={2.2} /> : null}
        </View>
        <Txt style={styles.sub} numberOfLines={1}>
          {subtitle}
        </Txt>
      </View>
      <View
        style={[
          styles.roleChip,
          { backgroundColor: withAlpha(roleColor, 0.12), borderColor: withAlpha(roleColor, 0.3) },
        ]}>
        <Txt style={[styles.roleText, { color: roleColor }]} numberOfLines={1}>
          {roleLabel}
        </Txt>
      </View>
      <IconChevronRight size={16} color={theme.colors.textOnGlassFaint} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.glassTitle, fontSize: 13 },
  nameCol: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.glassBodySemibold, fontSize: 14.5, color: '#f6f6f8', flexShrink: 1 },
  sub: { fontFamily: fonts.glassBodyMedium, fontSize: 11.5, color: 'rgba(246,246,248,0.45)' },
  roleChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
  },
  roleText: { fontFamily: fonts.glassBodyBold, fontSize: 10.5 },
});
