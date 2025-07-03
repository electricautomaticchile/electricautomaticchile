"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";
import {
  DatosEmpresa,
  ContactoPrincipal,
  ConfiguracionNotificaciones,
  EstadosCarga,
  UseConfiguracionEmpresaReturn,
  DatosActualizacionEmpresa,
} from "../types";
import {
  DATOS_EMPRESA_DEFAULT,
  NOTIFICACIONES_DEFAULT,
  ESTADOS_CARGA_DEFAULT,
  MENSAJES_SISTEMA,
  VALIDADORES,
} from "../config";
import { useEmpresaId } from "./useEmpresaId";

export function useConfiguracionEmpresa(): UseConfiguracionEmpresaReturn {
  // Estados principales
  const [datosEmpresa, setDatosEmpresa] = useState<DatosEmpresa>(
    DATOS_EMPRESA_DEFAULT
  );
  const [configuracionNotificaciones, setConfiguracionNotificaciones] =
    useState<ConfiguracionNotificaciones>(NOTIFICACIONES_DEFAULT);
  const [estados, setEstados] = useState<EstadosCarga>(ESTADOS_CARGA_DEFAULT);
  const [error, setError] = useState<string | undefined>(undefined);

  const { toast } = useToast();
  const {
    empresaId,
    loading: loadingEmpresaId,
    error: errorEmpresaId,
  } = useEmpresaId();

  // Función para cargar datos de la empresa
  const cargarDatosEmpresa = useCallback(async () => {
    if (!empresaId) {
      setError("ID de empresa no disponible");
      return;
    }

    try {
      setEstados((prev) => ({ ...prev, loading: true }));
      setError(undefined);

      console.log("🔄 Cargando datos de empresa con ID:", empresaId);

      const response = await apiService.obtenerEmpresa(empresaId);

      if (response.success && response.data) {
        const empresa = response.data;
        console.log("✅ Datos de empresa cargados:", empresa);

        setDatosEmpresa({
          nombreEmpresa: empresa.nombreEmpresa || "",
          razonSocial: empresa.razonSocial || "",
          rut: empresa.rut || "",
          correo: empresa.correo || "",
          telefono: empresa.telefono || "",
          direccion: empresa.direccion || "",
          ciudad: empresa.ciudad || "",
          region: empresa.region || "",
          contactoPrincipal: {
            nombre: empresa.contactoPrincipal?.nombre || "",
            cargo: empresa.contactoPrincipal?.cargo || "",
            telefono: empresa.contactoPrincipal?.telefono || "",
            correo: empresa.contactoPrincipal?.correo || "",
          },
        });

        // Cargar configuraciones de notificaciones si existen
        if (empresa.configuraciones) {
          setConfiguracionNotificaciones((prev) => ({
            ...prev,
            emailHabilitadas: empresa.configuraciones?.notificaciones ?? true,
          }));
        }
      } else {
        const errorMsg = response.error || MENSAJES_SISTEMA.error.carga;
        setError(errorMsg);
        console.error("❌ Error en respuesta:", response.error);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : MENSAJES_SISTEMA.error.carga;
      setError(errorMsg);
      console.error("❌ Error cargando datos de empresa:", error);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setEstados((prev) => ({ ...prev, loading: false }));
    }
  }, [empresaId, toast]);

  // Función para guardar datos de la empresa
  const guardarDatos = useCallback(async () => {
    if (!empresaId) {
      toast({
        title: "Error",
        description: "ID de empresa no disponible",
        variant: "destructive",
      });
      return;
    }

    try {
      setEstados((prev) => ({ ...prev, saving: true }));
      console.log("💾 Guardando datos de empresa:", datosEmpresa);

      const datosParaActualizar: DatosActualizacionEmpresa = {
        nombreEmpresa: datosEmpresa.nombreEmpresa,
        razonSocial: datosEmpresa.razonSocial,
        rut: datosEmpresa.rut,
        correo: datosEmpresa.correo,
        telefono: datosEmpresa.telefono,
        direccion: datosEmpresa.direccion,
        ciudad: datosEmpresa.ciudad,
        region: datosEmpresa.region,
        contactoPrincipal: datosEmpresa.contactoPrincipal,
        configuraciones: {
          notificaciones: configuracionNotificaciones.emailHabilitadas,
          tema: "claro" as const,
          maxUsuarios: 10,
        },
      };

      const response = await apiService.actualizarEmpresa(
        empresaId,
        datosParaActualizar
      );

      if (response.success) {
        toast({
          title: "Configuración guardada",
          description: MENSAJES_SISTEMA.guardado.empresa,
        });
        console.log("✅ Empresa actualizada:", response.data);
      } else {
        throw new Error(response.error || "Error desconocido");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : MENSAJES_SISTEMA.error.guardado;
      console.error("❌ Error guardando datos:", error);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setEstados((prev) => ({ ...prev, saving: false }));
    }
  }, [empresaId, datosEmpresa, configuracionNotificaciones, toast]);

  // Función para guardar notificaciones
  const guardarNotificaciones = useCallback(async () => {
    if (!empresaId) {
      toast({
        title: "Error",
        description: "ID de empresa no disponible",
        variant: "destructive",
      });
      return;
    }

    try {
      setEstados((prev) => ({ ...prev, savingNotificaciones: true }));

      const datosParaActualizar: DatosActualizacionEmpresa = {
        configuraciones: {
          notificaciones: configuracionNotificaciones.emailHabilitadas,
          tema: "claro" as const,
          maxUsuarios: 10,
        },
      };

      const response = await apiService.actualizarEmpresa(
        empresaId,
        datosParaActualizar
      );

      if (response.success) {
        toast({
          title: "Notificaciones guardadas",
          description: MENSAJES_SISTEMA.guardado.notificaciones,
        });
      } else {
        throw new Error(response.error || "Error desconocido");
      }
    } catch (error) {
      console.error("❌ Error guardando notificaciones:", error);
      toast({
        title: "Error",
        description: MENSAJES_SISTEMA.error.guardado,
        variant: "destructive",
      });
    } finally {
      setEstados((prev) => ({ ...prev, savingNotificaciones: false }));
    }
  }, [empresaId, configuracionNotificaciones, toast]);

  // Función para actualizar datos de empresa
  const actualizarDatos = useCallback((nuevosDatos: Partial<DatosEmpresa>) => {
    setDatosEmpresa((prev) => ({
      ...prev,
      ...nuevosDatos,
    }));
  }, []);

  // Función para actualizar contacto principal
  const actualizarContacto = useCallback(
    (nuevoContacto: Partial<ContactoPrincipal>) => {
      setDatosEmpresa((prev) => ({
        ...prev,
        contactoPrincipal: {
          ...prev.contactoPrincipal,
          ...nuevoContacto,
        },
      }));
    },
    []
  );

  // Función para actualizar notificaciones
  const actualizarNotificaciones = useCallback(
    (nuevaConfig: Partial<ConfiguracionNotificaciones>) => {
      setConfiguracionNotificaciones((prev) => ({
        ...prev,
        ...nuevaConfig,
      }));
    },
    []
  );

  // Estados derivados
  const isLoading = estados.loading || loadingEmpresaId;
  const isSaving = estados.saving || estados.savingNotificaciones;

  const hasChanges =
    JSON.stringify(datosEmpresa) !== JSON.stringify(DATOS_EMPRESA_DEFAULT) ||
    JSON.stringify(configuracionNotificaciones) !==
      JSON.stringify(NOTIFICACIONES_DEFAULT);

  const isValid =
    VALIDADORES.validarRequerido(datosEmpresa.nombreEmpresa) &&
    VALIDADORES.validarEmail(datosEmpresa.correo) &&
    (datosEmpresa.rut ? VALIDADORES.validarRUT(datosEmpresa.rut) : true);

  return {
    // Estados
    datosEmpresa,
    configuracionNotificaciones,
    estados,
    empresaId,
    error: error || errorEmpresaId,

    // Acciones
    actualizarDatos,
    actualizarContacto,
    actualizarNotificaciones,
    guardarDatos,
    guardarNotificaciones,
    recargarDatos: cargarDatosEmpresa,

    // Estados derivados
    isLoading,
    isSaving,
    hasChanges,
    isValid,
  };
}
