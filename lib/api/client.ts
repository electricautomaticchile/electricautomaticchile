import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permisos');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
