export class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly USER_KEY = "user_data";

  private static getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  }

  private static setCookie(name: string, value: string, maxAge: number): void {
    if (typeof window === "undefined") return;
    const isProduction = window.location.protocol === "https:";
    const cookieOptions = [
      `${name}=${encodeURIComponent(value)}`,
      "path=/",
      `max-age=${maxAge}`,
      "samesite=strict",
    ];
    if (isProduction) {
      cookieOptions.push("secure");
    }
    document.cookie = cookieOptions.join("; ");
  }

  private static deleteCookie(name: string): void {
    if (typeof window === "undefined") return;
    const clearCookieOptions = [
      "path=/",
      "expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "samesite=strict",
    ];
    if (window.location.protocol === "https:") {
      clearCookieOptions.push("secure");
    }
    document.cookie = `${name}=; ${clearCookieOptions.join("; ")}`;
  }

  static getToken(): string | null {
    return this.getCookie(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    this.setCookie(this.TOKEN_KEY, token, 24 * 60 * 60);
  }

  static getRefreshToken(): string | null {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    this.setCookie(this.REFRESH_TOKEN_KEY, token, 7 * 24 * 60 * 60);
  }

  static getUser(): any | null {
    const userData = this.getCookie(this.USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static setUser(user: any): void {
    this.setCookie(this.USER_KEY, JSON.stringify(user), 24 * 60 * 60);
  }

  static clearTokens(): void {
    this.deleteCookie(this.TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.deleteCookie(this.USER_KEY);
  }
}
