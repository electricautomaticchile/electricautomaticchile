// Configuración del Backend API
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";
export const API_URL = `${API_BASE_URL}/api`;

// Log de configuración (solo en desarrollo)
if (process.env.NODE_ENV === "development") {
  console.log("🔗 API Configuration:", {
    baseUrl: API_BASE_URL,
    apiUrl: API_URL,
    version: API_VERSION,
  });
}
