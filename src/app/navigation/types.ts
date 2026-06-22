/**
 * Tipos de los param lists de navegación.
 * Tipar las rutas evita errores de navegación y da autocompletado.
 */
import { TabKey } from '@/shared/auth/roles';

export type OnboardingStackParamList = {
  Splash: undefined;
  Login: undefined;
  CrearCuenta: undefined;
  CompletarPerfil: undefined;
  VerificarOtp: { phone?: string } | undefined;
  RedesSocialesModal: undefined;
};

export type AppTabParamList = Record<TabKey, undefined>;

export type RootStackParamList = {
  Onboarding: undefined;
  App: undefined;
};
