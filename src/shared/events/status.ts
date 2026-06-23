/**
 * Estado de un evento — concepto de dominio compartido.
 * El color de cada estado se resuelve en la UI con estas claves.
 */
export type EventStatus = 'en_curso' | 'inscripcion' | 'finalizado' | 'proximo';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  en_curso: 'En curso',
  inscripcion: 'Inscr.',
  finalizado: 'Final.',
  proximo: 'Próximo',
};
