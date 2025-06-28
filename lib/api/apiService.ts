// Configuración del Backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";
const API_URL = `${API_BASE_URL}/api`;

// Log de configuración (solo en desarrollo)
if (process.env.NODE_ENV === "development") {
  console.log("🔗 API Configuration:", {
    baseUrl: API_BASE_URL,
    apiUrl: API_URL,
    version: API_VERSION,
  });
}

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Tipos para Cotizaciones
export interface ICotizacion {
  _id: string;
  numero?: string;
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  servicio:
    | "cotizacion_reposicion"
    | "cotizacion_monitoreo"
    | "cotizacion_mantenimiento"
    | "cotizacion_completa";
  plazo?: "urgente" | "pronto" | "normal" | "planificacion";
  mensaje: string;
  archivoUrl?: string;
  archivo?: string;
  archivoTipo?: string;
  estado:
    | "pendiente"
    | "en_revision"
    | "cotizando"
    | "cotizada"
    | "aprobada"
    | "rechazada"
    | "convertida_cliente";
  prioridad: "baja" | "media" | "alta" | "critica";
  titulo?: string;
  descripcion?: string;
  items?: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  subtotal?: number;
  iva?: number;
  total?: number;
  validezDias?: number;
  condicionesPago?: string;
  clienteId?: string;
  asignadoA?: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  fechaCotizacion?: string;
  fechaAprobacion?: string;
  fechaConversion?: string;
  notas?: string;
}

// Tipos para Clientes
export interface ICliente {
  _id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  empresa?: string;
  numeroCliente?: string;
  role?: string;
  esActivo?: boolean;
  activo?: boolean;
  passwordTemporal?: string;
  planSeleccionado?: string;
  montoMensual?: number;
  fechaRegistro?: string;
  fechaActivacion?: string;
  notas?: string;
}

// Tipos para Usuarios
export interface IUsuario {
  _id: string;
  nombre: string;
  email: string;
  numeroCliente?: string;
  tipoUsuario: "admin" | "cliente" | "empresa";
  role?: string;
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

// Tipos para Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUsuario;
  token: string;
  refreshToken: string;
}

// Clase para manejar el almacenamiento de tokens
class TokenManager {
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
    console.log(
      "🍪 Token guardado en cookies:",
      isProduction ? "con secure" : "sin secure"
    );
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

    console.log("🗑️ Tokens y cookies limpiados");
  }
}

// Clase principal del servicio API
class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const token = TokenManager.getToken();

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Si el token ha expirado, intentar renovarlo
        if (response.status === 401 && token) {
          try {
            await this.refreshAuthToken();
            // Reintentar la solicitud original con el nuevo token
            const newToken = TokenManager.getToken();
            if (newToken) {
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              };
              const retryResponse = await fetch(url, config);
              const retryData = await retryResponse.json();

              if (retryResponse.ok) {
                return retryData;
              }
            }
          } catch (refreshError) {
            // Si falla la renovación, limpiar tokens y redirigir al login
            TokenManager.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login";
            }
          }
        }

        return {
          success: false,
          error: data.message || data.error || "Error en la solicitud",
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  // =================== AUTENTICACIÓN ===================

  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      TokenManager.setToken(response.data.token);
      TokenManager.setRefreshToken(response.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/logout", {
      method: "POST",
    });

    TokenManager.clearTokens();
    return response;
  }

  async refreshAuthToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.makeRequest<{ token: string }>(
      "/auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.success && response.data) {
      TokenManager.setToken(response.data.token);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>("/auth/me");
  }

  // =================== COTIZACIONES ===================

  async enviarFormularioContacto(data: {
    nombre: string;
    email: string;
    empresa?: string;
    telefono?: string;
    servicio: string;
    plazo?: string;
    mensaje: string;
    archivoUrl?: string;
    archivo?: string;
    archivoTipo?: string;
  }): Promise<ApiResponse<{ id: string; numero: string; estado: string }>> {
    return this.makeRequest("/cotizaciones/contacto", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async obtenerCotizaciones(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    prioridad?: string;
    servicio?: string;
  }): Promise<ApiResponse<ICotizacion[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/cotizaciones?${queryParams.toString()}`
      : "/cotizaciones";

    return this.makeRequest<ICotizacion[]>(endpoint);
  }

  async obtenerCotizacionesPendientes(): Promise<ApiResponse<ICotizacion[]>> {
    return this.makeRequest<ICotizacion[]>("/cotizaciones/pendientes");
  }

  async obtenerEstadisticasCotizaciones(): Promise<ApiResponse<any>> {
    return this.makeRequest("/cotizaciones/estadisticas");
  }

  async obtenerCotizacion(id: string): Promise<ApiResponse<ICotizacion>> {
    return this.makeRequest<ICotizacion>(`/cotizaciones/${id}`);
  }

  async cambiarEstadoCotizacion(
    id: string,
    estado: string,
    notas?: string
  ): Promise<ApiResponse<ICotizacion>> {
    return this.makeRequest<ICotizacion>(`/cotizaciones/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado, notas }),
    });
  }

  async agregarCotizacion(
    id: string,
    datosActualizacion: {
      titulo: string;
      descripcion?: string;
      items: Array<{
        descripcion: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
      }>;
      subtotal: number;
      iva: number;
      total: number;
      validezDias?: number;
      condicionesPago?: string;
    }
  ): Promise<ApiResponse<ICotizacion>> {
    return this.makeRequest<ICotizacion>(`/cotizaciones/${id}/cotizar`, {
      method: "PUT",
      body: JSON.stringify(datosActualizacion),
    });
  }

  async convertirCotizacionACliente(
    id: string,
    datos: {
      passwordTemporal?: string;
      planSeleccionado?: string;
      montoMensual?: number;
    }
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/cotizaciones/${id}/convertir-cliente`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async eliminarCotizacion(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/cotizaciones/${id}`, {
      method: "DELETE",
    });
  }

  // =================== CLIENTES ===================

  async obtenerClientes(params?: {
    page?: number;
    limit?: number;
    tipoCliente?: string;
    ciudad?: string;
  }): Promise<ApiResponse<ICliente[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/clientes?${queryParams.toString()}`
      : "/clientes";

    return this.makeRequest<ICliente[]>(endpoint);
  }

  async obtenerCliente(id: string): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>(`/clientes/${id}`);
  }

  async crearCliente(datos: Partial<ICliente>): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>("/clientes", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async actualizarCliente(
    id: string,
    datos: Partial<ICliente>
  ): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }

  async eliminarCliente(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/clientes/${id}`, {
      method: "DELETE",
    });
  }

  // =================== USUARIOS ===================

  async obtenerUsuarios(): Promise<ApiResponse<IUsuario[]>> {
    return this.makeRequest<IUsuario[]>("/usuarios");
  }

  async obtenerUsuario(id: string): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>(`/usuarios/${id}`);
  }

  async crearUsuario(datos: Partial<IUsuario>): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>("/usuarios", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async actualizarUsuario(
    id: string,
    datos: Partial<IUsuario>
  ): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }

  async eliminarUsuario(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/usuarios/${id}`, {
      method: "DELETE",
    });
  }

  // =================== DISPOSITIVOS IoT ===================

  async obtenerDispositivos(params?: {
    cliente?: string;
    estado?: string;
    tipoDispositivo?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/dispositivos?${queryParams.toString()}`
      : "/dispositivos";

    return this.makeRequest<any[]>(endpoint);
  }

  async obtenerDispositivo(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/dispositivos/${id}`);
  }

  async crearDispositivo(datos: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/dispositivos", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async agregarLecturaDispositivo(
    id: string,
    lecturas: any[]
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/dispositivos/${id}/lecturas`, {
      method: "POST",
      body: JSON.stringify({ lecturas }),
    });
  }

  async obtenerEstadisticasConsumoCliente(
    clienteId: string,
    params?: {
      periodo?: "mensual" | "diario" | "horario";
      año?: number;
      mes?: number;
    }
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/estadisticas/consumo-electrico/${clienteId}?${queryParams.toString()}`
      : `/estadisticas/consumo-electrico/${clienteId}`;

    return this.makeRequest<any>(endpoint);
  }

  // =================== LEAD MAGNET (MIGRADO) ===================

  async enviarLeadMagnet(datos: {
    email: string;
    nombre?: string;
    empresa?: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/lead-magnet/enviar-pdf", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async obtenerEstadisticasLeads(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/lead-magnet/estadisticas");
  }

  // =================== ESTADÍSTICAS GLOBALES ===================

  async obtenerEstadisticasGlobales(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/estadisticas/globales");
  }
}

// Exportar instancia única del servicio
export const apiService = new ApiService();

// Exportar también la clase para casos especiales
export { ApiService };
