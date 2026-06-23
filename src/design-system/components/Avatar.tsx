/**
 * Avatar circular con iniciales (o imagen, a futuro). Reutilizable en header,
 * perfil, listas de staff/equipos/usuarios. El fondo es el color de acento
 * con baja opacidad y las iniciales en el color sólido.
 */
import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { Txt } from './Txt';

interface AvatarProps {
  /** Iniciales a mostrar si no hay imagen (ej. "GG"). */
  initials?: string;
  /** URI de imagen; si se pasa, reemplaza las iniciales. */
  uri?: string;
  /** Diámetro en px. Default 40. */
  size?: number;
  /** Color de acento (texto + tinte de fondo). Default rojo de marca. */
  color?: string;
  style?: ViewStyle;
}

export function Avatar({
  initials,
  uri,
  size = 40,
  color = theme.colors.brandRed,
  style,
}: AvatarProps) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[dim, style as ImageStyle]} />;
  }
  return (
    <View style={[styles.wrap, dim, { backgroundColor: color + '2e' }, style]}>
      <Txt style={[styles.initials, { color, fontSize: Math.round(size * 0.36) }]}>
        {initials}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: theme.fonts.headingBold },
});
