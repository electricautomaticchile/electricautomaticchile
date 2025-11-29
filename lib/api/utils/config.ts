import { z } from "zod";

// Configuración del Backend API
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const API_VERSION = "v1";
export const API_URL = `${API_BASE_URL}/api`;

const configSchema = z.object({
  baseUrl: z.string().url(),
  apiUrl: z.string().url(),
  version: z.string(),
});

// Log de configuración (solo en desarrollo)
if (process.env.NODE_ENV === "development") {
    baseUrl: API_BASE_URL,
    apiUrl: API_URL,
    version: API_VERSION,
  });
}
