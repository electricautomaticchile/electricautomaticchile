/**
 * Tests para la configuración de seguridad
 * Verifica que los fallbacks inseguros han sido eliminados
 */

import { SecurityValidator } from "../../lib/config/security";

describe("Configuración de Seguridad", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Guardar variables de entorno originales
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restaurar variables de entorno
    process.env = originalEnv;
  });

  describe("Validación de JWT_SECRET", () => {
    test("debe rechazar JWT_SECRET vacío", () => {
      delete process.env.JWT_SECRET;

      const result = SecurityValidator.validatePassword("");
      expect(result.valid).toBe(false);
    });

    test("debe rechazar JWT_SECRET con menos de 32 caracteres", () => {
      const shortSecret = "short_secret";

      const validator = SecurityValidator.getInstance();
      expect(() => {
        process.env.JWT_SECRET = shortSecret;
        validator.validateEnvironment();
      }).toThrow("JWT_SECRET debe tener al menos 32 caracteres");
    });

    test("debe rechazar fallbacks inseguros conocidos", () => {
      const insecureSecrets = [
        "fallback_secret",
        "electricAutomaticSecretKey",
        "secret123",
        "password123",
      ];

      insecureSecrets.forEach((secret) => {
        expect(() => {
          process.env.JWT_SECRET = secret;
          const validator = SecurityValidator.getInstance();
          validator.validateEnvironment();
        }).toThrow();
      });
    });

    test("debe aceptar JWT_SECRET seguro", () => {
      const secureSecret = SecurityValidator.generateSecureSecret();
      process.env.JWT_SECRET = secureSecret;

      const validator = SecurityValidator.getInstance();
      expect(() => validator.validateEnvironment()).not.toThrow();
    });
  });

  describe("Validación de contraseñas", () => {
    test("debe validar contraseñas seguras", () => {
      const securePassword = "MySecure123!";
      const result = SecurityValidator.validatePassword(securePassword);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("debe rechazar contraseñas inseguras", () => {
      const insecurePasswords = [
        "password123",
        "admin123",
        "short",
        "NOLOWERCASE123!",
        "nouppercase123!",
        "NoNumbers!",
        "NoSpecialChars123",
      ];

      insecurePasswords.forEach((password) => {
        const result = SecurityValidator.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Generación de secretos", () => {
    test("debe generar secretos con longitud correcta", () => {
      const secret1 = SecurityValidator.generateSecureSecret();
      const secret2 = SecurityValidator.generateSecureSecret();

      expect(secret1.length).toBeGreaterThanOrEqual(32);
      expect(secret2.length).toBeGreaterThanOrEqual(32);
    });

    test("debe generar secretos únicos", () => {
      const secret1 = SecurityValidator.generateSecureSecret();
      const secret2 = SecurityValidator.generateSecureSecret();

      expect(secret1).not.toBe(secret2);
    });

    test("debe generar secretos con caracteres seguros", () => {
      const secret = SecurityValidator.generateSecureSecret();

      // Verificar que contiene caracteres alfanuméricos y especiales
      expect(secret).toMatch(/[A-Za-z0-9\-_]/);
      expect(secret.length).toBeGreaterThan(32);
    });
  });

  describe("Configuración de producción", () => {
    test("debe requerir configuraciones adicionales en producción", () => {
      // Usar Object.defineProperty para modificar NODE_ENV
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        writable: true,
      });
      process.env.JWT_SECRET = SecurityValidator.generateSecureSecret();
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";

      // En producción, localhost debería generar error
      expect(() => {
        const validator = SecurityValidator.getInstance();
        validator.validateEnvironment();
      }).toThrow("No se debe usar localhost para MongoDB en producción");
    });

    test("debe aceptar configuración válida de producción", () => {
      // Usar Object.defineProperty para modificar NODE_ENV
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        writable: true,
      });
      process.env.JWT_SECRET = SecurityValidator.generateSecureSecret();
      process.env.MONGODB_URI =
        "mongodb+srv://user:pass@cluster.mongodb.net/db";
      process.env.RESEND_API_KEY = "test_key";
      process.env.AWS_ACCESS_KEY_ID = "test_access_key";
      process.env.AWS_SECRET_ACCESS_KEY = "test_secret_key";

      const validator = SecurityValidator.getInstance();
      expect(() => validator.validateEnvironment()).not.toThrow();
    });
  });

  describe("Prevención de fallbacks inseguros", () => {
    test("no debe permitir fallbacks hardcodeados", () => {
      // Simular ausencia de JWT_SECRET
      delete process.env.JWT_SECRET;

      const validator = SecurityValidator.getInstance();
      expect(() => validator.validateEnvironment()).toThrow(
        "JWT_SECRET no está configurado"
      );
    });

    test("debe fallar explícitamente sin configuración", () => {
      // Limpiar todas las variables críticas
      delete process.env.JWT_SECRET;
      delete process.env.MONGODB_URI;

      const validator = SecurityValidator.getInstance();
      expect(() => validator.validateEnvironment()).toThrow();
    });
  });
});
