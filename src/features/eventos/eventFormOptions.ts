/**
 * Opciones de los selects/segmented de los formularios de evento
 * (crear y editar). Centralizadas para no duplicarlas entre pantallas.
 */
import type { Segment } from '@/design-system/components';

export const TIPO_OPTS = ['Liga', 'Torneo', 'Copa', 'Relámpago'];
export const JUEGO_OPTS = ['Gears E-Day', 'Gears 5 — Versus', 'Otro (próximamente)'];
export const MODO_OPTS = ['1v1', '2v2', '4v4', '5v5'];
/** Juego + modo combinados (form de editar usa un solo campo). */
export const JUEGO_MODO_OPTS = [
  'Gears E-Day · 4v4',
  'Gears E-Day · 5v5',
  'Gears 5 — Versus · 4v4',
  'Gears 5 — Versus · 5v5',
];
export const FORMATO_OPTS = [
  'Eliminación simple',
  'Eliminación doble',
  'Grupos + Playoffs (elim. doble)',
  'Round robin',
  'Suizo',
];
export const ROSTER_OPTS = [
  '4 titulares · 2 suplentes · 1 coach',
  '5 titulares · 1 suplente',
  '3 titulares · 1 suplente',
];
export const REGION_OPTS = [
  'México · Español',
  'LATAM · Español',
  'Norteamérica · Inglés',
  'Global · Inglés',
];

/** Segmentos del estado del evento (editar). */
export const ESTADO_SEGMENTS: Segment[] = [
  { key: 'borrador', label: 'Borrador' },
  { key: 'inscripcion', label: 'Inscrip.' },
  { key: 'en_curso', label: 'En curso' },
  { key: 'finalizado', label: 'Final.' },
];

/** Segmentos de visibilidad. */
export const VISIBILITY_SEGMENTS: Segment[] = [
  { key: 'publico', label: 'Público' },
  { key: 'privado', label: 'Privado' },
  { key: 'invitacion', label: 'Invitación' },
];
