# Integración Arduino LED - Dashboard Empresa

## Descripción

Se ha integrado exitosamente el sistema de control LED Arduino al dashboard empresa de ElectricAutomaticChile. Esta integración permite controlar remotamente un LED Arduino desde la interfaz web empresarial.

## Características Implementadas

### 🔌 APIs REST (Next.js)

- **POST** `/api/arduino/connect` - Conectar con Arduino
- **POST** `/api/arduino/disconnect` - Desconectar Arduino
- **GET** `/api/arduino/status` - Obtener estado actual
- **POST** `/api/arduino/control/[action]` - Controlar LED (on/off/toggle)
- **GET** `/api/arduino/stats/daily` - Estadísticas diarias
- **GET** `/api/arduino/stats/hourly` - Estadísticas por horas
- **GET** `/api/arduino/stats/efficiency` - Métricas de eficiencia
- **GET** `/api/arduino/stats/export` - Exportar datos (JSON/CSV)

### 🎛️ Componente React/TypeScript

- **Versión reducida**: Para el dashboard principal (resumen)
- **Versión completa**: Pestaña dedicada con todas las funciones
- **Auto-refresh**: Actualización automática cada 5 segundos
- **Notificaciones**: Toast notifications para feedback
- **Estados visuales**: LED animado que refleja el estado real

### 📊 Base de Datos MongoDB

- **Modelo**: `ArduinoLedStats` para tracking de comandos
- **Campos**: timestamp, command, duration, source
- **Índices**: Optimizados para consultas temporales
- **Agregaciones**: Estadísticas diarias, por horas, eficiencia

### 🎨 Interfaz de Usuario

- **Diseño consistente**: Integrado con el tema del dashboard
- **Responsive**: Adaptable a móviles y desktop
- **Accesibilidad**: Iconos descriptivos y estados claros
- **Tema oscuro/claro**: Soporte completo

## Ubicación en el Dashboard

### Dashboard Principal

- **Grid 4 columnas**: Nuevo card "Control Arduino"
- **Vista resumida**: Estado conexión, LED status, estadísticas básicas
- **Controles rápidos**: Botones ON/OFF

### Pestaña Dedicada "Arduino"

- **3 sub-pestañas**:
  1. **Control**: Panel completo de control con LED visual
  2. **Estado**: Información detallada del sistema
  3. **Estadísticas**: KPIs, gráficos y exportación

### Navegación

- **Sidebar**: Nuevo icono ⚡ (Zap) para acceso rápido
- **TabsList**: Nueva pestaña "Arduino" en la barra superior

## Estructura de Archivos

```
electricautomaticchile/
├── app/
│   ├── api/arduino/
│   │   ├── connect/route.ts
│   │   ├── disconnect/route.ts
│   │   ├── status/route.ts
│   │   ├── control/[action]/route.ts
│   │   └── stats/
│   │       ├── daily/route.ts
│   │       ├── hourly/route.ts
│   │       ├── efficiency/route.ts
│   │       └── export/route.ts
│   └── dashboard-empresa/
│       ├── page.tsx (modificado)
│       └── componentes/
│           └── control-arduino.tsx (nuevo)
└── lib/
    └── arduino-database.ts (nuevo)
```

## Dependencias Agregadas

```json
{
  "dependencies": {
    "serialport": "^12.0.0"
  },
  "devDependencies": {
    "@types/serialport": "^8.0.5"
  }
}
```

## Configuración Requerida

### 1. Hardware Arduino

- **Código**: Usar `arduino_led_control.ino` del proyecto original
- **Conexión**: USB al servidor donde corre Next.js
- **Puerto**: Auto-detección o manual

### 2. Base de Datos

- **MongoDB**: Configuración existente del proyecto
- **Colección**: `arduino_led_stats` (se crea automáticamente)

### 3. Variables de Entorno

- Usar la configuración MongoDB existente del proyecto
- No se requieren variables adicionales

## Uso

### Conexión Inicial

1. Conectar Arduino por USB al servidor
2. Ir a Dashboard Empresa → Arduino
3. Hacer clic en "Conectar"
4. El sistema detectará automáticamente el puerto

### Control LED

- **Encender**: Botón "Encender" o API `POST /api/arduino/control/on`
- **Apagar**: Botón "Apagar" o API `POST /api/arduino/control/off`
- **Toggle**: Botón "Toggle" o API `POST /api/arduino/control/toggle`

### Monitoreo

- **Estado visual**: LED animado en la interfaz
- **Auto-refresh**: Actualización automática cada 5 segundos
- **Notificaciones**: Feedback inmediato de acciones

### Estadísticas

- **Tiempo real**: KPIs actualizados automáticamente
- **Exportación**: Descarga datos en JSON/CSV
- **Períodos**: 7, 14, 30, 90 días configurables

## Características Técnicas

### Seguridad

- **Validación**: Comandos validados en backend
- **Timeouts**: Conexiones con timeout configurado
- **Error handling**: Manejo robusto de errores

### Performance

- **Conexión persistente**: Reutilización de conexión serial
- **Índices DB**: Consultas optimizadas
- **Lazy loading**: Carga bajo demanda

### Escalabilidad

- **Múltiples dispositivos**: Arquitectura preparada
- **Pool de conexiones**: MongoDB optimizado
- **Cache**: Preparado para implementar

## Troubleshooting

### Problemas Comunes

1. **Arduino no detectado**

   - Verificar conexión USB
   - Comprobar drivers CH340/FTDI
   - Revisar permisos del puerto serie

2. **Error de conexión**

   - Verificar que no esté usado por otro programa
   - Reiniciar Arduino
   - Comprobar baudrate (9600)

3. **Estadísticas no cargan**
   - Verificar conexión MongoDB
   - Comprobar logs del servidor
   - Validar esquema de base de datos

### Logs

- **Browser Console**: Errores de frontend
- **Server Logs**: Errores de API y conexión
- **MongoDB Logs**: Errores de base de datos

## Próximas Mejoras

### Funcionalidades Planeadas

- [ ] Control múltiples LEDs
- [ ] Programación de horarios
- [ ] Alertas automáticas
- [ ] Dashboard en tiempo real con WebSockets
- [ ] Integración con sensores adicionales
- [ ] Control por voz
- [ ] App móvil dedicada

### Optimizaciones Técnicas

- [ ] WebSocket para tiempo real
- [ ] Cache Redis para estadísticas
- [ ] Compresión de datos históricos
- [ ] Backup automático de configuraciones
- [ ] Monitoreo de salud del sistema

## Soporte

Para soporte técnico o reportar bugs:

1. Revisar logs del sistema
2. Verificar configuración hardware
3. Comprobar conectividad de red
4. Contactar al equipo de desarrollo

---

**Integración completada exitosamente** ✅  
**Fecha**: Diciembre 2024  
**Versión**: 1.0.0
