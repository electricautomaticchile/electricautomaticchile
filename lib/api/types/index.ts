// Re-exportar types desde la carpeta types/ global
export type {
  ApiResponse,
  PaginationParams,
  FilterParams,
} from "@/types/api";

export type {
  ICliente,
  ICrearCliente,
  IActualizarCliente,
} from "@/types/cliente";

export type {
  IEmpresa,
  ICrearEmpresa,
  IActualizarEmpresa,
  CrearEmpresaResponse,
  ResetearPasswordEmpresaResponse,
} from "@/types/empresa";

export type {
  ICotizacion,
  ICrearCotizacion,
  IActualizarCotizacion,
} from "@/types/cotizacion";

export type {
  AuthUser,
  UserRole,
  UserType,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Usuario,
} from "@/types/auth";

export type {
  Device,
  DeviceType,
  BaseDevice,
  LEDDevice,
  SensorDevice,
  RelayDevice,
  SwitchDevice,
  MeterDevice,
  GatewayDevice,
} from "@/types/device-types";
