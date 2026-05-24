import axios from 'axios';
import { ensureCSRFToken } from '@/lib/utils/csrf';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Flag para evitar múltiples redirects simultáneos (MED-02)
let isRedirecting = false;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const isMutation = ['post', 'put', 'delete', 'patch'].includes(config.method || '');
    const csrfToken = isMutation ? await ensureCSRFToken() : '';
    if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method || '')) {
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
