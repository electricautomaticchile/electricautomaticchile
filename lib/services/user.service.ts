/**
 * Servicio específico para gestión de usuarios
 */

import { DatabaseService } from './database.service';
import { IUser, UserDocument, UserRole } from '@/lib/types/database';

// Importar el modelo de usuario (asumiendo que existe)
// import { User } from '@/lib/models/User';

export class UserService extends DatabaseService<UserDocument> {
  constructor(userModel: any) {
    super(userModel);
  }

  /**
   * Crear usuario
   */
  async createUser(userData: any): Promise<UserDocument> {
    try {
      const user = await this.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por número de cliente
   */
  async findByNumeroCliente(numeroCliente: string): Promise<UserDocument | null> {
    try {
      return await this.findOne({ numeroCliente });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar contraseña
   */
  async verifyPassword(user: UserDocument, password: string): Promise<boolean> {
    try {
      if (!user.password) {
        return false;
      }
      
      // Implementar verificación de contraseña según necesidad
      const isValid = user.password === password; // Simplificado
      return isValid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Actualizar último acceso
   */
  async updateLastAccess(userId: string): Promise<void> {
    try {
      await this.updateById(userId, {
        ultimoAcceso: new Date()
      });
    } catch (error) {
      // Error silencioso
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      const updated = await this.updateById(userId, {
        password: newPassword,
        passwordTemporal: undefined
      });

      return !!updated;
    } catch (error) {
      return false;
    }
  }

  /**
   * Activar/desactivar usuario
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<UserDocument | null> {
    try {
      const updated = await this.updateById(userId, {
        esActivo: isActive,
        fechaActivacion: isActive ? new Date() : undefined
      });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuarios por rol
   */
  async getUsersByRole(role: UserRole, pagination = {}) {
    try {
      return await this.findMany({ role }, pagination);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuarios activos
   */
  async getActiveUsers(pagination = {}) {
    try {
      return await this.findMany({ esActivo: true }, pagination);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Estadísticas de usuarios
   */
  async getUserStats() {
    try {
      const pipeline = [
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            active: {
              $sum: { $cond: ['$esActivo', 1, 0] }
            }
          }
        },
        {
          $project: {
            role: '$_id',
            total: '$count',
            active: '$active',
            inactive: { $subtract: ['$count', '$active'] }
          }
        }
      ];

      const stats = await this.aggregate(pipeline);
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Limpiar usuarios inactivos antiguos
   */
  async cleanupInactiveUsers(daysOld: number = 365): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.deleteMany({
        esActivo: false,
        createdAt: { $lt: cutoffDate },
        ultimoAcceso: { $lt: cutoffDate }
      });

      return result.deletedCount;
    } catch (error) {
      throw error;
    }
  }
} 