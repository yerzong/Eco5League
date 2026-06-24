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
  /** Relleno sólido del color con iniciales blancas (en vez de tinte). */
  solid?: boolean;
  /** Fuente de las iniciales: 'heading' (Oswald, default) o 'body' (Inter). */
  font?: 'heading' | 'body';
  style?: ViewStyle;
}

export function Avatar({
  initials,
  uri,
  size = 40,
  color = theme.colors.brandRed,
  solid = false,
  font = 'heading',
  style,
}: AvatarProps) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[dim, style as ImageStyle]} />;
  }
  const bg = solid ? color : color + '2e';
  const fg = solid ? theme.colors.white : color;
  const fontFamily = font === 'body' ? theme.fonts.label : theme.fonts.headingBold;
  return (
    <View style={[styles.wrap, dim, { backgroundColor: bg }, style]}>
      <Txt style={[styles.initials, { fontFamily, color: fg, fontSize: Math.round(size * 0.32) }]}>
        {initials}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: theme.fonts.headingBold },
});
