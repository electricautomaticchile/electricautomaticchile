import { WeatherService } from './WeatherService';
import { WeatherData, WeatherForecast, ConsumptionPrediction, LocationCoordinates } from './types';

export interface HistoricalConsumptionData {
  date: Date;
  consumption: number;
  temperature: number;
  humidity: number;
}

export interface PredictionConfig {
  baseConsumption: number; // Consumo base en kWh
  temperatureThreshold: number; // Temperatura de confort (°C)
  heatingFactor: number; // Factor de calefacción por grado
  coolingFactor: number; // Factor de refrigeración por grado
  humidityFactor: number; // Factor de humedad
  historicalWeight: number; // Peso de datos históricos (0-1)
}

export class WeatherPredictionService {
  private weatherService: WeatherService;
  private config: PredictionConfig;

  constructor(weatherService: WeatherService, config: PredictionConfig) {
    this.weatherService = weatherService;
    this.config = config;
  }

  /**
   * Genera predicciones de consumo basadas en pronóstico meteorológico
   */
  async generateConsumptionPredictions(
    location: LocationCoordinates,
    days: number = 3,
    historicalData?: HistoricalConsumptionData[]
  ): Promise<ConsumptionPrediction[]> {
    try {
      const forecast = await this.weatherService.getForecast(location, days);
      const predictions: ConsumptionPrediction[] = [];

      for (const forecastDay of forecast) {
        const prediction = this.calculateConsumptionPrediction(
          forecastDay,
          historicalData
        );
        predictions.push(prediction);
      }

      return predictions;
    } catch (error) {
      console.error('Error generating consumption predictions:', error);
      throw new Error('Failed to generate consumption predictions');
    }
  }

  /**
   * Calcula predicción de consumo para un día específico
   */
  private calculateConsumptionPrediction(
    forecast: WeatherForecast,
    historicalData?: HistoricalConsumptionData[]
  ): ConsumptionPrediction {
    const avgTemp = (forecast.tempMin + forecast.tempMax) / 2;
    
    // Calcular factores de consumo
    const temperatureFactor = this.calculateTemperatureFactor(avgTemp);
    const humidityFactor = this.calculateHumidityFactor(forecast.humidity);
    const historicalFactor = this.calculateHistoricalFactor(
      forecast.date,
      historicalData
    );

    // Predicción base
    let predictedConsumption = this.config.baseConsumption;
    
    // Aplicar factores
    predictedConsumption *= (1 + temperatureFactor);
    predictedConsumption *= (1 + humidityFactor);
    
    // Incorporar datos históricos si están disponibles
    if (historicalFactor > 0) {
      predictedConsumption = (
        predictedConsumption * (1 - this.config.historicalWeight) +
        historicalFactor * this.config.historicalWeight
      );
    }

    // Calcular confianza de la predicción
    const confidence = this.calculatePredictionConfidence(
      forecast,
      historicalData
    );

    // Generar recomendaciones
    const recommendations = this.generateRecommendations(
      avgTemp,
      forecast.humidity,
      predictedConsumption
    );

    return {
      date: forecast.date,
      predictedConsumption: Math.round(predictedConsumption * 100) / 100,
      confidence,
      factors: {
        temperature: temperatureFactor,
        humidity: humidityFactor,
        historical: historicalFactor
      },
      recommendations
    };
  }

  /**
   * Calcula factor de temperatura para consumo
   */
  private calculateTemperatureFactor(temperature: number): number {
    const threshold = this.config.temperatureThreshold;
    
    if (temperature > threshold) {
      // Necesidad de refrigeración
      return (temperature - threshold) * this.config.coolingFactor;
    } else if (temperature < threshold) {
      // Necesidad de calefacción
      return (threshold - temperature) * this.config.heatingFactor;
    }
    
    return 0; // Temperatura de confort
  }

  /**
   * Calcula factor de humedad para consumo
   */
  private calculateHumidityFactor(humidity: number): number {
    // Humedad alta aumenta sensación térmica y uso de AC
    if (humidity > 70) {
      return (humidity - 70) * this.config.humidityFactor;
    }
    return 0;
  }

  /**
   * Calcula factor histórico basado en datos previos
   */
  private calculateHistoricalFactor(
    targetDate: Date,
    historicalData?: HistoricalConsumptionData[]
  ): number {
    if (!historicalData || historicalData.length === 0) {
      return 0;
    }

    // Buscar datos del mismo día del año anterior
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const similarDays = historicalData.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate.getMonth() === targetMonth && 
             Math.abs(dataDate.getDate() - targetDay) <= 3;
    });

    if (similarDays.length === 0) {
      return 0;
    }

    // Promedio de consumo en días similares
    const avgConsumption = similarDays.reduce((sum, data) => sum + data.consumption, 0) / similarDays.length;
    return avgConsumption;
  }

  /**
   * Calcula confianza de la predicción
   */
  private calculatePredictionConfidence(
    forecast: WeatherForecast,
    historicalData?: HistoricalConsumptionData[]
  ): number {
    let confidence = 0.7; // Confianza base

    // Reducir confianza si hay alta probabilidad de precipitación
    if (forecast.precipitationProbability > 50) {
      confidence -= 0.1;
    }

    // Aumentar confianza si tenemos datos históricos
    if (historicalData && historicalData.length > 10) {
      confidence += 0.2;
    }

    // Reducir confianza en temperaturas extremas
    const avgTemp = (forecast.tempMin + forecast.tempMax) / 2;
    if (avgTemp < 0 || avgTemp > 35) {
      confidence -= 0.1;
    }

    return Math.max(0.3, Math.min(0.95, confidence));
  }

  /**
   * Genera recomendaciones de ahorro energético
   */
  private generateRecommendations(
    temperature: number,
    humidity: number,
    predictedConsumption: number
  ): string[] {
    const recommendations: string[] = [];
    const threshold = this.config.temperatureThreshold;

    if (temperature > threshold + 5) {
      recommendations.push('Considere usar ventiladores antes que aire acondicionado');
      recommendations.push('Mantenga cortinas cerradas durante las horas de mayor calor');
      recommendations.push('Configure el AC a 24°C para optimizar consumo');
    } else if (temperature < threshold - 5) {
      recommendations.push('Use ropa abrigada antes de aumentar la calefacción');
      recommendations.push('Selle ventanas y puertas para evitar pérdidas de calor');
      recommendations.push('Configure calefacción a 20°C para eficiencia óptima');
    }

    if (humidity > 70) {
      recommendations.push('Use deshumidificador para mejorar confort térmico');
      recommendations.push('Ventile durante horas de menor humedad');
    }

    if (predictedConsumption > this.config.baseConsumption * 1.3) {
      recommendations.push('Se prevé alto consumo - revise electrodomésticos innecesarios');
      recommendations.push('Considere diferir uso de equipos de alto consumo');
    }

    return recommendations;
  }

  /**
   * Obtiene predicción simple para cliente básico
   */
  async getSimplePrediction(
    location: LocationCoordinates
  ): Promise<{
    today: number;
    tomorrow: number;
    dayAfter: number;
    trend: 'up' | 'down' | 'stable';
    mainRecommendation: string;
  }> {
    try {
      const predictions = await this.generateConsumptionPredictions(location, 3);
      
      if (predictions.length < 3) {
        throw new Error('Insufficient prediction data');
      }

      const today = predictions[0].predictedConsumption;
      const tomorrow = predictions[1].predictedConsumption;
      const dayAfter = predictions[2].predictedConsumption;

      // Determinar tendencia
      let trend: 'up' | 'down' | 'stable' = 'stable';
      const avgChange = ((tomorrow - today) + (dayAfter - tomorrow)) / 2;
      
      if (avgChange > today * 0.1) trend = 'up';
      else if (avgChange < -today * 0.1) trend = 'down';

      // Recomendación principal
      const allRecommendations = predictions.flatMap(p => p.recommendations);
      const mainRecommendation = allRecommendations[0] || 'Mantenga sus hábitos de consumo actuales';

      return {
        today,
        tomorrow,
        dayAfter,
        trend,
        mainRecommendation
      };
    } catch (error) {
      console.error('Error getting simple prediction:', error);
      throw new Error('Failed to get consumption prediction');
    }
  }

  /**
   * Actualiza configuración de predicción
   */
  updateConfig(newConfig: Partial<PredictionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}