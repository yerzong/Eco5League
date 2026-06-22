/**
 * Usuarios demo (hardcodeados) para el maquetado, mientras no hay backend.
 * Cuando exista API real, esto se reemplaza por la llamada de login.
 *
 * Reglas que simula `authenticate`:
 *  - Correo no existe en la lista  → 'not_registered' (OB-02d)
 *  - Correo existe pero contraseña incorrecta → 'wrong_password' (OB-02c)
 *  - Coincide correo + contraseña → ok (entra con su rol)
 */
import { Role } from './roles';

export interface MockUser {
  email: string;
  password: string;
  role: Role;
  nombre: string;
}

export const MOCK_USERS: MockUser[] = [
  { email: 'gerson@eco5.mx', password: 'eco5demo', role: 'superadmin', nombre: 'Gerson' },
  { email: 'admin@eco5.mx', password: 'eco5demo', role: 'admin', nombre: 'Admin' },
  { email: 'jugador@eco5.mx', password: 'eco5demo', role: 'jugador', nombre: 'Jugador' },
];

export type AuthResult =
  | { ok: true; user: MockUser }
  | { ok: false; reason: 'not_registered' | 'wrong_password' };

/** Autentica contra los usuarios demo. Compara correo sin distinguir mayúsculas. */
export function authenticate(email: string, password: string): AuthResult {
  const normalized = email.trim().toLowerCase();
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === normalized);
  if (!user) return { ok: false, reason: 'not_registered' };
  if (user.password !== password) return { ok: false, reason: 'wrong_password' };
  return { ok: true, user };
}
