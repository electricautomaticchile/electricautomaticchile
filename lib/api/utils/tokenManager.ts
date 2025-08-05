// Clase para manejar el almacenamiento de tokens
export class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.TOKEN_KEY, token);

    // También guardar en cookies para el middleware
    const isProduction = window.location.protocol === "https:";
    const cookieOptions = [
      `${this.TOKEN_KEY}=${token}`,
      "path=/",
      `max-age=${24 * 60 * 60}`, // 24 horas
      "samesite=strict",
    ];

    // Solo agregar 'secure' en producción (HTTPS)
    if (isProduction) {
      cookieOptions.push("secure");
    }

    document.cookie = cookieOptions.join("; ");
    // Token guardado en cookies (sin logging en producción)
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);

    // También guardar en cookies para persistencia
    const isProduction = window.location.protocol === "https:";
    const cookieOptions = [
      `${this.REFRESH_TOKEN_KEY}=${token}`,
      "path=/",
      `max-age=${7 * 24 * 60 * 60}`, // 7 días
      "samesite=strict",
    ];

    // Solo agregar 'secure' en producción (HTTPS)
    if (isProduction) {
      cookieOptions.push("secure");
    }

    document.cookie = cookieOptions.join("; ");
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    // También limpiar cookies - asegurar que funcione tanto en dev como prod
    const clearCookieOptions = [
      "path=/",
      "expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "samesite=strict",
    ];

    // Agregar secure si estamos en HTTPS
    if (window.location.protocol === "https:") {
      clearCookieOptions.push("secure");
    }

    document.cookie = `${this.TOKEN_KEY}=; ${clearCookieOptions.join("; ")}`;
    document.cookie = `${this.REFRESH_TOKEN_KEY}=; ${clearCookieOptions.join("; ")}`;

    // Tokens y cookies limpiados
  }
}
