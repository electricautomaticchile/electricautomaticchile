"use client";

import { useState, useEffect } from "react";
import { UseEmpresaIdReturn } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Hook para obtener empresaId desde la base de datos
export function useEmpresaId(): UseEmpresaIdReturn {
  const [empresaId, setEmpresaId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<any>(undefined);
  const [tokenData, setTokenData] = useState<any>(undefined);

  useEffect(() => {
    const obtenerEmpresaIdDesdeAPI = async () => {
      try {
        setLoading(true);
        setError(undefined);

        // Obtener el token de autenticación
        const token =
          localStorage.getItem("auth_token") ||
          localStorage.getItem("token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];

        if (!token) {
          console.warn("⚠️ No hay token de autenticación");
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        // Llamar a la API para obtener el perfil del usuario
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📋 Perfil obtenido desde API:", data);

        // El perfil puede venir en diferentes formatos según la API
        const profile = data.data || data.user || data;
        setUserData(profile);

        // Extraer el empresaId - MongoDB usa _id como ObjectId
        const id =
          profile._id?.toString() ||
          profile.id?.toString() ||
          profile.empresaId?.toString();

        if (id) {
          console.log("🏢 EmpresaId obtenido desde API:", id);
          setEmpresaId(id);

          // Guardar en localStorage para uso futuro
          localStorage.setItem("user", JSON.stringify(profile));
        } else {
          console.warn("⚠️ No se encontró empresaId en el perfil");
          setError("No se pudo identificar la empresa");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        console.error("❌ Error obteniendo empresaId desde API:", err);
        setError(errorMessage);

        // Fallback: intentar obtener desde localStorage
        try {
          const userDataString =
            localStorage.getItem("user") || localStorage.getItem("userData");

          if (userDataString) {
            const userData = JSON.parse(userDataString);
            console.log(
              "📋 Usando datos de localStorage como fallback:",
              userData
            );
            setUserData(userData);

            const id =
              userData._id?.toString() ||
              userData.id?.toString() ||
              userData.empresaId?.toString();
            if (id) {
              console.log("🏢 EmpresaId obtenido desde localStorage:", id);
              setEmpresaId(id);
              setError(undefined);
            }
          }
        } catch (fallbackError) {
          console.error("Error en fallback:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerEmpresaIdDesdeAPI();
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
