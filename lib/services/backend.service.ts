import { apiClient } from '../api/client';

// Interfaces para tipos de datos
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  role: 'cliente' | 'admin' | 'superadmin';
  activo: boolean;
  fechaCreacion: Date;
  ultimoAcceso?: Date;
}

export interface Notificacion {
  id: string;
  tipo: 'info' | 'alerta' | 'exito';
  titulo: string;
  descripcion: string;
  destinatario: string;
  prioridad: 'baja' | 'media' | 'alta';
  fecha: Date;
  leida: boolean;
  enlace?: string;
}

export interface Mensaje {
  id: string;
  emisor: string;
  receptor: string;
  contenido: string;
  fecha: Date;
  leido: boolean;
  conversacionId: string;
}

export interface Dispositivo {
  id: string;
  clienteId: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  activo: boolean;
  ultimaConexion?: Date;
}

export interface Medicion {
  id: string;
  dispositivoId: string;
  tipo: string;
  valor: number;
  unidad: string;
  fecha: Date;
  calidad: 'buena' | 'regular' | 'mala';
}

// Servicio de Autenticación
export class AuthService {
  static async login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password });
  }

  static async register(userData: {
    email: string;
    password: string;
    nombre: string;
    role?: string;
  }) {
    return apiClient.post('/auth/register', userData);
  }

  static async logout() {
    return apiClient.post('/auth/logout');
  }

  static async refreshToken() {
    return apiClient.post('/auth/refresh');
  }

  static async forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, newPassword: string) {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  }
}

// Servicio de Usuarios
export class UserService {
  static async getUsers(params?: { page?: number; limit?: number; role?: string }) {
    return apiClient.get<{ users: Usuario[]; total: number }>('/users', params);
  }

  static async getUser(id: string) {
    return apiClient.get<Usuario>(`/users/${id}`);
  }

  static async updateUser(id: string, userData: Partial<Usuario>) {
    return apiClient.put<Usuario>(`/users/${id}`, userData);
  }

  static async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`);
  }

  static async getUserProfile() {
    return apiClient.get<Usuario>('/users/profile');
  }
}

// Servicio de Notificaciones
export class NotificationService {
  static async getNotifications(params?: { 
    page?: number; 
    limit?: number; 
    tipo?: string;
    leida?: boolean;
  }) {
    return apiClient.get<{
      notificaciones: Notificacion[];
      resumen: {
        total: number;
        noLeidas: number;
        alertas: { total: number; noLeidas: number };
        info: { total: number; noLeidas: number };
        exito: { total: number; noLeidas: number };
      };
    }>('/notificaciones/listar', params);
  }

  static async markAsRead(notificationId: string) {
    return apiClient.put(`/notificaciones/marcar-leida`, { notificationId });
  }

  static async markAllAsRead() {
    return apiClient.put('/notificaciones/marcar-todas-leidas');
  }

  static async deleteNotification(notificationId: string) {
    return apiClient.delete(`/notificaciones/eliminar/${notificationId}`);
  }

  static async createNotification(notificationData: {
    tipo: string;
    titulo: string;
    descripcion: string;
    destinatario: string;
    prioridad: string;
  }) {
    return apiClient.post('/notificaciones/crear', notificationData);
  }
}

// Servicio de Mensajes
export class MessageService {
  static async getConversations() {
    return apiClient.get<{ conversaciones: any[] }>('/mensajes/listar');
  }

  static async getMessages(conversationId: string) {
    return apiClient.get<{ mensajes: Mensaje[] }>(`/mensajes/listar?conversacionId=${conversationId}`);
  }

  static async sendMessage(messageData: {
    receptor: string;
    contenido: string;
    conversacionId?: string;
  }) {
    return apiClient.post('/mensajes/crear', messageData);
  }

  static async markMessageAsRead(messageId: string) {
    return apiClient.put('/mensajes/marcar-leido', { messageId });
  }

  static async deleteMessage(messageId: string) {
    return apiClient.delete(`/mensajes/${messageId}`);
  }
}

// Servicio de Dispositivos
export class DeviceService {
  static async getDevices(params?: { 
    clienteId?: string; 
    activo?: boolean;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{ dispositivos: Dispositivo[] }>('/dispositivos', params);
  }

  static async getDevice(id: string) {
    return apiClient.get<Dispositivo>(`/dispositivos/${id}`);
  }

  static async createDevice(deviceData: {
    nombre: string;
    tipo: string;
    clienteId: string;
    ubicacion: string;
  }) {
    return apiClient.post('/dispositivos', deviceData);
  }

  static async updateDevice(id: string, deviceData: Partial<Dispositivo>) {
    return apiClient.put<Dispositivo>(`/dispositivos/${id}`, deviceData);
  }

  static async deleteDevice(id: string) {
    return apiClient.delete(`/dispositivos/${id}`);
  }

  static async getDeviceStatus(id: string) {
    return apiClient.get(`/dispositivos/${id}/estado`);
  }
}

// Servicio de Mediciones
export class MeasurementService {
  static async getMeasurements(params?: {
    dispositivoId?: string;
    clienteId?: string;
    fechaInicio?: string;
    fechaFin?: string;
    tipo?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{ mediciones: Medicion[] }>('/mediciones', params);
  }

  static async createMeasurement(measurementData: {
    dispositivoId: string;
    tipo: string;
    valor: number;
    unidad: string;
  }) {
    return apiClient.post('/mediciones', measurementData);
  }

  static async createBatchMeasurements(measurements: any[]) {
    return apiClient.post('/mediciones/lote', { mediciones: measurements });
  }

  static async getStatistics(params?: {
    dispositivoId?: string;
    clienteId?: string;
    periodo?: string;
  }) {
    return apiClient.get('/mediciones/estadisticas', params);
  }

  static async getAnomalies(params?: {
    dispositivoId?: string;
    umbral?: number;
  }) {
    return apiClient.get('/mediciones/anomalias', params);
  }

  static async getLatestMeasurements(deviceId: string, limit?: number) {
    return apiClient.get(`/mediciones/dispositivo/${deviceId}/ultimas`, { limit });
  }
}

// Servicio de Analytics
export class AnalyticsService {
  static async getDashboard() {
    return apiClient.get('/analytics/dashboard');
  }

  static async getConsumptionReport(params?: {
    fechaInicio?: string;
    fechaFin?: string;
    clienteId?: string;
    agrupacion?: 'hora' | 'dia' | 'mes';
  }) {
    return apiClient.get('/analytics/consumo', params);
  }

  static async getSecurityAnalysis() {
    return apiClient.get('/analytics/seguridad');
  }

  static async getDevicePerformance(params?: {
    dispositivoId?: string;
    periodo?: string;
  }) {
    return apiClient.get('/analytics/dispositivos', params);
  }

  static async getClientActivity(params?: {
    clienteId?: string;
    periodo?: string;
  }) {
    return apiClient.get('/analytics/clientes', params);
  }

  static async exportData(params: {
    tipo: 'json' | 'csv';
    fechaInicio?: string;
    fechaFin?: string;
    incluir?: string[];
  }) {
    return apiClient.get('/analytics/exportar', params);
  }
}

// Servicio de Clientes
export class ClientService {
  static async getClients(params?: { 
    activo?: boolean;
    plan?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get('/clientes', params);
  }

  static async getClient(id: string) {
    return apiClient.get(`/clientes/${id}`);
  }

  static async createClient(clientData: any) {
    return apiClient.post('/clientes', clientData);
  }

  static async updateClient(id: string, clientData: any) {
    return apiClient.put(`/clientes/${id}`, clientData);
  }

  static async deleteClient(id: string) {
    return apiClient.delete(`/clientes/${id}`);
  }

  static async getClientHistory(id: string) {
    return apiClient.get(`/clientes/${id}/historial`);
  }
}

// Servicio de Salud del Sistema
export class HealthService {
  static async getSystemHealth() {
    return apiClient.get('/health');
  }

  static async getBackendStatus() {
    return apiClient.healthCheck();
  }
} 