import { WeatherData, WeatherForecast, WeatherAlert, WeatherConfig, LocationCoordinates } from './types';

export class WeatherService {
  private config: WeatherConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutos

  constructor(config: WeatherConfig) {
    this.config = config;
  }

  /**
   * Obtiene datos meteorológicos actuales
   */
  async getCurrentWeather(location: LocationCoordinates): Promise<WeatherData> {
    const cacheKey = `current_${location.lat}_${location.lon}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${this.config.baseUrl}/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.config.apiKey}&units=${this.config.units}&lang=${this.config.language}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const weatherData = this.transformCurrentWeatherData(data);
      
      this.setCachedData(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch current weather data');
    }
  }

  /**
   * Obtiene pronóstico meteorológico de 5 días
   */
  async getForecast(location: LocationCoordinates, days: number = 5): Promise<WeatherForecast[]> {
    const cacheKey = `forecast_${location.lat}_${location.lon}_${days}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${this.config.baseUrl}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${this.config.apiKey}&units=${this.config.units}&lang=${this.config.language}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const forecast = this.transformForecastData(data, days);
      
      this.setCachedData(cacheKey, forecast);
      return forecast;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Obtiene alertas meteorológicas
   */
  async getWeatherAlerts(location: LocationCoordinates): Promise<WeatherAlert[]> {
    const cacheKey = `alerts_${location.lat}_${location.lon}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Para alertas usamos OneCall API si está disponible
      const url = `${this.config.baseUrl}/onecall?lat=${location.lat}&lon=${location.lon}&appid=${this.config.apiKey}&exclude=minutely,hourly&units=${this.config.units}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        // Si OneCall no está disponible, retornamos alertas vacías
        return [];
      }

      const data = await response.json();
      const alerts = this.transformAlertsData(data.alerts || []);
      
      this.setCachedData(cacheKey, alerts);
      return alerts;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return []; // Retornamos array vacío en caso de error
    }
  }

  /**
   * Transforma datos actuales de la API
   */
  private transformCurrentWeatherData(data: any): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind?.speed || 0,
      windDirection: data.wind?.deg || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: new Date()
    };
  }

  /**
   * Transforma datos de pronóstico de la API
   */
  private transformForecastData(data: any, days: number): WeatherForecast[] {
    const forecasts: WeatherForecast[] = [];
    const dailyData = new Map<string, any[]>();

    // Agrupar por día
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, []);
      }
      dailyData.get(dateKey)!.push(item);
    });

    // Procesar cada día
    let count = 0;
    const dateKeys: string[] = [];
    dailyData.forEach((dayData, dateKey) => {
      dateKeys.push(dateKey);
    });

    for (const dateKey of dateKeys) {
      if (count >= days) break;
      
      const dayData = dailyData.get(dateKey)!;
      const temps = dayData.map(item => item.main.temp);
      const humidities = dayData.map(item => item.main.humidity);
      const precipProbs = dayData.map(item => (item.pop || 0) * 100);

      forecasts.push({
        date: new Date(dateKey),
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
        description: dayData[0].weather[0].description,
        icon: dayData[0].weather[0].icon,
        precipitationProbability: Math.round(Math.max(...precipProbs))
      });

      count++;
    }

    return forecasts;
  }

  /**
   * Transforma datos de alertas de la API
   */
  private transformAlertsData(alerts: any[]): WeatherAlert[] {
    return alerts.map((alert: any, index: number) => ({
      id: `alert_${index}_${Date.now()}`,
      type: this.mapAlertType(alert.event),
      severity: this.mapAlertSeverity(alert.severity),
      title: alert.event,
      description: alert.description,
      startDate: new Date(alert.start * 1000),
      endDate: new Date(alert.end * 1000),
      affectedAreas: alert.areas || []
    }));
  }

  /**
   * Mapea tipos de alerta
   */
  private mapAlertType(event: string): WeatherAlert['type'] {
    const eventLower = event.toLowerCase();
    if (eventLower.includes('heat') || eventLower.includes('hot')) return 'heat_wave';
    if (eventLower.includes('cold') || eventLower.includes('freeze')) return 'cold_snap';
    if (eventLower.includes('humid')) return 'high_humidity';
    if (eventLower.includes('storm') || eventLower.includes('thunder')) return 'storm';
    return 'storm'; // default
  }

  /**
   * Mapea severidad de alerta
   */
  private mapAlertSeverity(severity: string): WeatherAlert['severity'] {
    const severityLower = severity?.toLowerCase() || '';
    if (severityLower.includes('extreme') || severityLower.includes('severe')) return 'high';
    if (severityLower.includes('moderate')) return 'medium';
    return 'low';
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