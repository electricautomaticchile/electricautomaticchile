import { 
  MeterLocation, 
  GPSAnomaly, 
  Coordinates, 
  AntifraudConfig 
} from './types';
import { GeocodingService } from './GeocodingService';

export class AntifraudGPS {
  private config: AntifraudConfig;
  private geocodingService: GeocodingService;
  private anomalyHistory: Map<string, GPSAnomaly[]> = new Map();

  constructor(config: AntifraudConfig, geocodingService: GeocodingService) {
    this.config = config;
    this.geocodingService = geocodingService;
  }

  /**
   * Valida la ubicación de un medidor
   */
  async validateMeterLocation(meter: MeterLocation): Promise<{
    isValid: boolean;
    anomalies: GPSAnomaly[];
    confidence: number;
    recommendations: string[];
  }> {
    const anomalies: GPSAnomaly[] = [];
    let confidence = 1.0;
    const recommendations: string[] = [];

    try {
      // 1. Validar coordenadas básicas
      const basicValidation = this.validateBasicCoordinates(meter.coordinates);
      if (!basicValidation.isValid) {
        anomalies.push(...basicValidation.anomalies);
        confidence *= 0.3;
      }

      // 2. Validar contra dirección registrada
      const addressValidation = await this.validateAgainstAddress(meter);
      if (!addressValidation.isValid) {
        anomalies.push(...addressValidation.anomalies);
        confidence *= 0.7;
      }

      // 3. Detectar movimientos imposibles
      const movementValidation = this.detectImpossibleMovement(meter);
      if (!movementValidation.isValid) {
        anomalies.push(...movementValidation.anomalies);
        confidence *= 0.5;
      }

      // 4. Analizar patrones históricos
      const patternValidation = this.analyzeHistoricalPatterns(meter);
      if (!patternValidation.isValid) {
        anomalies.push(...patternValidation.anomalies);
        confidence *= 0.8;
      }

      // 5. Detectar clonación de dispositivos
      const cloningValidation = this.detectDeviceCloning(meter);
      if (!cloningValidation.isValid) {
        anomalies.push(...cloningValidation.anomalies);
        confidence *= 0.4;
      }

      // Generar recomendaciones
      recommendations.push(...this.generateRecommendations(anomalies, confidence));

      // Actualizar historial
      if (anomalies.length > 0) {
        this.updateAnomalyHistory(meter.id, anomalies);
      }

      return {
        isValid: anomalies.length === 0 || confidence > 0.7,
        anomalies,
        confidence,
        recommendations
      };

    } catch (error) {
      console.error('Error validating meter location:', error);
      return {
        isValid: false,
        anomalies: [{
          id: `validation_error_${Date.now()}`,
          type: 'signal_tampering',
          severity: 'medium',
          detectedAt: new Date(),
          description: 'Error durante la validación GPS',
          coordinates: meter.coordinates,
          evidence: {},
          status: 'pending'
        }],
        confidence: 0.5,
        recommendations: ['Revisar conectividad del dispositivo', 'Verificar manualmente la ubicación']
      };
    }
  }

  /**
   * Valida coordenadas básicas
   */
  private validateBasicCoordinates(coordinates: Coordinates): {
    isValid: boolean;
    anomalies: GPSAnomaly[];
  } {
    const anomalies: GPSAnomaly[] = [];

    // Verificar que las coordenadas sean válidas
    if (!coordinates.lat || !coordinates.lng || 
        Math.abs(coordinates.lat) > 90 || Math.abs(coordinates.lng) > 180) {
      anomalies.push({
        id: `invalid_coords_${Date.now()}`,
        type: 'signal_tampering',
        severity: 'critical',
        detectedAt: new Date(),
        description: 'Coordenadas GPS inválidas o fuera de rango',
        coordinates,
        evidence: {},
        status: 'pending'
      });
    }

    // Verificar que esté dentro de Chile
    if (!this.geocodingService.isWithinChile(coordinates)) {
      anomalies.push({
        id: `outside_chile_${Date.now()}`,
        type: 'location_mismatch',
        severity: 'high',
        detectedAt: new Date(),
        description: 'Ubicación GPS fuera del territorio chileno',
        coordinates,
        evidence: {},
        status: 'pending'
      });
    }

    // Verificar coordenadas sospechosas (0,0 o valores repetitivos)
    if ((coordinates.lat === 0 && coordinates.lng === 0) ||
        this.isRepeatingPattern(coordinates.lat.toString()) ||
        this.isRepeatingPattern(coordinates.lng.toString())) {
      anomalies.push({
        id: `suspicious_coords_${Date.now()}`,
        type: 'signal_tampering',
        severity: 'medium',
        detectedAt: new Date(),
        description: 'Coordenadas GPS sospechosas (patrón repetitivo o valores por defecto)',
        coordinates,
        evidence: {},
        status: 'pending'
      });
    }

    return {
      isValid: anomalies.length === 0,
      anomalies
    };
  }

  /**
   * Valida contra dirección registrada
   */
  private async validateAgainstAddress(meter: MeterLocation): Promise<{
    isValid: boolean;
    anomalies: GPSAnomaly[];
  }> {
    const anomalies: GPSAnomaly[] = [];

    try {
      // Geocodificar la dirección registrada
      const geocodingResults = await this.geocodingService.geocodeAddress(
        meter.address.formattedAddress
      );

      if (geocodingResults.length === 0) {
        anomalies.push({
          id: `address_not_found_${Date.now()}`,
          type: 'location_mismatch',
          severity: 'medium',
          detectedAt: new Date(),
          description: 'No se pudo geocodificar la dirección registrada',
          coordinates: meter.coordinates,
          evidence: {},
          status: 'pending'
        });
        return { isValid: false, anomalies };
      }

      const expectedCoordinates = geocodingResults[0].coordinates;
      const distance = this.geocodingService.calculateDistance(
        meter.coordinates,
        { lat: expectedCoordinates.lat, lng: expectedCoordinates.lng }
      );

      // Si la distancia es mayor al umbral permitido
      if (distance > this.config.maxAllowedDistance) {
        anomalies.push({
          id: `location_mismatch_${Date.now()}`,
          type: 'location_mismatch',
          severity: distance > this.config.maxAllowedDistance * 2 ? 'high' : 'medium',
          detectedAt: new Date(),
          description: `Ubicación GPS no coincide con dirección registrada (${Math.round(distance)}m de diferencia)`,
          coordinates: meter.coordinates,
          expectedCoordinates: { lat: expectedCoordinates.lat, lng: expectedCoordinates.lng },
          distance,
          evidence: {
            streetViewUrl: this.geocodingService.getStreetViewUrl(meter.coordinates),
            satelliteImageUrl: this.geocodingService.getSatelliteImageUrl(meter.coordinates)
          },
          status: 'pending'
        });
      }

    } catch (error) {
      console.error('Error validating against address:', error);
      anomalies.push({
        id: `address_validation_error_${Date.now()}`,
        type: 'signal_tampering',
        severity: 'low',
        detectedAt: new Date(),
        description: 'Error al validar contra dirección registrada',
        coordinates: meter.coordinates,
        evidence: {},
        status: 'pending'
      });
    }

    return {
      isValid: anomalies.length === 0,
      anomalies
    };
  }

  /**
   * Detecta movimientos imposibles
   */
  private detectImpossibleMovement(meter: MeterLocation): {
    isValid: boolean;
    anomalies: GPSAnomaly[];
  } {
    const anomalies: GPSAnomaly[] = [];
    const history = this.anomalyHistory.get(meter.id) || [];

    // Buscar registros de ubicación anteriores
    const previousLocations = history
      .filter(a => a.coordinates)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(0, 5); // Últimas 5 ubicaciones

    if (previousLocations.length === 0) {
      return { isValid: true, anomalies };
    }

    const lastLocation = previousLocations[0];
    const timeDiff = (new Date().getTime() - lastLocation.detectedAt.getTime()) / (1000 * 60 * 60); // horas
    const distance = this.geocodingService.calculateDistance(
      meter.coordinates,
      lastLocation.coordinates
    );

    // Calcular velocidad de movimiento
    const speed = distance / (timeDiff * 1000); // metros por hora

    if (speed > this.config.movementThreshold) {
      anomalies.push({
        id: `impossible_movement_${Date.now()}`,
        type: 'impossible_movement',
        severity: speed > this.config.movementThreshold * 2 ? 'critical' : 'high',
        detectedAt: new Date(),
        description: `Movimiento imposible detectado: ${Math.round(speed)}m/h (${Math.round(distance)}m en ${timeDiff.toFixed(1)}h)`,
        coordinates: meter.coordinates,
        expectedCoordinates: lastLocation.coordinates,
        distance,
        evidence: {
          movementPattern: [lastLocation.coordinates, meter.coordinates],
          streetViewUrl: this.geocodingService.getStreetViewUrl(meter.coordinates)
        },
        status: 'pending'
      });
    }

    return {
      isValid: anomalies.length === 0,
      anomalies
    };
  }

  /**
   * Analiza patrones históricos
   */
  private analyzeHistoricalPatterns(meter: MeterLocation): {
    isValid: boolean;
    anomalies: GPSAnomaly[];
  } {
    const anomalies: GPSAnomaly[] = [];
    const history = this.anomalyHistory.get(meter.id) || [];

    // Contar anomalías recientes (últimas 24 horas)
    const recentAnomalies = history.filter(
      a => new Date().getTime() - a.detectedAt.getTime() < 24 * 60 * 60 * 1000
    );

    // Si hay muchas anomalías recientes, es sospechoso
    if (recentAnomalies.length >= 3) {
      anomalies.push({
        id: `pattern_anomaly_${Date.now()}`,
        type: 'signal_tampering',
        severity: 'high',
        detectedAt: new Date(),
        description: `Patrón anómalo: ${recentAnomalies.length} anomalías en las últimas 24 horas`,
        coordinates: meter.coordinates,
        evidence: {},
        status: 'pending'
      });
    }

    // Detectar patrones de ubicación repetitivos sospechosos
    const locationCounts = new Map<string, number>();
    history.forEach(a => {
      const key = `${a.coordinates.lat.toFixed(6)}_${a.coordinates.lng.toFixed(6)}`;
      locationCounts.set(key, (locationCounts.get(key) || 0) + 1);
    });

    locationCounts.forEach((count, location) => {
      if (count > 10) { // Más de 10 reportes en la misma ubicación exacta
        anomalies.push({
          id: `repetitive_location_${Date.now()}`,
          type: 'signal_tampering',
          severity: 'medium',
          detectedAt: new Date(),
          description: `Ubicación repetitiva sospechosa: ${count} reportes en coordenadas idénticas`,
          coordinates: meter.coordinates,
          evidence: {},
          status: 'pending'
        });
      }
    });

    return {
      isValid: anomalies.length === 0,
      anomalies
    };
  }

  /**
   * Detecta clonación de dispositivos
   */
  private detectDeviceCloning(meter: MeterLocation): {
    isValid: boolean;
    anomalies: GPSAnomaly[];
  } {
    const anomalies: GPSAnomaly[] = [];

    // Esta función requeriría acceso a una base de datos de todos los medidores
    // Por ahora, implementamos validaciones básicas

    // Verificar si el número de serie es válido
    if (!meter.deviceInfo.serialNumber || 
        meter.deviceInfo.serialNumber.length < 8 ||
        this.isRepeatingPattern(meter.deviceInfo.serialNumber)) {
      anomalies.push({
        id: `invalid_serial_${Date.now()}`,
        type: 'device_cloning',
        severity: 'high',
        detectedAt: new Date(),
        description: 'Número de serie del dispositivo inválido o sospechoso',
        coordinates: meter.coordinates,
        evidence: {},
        status: 'pending'
      });
    }

    return {
      isValid: anomalies.length === 0,
      anomalies
    };
  }

  /**
   * Genera recomendaciones basadas en anomalías
   */
  private generateRecommendations(anomalies: GPSAnomaly[], confidence: number): string[] {
    const recommendations: string[] = [];

    if (confidence < 0.3) {
      recommendations.push('URGENTE: Inspección física inmediata requerida');
      recommendations.push('Suspender servicio hasta verificación');
    } else if (confidence < 0.5) {
      recommendations.push('Programar inspección física en 24-48 horas');
      recommendations.push('Aumentar frecuencia de monitoreo GPS');
    } else if (confidence < 0.7) {
      recommendations.push('Verificar ubicación en próxima visita de mantenimiento');
      recommendations.push('Monitorear patrones durante la próxima semana');
    }

    // Recomendaciones específicas por tipo de anomalía
    const anomalyTypes = new Set(anomalies.map(a => a.type));

    if (anomalyTypes.has('location_mismatch')) {
      recommendations.push('Actualizar dirección registrada si es necesario');
      recommendations.push('Verificar con Street View la ubicación reportada');
    }

    if (anomalyTypes.has('impossible_movement')) {
      recommendations.push('Investigar posible manipulación del dispositivo');
      recommendations.push('Verificar integridad física del medidor');
    }

    if (anomalyTypes.has('device_cloning')) {
      recommendations.push('Verificar autenticidad del dispositivo');
      recommendations.push('Revisar registros de instalación');
    }

    if (anomalyTypes.has('signal_tampering')) {
      recommendations.push('Revisar conectividad y señal GPS');
      recommendations.push('Verificar integridad del hardware GPS');
    }

    // Eliminar duplicados
    const uniqueRecommendations: string[] = [];
    const seen = new Set<string>();
    recommendations.forEach(rec => {
      if (!seen.has(rec)) {
        seen.add(rec);
        uniqueRecommendations.push(rec);
      }
    });
    return uniqueRecommendations;
  }

  /**
   * Actualiza historial de anomalías
   */
  private updateAnomalyHistory(meterId: string, anomalies: GPSAnomaly[]): void {
    const existing = this.anomalyHistory.get(meterId) || [];
    const updated = [...existing, ...anomalies];
    
    // Mantener solo los últimos 100 registros
    if (updated.length > 100) {
      updated.splice(0, updated.length - 100);
    }
    
    this.anomalyHistory.set(meterId, updated);
  }

  /**
   * Detecta patrones repetitivos en strings
   */
  private isRepeatingPattern(str: string): boolean {
    if (str.length < 4) return false;
    
    // Verificar si todos los caracteres son iguales
    if (new Set(str).size === 1) return true;
    
    // Verificar patrones simples como "1234", "abcd", etc.
    const isSequential = str.split('').every((char, index) => {
      if (index === 0) return true;
      const prevCode = str.charCodeAt(index - 1);
      const currentCode = char.charCodeAt(0);
      return currentCode === prevCode + 1;
    });
    
    return isSequential;
  }

  /**
   * Obtiene estadísticas de fraude
   */
  getAntifraudStats(): {
    totalMeters: number;
    anomaliesDetected: number;
    criticalAnomalies: number;
    fraudDetectionRate: number;
    topAnomalyTypes: Array<{ type: string; count: number }>;
  } {
    let totalAnomalies = 0;
    let criticalAnomalies = 0;
    const anomalyTypeCounts = new Map<string, number>();

    this.anomalyHistory.forEach((anomalies) => {
      totalAnomalies += anomalies.length;
      
      anomalies.forEach(anomaly => {
        if (anomaly.severity === 'critical') {
          criticalAnomalies++;
        }
        
        const count = anomalyTypeCounts.get(anomaly.type) || 0;
        anomalyTypeCounts.set(anomaly.type, count + 1);
      });
    });

    const topAnomalyTypes: Array<{ type: string; count: number }> = [];
    anomalyTypeCounts.forEach((count, type) => {
      topAnomalyTypes.push({ type, count });
    });
    topAnomalyTypes.sort((a, b) => b.count - a.count).splice(5);

    return {
      totalMeters: this.anomalyHistory.size,
      anomaliesDetected: totalAnomalies,
      criticalAnomalies,
      fraudDetectionRate: this.anomalyHistory.size > 0 ? (totalAnomalies / this.anomalyHistory.size) * 100 : 0,
      topAnomalyTypes
    };
  }

  /**
   * Limpia historial antiguo
   */
  cleanOldHistory(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const meterIdsToProcess: string[] = [];
    this.anomalyHistory.forEach((anomalies, meterId) => {
      meterIdsToProcess.push(meterId);
    });

    meterIdsToProcess.forEach(meterId => {
      const anomalies = this.anomalyHistory.get(meterId);
      if (anomalies) {
        const filtered = anomalies.filter(a => a.detectedAt > cutoffDate);
        
        if (filtered.length === 0) {
          this.anomalyHistory.delete(meterId);
        } else {
          this.anomalyHistory.set(meterId, filtered);
        }
      }
    });
  }
}