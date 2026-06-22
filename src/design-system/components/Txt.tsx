/**
 * Texto tipado al sistema tipográfico. Evita repetir fontFamily/fontSize.
 * <Txt variant="h2">Título</Txt>
 */
import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { theme } from '@/design-system/theme';
import { TypographyToken } from '@/design-system/tokens/typography';
import { PaletteToken } from '@/design-system/tokens/colors';

interface TxtProps extends TextProps {
  variant?: TypographyToken;
  color?: PaletteToken;
  style?: TextStyle | TextStyle[];
}

export function Txt({
  variant = 'body',
  color = 'textPrimary',
  style,
  children,
  ...rest
}: TxtProps) {
  return (
    <Text
      style={[
        styles.base,
        theme.typography[variant],
        { color: theme.colors[color] },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.textPrimary,
  },
});
