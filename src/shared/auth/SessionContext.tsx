/**
 * Estado de sesión global (maquetado).
 * De momento vive en memoria; luego se conecta al backend / almacenamiento seguro.
 * Permite simular login y cambiar de rol para probar la navegación por rol.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Role } from './roles';

interface SessionState {
  isAuthenticated: boolean;
  role: Role;
  /** Nombre completo del usuario (demo). */
  nombre: string;
  /** Iniciales derivadas del nombre (ej. "GG"). */
  initials: string;
  signIn: (role?: Role) => void;
  signOut: () => void;
  setRole: (role: Role) => void;
}

const SessionContext = createContext<SessionState | undefined>(undefined);

/** Toma las iniciales de un nombre: "Gerson García" → "GG". */
function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>('jugador');
  const [nombre] = useState('Gerson García');

  const value = useMemo<SessionState>(
    () => ({
      isAuthenticated,
      role,
      nombre,
      initials: toInitials(nombre),
      signIn: (r?: Role) => {
        if (r) setRole(r);
        setIsAuthenticated(true);
      },
      signOut: () => setIsAuthenticated(false),
      setRole,
    }),
    [isAuthenticated, role, nombre],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession debe usarse dentro de <SessionProvider>');
  }
  return ctx;
}
