/**
 * Estado de un evento — concepto de dominio compartido.
 * El color de cada estado se resuelve en la UI con estas claves.
 */
export type EventStatus = 'en_curso' | 'inscripcion' | 'finalizado' | 'proximo';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  en_curso: 'EN CURSO',
  inscripcion: 'Inscripciones',
  finalizado: 'Finalizado',
  proximo: 'Próximamente',
};

/** Formato de competencia de un evento. */
export type EventFormat = 'liga' | 'torneo' | 'copa';

export const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
  liga: 'Liga',
  torneo: 'Torneo',
  copa: 'Copa',
};
