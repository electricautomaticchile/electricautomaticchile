"use client";

import { useState, useEffect } from "react";
import { UseEmpresaIdReturn } from "../types";

// Hook para obtener empresaId del contexto/token
export function useEmpresaId(): UseEmpresaIdReturn {
  const [empresaId, setEmpresaId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<any>(undefined);
  const [tokenData, setTokenData] = useState<any>(undefined);

  useEffect(() => {
    const obtenerEmpresaId = () => {
      try {
        setError(undefined);

        // Primero intentar localStorage - donde guardamos userData después del login
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            console.log("📋 UserData encontrado:", userData);
            setUserData(userData);

            if (userData.id || userData._id) {
              return {
                id: userData.id || userData._id,
                fuente: "localStorage" as const,
                data: userData,
              };
            }
          } catch (error) {
            console.error("Error parsing userData:", error);
            setError("Error al procesar datos de usuario");
          }
        }

        // Intentar obtener del token JWT
        const token =
          localStorage.getItem("token") || localStorage.getItem("auth_token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("🔐 Token payload:", payload);
            setTokenData(payload);

            if (payload.empresaId || payload.id || payload.sub) {
              return {
                id: payload.empresaId || payload.id || payload.sub,
                fuente: "token" as const,
                data: payload,
              };
            }
          } catch (error) {
            console.error("Error decoding token:", error);
            setError("Token inválido");
          }
        }

        console.warn("⚠️ No se pudo encontrar empresaId");
        setError("No se pudo identificar la empresa");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error obteniendo empresaId:", err);
        return null;
      }
    };

    setLoading(true);
    const resultado = obtenerEmpresaId();

    if (resultado) {
      console.log(
        `🏢 EmpresaId obtenido desde ${resultado.fuente}:`,
        resultado.id
      );
      setEmpresaId(resultado.id);
    } else {
      setEmpresaId(undefined);
    }

    setLoading(false);
  }, []);

  return {
    empresaId,
    loading,
    error,
    userData,
    tokenData,
  };
}

// Hook simplificado que solo retorna el ID
export function useEmpresaIdSimple(): string | undefined {
  const { empresaId } = useEmpresaId();
  return empresaId;
}

// Hook con validación automática
export function useEmpresaIdValidated(): {
  empresaId: string | null;
  isValid: boolean;
  error?: string;
} {
  const { empresaId, error } = useEmpresaId();

  return {
    empresaId: empresaId || null,
    isValid: !!empresaId && !error,
    error,
  };
}
