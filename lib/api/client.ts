import axios from 'axios';
import { ensureCSRFToken } from '@/lib/utils/csrf';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Flag para evitar múltiples redirects simultáneos (MED-02)
let isRedirecting = false;

const publicAuthMutations = [
  '/api/auth/login',
  '/api/auth/login/empresa',
  '/api/auth/registro-empresa',
  '/api/auth/solicitar-recuperacion',
  '/api/auth/restablecer-password',
  '/api/auth/refresh',
  '/api/auth/refresh-token',
];

function shouldAttachCSRF(method = '', url = '') {
  if (!['post', 'put', 'delete', 'patch'].includes(method)) return false;
  return !publicAuthMutations.some((endpoint) => url.endsWith(endpoint));
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Indica al backend que exponga el token en el body de login. Necesario
    // porque frontend y API viven en dominios distintos: el proxy de Next
    // (dominio del frontend) no puede leer la cookie HttpOnly del backend.
    'X-Client-Type': 'web',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const needsCSRF = shouldAttachCSRF(config.method || '', config.url || '');
    const csrfToken = needsCSRF ? await ensureCSRFToken() : '';
    if (csrfToken && needsCSRF) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        const responseData = response.data.data || response.data;
        delete responseData.success;
        return { ...response, data: responseData };
      } else {
        return Promise.reject({
          response: {
            data: {
              error: response.data.error || response.data.message || 'Error desconocido',
            },
          },
        });
      }
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      // MED-02: Intentar refresh token antes de cerrar sesión
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await axios.post(`${API_URL}/api/auth/refresh-token`, {}, { withCredentials: true });
          if (refreshResponse.data?.success) {
            return apiClient(originalRequest);
          }
        } catch (_) {
          // Refresh falló, proceder con logout
        }
      }

      if (typeof window !== 'undefined') {
        isRedirecting = true;
        // HIGH-02: Solo limpiar datos no sensibles
        localStorage.removeItem('userType');
        document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'permisos=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'requiereCambioPassword=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/';
        setTimeout(() => { isRedirecting = false; }, 3000);
      }
    }
    return Promise.reject(error);
  }
);
