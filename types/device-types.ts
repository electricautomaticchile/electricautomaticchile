/**
 * Tipos base para el sistema modular de dispositivos
 */

// Interfaz base para todos los dispositivos
export interface BaseDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: boolean;
  location?: string;
  lastActivity?: Date;
  metadata?: Record<string, any>;
}

// Tipos de dispositivos soportados
export type DeviceType = 'LED' | 'Sensor' | 'Relay' | 'Switch' | 'Meter' | 'Gateway' | 'Custom';

// Interfaz para dispositivos de tipo LED
export interface LEDDevice extends BaseDevice {
  type: 'LED';
  brightness?: number; // 0-100
  color?: string; // HEX color code
  supportsColor?: boolean;
}

// Interfaz para dispositivos de tipo Sensor
export interface SensorDevice extends BaseDevice {
  type: 'Sensor';
  sensorType: 'temperature' | 'humidity' | 'motion' | 'light' | 'voltage' | 'current' | 'other';
  unit?: string;
  currentValue?: number;
  minValue?: number;
  maxValue?: number;
  precision?: number;
}

// Interfaz para dispositivos de tipo Relay
export interface RelayDevice extends BaseDevice {
  type: 'Relay';
  powerRating?: number;
  connectedDevice?: string;
}

// Interfaz para dispositivos de tipo Switch
export interface SwitchDevice extends BaseDevice {
  type: 'Switch';
  multipole?: boolean;
  poles?: number;
}

// Interfaz para medidores eléctricos
export interface MeterDevice extends BaseDevice {
  type: 'Meter';
  meterType: 'energy' | 'water' | 'gas' | 'other';
  readings: ReadingData[];
  currentReading?: number;
  unit: string;
}

// Interfaz para gateways
export interface GatewayDevice extends BaseDevice {
  type: 'Gateway';
  protocol: 'wifi' | 'zigbee' | 'bluetooth' | 'zwave' | 'other';
  connectedDevices: string[];
  ipAddress?: string;
}

// Interfaz para lectura de datos
export interface ReadingData {
  timestamp: Date;
  value: number;
  unit: string;
}

// Tipo que une todos los dispositivos específicos
export type Device = 
  | LEDDevice 
  | SensorDevice 
  | RelayDevice 
  | SwitchDevice 
  | MeterDevice 
  | GatewayDevice 
  | (BaseDevice & { type: 'Custom' }); 