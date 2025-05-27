# 🔗 Conexión Frontend-Backend - ElectricAutomaticChile

## 📋 Resumen de Integración

Esta guía te muestra cómo conectar tu aplicación Next.js actual con el nuevo backend API de forma gradual y sin interrumpir el servicio.

## 🎯 Estrategia de Migración

### Fase 1: Configuración Base (Semana 1)
1. ✅ Crear backend API (ya tienes el código completo)
2. 🔧 Configurar servicios de API en Next.js
3. 🔐 Migrar autenticación
4. 📊 Probar endpoints básicos

### Fase 2: Migración Gradual (Semana 2-3)
1. 👥 Migrar gestión de usuarios
2. 🏢 Migrar gestión de empresas
3. 📱 Migrar dispositivos IoT
4. 📈 Migrar dashboards

### Fase 3: Optimización (Semana 4)
1. 🚀 Optimizar rendimiento
2. 📱 Preparar para móvil
3. 🔍 Monitoreo y logs
4. 🚀 Deploy producción

## 🛠️ Configuración en Next.js

### 1. Variables de Entorno (.env.local)

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=10000

# Mantener las existentes para migración gradual
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# Nuevas para el backend
BACKEND_JWT_SECRET=tu-jwt-secret-super-seguro-aqui-256-bits
```

### 2. Configuración de Axios (lib/api/client.ts)

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT!) || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokensFromStorage();
  }

  private setupInterceptors() {
    // Request interceptor - agregar token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - manejar refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    this.accessToken = null;
    this.refreshToken = null;
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      { refreshToken: this.refreshToken }
    );

    const { accessToken, refreshToken } = response.data.data;
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  // Métodos de autenticación
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data.data;
      
      this.saveTokensToStorage(accessToken, refreshToken);
      
      return {
        success: true,
        data: { user, accessToken, refreshToken }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error en login'
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/auth/register', userData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error en registro'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await this.client.post('/auth/logout', { 
          refreshToken: this.refreshToken 
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.clearTokensFromStorage();
    }
  }

  async getCurrentUser(): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/auth/me');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error obteniendo usuario'
      };
    }
  }

  // Métodos para usuarios
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    company?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/users', { params });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error obteniendo usuarios'
      };
    }
  }

  async getUserById(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/users/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error obteniendo usuario'
      };
    }
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error actualizando usuario'
      };
    }
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/users/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error eliminando usuario'
      };
    }
  }

  // Métodos para empresas
  async getCompanies(params?: {
    page?: number;
    limit?: number;
    status?: string;
    size?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/companies', { params });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error obteniendo empresas'
      };
    }
  }

  async getCompanyById(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/companies/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error obteniendo empresa'
      };
    }
  }

  async createCompany(companyData: any): Promise<ApiResponse> {
    try {
      const response = await this.client.post('/companies', companyData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error creando empresa'
      };
    }
  }

  async updateCompany(id: string, companyData: any): Promise<ApiResponse> {
    try {
      const response = await this.client.put(`/companies/${id}`, companyData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error actualizando empresa'
      };
    }
  }

  async deleteCompany(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/companies/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error eliminando empresa'
      };
    }
  }

  // Método genérico para requests personalizados
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client(config);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error en la solicitud'
      };
    }
  }

  // Getters para verificar estado
  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get tokens() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken
    };
  }
}

// Instancia singleton
export const apiClient = new ApiClient();
export default apiClient;
```

### 3. Context de Autenticación (contexts/AuthContext.tsx)

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  avatar?: string;
  company?: any;
  preferences: any;
  lastLogin?: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (apiClient.isAuthenticated) {
        const response = await apiClient.getCurrentUser();
        if (response.success) {
          setUser(response.data.user);
        } else {
          await apiClient.logout();
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      await apiClient.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado en login' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado en registro' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: any) => {
    try {
      if (!user) return { success: false, error: 'Usuario no autenticado' };
      
      const response = await apiClient.updateUser(user.id, userData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error actualizando usuario' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

### 4. Hooks Personalizados

#### hooks/useUsers.ts

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface UseUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  company?: string;
  autoFetch?: boolean;
}

export function useUsers(params: UseUsersParams = {}) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (fetchParams?: UseUsersParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getUsers({
        ...params,
        ...fetchParams
      });

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Error obteniendo usuarios');
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    try {
      const response = await apiClient.register(userData);
      if (response.success) {
        await fetchUsers(); // Refrescar lista
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error creando usuario' };
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const response = await apiClient.updateUser(id, userData);
      if (response.success) {
        await fetchUsers(); // Refrescar lista
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error actualizando usuario' };
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await apiClient.deleteUser(id);
      if (response.success) {
        await fetchUsers(); // Refrescar lista
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error eliminando usuario' };
    }
  };

  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchUsers();
    }
  }, [params.page, params.limit, params.role, params.company]);

  return {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    refetch: () => fetchUsers()
  };
}
```

#### hooks/useCompanies.ts

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface UseCompaniesParams {
  page?: number;
  limit?: number;
  status?: string;
  size?: string;
  autoFetch?: boolean;
}

export function useCompanies(params: UseCompaniesParams = {}) {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async (fetchParams?: UseCompaniesParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getCompanies({
        ...params,
        ...fetchParams
      });

      if (response.success) {
        setCompanies(response.data.companies);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Error obteniendo empresas');
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: any) => {
    try {
      const response = await apiClient.createCompany(companyData);
      if (response.success) {
        await fetchCompanies(); // Refrescar lista
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error creando empresa' };
    }
  };

  const updateCompany = async (id: string, companyData: any) => {
    try {
      const response = await apiClient.updateCompany(id, companyData);
      if (response.success) {
        await fetchCompanies(); // Refrescar lista
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error actualizando empresa' };
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const response = await apiClient.deleteCompany(id);
      if (response.success) {
        await fetchCompanies(); // Refrescar lista
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Error eliminando empresa' };
    }
  };

  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchCompanies();
    }
  }, [params.page, params.limit, params.status, params.size]);

  return {
    companies,
    pagination,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch: () => fetchCompanies()
  };
}
```

## 🔄 Migración de Componentes

### 1. Actualizar Layout Principal (app/layout.tsx)

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Nuevo Componente de Login (components/auth/LoginForm.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Error en login');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### 3. Middleware de Protección (middleware.ts)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(pathname);

  // Si no hay token y la ruta es protegida
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay token y está en login/register, redirigir al dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 📊 Ejemplo de Dashboard Actualizado

### components/dashboard/UsersList.tsx

```typescript
'use client';

import { useUsers } from '@/hooks/useUsers';
import { useState } from 'react';

export default function UsersList() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  
  const { 
    users, 
    pagination, 
    loading, 
    error, 
    deleteUser,
    refetch 
  } = useUsers({ 
    page, 
    limit: 10, 
    role: role || undefined 
  });

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      const result = await deleteUser(id);
      if (result.success) {
        alert('Usuario eliminado exitosamente');
      } else {
        alert(result.error);
      }
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="empresa">Empresa</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      <div className="grid gap-4">
        {users.map((user: any) => (
          <div key={user._id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {user.role}
              </span>
            </div>
            
            <div className="space-x-2">
              <button 
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        
        <span className="px-3 py-1">
          Página {pagination.page} de {pagination.pages}
        </span>
        
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagination.pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
```

## 🚀 Pasos de Implementación

### 1. Preparación (30 minutos)

```bash
# En tu proyecto Next.js actual
npm install axios

# Crear archivos de configuración
touch lib/api/client.ts
touch contexts/AuthContext.tsx
touch hooks/useUsers.ts
touch hooks/useCompanies.ts
```

### 2. Configurar Backend (15 minutos)

```bash
# En directorio separado
mkdir electricautomaticchile-backend
cd electricautomaticchile-backend

# Copiar todo el código del README-BACKEND-COMPLETO.md
# Seguir las instrucciones de setup
npm install
npm run dev
```

### 3. Configurar Frontend (45 minutos)

1. ✅ Copiar `lib/api/client.ts`
2. ✅ Copiar `contexts/AuthContext.tsx`
3. ✅ Actualizar `app/layout.tsx`
4. ✅ Crear hooks personalizados
5. ✅ Actualizar variables de entorno

### 4. Migrar Componentes (2-3 horas)

1. 🔐 Migrar login/logout
2. 👥 Migrar gestión de usuarios
3. 🏢 Migrar gestión de empresas
4. 📊 Actualizar dashboards

### 5. Testing (30 minutos)

```bash
# Probar endpoints
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 🔧 Configuración de Producción

### 1. Variables de Entorno Producción

```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-production-key
UPSTASH_REDIS_REST_URL=https://...
ALLOWED_ORIGINS=https://tu-dominio.com

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
```

### 2. Deploy Backend

```bash
# Con Railway/Render/DigitalOcean
git init
git add .
git commit -m "Initial backend setup"
git push origin main

# O con Docker
docker build -t electricautomaticchile-backend .
docker run -p 3001:3001 electricautomaticchile-backend
```

### 3. Actualizar Frontend

```bash
# Actualizar URL de API en producción
NEXT_PUBLIC_API_URL=https://tu-backend-url.com/api
```

## ✅ Checklist de Migración

### Preparación
- [ ] Backend API funcionando en localhost:3001
- [ ] Health check respondiendo: `http://localhost:3001/health`
- [ ] MongoDB conectado
- [ ] Redis configurado (Upstash)

### Frontend
- [ ] ApiClient configurado
- [ ] AuthContext implementado
- [ ] Hooks personalizados creados
- [ ] Variables de entorno actualizadas

### Testing
- [ ] Login funciona con nuevo backend
- [ ] Refresh token automático
- [ ] Gestión de usuarios migrada
- [ ] Gestión de empresas migrada
- [ ] Dashboards actualizados

### Producción
- [ ] Backend deployado
- [ ] Frontend actualizado con URL producción
- [ ] Variables de entorno configuradas
- [ ] SSL/HTTPS configurado
- [ ] Monitoreo activo

## 🆘 Solución de Problemas

### CORS Issues
```typescript
// En backend app.ts, verificar:
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
};
```

### Token Refresh Issues
```typescript
// Verificar en ApiClient que el refresh funcione:
console.log('Refresh token:', this.refreshToken);
```

### MongoDB Connection
```bash
# Verificar conexión
mongosh "mongodb+srv://..."
```

¡Con esta configuración tendrás un backend API robusto y escalable conectado perfectamente con tu aplicación Next.js! 🚀 