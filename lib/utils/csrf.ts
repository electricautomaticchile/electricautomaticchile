let csrfToken: string | null = null;

export async function fetchCSRFToken(): Promise<string> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/auth/csrf-token`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.token;
      return csrfToken || '';
    }
  } catch (error) {
    // LOW-03: No exponer errores en consola de producción
    if (process.env.NODE_ENV === 'development') {
      console.error('Error obteniendo CSRF token:', error);
    }
  }
  
  return '';
}

export function getCSRFToken(): string {
  return csrfToken || '';
}

export function setCSRFToken(token: string): void {
  csrfToken = token;
}

export function clearCSRFToken(): void {
  csrfToken = null;
}

export async function ensureCSRFToken(): Promise<string> {
  if (!csrfToken) {
    return await fetchCSRFToken();
  }
  return csrfToken;
}
