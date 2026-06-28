/**
 * Utilidades de color para el design-system.
 * Mantener aquí cualquier manipulación de color reutilizable (no hardcodear).
 */

/**
 * Devuelve el color hex con un canal alfa aplicado.
 * @param hex   color en formato `#RRGGBB` (si no lo es, se devuelve tal cual).
 * @param alpha opacidad 0–1.
 */
export function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}
