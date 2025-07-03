"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";
import {
  IEmpresa,
  ICrearEmpresa,
  EstadisticasEmpresas,
  Credenciales,
} from "../types";

export function useEmpresas(reducida = false) {
  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEmpresas | null>(
    null
  );
  const [cargando, setCargando] = useState(true);
  const [cargandoCreacion, setCargandoCreacion] = useState(false);
  const [showCredenciales, setShowCredenciales] = useState<Credenciales | null>(
    null
  );
  const { toast } = useToast();

  const cargarEmpresas = useCallback(async () => {
    try {
      setCargando(true);
      const response = await apiService.obtenerEmpresas();

      if (response.success && response.data) {
        const empresasOrdenadas = response.data.sort(
          (a: IEmpresa, b: IEmpresa) =>
            new Date(b.fechaCreacion).getTime() -
            new Date(a.fechaCreacion).getTime()
        );

        if (reducida) {
          setEmpresas(empresasOrdenadas.slice(0, 5));
        } else {
          setEmpresas(empresasOrdenadas);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error al cargar empresas",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar empresas",
      });
    } finally {
      setCargando(false);
    }
  }, [reducida, toast]);

  const cargarEstadisticas = async () => {
    try {
      const response = await apiService.obtenerEstadisticasEmpresas();
      if (response.success && response.data) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const crearEmpresa = async (datosEmpresa: ICrearEmpresa) => {
    try {
      setCargandoCreacion(true);
      const response = await apiService.crearEmpresa(datosEmpresa);

      if (response.success && response.data) {
        toast({
          variant: "default",
          title: "Empresa creada",
          description: "La empresa ha sido creada exitosamente",
        });

        // Mostrar credenciales si están disponibles
        if (response.credenciales) {
          setShowCredenciales({
            numeroCliente: response.credenciales.numeroCliente,
            correo: response.credenciales.correo,
            password: response.credenciales.password,
            passwordTemporal: response.credenciales.passwordTemporal,
            mensaje: response.credenciales.mensaje,
          });
        }

        await cargarEmpresas();
        return { success: true };
      } else {
        toast({
          variant: "destructive",
          title: "Error al crear empresa",
          description: response.error || "Error desconocido",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setCargandoCreacion(false);
    }
  };

  const cambiarEstadoEmpresa = async (
    id: string,
    nuevoEstado: "activo" | "suspendido" | "inactivo",
    motivo?: string
  ) => {
    try {
      const response = await apiService.cambiarEstadoEmpresa(
        id,
        nuevoEstado,
        motivo
      );

      if (response.success) {
        toast({
          variant: "default",
          title: "Estado actualizado",
          description: `Empresa marcada como ${nuevoEstado}`,
        });
        await cargarEmpresas();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error al cambiar estado",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cambiar estado de empresa",
      });
    }
  };

  const resetearPassword = async (id: string) => {
    try {
      const response = await apiService.resetearPasswordEmpresa(id);

      if (response.success && response.data) {
        toast({
          variant: "default",
          title: "Contraseña reseteada",
          description: "Se ha generado una nueva contraseña temporal",
        });

        // Mostrar nueva contraseña
        setShowCredenciales({
          numeroCliente: response.data.numeroCliente,
          correo: response.data.correo,
          password: response.nuevaPassword,
          passwordTemporal: true,
          mensaje: "Nueva contraseña temporal generada",
        });

        await cargarEmpresas();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error al resetear contraseña",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al resetear contraseña",
      });
    }
  };

  useEffect(() => {
    cargarEmpresas();
    if (!reducida) {
      cargarEstadisticas();
    }
  }, [reducida, cargarEmpresas]);

  return {
    empresas,
    estadisticas,
    cargando,
    cargandoCreacion,
    showCredenciales,
    setShowCredenciales,
    cargarEmpresas,
    crearEmpresa,
    cambiarEstadoEmpresa,
    resetearPassword,
  };
}
