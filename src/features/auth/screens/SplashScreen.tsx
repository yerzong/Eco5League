import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Txt, Button } from '@/design-system/components';
import { theme } from '@/design-system/theme';
import type { OnboardingStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Txt variant="overline" color="brandRed">
          OB-01 · SPLASH
        </Txt>
        <Txt variant="display">ECO 5</Txt>
        <Txt variant="title" color="textSecondary">
          ESPORTS
        </Txt>
      </View>
      <Button label="Comenzar" onPress={() => navigation.navigate('Login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
});
