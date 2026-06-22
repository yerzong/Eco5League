/**
 * Tipografía — extraída de los Text Styles de Figma.
 * Titulares/CTAs: Oswald. Cuerpo: Inter.
 * NOTA: las fuentes Oswald e Inter deben enlazarse al proyecto nativo
 * (react-native.config.js + npx react-native-asset) antes de verse correctas.
 */

export const fonts = {
  display: 'Oswald-Bold',
  heading: 'Oswald-SemiBold',
  headingBold: 'Oswald-Bold',
  button: 'Oswald-SemiBold',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  label: 'Inter-SemiBold',
} as const;

export const typography = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 40 },
  h1: { fontFamily: fonts.headingBold, fontSize: 42, lineHeight: 44 },
  h2: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 24 },
  title: { fontFamily: fonts.heading, fontSize: 18, lineHeight: 20 },
  sectionLabel: { fontFamily: fonts.heading, fontSize: 13, lineHeight: 16 },
  overline: { fontFamily: fonts.heading, fontSize: 10, lineHeight: 12 },
  button: { fontFamily: fonts.button, fontSize: 14 },
  buttonSm: { fontFamily: fonts.button, fontSize: 12 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24 },
  bodySm: { fontFamily: fonts.body, fontSize: 13, lineHeight: 21 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.body, fontSize: 11.5, lineHeight: 16 },
  label: { fontFamily: fonts.label, fontSize: 12, lineHeight: 16 },
} as const;

export type TypographyToken = keyof typeof typography;
