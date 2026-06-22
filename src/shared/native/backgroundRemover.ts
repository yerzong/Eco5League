/**
 * Puente al módulo nativo de quita-fondos (Vision, iOS 17+).
 * Devuelve la ruta de un PNG con el fondo recortado.
 */
import { NativeModules, Platform } from 'react-native';

const { BackgroundRemover } = NativeModules as {
  BackgroundRemover?: { removeBackground(uri: string): Promise<string> };
};

/** ¿Está disponible el quita-fondos en esta plataforma/OS? */
export const hasBackgroundRemover =
  Platform.OS === 'ios' && !!BackgroundRemover;

/** Recorta el fondo. Lanza si no hay sujeto o no está disponible. */
export async function removeBackground(uri: string): Promise<string> {
  if (!BackgroundRemover) {
    throw new Error('Quita-fondos no disponible en esta plataforma.');
  }
  return BackgroundRemover.removeBackground(uri);
}
