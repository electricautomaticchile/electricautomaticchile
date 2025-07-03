import { PlanServicio, Cliente } from "./types";

// Planes de servicio disponibles
export const PLANES_SERVICIO: PlanServicio[] = [
  {
    id: "basico",
    nombre: "Básico",
    descripcion: "Monitoreo básico de consumo",
    precio: 25000,
    caracteristicas: [
      "Monitoreo en tiempo real",
      "Alertas de consumo excesivo",
      "Reportes mensuales",
      "Acceso a plataforma web",
    ],
  },
  {
    id: "estandar",
    nombre: "Estándar",
    descripcion: "Monitoreo y reposición automática",
    precio: 45000,
    caracteristicas: [
      "Todas las características del plan Básico",
      "Reposición automática limitada",
      "Alertas avanzadas",
      "Soporte telefónico 8/5",
    ],
  },
  {
    id: "premium",
    nombre: "Premium",
    descripcion: "Solución completa de administración energética",
    precio: 85000,
    caracteristicas: [
      "Todas las características del plan Estándar",
      "Reposición automática ilimitada",
      "Asesoría energética personalizada",
      "Soporte técnico 24/7",
      "Mantenimiento preventivo trimestral",
    ],
  },
  {
    id: "corporativo",
    nombre: "Corporativo",
    descripcion: "Solución empresarial a medida",
    precio: 150000,
    caracteristicas: [
      "Todas las características del plan Premium",
      "API para integración con sistemas empresariales",
      "Panel de administración multi-usuario",
      "Personalización de la plataforma",
      "Asesoramiento técnico dedicado",
      "Servicio de instalación incluido",
    ],
  },
];

// Datos de ejemplo para clientes existentes
export const CLIENTES_EJEMPLO: Cliente[] = [
  {
    id: "1",
    numeroCliente: "123456-7",
    nombre: "Juan Pérez",
    correo: "juan@empresa.cl",
    telefono: "+56 9 1234 5678",
    empresa: "Empresa ABC",
    rut: "12.345.678-9",
    direccion: "Av. Principal 123, Santiago",
    planSeleccionado: "premium",
    activo: true,
    fechaRegistro: "2023-06-15",
    ultimaFacturacion: "2023-11-01",
    montoMensual: 85000,
    notas:
      "Cliente desde junio 2023, tiene equipos en 3 sucursales diferentes.",
  },
  {
    id: "2",
    numeroCliente: "234567-8",
    nombre: "María González",
    correo: "maria@gmail.com",
    telefono: "+56 9 8765 4321",
    rut: "23.456.789-0",
    direccion: "Calle Secundaria 456, Viña del Mar",
    planSeleccionado: "basico",
    activo: true,
    fechaRegistro: "2023-08-20",
    ultimaFacturacion: "2023-11-01",
    montoMensual: 25000,
  },
];

// Configuraciones de validación
export const VALIDACION_CONFIG = {
  nombre: {
    minLength: 2,
    maxLength: 100,
    required: true,
  },
  correo: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true,
  },
  telefono: {
    pattern: /^\+?56\s?9\s?\d{4}\s?\d{4}$/,
    required: true,
  },
  rut: {
    pattern: /^(\d{1,2}\.)?\d{3}\.\d{3}-[\dkK]$/,
    required: true,
  },
  empresa: {
    maxLength: 200,
    required: false,
  },
  direccion: {
    maxLength: 300,
    required: false,
  },
  notas: {
    maxLength: 500,
    required: false,
  },
};

// Configuraciones de generación
export const GENERACION_CONFIG = {
  password: {
    longitud: 10,
    caracteres:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
  },
  numeroCliente: {
    rangoMinimo: 100000,
    rangoMaximo: 999999,
  },
};

// Configuraciones de UI
export const UI_CONFIG = {
  timeouts: {
    exitoMostrar: 2000,
    copiadoMostrar: 2000,
  },
  tabs: {
    default: "nuevo-cliente" as const,
  },
};

// Mensajes del sistema
export const MENSAJES = {
  exito: {
    clienteRegistrado: "Cliente registrado exitosamente",
    correoEnviado: "Correo de confirmación enviado",
    credencialesCopiadas: "Credenciales copiadas al portapapeles",
  },
  error: {
    registroFallido: "Error al registrar cliente",
    correoFallido: "Error al enviar correo de confirmación",
    validacionFallida: "Por favor, complete todos los campos obligatorios",
    clienteNoEncontrado: "Cliente no encontrado",
    planNoSeleccionado: "Debe seleccionar un plan de servicio",
  },
  validacion: {
    nombreRequerido: "El nombre es obligatorio",
    nombreMuyCorto: "El nombre debe tener al menos 2 caracteres",
    correoRequerido: "El correo electrónico es obligatorio",
    correoInvalido: "Formato de correo electrónico inválido",
    telefonoRequerido: "El teléfono es obligatorio",
    telefonoInvalido: "Formato de teléfono inválido (+56 9 XXXX XXXX)",
    rutRequerido: "El RUT es obligatorio",
    rutInvalido: "Formato de RUT inválido (XX.XXX.XXX-X)",
    planRequerido: "Debe seleccionar un plan de servicio",
  },
};

// URLs de API
export const API_ENDPOINTS = {
  crearCliente: "/api/cliente/crear",
  enviarConfirmacion: "/api/cliente/enviar-confirmacion",
  obtenerClientes: "/api/clientes",
  actualizarCliente: "/api/cliente/actualizar",
  eliminarCliente: "/api/cliente/eliminar",
};
