/**
 * Lista de nacionalidades (hardcodeada para el maquetado).
 * Enfocada en Latinoamérica + países comunes en la comunidad.
 */
export interface Nationality {
  code: string;
  label: string;
  flag: string;
}

export const NATIONALITIES: Nationality[] = [
  { code: 'MX', label: 'México', flag: '🇲🇽' },
  { code: 'AR', label: 'Argentina', flag: '🇦🇷' },
  { code: 'BO', label: 'Bolivia', flag: '🇧🇴' },
  { code: 'BR', label: 'Brasil', flag: '🇧🇷' },
  { code: 'CL', label: 'Chile', flag: '🇨🇱' },
  { code: 'CO', label: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', label: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', label: 'Cuba', flag: '🇨🇺' },
  { code: 'EC', label: 'Ecuador', flag: '🇪🇨' },
  { code: 'SV', label: 'El Salvador', flag: '🇸🇻' },
  { code: 'ES', label: 'España', flag: '🇪🇸' },
  { code: 'US', label: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'GT', label: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', label: 'Honduras', flag: '🇭🇳' },
  { code: 'NI', label: 'Nicaragua', flag: '🇳🇮' },
  { code: 'PA', label: 'Panamá', flag: '🇵🇦' },
  { code: 'PY', label: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', label: 'Perú', flag: '🇵🇪' },
  { code: 'PR', label: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'DO', label: 'República Dominicana', flag: '🇩🇴' },
  { code: 'UY', label: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', label: 'Venezuela', flag: '🇻🇪' },
  { code: 'CA', label: 'Canadá', flag: '🇨🇦' },
  { code: 'OT', label: 'Otra', flag: '🌎' },
];
