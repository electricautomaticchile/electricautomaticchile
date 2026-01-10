import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
      if (authCookie) {
        const token = authCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
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
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('permisos');
        localStorage.removeItem('userType');
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
