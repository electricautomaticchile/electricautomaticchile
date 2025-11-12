// Tipos para servicios meteorológicos
export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  timestamp: Date;
}

export interface WeatherForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  icon: string;
  precipitationProbability: number;
}

export interface ConsumptionPrediction {
  date: Date;
  predictedConsumption: number;
  confidence: number;
  factors: {
    temperature: number;
    humidity: number;
    historical: number;
  };
  recommendations: string[];
}

export interface WeatherAlert {
  id: string;
  type: 'heat_wave' | 'cold_snap' | 'high_humidity' | 'storm';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  affectedAreas: string[];
}

export interface WeatherConfig {
  apiKey: string;
  baseUrl: string;
  units: 'metric' | 'imperial';
  language: string;
}

export interface LocationCoordinates {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
  state?: string;
}