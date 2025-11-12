// Tipos para servicios de geocoding y mapas
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  number?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  formattedAddress: string;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  address: Address;
  accuracy: 'ROOFTOP' | 'RANGE_INTERPOLATED' | 'GEOMETRIC_CENTER' | 'APPROXIMATE';
  placeId?: string;
  types: string[];
}

export interface ReverseGeocodingResult {
  address: Address;
  placeId?: string;
  types: string[];
}

export interface MeterLocation {
  id: string;
  customerId: string;
  customerName: string;
  coordinates: Coordinates;
  address: Address;
  installationDate: Date;
  lastValidation?: Date;
  status: 'active' | 'inactive' | 'suspicious' | 'fraud_detected';
  deviceInfo: {
    serialNumber: string;
    model: string;
    manufacturer: string;
  };
  gpsValidation: {
    isValidated: boolean;
    lastGPSCheck: Date;
    accuracy: number; // metros
    confidence: number; // 0-1
    anomalies: GPSAnomaly[];
  };
}

export interface GPSAnomaly {
  id: string;
  type: 'location_mismatch' | 'impossible_movement' | 'signal_tampering' | 'device_cloning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  description: string;
  coordinates: Coordinates;
  expectedCoordinates?: Coordinates;
  distance?: number; // metros de diferencia
  evidence: {
    streetViewUrl?: string;
    satelliteImageUrl?: string;
    movementPattern?: Coordinates[];
    signalStrength?: number;
  };
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  investigationNotes?: string;
}

export interface MapBounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface MapCluster {
  id: string;
  coordinates: Coordinates;
  count: number;
  meters: MeterLocation[];
  bounds: MapBounds;
  averageConsumption?: number;
  anomalyCount: number;
}

export interface RouteOptimization {
  waypoints: Coordinates[];
  distance: number; // metros
  duration: number; // segundos
  optimizedOrder: number[];
  estimatedCost: number;
}

export interface GeocodingConfig {
  googleMapsApiKey: string;
  mapboxAccessToken: string;
  nominatimUserAgent: string;
  defaultCountry: string;
  defaultLanguage: string;
  cacheTimeout: number;
}

export interface AntifraudConfig {
  maxAllowedDistance: number; // metros
  movementThreshold: number; // metros/hora
  signalStrengthThreshold: number;
  validationInterval: number; // horas
  alertThresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface MapStyle {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  category: 'street' | 'satellite' | 'hybrid' | 'terrain' | 'custom';
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'meters' | 'consumption' | 'anomalies' | 'weather' | 'air_quality' | 'zones';
  visible: boolean;
  opacity: number;
  color: string;
  data?: any[];
}

export interface HeatmapData {
  coordinates: Coordinates;
  intensity: number;
  value: number;
  label?: string;
  color?: string;
}