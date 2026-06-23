/**
 * Configuración central de servicios.
 * Aquí se decide si la app usa datos simulados (maqueta) o el backend real,
 * y vive la URL base de la API y las constantes demo.
 *
 * Cuando exista backend: pon `useMockServices: false` y ajusta `apiBaseUrl`.
 */
export const config = {
  /** URL base del backend (placeholder mientras no existe). */
  apiBaseUrl: 'https://api.eco5league.mx/v1',

  /** Si es true, los servicios responden con datos simulados en memoria. */
  useMockServices: true,

  /** Valores de prueba usados solo en modo maqueta. */
  demo: {
    /** Código OTP válido (teléfono y recuperación de contraseña). */
    otpCode: '529713',
    /** Contraseña de los usuarios demo. */
    password: 'eco5demo',
  },
} as const;
