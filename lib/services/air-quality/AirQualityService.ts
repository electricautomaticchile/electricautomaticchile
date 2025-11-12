import { 
  AirQualityData, 
  AirQualityForecast, 
  AirQualityAlert, 
  AirQualityConfig, 
  LocationBounds,
  AirQualityStation 
} from './types';

export class AirQualityService {
  private config: AirQualityConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hora

  constructor(config: AirQualityConfig) {
    this.config = config;
  }

  /**
   * Obtiene datos actuales de calidad del aire
   */
  async getCurrentAirQuality(lat: number, lon: number): Promise<AirQualityData | null> {
    const cacheKey = `current_${lat}_${lon}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Intentar primero con OpenAQ
      let airQualityData = await this.getOpenAQData(lat, lon);
      
      // Si no hay datos de OpenAQ y tenemos AirVisual, intentar con AirVisual
      if (!airQualityData && this.config.airVisualApiKey) {
        airQualityData = await this.getAirVisualData(lat, lon);
      }

      if (airQualityData) {
        this.setCachedData(cacheKey, airQualityData);
      }

      return airQualityData;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      return null;
    }
  }

  /**
   * Obtiene datos de OpenAQ
   */
  private async getOpenAQData(lat: number, lon: number): Promise<AirQualityData | null> {
    try {
      const radius = 25000; // 25km radius
      const url = `${this.config.openAqApiUrl}/latest?coordinates=${lat},${lon}&radius=${radius}&limit=100`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenAQ API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return null;
      }

      return this.transformOpenAQData(data.results, lat, lon);
    } catch (error) {
      console.error('Error fetching OpenAQ data:', error);
      return null;
    }
  }

  /**
   * Obtiene datos de AirVisual (backup)
   */
  private async getAirVisualData(lat: number, lon: number): Promise<AirQualityData | null> {
    if (!this.config.airVisualApiKey || !this.config.airVisualApiUrl) {
      return null;
    }

    try {
      const url = `${this.config.airVisualApiUrl}/nearest_city?lat=${lat}&lon=${lon}&key=${this.config.airVisualApiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`AirVisual API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'success' || !data.data) {
        return null;
      }

      return this.transformAirVisualData(data.data, lat, lon);
    } catch (error) {
      console.error('Error fetching AirVisual data:', error);
      return null;
    }
  }

  /**
   * Transforma datos de OpenAQ
   */
  private transformOpenAQData(results: any[], lat: number, lon: number): AirQualityData {
    const measurements: { [key: string]: number } = {};
    
    // Agrupar mediciones por parámetro
    results.forEach(result => {
      const parameter = result.parameter.toLowerCase();
      if (!measurements[parameter] || new Date(result.date.utc) > new Date(measurements[parameter + '_date'])) {
        measurements[parameter] = result.value;
        measurements[parameter + '_date'] = result.date.utc;
      }
    });

    // Calcular AQI aproximado basado en PM2.5
    const pm25 = measurements['pm25'] || 0;
    const aqi = this.calculateAQIFromPM25(pm25);

    return {
      aqi,
      co: measurements['co'] || 0,
      no: measurements['no'] || 0,
      no2: measurements['no2'] || 0,
      o3: measurements['o3'] || 0,
      so2: measurements['so2'] || 0,
      pm2_5: measurements['pm25'] || 0,
      pm10: measurements['pm10'] || 0,
      nh3: measurements['nh3'] || 0,
      timestamp: new Date(),
      location: { lat, lon }
    };
  }

  /**
   * Transforma datos de AirVisual
   */
  private transformAirVisualData(data: any, lat: number, lon: number): AirQualityData {
    const current = data.current;
    const pollution = current.pollution;

    return {
      aqi: pollution.aqius || 0,
      co: 0, // AirVisual no proporciona estos datos en la API gratuita
      no: 0,
      no2: 0,
      o3: 0,
      so2: 0,
      pm2_5: pollution.p2?.v || 0,
      pm10: pollution.p1?.v || 0,
      nh3: 0,
      timestamp: new Date(pollution.ts),
      location: { lat, lon, name: data.city }
    };
  }

  /**
   * Calcula AQI aproximado desde PM2.5
   */
  private calculateAQIFromPM25(pm25: number): number {
    if (pm25 <= 12) return 1; // Good
    if (pm25 <= 35.4) return 2; // Moderate
    if (pm25 <= 55.4) return 3; // Unhealthy for Sensitive Groups
    if (pm25 <= 150.4) return 4; // Unhealthy
    return 5; // Very Unhealthy/Hazardous
  }

  /**
   * Genera alertas basadas en umbrales
   */
  async generateAirQualityAlerts(airQualityData: AirQualityData): Promise<AirQualityAlert[]> {
    const alerts: AirQualityAlert[] = [];

    // Alerta por PM2.5
    if (airQualityData.pm2_5 > this.config.alertThresholds.pm2_5) {
      alerts.push({
        id: `pm25_${Date.now()}`,
        level: this.getAlertLevel(airQualityData.pm2_5, 'pm2_5'),
        pollutant: 'PM2.5',
        value: airQualityData.pm2_5,
        threshold: this.config.alertThresholds.pm2_5,
        message: `Niveles elevados de PM2.5 detectados: ${airQualityData.pm2_5} μg/m³`,
        healthImpact: 'Puede causar irritación respiratoria y cardiovascular',
        recommendations: [
          'Limite actividades al aire libre',
          'Use purificadores de aire en interiores',
          'Considere usar mascarilla al salir'
        ],
        timestamp: new Date()
      });
    }

    // Alerta por PM10
    if (airQualityData.pm10 > this.config.alertThresholds.pm10) {
      alerts.push({
        id: `pm10_${Date.now()}`,
        level: this.getAlertLevel(airQualityData.pm10, 'pm10'),
        pollutant: 'PM10',
        value: airQualityData.pm10,
        threshold: this.config.alertThresholds.pm10,
        message: `Niveles elevados de PM10 detectados: ${airQualityData.pm10} μg/m³`,
        healthImpact: 'Puede agravar condiciones respiratorias existentes',
        recommendations: [
          'Evite ejercicio intenso al aire libre',
          'Mantenga ventanas cerradas',
          'Use sistemas de filtración de aire'
        ],
        timestamp: new Date()
      });
    }

    // Alerta por AQI general
    if (airQualityData.aqi >= this.config.alertThresholds.aqi) {
      alerts.push({
        id: `aqi_${Date.now()}`,
        level: this.getAlertLevelFromAQI(airQualityData.aqi),
        pollutant: 'AQI General',
        value: airQualityData.aqi,
        threshold: this.config.alertThresholds.aqi,
        message: `Calidad del aire deteriorada: AQI ${airQualityData.aqi}`,
        healthImpact: 'Puede afectar a personas sensibles y población general',
        recommendations: [
          'Reduzca tiempo al aire libre',
          'Aumente uso de purificadores de aire',
          'Considere ajustar sistemas HVAC'
        ],
        timestamp: new Date()
      });
    }

    return alerts;
  }

  /**
   * Obtiene nivel de alerta por contaminante
   */
  private getAlertLevel(value: number, pollutant: string): AirQualityAlert['level'] {
    const thresholds = {
      pm2_5: { moderate: 12, unhealthy_sensitive: 35.4, unhealthy: 55.4, very_unhealthy: 150.4 },
      pm10: { moderate: 54, unhealthy_sensitive: 154, unhealthy: 254, very_unhealthy: 354 }
    };

    const threshold = thresholds[pollutant as keyof typeof thresholds];
    if (!threshold) return 'moderate';

    if (value <= threshold.moderate) return 'good';
    if (value <= threshold.unhealthy_sensitive) return 'moderate';
    if (value <= threshold.unhealthy) return 'unhealthy_sensitive';
    if (value <= threshold.very_unhealthy) return 'unhealthy';
    return 'very_unhealthy';
  }

  /**
   * Obtiene nivel de alerta desde AQI
   */
  private getAlertLevelFromAQI(aqi: number): AirQualityAlert['level'] {
    if (aqi <= 1) return 'good';
    if (aqi <= 2) return 'moderate';
    if (aqi <= 3) return 'unhealthy_sensitive';
    if (aqi <= 4) return 'unhealthy';
    return 'very_unhealthy';
  }

  /**
   * Busca estaciones de monitoreo cercanas
   */
  async findNearbyStations(lat: number, lon: number, radius: number = 50000): Promise<AirQualityStation[]> {
    const cacheKey = `stations_${lat}_${lon}_${radius}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${this.config.openAqApiUrl}/locations?coordinates=${lat},${lon}&radius=${radius}&limit=50`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenAQ API error: ${response.status}`);
      }

      const data = await response.json();
      const stations = this.transformStationsData(data.results || []);
      
      this.setCachedData(cacheKey, stations);
      return stations;
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      return [];
    }
  }

  /**
   * Transforma datos de estaciones
   */
  private transformStationsData(results: any[]): AirQualityStation[] {
    return results.map(station => ({
      id: station.id?.toString() || `station_${Date.now()}_${Math.random()}`,
      name: station.name || 'Estación sin nombre',
      coordinates: {
        lat: station.coordinates?.latitude || 0,
        lon: station.coordinates?.longitude || 0
      },
      parameters: station.parameters?.map((p: any) => p.parameter) || [],
      lastUpdate: new Date(station.lastUpdated || Date.now()),
      isActive: station.isAnalysis !== false
    }));
  }

  /**
   * Obtiene recomendaciones de consumo basadas en calidad del aire
   */
  getConsumptionRecommendations(airQualityData: AirQualityData): string[] {
    const recommendations: string[] = [];

    if (airQualityData.aqi >= 3) {
      recommendations.push('Mantenga ventanas cerradas y use purificadores de aire');
      recommendations.push('Aumente la filtración de su sistema HVAC');
      recommendations.push('Considere reducir ventilación exterior en sistemas de climatización');
    }

    if (airQualityData.pm2_5 > 35) {
      recommendations.push('Active purificadores de aire para reducir partículas finas');
      recommendations.push('Evite abrir ventanas durante picos de contaminación');
    }

    if (airQualityData.pm10 > 50) {
      recommendations.push('Use filtros HEPA en sistemas de ventilación');
      recommendations.push('Limpie filtros de aire acondicionado con mayor frecuencia');
    }

    if (recommendations.length === 0) {
      recommendations.push('Calidad del aire buena - puede ventilar normalmente');
    }

    return recommendations;
  }

  /**
   * Obtiene datos del cache
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  /**
   * Guarda datos en cache
   */
  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Limpia cache expirado
   */
  public clearExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((cached, key) => {
      if (now - cached.timestamp >= this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}