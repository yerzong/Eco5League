/**
 * Cliente HTTP base (POO). Envuelve `fetch` con:
 *  - URL base configurable
 *  - headers comunes (JSON) + token de sesión opcional
 *  - parseo y manejo de errores unificado vía ApiError
 *
 * Todos los servicios HTTP (AuthService, EventosService…) reciben una
 * instancia de ApiClient por inyección de dependencias, no la crean ellos.
 */
import { ApiError } from './ApiError';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Proveedor del token de sesión (lo inyecta quien construye el cliente). */
export type TokenProvider = () => string | null | undefined;

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getToken?: TokenProvider,
  ) {}

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(method: Method, path: string, body?: unknown): Promise<T> {
    const token = this.getToken?.();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new ApiError(0, 'Sin conexión. Revisa tu red e inténtalo de nuevo.', e);
    }

    const text = await res.text();
    const data = text ? safeJson(text) : undefined;

    if (!res.ok) {
      const message =
        (data as { message?: string } | undefined)?.message ??
        `Error ${res.status}`;
      throw new ApiError(res.status, message, data);
    }
    return data as T;
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
