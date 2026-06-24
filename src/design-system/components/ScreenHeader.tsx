/**
 * Encabezado fijo de pantallas de gestión: eyebrow + título (con meta opcional)
 * + acciones (campana + avatar). Reutilizable en Eventos, Staff, Equipos…
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import { Txt } from './Txt';
import { Eyebrow } from './Eyebrow';
import { HeaderActions } from './HeaderActions';

interface ScreenHeaderProps {
  eyebrow: string;
  title: string;
  /** Texto secundario junto al título (ej. "24 registrados"). */
  meta?: string;
  initials: string;
  onNotifications?: () => void;
  onProfile?: () => void;
  style?: ViewStyle;
}

export function ScreenHeader({
  eyebrow,
  title,
  meta,
  initials,
  onNotifications,
  onProfile,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.wrap, style]}>
      <Eyebrow label={eyebrow} />
      <View style={styles.row}>
        <View style={styles.titleCluster}>
          <Txt style={styles.title}>{title}</Txt>
          {meta ? <Txt style={styles.meta}>{meta}</Txt> : null}
        </View>
        <HeaderActions
          initials={initials}
          onNotifications={onNotifications}
          onProfile={onProfile}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCluster: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.textPrimary,
  },
  meta: { fontFamily: fonts.label, fontSize: 13, color: theme.colors.textTertiary },
});
