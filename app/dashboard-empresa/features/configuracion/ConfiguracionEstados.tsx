import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, RefreshCw, LogIn, Building2 } from "lucide-react";
import { ConfiguracionEstadosProps } from "./types";

export function ConfiguracionEstados({
  loading,
  empresaId,
  error,
  onReintentarLogin,
}: ConfiguracionEstadosProps) {
  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Cargando configuración
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Obteniendo datos de la empresa...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sin empresaId
  if (!empresaId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-red-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No se pudo identificar la empresa
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              No se encontró información de la empresa en su sesión actual. Por
              favor, inicie sesión nuevamente para continuar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onReintentarLogin}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Ir al Login
            </Button>

            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar Página
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error general
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Error al cargar la configuración
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>

            <Button
              onClick={onReintentarLogin}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay error y hay empresaId, no mostrar nada (continúa normal)
  return null;
}

// Componente para estado de carga específico de formularios
export function ConfiguracionEstadoCarga({
  mensaje = "Cargando...",
}: {
  mensaje?: string;
}) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <LoadingSpinner />
        <span className="text-gray-600 dark:text-gray-400">{mensaje}</span>
      </div>
    </div>
  );
}

// Componente para estado de guardado
export function ConfiguracionEstadoGuardando({
  mensaje = "Guardando configuración...",
}: {
  mensaje?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <LoadingSpinner />
          <span className="font-medium">{mensaje}</span>
        </div>
      </div>
    </div>
  );
}

// Componente para mensajes de éxito
export function ConfiguracionExito({
  mensaje,
  onCerrar,
}: {
  mensaje: string;
  onCerrar?: () => void;
}) {
  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            {mensaje}
          </p>
        </div>
        {onCerrar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCerrar}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente para mensajes de error
export function ConfiguracionError({
  mensaje,
  onReintentar,
  onCerrar,
}: {
  mensaje: string;
  onReintentar?: () => void;
  onCerrar?: () => void;
}) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {mensaje}
          </p>
          {onReintentar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReintentar}
              className="mt-2 text-red-600 hover:text-red-800 p-0 h-auto"
            >
              Reintentar
            </Button>
          )}
        </div>
        {onCerrar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCerrar}
            className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}
