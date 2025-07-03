"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Bell, RefreshCw, Save } from "lucide-react";
import { ConfiguracionEmpresaProps } from "./types";
import { useConfiguracionEmpresa } from "./hooks/useConfiguracionEmpresa";
import { ConfiguracionEstados } from "./ConfiguracionEstados";
import { ConfiguracionForm } from "./ConfiguracionForm";
import { ConfiguracionContacto } from "./ConfiguracionContacto";
import { ConfiguracionNotificaciones } from "./ConfiguracionNotificaciones";

export function ConfiguracionEmpresa({ className }: ConfiguracionEmpresaProps) {
  const {
    datosEmpresa,
    configuracionNotificaciones,
    estados,
    empresaId,
    error,
    actualizarDatos,
    actualizarContacto,
    actualizarNotificaciones,
    guardarDatos,
    guardarNotificaciones,
    recargarDatos,
    isLoading,
    isSaving,
  } = useConfiguracionEmpresa();

  // Manejar estados especiales (carga, error, sin empresa)
  const estadoEspecial = (
    <ConfiguracionEstados
      loading={isLoading}
      empresaId={empresaId}
      error={error}
      onReintentarLogin={() => (window.location.href = "/auth/login")}
    />
  );

  // Si hay un estado especial, mostrarlo
  if (isLoading || !empresaId || error) {
    return (
      <div className={`space-y-6 ${className || ""}`}>{estadoEspecial}</div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-orange-600" />
            Configuración de Empresa
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administre los datos y preferencias de su empresa
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={recargarDatos}
          disabled={isLoading || isSaving}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Recargar
        </Button>
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Datos Generales
          </TabsTrigger>
          <TabsTrigger
            value="notificaciones"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab de Datos Generales */}
        <TabsContent value="general" className="space-y-6">
          {/* Formulario principal */}
          <ConfiguracionForm
            datosEmpresa={datosEmpresa}
            onDatosChange={actualizarDatos}
            loading={estados.loading}
            saving={estados.saving}
          />

          {/* Contacto principal */}
          <ConfiguracionContacto
            contactoPrincipal={datosEmpresa.contactoPrincipal}
            onContactoChange={actualizarContacto}
            loading={estados.loading}
            saving={estados.saving}
          />

          {/* Botón para guardar datos generales */}
          <div className="flex justify-end">
            <Button
              onClick={guardarDatos}
              disabled={isSaving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {estados.saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Tab de Notificaciones */}
        <TabsContent value="notificaciones" className="space-y-6">
          <ConfiguracionNotificaciones
            configuracion={configuracionNotificaciones}
            onConfiguracionChange={actualizarNotificaciones}
            loading={estados.loadingNotificaciones}
            saving={estados.savingNotificaciones}
            onGuardar={guardarNotificaciones}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
