/**
 * Encabezado estándar de las pantallas de onboarding/auth:
 * (insignia opcional) + eyebrow "// LABEL" + título grande + subtítulo.
 *
 * Centraliza el patrón que antes se copiaba en ~9 pantallas, manteniendo
 * el mismo ritmo de espaciado.
 */
import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import type { IconProps } from '@/design-system/icons';
import { Txt } from './Txt';
import { Eyebrow } from './Eyebrow';
import { CircleBadge } from './CircleBadge';

type IconCmp = React.ComponentType<IconProps>;

interface AuthHeaderProps {
  /** Texto del eyebrow, p. ej. "// Recuperar acceso". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Ícono de la insignia circular. Si se omite, no se muestra insignia. */
  icon?: IconCmp;
  /** Color de la insignia. Default rojo de marca. */
  badgeColor?: string;
  style?: ViewStyle;
  /** Permite ajustar el tamaño del título por pantalla (default 34). */
  titleStyle?: TextStyle;
}

export function AuthHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  badgeColor,
  style,
  titleStyle,
}: AuthHeaderProps) {
  return (
    <View style={style}>
      {icon ? (
        <CircleBadge icon={icon} color={badgeColor} style={styles.badge} />
      ) : null}
      <Eyebrow label={eyebrow} />
      <Txt variant="screenTitle" style={[styles.title, titleStyle] as TextStyle[]}>
        {title}
      </Txt>
      {subtitle ? (
        <Txt variant="body" color="textSecondary" style={styles.subtitle}>
          {subtitle}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { marginBottom: theme.spacing.xl },
  title: { color: theme.colors.textPrimary, marginTop: theme.spacing.xs },
  subtitle: { marginTop: theme.spacing.sm },
});
