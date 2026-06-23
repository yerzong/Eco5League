/**
 * Theme central. Punto único de consumo de tokens en toda la app.
 * import { theme } from '@/design-system/theme';
 */
import { palette, roleColors, providerColors, categoryColors } from './tokens/colors';
import { typography, fonts } from './tokens/typography';
import { spacing, radius } from './tokens/spacing';

export const theme = {
  colors: palette,
  roleColors,
  providerColors,
  categoryColors,
  typography,
  fonts,
  spacing,
  radius,
} as const;

export type Theme = typeof theme;
export { palette, roleColors, providerColors, categoryColors, typography, fonts, spacing, radius };
