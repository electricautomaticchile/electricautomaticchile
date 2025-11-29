/**
 * Configuración de seguridad centralizada
 * Valida y gestiona todas las variables de entorno críticas para la seguridad
 */

export interface SecurityConfig {
  jwtSecret: string;
  mongodbUri: string;
  resendApiKey: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  isProduction: boolean;
}

class SecurityValidator {
  private static instance: SecurityValidator;
  private config: SecurityConfig | null = null;

  private constructor() {}

  public static getInstance(): SecurityValidator {
    if (!SecurityValidator.instance) {
      SecurityValidator.instance = new SecurityValidator();
    }
    return SecurityValidator.instance;
  }

  /**
   * Valida todas las variables de entorno críticas
   */
  public validateEnvironment(): SecurityConfig {
    if (this.config) {
      return this.config;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      errors.push('JWT_SECRET no está configurado');
    } else if (jwtSecret.length < 32) {
      errors.push('JWT_SECRET debe tener al menos 32 caracteres');
    } else if (jwtSecret === 'fallback_secret' || jwtSecret === 'electricAutomaticSecretKey') {
      errors.push('JWT_SECRET contiene un valor inseguro por defecto');
    }

    // Validar MONGODB_URI
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
      warnings.push('MONGODB_URI no está configurado, usando localhost por defecto');
    } else if (mongodbUri.includes('localhost') && process.env.NODE_ENV === 'production') {
      errors.push('No se debe usar localhost para MongoDB en producción');
    }

    // Validar RESEND_API_KEY
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey && process.env.NODE_ENV === 'production') {
      warnings.push('RESEND_API_KEY no está configurado');
    }

    // Validar AWS credentials
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    if (!awsAccessKeyId && process.env.NODE_ENV === 'production') {
      warnings.push('AWS_ACCESS_KEY_ID no está configurado');
    }
    
    if (!awsSecretAccessKey && process.env.NODE_ENV === 'production') {
      warnings.push('AWS_SECRET_ACCESS_KEY no está configurado');
    }

    // Validar configuración de NODE_ENV
    const isProduction = process.env.NODE_ENV === 'production';
    if (!process.env.NODE_ENV) {
      warnings.push('NODE_ENV no está configurado');
    }

    // Mostrar warnings
    if (warnings.length > 0) {
    }

    // Si hay errores críticos, fallar
    if (errors.length > 0) {
      
      // En desarrollo, mostrar ayuda adicional
      if (!isProduction) {
      }
      
      throw new Error(`Configuración de seguridad inválida: ${errors.join(', ')}`);
    }

    // Construir configuración validada
    this.config = {
      jwtSecret: jwtSecret!,
      mongodbUri: mongodbUri || 'mongodb://localhost:27017/electricautomaticchile',
      resendApiKey: resendApiKey || '',
      awsAccessKeyId: awsAccessKeyId || '',
      awsSecretAccessKey: awsSecretAccessKey || '',
      isProduction
    };

    return this.config;
  }

  /**
   * Obtiene la configuración validada (debe llamarse después de validateEnvironment)
   */
  public getConfig(): SecurityConfig {
    if (!this.config) {
      throw new Error('La configuración no ha sido validada. Llame a validateEnvironment() primero.');
    }
    return this.config;
  }

  /**
   * Genera un secreto JWT seguro para desarrollo
   */
  public static generateSecureSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Valida que una contraseña cumpla con los requisitos mínimos
   */
  public static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }

    // Validar contra contraseñas comunes inseguras
    const insecurePasswords = [
      'password', 'password123', '123456789', 'admin123', 
      'qwerty123', 'letmein123', 'welcome123'
    ];
    
    if (insecurePasswords.some(p => password.toLowerCase().includes(p.toLowerCase()))) {
      errors.push('No debe contener patrones comunes inseguros');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Instancia singleton
const securityValidator = SecurityValidator.getInstance();

// Exportar la instancia y funciones de utilidad
export default securityValidator;
export { SecurityValidator };

// Función de conveniencia para validar el entorno al inicio de la aplicación
export function initializeSecurity(): SecurityConfig {
  return securityValidator.validateEnvironment();
} 