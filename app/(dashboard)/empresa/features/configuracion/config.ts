import {
  DatosEmpresa,
  ContactoPrincipal,
  ConfiguracionNotificaciones,
  EstadosCarga,
} from "./types";

// Datos por defecto para nueva empresa
export const DATOS_EMPRESA_DEFAULT: DatosEmpresa = {
  nombreEmpresa: "",
  razonSocial: "",
  rut: "",
  correo: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  region: "",
  contactoPrincipal: {
    nombre: "",
    cargo: "",
    telefono: "",
    correo: "",
  },
};

// Configuración de notificaciones por defecto
export const NOTIFICACIONES_DEFAULT: ConfiguracionNotificaciones = {
  emailHabilitadas: true,
  notificacionesFacturacion: true,
  notificacionesConsumo: true,
  notificacionesAlertas: true,
};

// Estados de carga por defecto
export const ESTADOS_CARGA_DEFAULT: EstadosCarga = {
  loading: false,
  saving: false,
  loadingNotificaciones: false,
  savingNotificaciones: false,
};

// Reglas de validación
export const VALIDACION_REGLAS = {
  nombreEmpresa: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  rut: {
    required: true,
    pattern: /^[0-9]+-[0-9kK]$/,
  },
  correo: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  telefono: {
    required: false,
    pattern: /^(\+56|56)?[-\s]?[2-9]\d{7,8}$/,
  },
};

// Configuración de campos del formulario
export const CAMPOS_EMPRESA = [
  {
    id: "nombreEmpresa",
    label: "Nombre de la Empresa",
    placeholder: "Nombre comercial de la empresa",
    type: "text",
    required: true,
    gridCols: "md:col-span-1",
  },
  {
    id: "razonSocial",
    label: "Razón Social",
    placeholder: "Razón social legal",
    type: "text",
    required: true,
    gridCols: "md:col-span-1",
  },
  {
    id: "rut",
    label: "RUT",
    placeholder: "12.345.678-9",
    type: "text",
    required: true,
    gridCols: "md:col-span-1",
  },
  {
    id: "correo",
    label: "Correo Electrónico",
    placeholder: "contacto@empresa.com",
    type: "email",
    required: true,
    gridCols: "md:col-span-1",
  },
  {
    id: "telefono",
    label: "Teléfono",
    placeholder: "+56 9 1234 5678",
    type: "tel",
    required: false,
    gridCols: "md:col-span-1",
  },
  {
    id: "ciudad",
    label: "Ciudad",
    placeholder: "Santiago",
    type: "text",
    required: false,
    gridCols: "md:col-span-1",
  },
  {
    id: "region",
    label: "Región",
    placeholder: "Región Metropolitana",
    type: "text",
    required: false,
    gridCols: "md:col-span-1",
  },
  {
    id: "direccion",
    label: "Dirección",
    placeholder: "Dirección completa de la empresa",
    type: "text",
    required: false,
    gridCols: "md:col-span-2",
  },
];

// Configuración de campos del contacto principal
export const CAMPOS_CONTACTO = [
  {
    id: "nombre",
    label: "Nombre Completo",
    placeholder: "Nombre del contacto principal",
    type: "text",
    required: true,
  },
  {
    id: "cargo",
    label: "Cargo",
    placeholder: "Gerente General, CEO, etc.",
    type: "text",
    required: false,
  },
  {
    id: "telefono",
    label: "Teléfono",
    placeholder: "+56 9 1234 5678",
    type: "tel",
    required: false,
  },
  {
    id: "correo",
    label: "Correo Electrónico",
    placeholder: "contacto@empresa.com",
    type: "email",
    required: false,
  },
];

// Configuración de pestañas
export const TABS_CONFIGURACION = [
  {
    value: "general",
    label: "Datos Generales",
    icon: "Building2",
  },
  {
    value: "notificaciones",
    label: "Notificaciones",
    icon: "Bell",
  },
];

// Mensajes del sistema
export const MENSAJES_SISTEMA = {
  carga: {
    empresa: "Cargando datos de la empresa...",
    notificaciones: "Cargando configuración...",
  },
  guardado: {
    empresa: "Los datos de la empresa se han actualizado exitosamente",
    notificaciones: "Las preferencias de notificaciones se han actualizado",
  },
  error: {
    carga: "Error al cargar los datos de la empresa",
    guardado: "Error al guardar la configuración",
    noEmpresa: "No se pudo identificar la empresa",
    sesion: "Por favor, inicie sesión nuevamente",
  },
};

// Configuración de regiones de Chile
export const REGIONES_CHILE = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región Aysén del General Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena",
];

// Configuraciones de notificaciones disponibles
export const TIPOS_NOTIFICACIONES = [
  {
    id: "emailHabilitadas",
    label: "Notificaciones por Email",
    descripcion: "Recibir notificaciones por correo electrónico",
  },
  {
    id: "notificacionesFacturacion",
    label: "Notificaciones de Facturación",
    descripcion: "Alertas sobre facturación y pagos",
  },
  {
    id: "notificacionesConsumo",
    label: "Notificaciones de Consumo",
    descripcion: "Alertas sobre consumo energético",
  },
  {
    id: "notificacionesAlertas",
    label: "Notificaciones de Alertas",
    descripcion: "Alertas del sistema y dispositivos",
  },
];

// Funciones de validación
export const VALIDADORES = {
  validarRUT: (rut: string): boolean => {
    if (!rut) return false;

    // Limpiar el RUT
    const rutLimpio = rut.replace(/[.-]/g, "");

    // Validar formato básico
    if (!/^[0-9]+[0-9kK]$/.test(rutLimpio)) return false;

    // Extraer dígitos y verificador
    const rutDigitos = rutLimpio.slice(0, -1);
    const verificador = rutLimpio.slice(-1).toLowerCase();

    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;

    for (let i = rutDigitos.length - 1; i >= 0; i--) {
      suma += parseInt(rutDigitos[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const digitoCalculado =
      resto === 0 ? "0" : resto === 1 ? "k" : (11 - resto).toString();

    return verificador === digitoCalculado;
  },

  validarEmail: (email: string): boolean => {
    return VALIDACION_REGLAS.correo.pattern.test(email);
  },

  validarTelefono: (telefono: string): boolean => {
    if (!telefono) return true; // No es requerido
    return VALIDACION_REGLAS.telefono.pattern.test(telefono);
  },

  validarRequerido: (valor: string): boolean => {
    return valor.trim().length > 0;
  },
};

// Utilidades de formateo
export const FORMATEADORES = {
  formatearRUT: (rut: string): string => {
    const rutLimpio = rut.replace(/[.-]/g, "");
    if (rutLimpio.length < 2) return rut;

    const cuerpo = rutLimpio.slice(0, -1);
    const verificador = rutLimpio.slice(-1);

    // Agregar puntos cada 3 dígitos desde la derecha
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${cuerpoFormateado}-${verificador}`;
  },

  formatearTelefono: (telefono: string): string => {
    const telefonoLimpio = telefono.replace(/[^\d+]/g, "");

    // Formato chileno: +56 9 1234 5678
    if (telefonoLimpio.startsWith("+56")) {
      const numero = telefonoLimpio.slice(3);
      if (numero.length === 9 && numero.startsWith("9")) {
        return `+56 ${numero[0]} ${numero.slice(1, 5)} ${numero.slice(5)}`;
      }
    }

    return telefono;
  },
};

// Configuración de debug
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === "development",
  logEvents: true,
  logValidation: true,
  logApiCalls: true,
};
