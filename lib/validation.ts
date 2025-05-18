import { z } from 'zod';

// Esquema para la validación de datos de dispositivos
export const DeviceSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tipo: z.enum(["LED", "Sensor", "Relay", "Switch", "Otro"]),
  estado: z.boolean(),
  ubicacion: z.string().optional(),
  ultimaActividad: z.date().optional()
});

// Esquema para la validación de datos de usuario
export const UserSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  rol: z.enum(["admin", "empresa", "usuario"]),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe tener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe tener al menos un carácter especial")
});

// Esquema para la validación de datos de historial de cambios
export const HistorialCambioSchema = z.object({
  dispositivo: z.string().optional(),
  estado: z.boolean(),
  timestamp: z.string().datetime(),
  modo: z.enum(["manual", "temporizador", "secuencia"]),
  usuario: z.string().optional()
});

// Esquema para la validación de datos de reposición
export const ReposicionSchema = z.object({
  id: z.string().optional(),
  ubicacion: z.string(),
  fecha: z.string().datetime(),
  motivo: z.string(),
  estado: z.enum(["pendiente", "en_progreso", "completada", "cancelada"]),
  responsable: z.string().optional(),
  tiempoEstimado: z.number().positive().optional(),
  observaciones: z.string().optional()
});

// Función para validar datos
export function validateData<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
} 