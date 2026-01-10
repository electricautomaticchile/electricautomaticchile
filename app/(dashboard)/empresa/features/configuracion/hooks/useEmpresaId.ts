"use client";

import { useState, useEffect } from "react";
import { UseEmpresaIdReturn } from "../types";
import { useApi } from "@/hooks/useApi";

export function useEmpresaId(): UseEmpresaIdReturn {
  const { user, isLoading } = useApi();
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      const id = user?.id || (user as any)?._id;
      if (!id) {
        setError("No se pudo identificar la empresa");
      } else {
        setError(undefined);
      }
    }
  }, [user, isLoading]);

  const empresaId = user?.id || (user as any)?._id || undefined;

  return {
    empresaId,
    loading: isLoading,
    error,
    userData: user,
    tokenData: undefined,
  };
}

export function useEmpresaIdSimple(): string | undefined {
  const { empresaId } = useEmpresaId();
  return empresaId;
}

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
