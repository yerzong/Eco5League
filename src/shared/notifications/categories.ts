/**
 * Categorías de notificación / actividad — concepto de dominio compartido.
 * Fuente de verdad del tipo; el color de cada categoría vive en el
 * design-system (categoryColors) usando estas mismas claves.
 */
export type NotificationCategory =
  | 'inscripcion'
  | 'transferencia'
  | 'resultado'
  | 'sistema';

/** Etiqueta visible (mayúsculas) de cada categoría. */
export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  inscripcion: 'Inscripción',
  transferencia: 'Transferencia',
  resultado: 'Resultado',
  sistema: 'Sistema',
};
