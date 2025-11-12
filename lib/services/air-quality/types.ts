// Tipos para servicios de calidad del aire
export interface AirQualityData {
  aqi: number; // Air Quality Index (1-5 scale)
  co: number; // Carbon monoxide (μg/m³)
  no: number; // Nitric oxide (μg/m³)
  no2: number; // Nitrogen dioxide (μg/m³)
  o3: number; // Ozone (μg/m³)
  so2: number; // Sulphur dioxide (μg/m³)
  pm2_5: number; // PM2.5 (μg/m³)
  pm10: number; // PM10 (μg/m³)
  nh3: number; // Ammonia (μg/m³)
  timestamp: Date;
  location: {
    lat: number;
    lon: number;
    name?: string;
  };
}

export interface AirQualityForecast {
  date: Date;
  aqi: number;
  pm2_5: number;
  pm10: number;
  o3: number;
  description: string;
  healthRecommendations: string[];
}

export interface AirQualityAlert {
  id: string;
  level: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  pollutant: string;
  value: number;
  threshold: number;
  message: string;
  healthImpact: string;
  recommendations: string[];
  timestamp: Date;
}

export interface ConsumptionCorrelation {
  date: Date;
  airQuality: {
    aqi: number;
    pm2_5: number;
    pm10: number;
  };
  consumption: {
    total: number;
    hvac: number; // Heating, Ventilation, Air Conditioning
    airPurifiers: number;
  };
  correlation: {
    aqiVsHvac: number; // -1 to 1
    pm25VsAirPurifiers: number;
    overallImpact: number;
  };
  insights: string[];
}

export interface AirQualityConfig {
  openAqApiUrl: string;
  airVisualApiKey?: string;
  airVisualApiUrl?: string;
  updateInterval: number; // minutes
  alertThresholds: {
    pm2_5: number;
    pm10: number;
    aqi: number;
  };
}

export interface LocationBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface AirQualityStation {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  parameters: string[];
  lastUpdate: Date;
  isActive: boolean;
}