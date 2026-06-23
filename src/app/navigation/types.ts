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
  RedesSocialesModal: { onAdd?: (s: import('@/features/auth/socialNetworks').AddedSocial) => void } | undefined;
  // Recuperar contraseña (00b · Recuperar acceso)
  RecuperarAcceso: undefined;
  RecuperarCodigo: { email: string };
  NuevaContrasena: { email: string };
  ContrasenaRestablecida: { email: string };
};

export type AppTabParamList = Record<TabKey, undefined>;

/** Stack de la app autenticada: las tabs + pantallas que se abren del header. */
export type AppStackParamList = {
  Tabs: undefined;
  Notificaciones: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  App: undefined;
};
