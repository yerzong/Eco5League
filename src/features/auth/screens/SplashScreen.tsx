/**
 * OB-01 · Splash — pantalla de marca (rediseño "glass").
 * Fondo profundo con glows rojos, emblema hexagonal, pill de temporada glass
 * y CTA primario con degradado. Fiel a Figma "🔐 Acceso ✦ glass".
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  HexBadge,
  GlowBackground,
  AppButton,
} from '@/design-system/components';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <GlowBackground size={520} centerY={0.32} />
      <GlowBackground size={300} centerY={0.74} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Bloque de marca */}
        <View style={styles.hero}>
          <HexBadge size={140}>
            <Txt style={styles.e5}>E5</Txt>
          </HexBadge>

          <Txt style={styles.wordmark}>ECO5</Txt>

          <View style={styles.esportsRow}>
            <View style={styles.esportsLine} />
            <Txt style={styles.esports}>E S P O R T S</Txt>
            <View style={styles.esportsLine} />
          </View>

          <Txt style={styles.tagline}>GEARS E-DAY  //  4V4  //  LIGA COMPETITIVA</Txt>

          <View style={styles.season}>
            <View style={styles.dot} />
            <Txt style={styles.seasonText}>TEMPORADA 1 · EN VIVO</Txt>
          </View>
        </View>

        {/* CTA + versión */}
        <View style={styles.footer}>
          <AppButton label="Entrar" onPress={() => navigation.navigate('Login')} />
          <Txt style={styles.version}>[ v1.0 ]</Txt>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgDeep },
  safe: {
    flex: 1,
    paddingHorizontal: theme.spacing['2xl'],
    paddingBottom: theme.spacing.xl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  e5: {
    fontFamily: fonts.headingBold,
    fontSize: 50,
    lineHeight: 56,
    color: theme.colors.white,
    textAlign: 'center',
  },
  wordmark: {
    fontFamily: fonts.headingBold,
    fontSize: 64,
    lineHeight: 70,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    marginTop: theme.spacing.sm,
  },
  esportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  esportsLine: { width: 24, height: 3, backgroundColor: theme.colors.brandRed },
  esports: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: theme.colors.brandRed,
    letterSpacing: 5,
  },
  tagline: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: theme.colors.textOnGlassDim,
    letterSpacing: 2,
    textAlign: 'center',
  },
  season: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.glassFill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 8,
    marginTop: theme.spacing.xs,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.success },
  seasonText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: theme.colors.textOnGlass,
    letterSpacing: 1.5,
  },
  footer: { gap: theme.spacing.lg, alignItems: 'center' },
  version: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: theme.colors.textOnGlassFaint,
    letterSpacing: 1,
  },
});
