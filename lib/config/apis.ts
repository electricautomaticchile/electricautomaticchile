// Configuración de APIs externas
export const API_CONFIG = {
  // OpenWeatherMap API
  openWeatherMap: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    apiKey: process.env.OPENWEATHERMAP_API_KEY || '',
    units: 'metric' as const,
    language: 'es' as const
  },

  // WeatherAPI (backup)
  weatherAPI: {
    baseUrl: 'https://api.weatherapi.com/v1',
    apiKey: process.env.WEATHER_API_KEY || '',
  },

  // OpenAQ API para calidad del aire
  openAQ: {
    baseUrl: 'https://api.openaq.org/v2',
    updateInterval: 60, // minutos
    alertThresholds: {
      pm2_5: 35, // μg/m³
      pm10: 50,  // μg/m³
      aqi: 3     // escala 1-5
    }
  },

  // AirVisual API (backup para calidad del aire)
  airVisual: {
    baseUrl: 'https://api.airvisual.com/v2',
    apiKey: process.env.AIRVISUAL_API_KEY || '',
  },

  // Mapbox para mapas avanzados (dashboard empresa)
  mapbox: {
    accessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
    styleUrl: 'mapbox://styles/mapbox/streets-v11'
  },

  // Google Maps Platform (geocoding y validación)
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    baseUrl: 'https://maps.googleapis.com/maps/api'
  },

  // Nominatim para geocoding básico (dashboard cliente)
  nominatim: {
    baseUrl: 'https://nominatim.openstreetmap.org',
    userAgent: 'ElectricAutomaticChile/1.0'
  }
};

// Configuración de predicciones por defecto
export const PREDICTION_CONFIG = {
  baseConsumption: 100, // kWh base
  temperatureThreshold: 22, // °C temperatura de confort
  heatingFactor: 0.08, // 8% por grado bajo umbral
  coolingFactor: 0.12, // 12% por grado sobre umbral
  humidityFactor: 0.002, // 0.2% por punto de humedad sobre 70%
  historicalWeight: 0.3 // 30% peso de datos históricos
};

// Validación de configuración
export const validateAPIConfig = () => {
  const warnings: string[] = [];
  
  if (!API_CONFIG.openWeatherMap.apiKey) {
    warnings.push('OpenWeatherMap API key not configured');
  }
  
  if (!API_CONFIG.mapbox.accessToken) {
    warnings.push('Mapbox access token not configured (enterprise features limited)');
  }
  
  if (!API_CONFIG.googleMaps.apiKey) {
    warnings.push('Google Maps API key not configured (geocoding limited)');
  }
  
  if (warnings.length > 0) {
  }
  
  return warnings.length === 0;
};

// Rate limiting configuration
export const RATE_LIMITS = {
  openWeatherMap: {
    requestsPerMinute: 60,
    requestsPerDay: 1000
  },
  weatherAPI: {
    requestsPerMinute: 100,
    requestsPerDay: 1000000
  },
  openAQ: {
    requestsPerMinute: 100,
    requestsPerDay: 10000
  },
  airVisual: {
    requestsPerMinute: 10,
    requestsPerDay: 10000
  },
  googleMaps: {
    requestsPerMinute: 300,
    requestsPerDay: 40000
  }
};

// Cache configuration
export const CACHE_CONFIG = {
  weather: {
    current: 15 * 60 * 1000, // 15 minutos
    forecast: 60 * 60 * 1000, // 1 hora
    alerts: 30 * 60 * 1000    // 30 minutos
  },
  airQuality: {
    current: 60 * 60 * 1000,  // 1 hora
    stations: 24 * 60 * 60 * 1000 // 24 horas
  },
  geocoding: {
    results: 24 * 60 * 60 * 1000 // 24 horas
  }
};