# APIs Inteligentes - Electric Automatic Chile

## Resumen

Este documento describe la implementación de APIs inteligentes para predicciones de consumo eléctrico, análisis de correlaciones ambientales y mapas interactivos con capacidades anti-fraude GPS.

## Funcionalidades Implementadas

### Dashboard Cliente

#### 1. Pronóstico de Consumo
- **Ubicación**: `app/dashboard-cliente/componentes/predicciones-clima/PronosticoConsumo.tsx`
- **Funcionalidad**: Predicciones básicas de consumo basadas en clima
- **APIs utilizadas**: OpenWeatherMap (plan básico)
- **Características**:
  - Pronóstico de 3 días
  - Recomendaciones de ahorro contextuales
  - Interfaz simplificada para usuarios finales

#### 2. Consejos de Ahorro
- **Ubicación**: `app/dashboard-cliente/componentes/predicciones-clima/ConsejosAhorro.tsx`
- **Funcionalidad**: Recomendaciones personalizadas basadas en condiciones climáticas
- **Características**:
  - Consejos contextuales según temperatura y humedad
  - Cálculo de ahorro potencial
  - Sistema de seguimiento de consejos aplicados

#### 3. Índice de Calidad del Aire
- **Ubicación**: `app/dashboard-cliente/componentes/calidad-aire/IndiceCalidadAire.tsx`
- **Funcionalidad**: Monitoreo básico de calidad del aire
- **APIs utilizadas**: OpenAQ, AirVisual (backup)
- **Características**:
  - Índice AQI simplificado
  - Impacto en consumo de aires acondicionados
  - Recomendaciones de salud

### Dashboard Empresa

#### 1. Predictor de Demanda
- **Ubicación**: `app/dashboard-empresa/features/predicciones-avanzadas/PredictorDemanda.tsx`
- **Funcionalidad**: Predicciones avanzadas de demanda por zonas
- **APIs utilizadas**: OpenWeatherMap (plan profesional), WeatherAPI
- **Características**:
  - Predicciones hasta 7 días
  - Análisis por zonas geográficas
  - Alertas predictivas automáticas
  - Precisión superior al 85%

#### 2. Análisis de Correlaciones
- **Ubicación**: `app/dashboard-empresa/features/predicciones-avanzadas/AnalisisCorrelaciones.tsx`
- **Funcionalidad**: Correlaciones entre factores ambientales y consumo
- **APIs utilizadas**: OpenAQ, AirVisual, OpenWeatherMap
- **Características**:
  - Análisis de correlaciones en tiempo real
  - Visualizaciones interactivas
  - Insights accionables
  - Reportes de tendencias

## Servicios Base

### 1. WeatherService
- **Ubicación**: `lib/services/weather/WeatherService.ts`
- **Funcionalidad**: Servicio principal para datos meteorológicos
- **Características**:
  - Cache inteligente (15 minutos)
  - Manejo de errores robusto
  - Soporte para múltiples APIs
  - Rate limiting automático

### 2. WeatherPredictionService
- **Ubicación**: `lib/services/weather/WeatherPredictionService.ts`
- **Funcionalidad**: Motor de predicciones de consumo
- **Características**:
  - Algoritmos de IA para predicciones
  - Integración con datos históricos
  - Configuración personalizable
  - Cálculo de confianza

### 3. AirQualityService
- **Ubicación**: `lib/services/air-quality/AirQualityService.ts`
- **Funcionalidad**: Servicio de calidad del aire
- **Características**:
  - Integración con múltiples fuentes
  - Sistema de alertas automáticas
  - Cache de 1 hora
  - Correlaciones con consumo

## Configuración de APIs

### Variables de Entorno Requeridas

```bash
# APIs Meteorológicas
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
WEATHER_API_KEY=your-weather-api-key

# APIs Calidad del Aire
AIRVISUAL_API_KEY=your-airvisual-api-key

# APIs de Mapas y Geocoding
MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Configuración por Defecto

```typescript
// lib/config/apis.ts
export const API_CONFIG = {
  openWeatherMap: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    units: 'metric',
    language: 'es'
  },
  // ... más configuraciones
};
```

## Límites de APIs

| API | Requests/min | Requests/día | Costo |
|-----|-------------|--------------|-------|
| OpenWeatherMap | 60 | 1,000 (free) | $0-40/mes |
| WeatherAPI | 100 | 1,000,000 | $0-4/mes |
| OpenAQ | 100 | 10,000 | Gratis |
| AirVisual | 10 | 10,000 | $0-29/mes |
| Google Maps | 300 | 40,000 | $200 crédito/mes |
| Mapbox | - | 50,000 | $0-5/mes |

**Nota**: Con las APIs implementadas, el costo total estimado es de ~$350/mes para una operación completa.

## Nuevas Secciones de Soluciones

### 1. Predicciones Inteligentes
- **Ubicación**: `app/navservices/predicciones-inteligentes/page.tsx`
- **Contenido**: Sistema de predicción de demanda con IA
- **Beneficios destacados**:
  - 15% reducción de costos operativos
  - 85%+ precisión en predicciones
  - Planificación proactiva 7 días

### 2. Analytics Ambientales
- **Ubicación**: `app/navservices/analytics-ambientales/page.tsx`
- **Contenido**: Análisis de correlaciones aire/consumo
- **Beneficios destacados**:
  - Insights únicos en el mercado
  - Reportes ESG automáticos
  - 12% ahorro energético adicional

## Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install recharts
# Las demás dependencias ya están incluidas
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
# Editar .env.local con sus API keys
```

### 3. Obtener API Keys

#### OpenWeatherMap (Requerido)
1. Registrarse en [openweathermap.org](https://openweathermap.org/api)
2. Obtener API key gratuita (1000 calls/día)
3. Para uso empresarial, considerar plan profesional

#### AirVisual (Opcional)
1. Registrarse en [iqair.com](https://www.iqair.com/air-pollution-data-api)
2. Plan gratuito: 10,000 calls/mes

#### Mapbox (Para dashboard empresa)
1. Registrarse en [mapbox.com](https://www.mapbox.com/)
2. 50,000 requests/mes gratuitos

#### Google Maps (Para geocoding avanzado)
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Geocoding API
3. $200 crédito mensual gratuito

## Uso

### Dashboard Cliente

```typescript
// Ejemplo de uso en componente
import { PronosticoConsumo } from './componentes/predicciones-clima/PronosticoConsumo';

<PronosticoConsumo 
  ubicacion={{ lat: -33.4489, lon: -70.6693 }} 
  reducida={false} 
/>
```

### Dashboard Empresa

```typescript
// Ejemplo de uso avanzado
import { PredictorDemanda } from './features/predicciones-avanzadas/PredictorDemanda';

<PredictorDemanda reducida={false} />
```

## Monitoreo y Métricas

### KPIs Técnicos
- Tiempo de respuesta < 2 segundos
- Disponibilidad > 99.5%
- Precisión de predicciones > 85%
- Cache hit ratio > 80%

### KPIs de Negocio
- Reducción de costos operativos: 10-15%
- Mejora en satisfacción del cliente: +20%
- Incremento en retención: +15%

## Troubleshooting

### Errores Comunes

1. **API Key inválida**
   ```
   Error: Weather API error: 401
   Solución: Verificar API key en .env.local
   ```

2. **Rate limit excedido**
   ```
   Error: Too many requests
   Solución: Implementar rate limiting o upgrade plan
   ```

3. **Datos no disponibles**
   ```
   Error: No air quality data available
   Solución: Verificar cobertura geográfica de APIs
   ```

### 3. Mapa Básico de Ubicación
- **Ubicación**: `app/dashboard-cliente/componentes/ubicacion/MapaBasico.tsx`
- **Funcionalidad**: Visualización simple de la ubicación del medidor
- **Características**:
  - Mapa básico con ubicación del medidor
  - Validación de estado GPS
  - Integración con Google Maps
  - Información de precisión

### Dashboard Empresa - Mapas y Anti-fraude

#### 1. Mapa Interactivo
- **Ubicación**: `app/dashboard-empresa/features/gestion-geografica/MapaInteractivo.tsx`
- **Funcionalidad**: Visualización avanzada de toda la red eléctrica
- **APIs utilizadas**: Mapbox, Google Maps Platform
- **Características**:
  - Mapas interactivos con múltiples capas
  - Clustering inteligente de medidores
  - Filtros avanzados por estado y zona
  - Análisis geoespacial en tiempo real

#### 2. Sistema Anti-fraude GPS
- **Ubicación**: `app/dashboard-empresa/features/gestion-geografica/SistemaAntifraude.tsx`
- **Funcionalidad**: Detección automática de fraudes y anomalías GPS
- **APIs utilizadas**: Google Maps, Street View, Geocoding
- **Características**:
  - Detección de 4 tipos de anomalías
  - Validación cruzada con múltiples fuentes
  - Panel de investigación integrado
  - Estadísticas de fraude en tiempo real

## Servicios de Geocoding y Anti-fraude

### 1. GeocodingService
- **Ubicación**: `lib/services/geocoding/GeocodingService.ts`
- **Funcionalidad**: Geocodificación y validación de direcciones
- **Características**:
  - Soporte para Google Maps y Nominatim
  - Geocodificación inversa
  - Cálculo de distancias
  - Validación de coordenadas en Chile

### 2. AntifraudGPS
- **Ubicación**: `lib/services/geocoding/AntifraudGPS.ts`
- **Funcionalidad**: Motor de detección de fraudes GPS
- **Características**:
  - 4 tipos de detección de anomalías
  - Análisis de patrones históricos
  - Sistema de confianza y recomendaciones
  - Integración con Street View para evidencia

## Nuevas Secciones de Soluciones

### 3. Mapas Inteligentes GPS
- **Ubicación**: `app/navservices/mapas-inteligentes/page.tsx`
- **Contenido**: Sistema de mapas con GPS anti-fraude
- **Beneficios destacados**:
  - 25% reducción de fraudes
  - 18% reducción de pérdidas
  - 30% optimización de rutas
  - 40% mejora en tiempo de respuesta

## Roadmap

### Funcionalidades Completadas ✅
- [x] Mapas interactivos con GPS anti-fraude
- [x] Sistema de detección de anomalías GPS
- [x] Geocoding inteligente con múltiples fuentes
- [x] Validación cruzada con Street View

### Próximas Funcionalidades
- [ ] Integración con sistemas ERP
- [ ] Alertas por WhatsApp/SMS
- [ ] Machine Learning avanzado
- [ ] Reportes automáticos PDF
- [ ] API pública para terceros

### Mejoras Técnicas
- [ ] Redis para cache distribuido
- [ ] WebSockets para datos en tiempo real
- [ ] Microservicios para escalabilidad
- [ ] Tests automatizados E2E
- [ ] Monitoreo con Prometheus
- [ ] CI/CD con GitHub Actions

## Soporte

Para soporte técnico o consultas sobre implementación:
- Email: soporte@electricautomaticchile.com
- Documentación: [docs.electricautomaticchile.com](https://docs.electricautomaticchile.com)
- GitHub Issues: [github.com/electricautomaticchile/issues](https://github.com/electricautomaticchile/issues)