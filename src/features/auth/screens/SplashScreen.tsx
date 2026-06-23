/**
 * OB-01 · Splash — pantalla de marca de entrada.
 * Fiel al diseño de Figma (página "00 · Acceso & Onboarding").
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Txt,
  HexBadge,
  GlowBackground,
  AngularButton,
} from '@/design-system/components';
import { theme } from '@/design-system/theme';
import { fonts } from '@/design-system/tokens/typography';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <GlowBackground centerY={0.4} />
      {/* Línea diagonal de marca (rotada -18°), detrás del contenido */}
      <View style={styles.diagonal} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Bloque de marca */}
        <View style={styles.hero}>
          <HexBadge size={132}>
            <Txt style={styles.e5}>E5</Txt>
          </HexBadge>

          <Txt style={styles.wordmark}>ECO5</Txt>

          <View style={styles.esportsRow}>
            <View style={styles.esportsLine} />
            <Txt style={styles.esports}>E S P O R T S</Txt>
            <View style={styles.esportsLine} />
          </View>

          <Txt style={styles.tagline}>GEARS E-DAY  //  4V4  //  LIGA COMPETITIVA</Txt>
        </View>

        {/* CTA */}
        <AngularButton
          label="ENTRAR  »"
          onPress={() => navigation.navigate('Login')}
        />

        {/* Pie */}
        <View style={styles.footer}>
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Txt style={styles.status}>TEMPORADA 1 · EN VIVO</Txt>
          </View>
          <Txt style={styles.version}>[ v1.0 ]</Txt>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgOuter },
  diagonal: {
    position: 'absolute',
    top: '55%',
    left: -40,
    right: -40,
    height: 2,
    backgroundColor: theme.colors.brandRed,
    opacity: 0.7,
    transform: [{ rotate: '-18deg' }],
  },
  safe: {
    flex: 1,
    paddingHorizontal: theme.spacing['3xl'],
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
    fontSize: 46,
    lineHeight: 50,
    color: theme.colors.white,
    textAlign: 'center',
  },
  wordmark: {
    fontFamily: fonts.headingBold,
    fontSize: 64,
    lineHeight: 68,
    color: theme.colors.textPrimary,
    letterSpacing: 2,
    marginTop: theme.spacing.lg,
  },
  esportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  esportsLine: {
    width: 24,
    height: 3,
    backgroundColor: theme.colors.brandRed,
  },
  esports: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: theme.colors.brandRed,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: fonts.meta,
    fontSize: 12,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing['2xl'],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  status: {
    fontFamily: fonts.meta,
    fontSize: 11,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  version: {
    fontFamily: fonts.meta,
    fontSize: 11,
    color: theme.colors.textTertiary,
    letterSpacing: 1,
  },
});
