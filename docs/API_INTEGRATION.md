# Integración con API - Frontend

## 🔗 Endpoints Utilizados

### Autenticación

```typescript
POST / api / auth / login;
Body: {
  (email, password);
}
Response: {
  (token, user);
}

GET / api / auth / me;
Headers: {
  Authorization: Bearer<token>;
}
Response: {
  user;
}
```

### Clientes

```typescript
GET /api/clientes
Response: { success, data: Cliente[] }

GET /api/clientes/:id
Response: { success, data: Cliente }

GET /api/clientes/mi-dispositivo
Response: { success, data: { dispositivoId, clienteNombre } }
```

### Dispositivos

```typescript
GET /api/dispositivos
Response: { success, data: Dispositivo[] }

GET /api/dispositivos/numero/:numeroDispositivo
Response: { success, data: Dispositivo }

PUT /api/dispositivos/numero/:numeroDispositivo/ultima-lectura
Body: { voltage, current, activePower, energy, cost }
Response: { success, data: Dispositivo }
```

### Estadísticas

```typescript
GET /api/estadisticas/consumo-electrico/:clienteId
Query: { periodo: 'mensual' | 'diario' | 'horario', año: number, mes?: number }
Response: {
  success,
  data: {
    periodo,
    fechaInicio,
    fechaFin,
    consumoActual,
    costoEstimado,
    consumoPromedio,
    consumoMaximo,
    consumoMinimo,
    tarifaKwh,
    datosGrafico: []
  }
}
```

## 🛠️ Servicios API

### apiService

```typescript
// lib/api/apiService.ts

// Autenticación
login(email, password);
getCurrentUser();

// Clientes
obtenerClientes();
obtenerClientePorId(id);

// Dispositivos
obtenerDispositivos();
obtenerDispositivoPorNumero(numero);

// Estadísticas
obtenerEstadisticasConsumoCliente(clienteId, params);
```

### baseService

```typescript
// lib/api/utils/baseService.ts

get<T>(endpoint, config?)
post<T>(endpoint, data, config?)
put<T>(endpoint, data, config?)
delete<T>(endpoint, config?)
```

## 🔄 Manejo de Errores

```typescript
try {
  const response = await apiService.login(email, password);
  if (response.success) {
    // Éxito
  }
} catch (error) {
  if (error.response?.status === 401) {
    // No autorizado
  } else if (error.response?.status === 404) {
    // No encontrado
  } else {
    // Error de red u otro
  }
}
```

## 🔐 Headers Automáticos

Todos los requests incluyen automáticamente:

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>' // Si existe
}
```

## ⚡ Interceptores

### Request Interceptor

- Agrega token JWT automáticamente
- Agrega headers comunes

### Response Interceptor

- Maneja errores 401 (redirige a login)
- Maneja errores de red
- Transforma respuestas
