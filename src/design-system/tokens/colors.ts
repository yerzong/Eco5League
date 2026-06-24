/**
 * Color tokens — extraídos de la colección "ECO5 Tokens" en Figma.
 * Fuente de verdad: página "🎨 Design System".
 * No hardcodear hex en pantallas; siempre referir estos tokens vía el theme.
 */

export const palette = {
  // Fondos
  bgOuter: '#08090b',
  bgBase: '#0e0f12',
  surface1: '#16181d',
  surface2: '#1c1f26',
  /** Superficie hundida para listas densas (cards de Usuarios). */
  surfaceSunken: '#121419',

  // Bordes
  borderDefault: '#2a2e37',
  borderStrong: '#3a3f4a',
  /** Borde sutil para superficies hundidas (Usuarios). */
  borderSubtle: '#262a31',

  // Marca
  brandRed: '#c8102e',
  brandRedHover: '#e11d33',
  /** Borde claro de los botones angulares (CTA). */
  brandRedBorder: '#f04d60',

  // Texto
  textPrimary: '#f2f3f5',
  textSecondary: '#9aa0aa',
  textTertiary: '#5e6571',
  textGunmetal: '#8a9099',

  // Estados
  success: '#3e9c5f',
  warning: '#e0a526',
  danger: '#c8102e',

  // Acentos de dashboard / categorías (valores exactos del diseño SA)
  accentGreen: '#2ea846',
  accentAmber: '#e8a020',
  navBar: '#0a0b0e',
  surfacePill: '#1f2228',

  // Blanco base
  white: '#ffffff',
} as const;

/**
 * Color por rol — para badges, acentos y tab activo contextual.
 * Coincide con role/* del Excel "Matriz de permisos".
 */
export const roleColors = {
  visitante: '#8a9099',
  jugador: '#c8102e',
  capitan: '#e0a526',
  coach: '#2a6fdb',
  manager: '#3e9c5f',
  colaborador: '#7a4fc0', // staff
  admin: '#b0452b',
  superadmin: '#c8102e',
} as const;

/**
 * Color por categoría de notificación / tarea / actividad.
 * Coincide con las etiquetas del centro de alertas y el dashboard.
 */
export const categoryColors = {
  inscripcion: '#2ea846', // verde
  transferencia: '#e8a020', // ámbar
  resultado: '#c8102e', // rojo de marca
  sistema: '#5e6571', // gris
} as const;

export type CategoryKey = keyof typeof categoryColors;

/** Colores oficiales de proveedores de login (para botones sociales). */
export const providerColors = {
  xbox: '#107c10',
  discord: '#5865f2',
  google: '#ffffff',
  apple: '#000000',
} as const;

export type PaletteToken = keyof typeof palette;
