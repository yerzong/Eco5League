/**
 * Error de API tipado. Extiende Error para conservar stack trace y
 * permitir distinguir fallos HTTP del resto con `instanceof ApiError`.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** ¿El error es por credenciales / sesión inválida? */
  get isAuth(): boolean {
    return this.status === 401 || this.status === 403;
  }
}
