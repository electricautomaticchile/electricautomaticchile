# Configuración de Seguridad - Electricautomaticchile

## 🛡️ Resumen de Seguridad

Esta plataforma IoT maneja datos críticos de infraestructura eléctrica y requiere medidas de seguridad extremas. Este documento detalla todas las configuraciones de seguridad implementadas.

## 🔐 Autenticación y Autorización

### Sistema de Roles y Permisos

#### Jerarquía de Usuarios

```typescript
enum UserRole {
  CLIENTE = "cliente",
  EMPRESA_OPERADOR = "empresa_operador",
  EMPRESA_ADMIN = "empresa_admin",
  SUPERADMIN = "superadmin",
}

// Permisos por rol
const rolePermissions = {
  cliente: ["view_own_consumption", "manage_own_service", "view_own_billing"],
  empresa_operador: [
    "view_company_devices",
    "manage_client_services",
    "view_company_analytics",
  ],
  empresa_admin: [
    "manage_company_users",
    "configure_company_settings",
    "view_financial_reports",
  ],
  superadmin: [
    "manage_all_companies",
    "system_configuration",
    "security_audit",
  ],
};
```

### Autenticación Multi-Factor (MFA)

#### Configuración de MFA Obligatorio

```javascript
// Para usuarios empresa_admin y superadmin
const mfaConfig = {
  required_roles: ["empresa_admin", "superadmin"],
  methods: ["totp", "sms", "email"],
  backup_codes: 10,
  session_timeout: 30 * 60 * 1000, // 30 minutos
};
```

#### Implementación TOTP

```typescript
import speakeasy from "speakeasy";

export function generateMFASecret(email: string) {
  return speakeasy.generateSecret({
    name: `ElectricAutomatic (${email})`,
    issuer: "ElectricAutomatic Chile",
    length: 32,
  });
}

export function verifyMFAToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2, // Permitir +/- 2 intervalos de tiempo
  });
}
```

## 🔒 Encriptación de Datos

### Datos en Reposo

```typescript
// Configuración de encriptación AES-256-GCM
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY; // 32 bytes
const IV_LENGTH = 16; // AES block size

export function encryptSensitiveData(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher("aes-256-gcm", ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from("ElectricAutomatic", "utf8"));

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}
```

### Datos Críticos Encriptados

- Números de tarjetas de crédito
- Datos bancarios
- Información de dispositivos IoT
- Logs de acceso con información personal
- Coordenadas GPS precisas

## 🌐 Seguridad de Red

### Rate Limiting Avanzado

```typescript
// Rate limiting por tipo de endpoint
const rateLimitConfig = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por ventana
    skipSuccessfulRequests: false,
  },
  api: {
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // 100 requests por minuto
    skipSuccessfulRequests: true,
  },
  iot: {
    windowMs: 10 * 1000, // 10 segundos
    max: 1000, // 1000 mediciones por 10 segundos
    skipSuccessfulRequests: true,
  },
};
```

### WAF (Web Application Firewall)

```yaml
# Configuración AWS WAF
Rules:
  - Name: SQLInjectionRule
    Priority: 1
    Statement:
      ManagedRuleGroupStatement:
        VendorName: AWS
        Name: AWSManagedRulesSQLiRuleSet
    Action:
      Block: {}

  - Name: XSSRule
    Priority: 2
    Statement:
      ManagedRuleGroupStatement:
        VendorName: AWS
        Name: AWSManagedRulesCommonRuleSet
    Action:
      Block: {}

  - Name: IPWhitelistRule
    Priority: 3
    Statement:
      IPSetReferenceStatement:
        ARN: arn:aws:wafv2:region:account:ipset/AdminIPSet
    Action:
      Allow: {}
```

## 🔍 Auditoría y Monitoreo

### Logging de Seguridad

```typescript
interface SecurityEvent {
  timestamp: Date;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  event_type:
    | "login"
    | "logout"
    | "failed_auth"
    | "permission_denied"
    | "data_access";
  resource_accessed?: string;
  success: boolean;
  additional_data?: any;
}

export function logSecurityEvent(event: SecurityEvent) {
  // Log a MongoDB con TTL de 1 año
  SecurityLog.create({
    ...event,
    created_at: new Date(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  // Alertas en tiempo real para eventos críticos
  if (["failed_auth", "permission_denied"].includes(event.event_type)) {
    sendSecurityAlert(event);
  }
}
```

### Detección de Anomalías

```typescript
// Sistema de detección de patrones sospechosos
export class AnomalyDetector {
  // Múltiples logins fallidos
  async detectBruteForce(ip: string, timeWindow: number = 300000) {
    const failures = await SecurityLog.countDocuments({
      ip_address: ip,
      event_type: "failed_auth",
      timestamp: { $gte: new Date(Date.now() - timeWindow) },
    });

    return failures >= 10;
  }

  // Acceso desde ubicaciones inusuales
  async detectGeoAnomaly(user_id: string, current_ip: string) {
    const lastLogin = await SecurityLog.findOne({
      user_id,
      event_type: "login",
      success: true,
    }).sort({ timestamp: -1 });

    if (lastLogin) {
      const geoDistance = await this.calculateGeoDistance(
        lastLogin.ip_address,
        current_ip
      );

      // Si la distancia es > 1000km en menos de 1 hora
      const timeDiff = Date.now() - lastLogin.timestamp.getTime();
      return geoDistance > 1000 && timeDiff < 3600000;
    }

    return false;
  }
}
```

## 🚨 Respuesta a Incidentes

### Procedimientos Automatizados

```typescript
export class IncidentResponse {
  // Bloqueo automático de IP sospechosas
  async blockSuspiciousIP(ip: string, reason: string) {
    await FirewallRule.create({
      ip_address: ip,
      action: "BLOCK",
      reason,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    });

    // Notificar al equipo de seguridad
    await this.notifySecurityTeam({
      type: "IP_BLOCKED",
      ip_address: ip,
      reason,
    });
  }

  // Suspensión automática de cuenta
  async suspendAccount(user_id: string, reason: string) {
    await User.findByIdAndUpdate(user_id, {
      status: "SUSPENDED",
      suspension_reason: reason,
      suspended_at: new Date(),
    });

    // Log del evento
    logSecurityEvent({
      user_id,
      event_type: "account_suspended",
      reason,
      timestamp: new Date(),
    });
  }
}
```

## 🔐 Seguridad de Dispositivos IoT

### Autenticación de Dispositivos

```typescript
export class IoTDeviceSecurity {
  // Certificados únicos por dispositivo
  async authenticateDevice(deviceId: string, certificate: string) {
    const device = await IoTDevice.findOne({ deviceId });

    if (!device || !device.certificate) {
      throw new Error("Dispositivo no autorizado");
    }

    const isValidCert = crypto.verify(
      "RSA-SHA256",
      Buffer.from(certificate),
      device.public_key,
      device.certificate
    );

    if (!isValidCert) {
      await this.logSecurityViolation(deviceId, "INVALID_CERTIFICATE");
      throw new Error("Certificado inválido");
    }

    return device;
  }

  // Validación de coordenadas GPS (anti-fraude)
  async validateGPSLocation(deviceId: string, coords: GPSCoordinates) {
    const device = await IoTDevice.findOne({ deviceId });
    const lastKnownLocation = device.last_gps_location;

    if (lastKnownLocation) {
      const distance = this.calculateDistance(lastKnownLocation, coords);
      const timeDiff = Date.now() - device.last_gps_update.getTime();

      // Si se movió más de 100m en menos de 5 minutos = posible fraude
      if (distance > 100 && timeDiff < 300000) {
        await this.flagPotentialFraud(deviceId, {
          suspicious_movement: true,
          distance,
          time_diff: timeDiff,
        });
      }
    }
  }
}
```

## 📊 Cumplimiento Normativo

### Cumplimiento SEC (Chile)

```typescript
// Registros para auditoría SEC
export interface SECAuditLog {
  timestamp: Date;
  device_id: string;
  action: "CUT_SERVICE" | "RESTORE_SERVICE" | "MEASUREMENT";
  user_id?: string;
  client_account: string;
  technical_details: any;
  compliance_status: "COMPLIANT" | "NON_COMPLIANT";
}

// Retención de datos según normativa
const dataRetentionPolicies = {
  billing_records: 7 * 365 * 24 * 60 * 60 * 1000, // 7 años
  consumption_data: 3 * 365 * 24 * 60 * 60 * 1000, // 3 años
  audit_logs: 5 * 365 * 24 * 60 * 60 * 1000, // 5 años
  security_logs: 365 * 24 * 60 * 60 * 1000, // 1 año
};
```

### GDPR/LOPD Compliance

```typescript
export class DataPrivacy {
  // Derecho al olvido
  async deleteUserData(user_id: string) {
    // Anonimizar en lugar de eliminar para mantener integridad
    await User.findByIdAndUpdate(user_id, {
      email: `deleted_${Date.now()}@anonymized.local`,
      name: "Usuario Eliminado",
      phone: null,
      address: null,
      gdpr_deletion_date: new Date(),
    });

    // Eliminar datos no críticos
    await UserPreferences.deleteMany({ user_id });
    await NotificationSettings.deleteMany({ user_id });
  }

  // Exportación de datos personales
  async exportUserData(user_id: string) {
    const userData = await User.findById(user_id).lean();
    const consumptionData = await ConsumptionRecord.find({ user_id }).lean();
    const billingData = await BillingRecord.find({ user_id }).lean();

    return {
      personal_data: userData,
      consumption_history: consumptionData,
      billing_history: billingData,
      export_date: new Date(),
    };
  }
}
```

## 🔧 Configuraciones de Seguridad Específicas

### Variables de Entorno Críticas

```bash
# Claves de encriptación (generar con openssl rand -hex 32)
DATA_ENCRYPTION_KEY=64_character_hex_string_here
JWT_SECRET=another_64_character_hex_string_here

# Configuración de sesiones
SESSION_TIMEOUT=1800000  # 30 minutos
ABSOLUTE_SESSION_TIMEOUT=28800000  # 8 horas

# Configuración de MFA
MFA_ISSUER="ElectricAutomatic Chile"
MFA_WINDOW=2

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Configuración de cookies seguras
COOKIE_SECURE=true
COOKIE_HTTPONLY=true
COOKIE_SAMESITE=strict
```

## 📋 Checklist de Seguridad Pre-Producción

- [ ] Variables de entorno configuradas y validadas
- [ ] Certificados SSL/TLS instalados y validados
- [ ] WAF configurado y activo
- [ ] Rate limiting configurado
- [ ] Logs de seguridad configurados
- [ ] Monitoreo de anomalías activo
- [ ] Procedimientos de respuesta a incidentes documentados
- [ ] Backup y recuperación de datos probados
- [ ] Auditoría de permisos completada
- [ ] Pruebas de penetración realizadas

---

**🚨 CLASIFICACIÓN: CONFIDENCIAL**  
**Este documento contiene información crítica de seguridad. Acceso restringido solo al equipo de desarrollo y seguridad.**
