/**
 * Providers globales de la app. Se anidan aquí para mantener App.tsx limpio.
 * A futuro: QueryClientProvider, ThemeProvider, etc.
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '@/shared/auth/SessionContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <SessionProvider>{children}</SessionProvider>
    </SafeAreaProvider>
  );
}
