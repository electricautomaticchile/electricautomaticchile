# API Reference - Electricautomaticchile

## 📋 Información General

La API de Electricautomaticchile proporciona acceso programático a todas las funcionalidades de la plataforma IoT de gestión eléctrica.

**Base URL**: `https://api.electricautomaticchile.cl/v1`

## 🔐 Autenticación

### JWT Bearer Token

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### Obtener Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@empresa.cl",
  "password": "contraseña_segura"
}
```

**Respuesta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "usuario@empresa.cl",
    "role": "empresa_admin",
    "company_id": "64f1a2b3c4d5e6f7g8h9i0j2"
  },
  "expires_in": 3600
}
```

## 👥 Gestión de Usuarios

### Obtener Perfil de Usuario

```bash
GET /api/users/profile
Authorization: Bearer {token}
```

### Actualizar Perfil

```bash
PUT /api/users/profile
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "preferences": {
    "notifications": true,
    "language": "es"
  }
}
```

## 🏢 Gestión de Empresas

### Listar Empresas (Solo Superadmin)

```bash
GET /api/companies
Authorization: Bearer {token}
```

### Obtener Detalles de Empresa

```bash
GET /api/companies/{company_id}
Authorization: Bearer {token}
```

## 🔌 Dispositivos IoT

### Listar Dispositivos

```bash
GET /api/devices
Authorization: Bearer {token}
```

**Respuesta:**

```json
{
  "devices": [
    {
      "device_id": "ESP32_001_ABC123",
      "name": "Medidor Principal Sector A",
      "status": "online",
      "last_seen": "2024-12-07T10:30:00Z",
      "location": {
        "latitude": -33.4489,
        "longitude": -70.6693,
        "address": "Av. Providencia 123, Santiago"
      },
      "measurements": {
        "voltage": 220.5,
        "current": 15.2,
        "power": 3351.6,
        "energy": 245.8
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Obtener Dispositivo Específico

```bash
GET /api/devices/{device_id}
Authorization: Bearer {token}
```

### Enviar Comando a Dispositivo

```bash
POST /api/devices/{device_id}/commands
Content-Type: application/json
Authorization: Bearer {token}

{
  "command": "CUT_SERVICE",
  "parameters": {
    "reason": "Falta de pago",
    "scheduled_time": "2024-12-07T15:00:00Z"
  },
  "priority": "high"
}
```

## 📊 Mediciones y Telemetría

### Obtener Mediciones Históricas

```bash
GET /api/measurements/{device_id}?from=2024-12-01&to=2024-12-07&interval=1h
Authorization: Bearer {token}
```

**Respuesta:**

```json
{
  "device_id": "ESP32_001_ABC123",
  "measurements": [
    {
      "timestamp": "2024-12-07T10:00:00Z",
      "voltage": 220.3,
      "current": 14.8,
      "power": 3260.4,
      "energy": 244.2,
      "power_factor": 0.92
    }
  ],
  "interval": "1h",
  "total_records": 168
}
```

### Obtener Estadísticas de Consumo

```bash
GET /api/analytics/consumption/{client_id}?period=monthly&year=2024
Authorization: Bearer {token}
```

## 💳 Facturación y Pagos

### Obtener Facturas de Cliente

```bash
GET /api/billing/{client_id}/invoices
Authorization: Bearer {token}
```

### Crear Nueva Factura

```bash
POST /api/billing/invoices
Content-Type: application/json
Authorization: Bearer {token}

{
  "client_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "period": "2024-12",
  "consumption_kwh": 245.8,
  "rate_per_kwh": 120.5,
  "additional_charges": [
    {
      "description": "Cargo fijo mensual",
      "amount": 5000
    }
  ]
}
```

### Procesar Pago

```bash
POST /api/payments/process
Content-Type: application/json
Authorization: Bearer {token}

{
  "invoice_id": "64f1a2b3c4d5e6f7g8h9i0j4",
  "payment_method": "transbank",
  "amount": 29629.9,
  "transaction_data": {
    "card_token": "token_from_transbank"
  }
}
```

## 🚨 Alertas y Notificaciones

### Obtener Alertas Activas

```bash
GET /api/alerts?status=active&severity=critical
Authorization: Bearer {token}
```

### Crear Alerta Personalizada

```bash
POST /api/alerts/rules
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Sobrecorriente Crítica",
  "device_id": "ESP32_001_ABC123",
  "condition": {
    "parameter": "current",
    "operator": ">",
    "threshold": 25.0
  },
  "actions": [
    {
      "type": "email",
      "recipients": ["admin@empresa.cl"]
    },
    {
      "type": "cut_service",
      "delay_seconds": 300
    }
  ]
}
```

## 📈 Reportes y Analytics

### Generar Reporte PDF

```bash
POST /api/reports/generate
Content-Type: application/json
Authorization: Bearer {token}

{
  "type": "consumption_summary",
  "period": {
    "start": "2024-11-01",
    "end": "2024-11-30"
  },
  "client_ids": ["64f1a2b3c4d5e6f7g8h9i0j3"],
  "format": "pdf",
  "delivery_method": "email"
}
```

## 📱 Endpoints Móviles

### Estado del Servicio (Cliente)

```bash
GET /api/mobile/service-status
Authorization: Bearer {token}
```

### Control Rápido de Servicio

```bash
POST /api/mobile/toggle-service
Content-Type: application/json
Authorization: Bearer {token}

{
  "action": "activate",
  "confirm_payment": true
}
```

## 🔒 Endpoints de Seguridad

### Cambiar Contraseña

```bash
POST /api/security/change-password
Content-Type: application/json
Authorization: Bearer {token}

{
  "current_password": "contraseña_actual",
  "new_password": "nueva_contraseña_segura"
}
```

### Habilitar MFA

```bash
POST /api/security/mfa/enable
Authorization: Bearer {token}
```

## 📋 Códigos de Estado HTTP

| Código | Descripción                                |
| ------ | ------------------------------------------ |
| 200    | OK - Solicitud exitosa                     |
| 201    | Created - Recurso creado                   |
| 400    | Bad Request - Datos inválidos              |
| 401    | Unauthorized - Token inválido              |
| 403    | Forbidden - Sin permisos                   |
| 404    | Not Found - Recurso no encontrado          |
| 429    | Too Many Requests - Rate limit excedido    |
| 500    | Internal Server Error - Error del servidor |

## 🚫 Rate Limiting

- **Autenticación**: 5 intentos por 15 minutos
- **API General**: 100 requests por minuto
- **IoT Telemetry**: 1000 requests por 10 segundos
