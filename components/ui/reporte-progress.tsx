"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Download, Clock } from "lucide-react";
import {
  IConfigReporte,
  IProgressCallback,
} from "@/lib/api/services/reportesService";

interface ReporteProgressProps {
  isOpen: boolean;
  onClose: () => void;
  config: IConfigReporte | null;
  onGenerate: (
    config: IConfigReporte,
    onProgress: IProgressCallback
  ) => Promise<void>;
}

interface ProgressState {
  step: string;
  percentage: number;
  message: string;
  isComplete: boolean;
  hasError: boolean;
  startTime?: Date;
  endTime?: Date;
}

export function ReporteProgress({
  isOpen,
  onClose,
  config,
  onGenerate,
}: ReporteProgressProps) {
  const [progress, setProgress] = useState<ProgressState>({
    step: "init",
    percentage: 0,
    message: "Preparando...",
    isComplete: false,
    hasError: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Calcular tiempo transcurrido
  const tiempoTranscurrido = progress.startTime
    ? Math.round((new Date().getTime() - progress.startTime.getTime()) / 1000)
    : 0;

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (isOpen && config) {
      setProgress({
        step: "init",
        percentage: 0,
        message: "Preparando generación...",
        isComplete: false,
        hasError: false,
        startTime: new Date(),
      });
    }
  }, [isOpen, config]);

  // Función para manejar el progreso
  const handleProgress: IProgressCallback = (progressData) => {
    setProgress((prev) => ({
      ...prev,
      step: progressData.step,
      percentage: progressData.percentage,
      message: progressData.message,
      isComplete: progressData.step === "complete",
      hasError: progressData.step === "error",
      ...(progressData.step === "complete" || progressData.step === "error"
        ? { endTime: new Date() }
        : {}),
    }));
  };

  // Función para iniciar la generación
  const iniciarGeneracion = async () => {
    if (!config) return;

    setIsGenerating(true);
    setProgress((prev) => ({ ...prev, startTime: new Date() }));

    try {
      await onGenerate(config, handleProgress);
    } catch (error) {
      setProgress((prev) => ({
        ...prev,
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
        hasError: true,
        endTime: new Date(),
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-iniciar cuando se abre el modal
  useEffect(() => {
    if (isOpen && config && !isGenerating && progress.step === "init") {
      iniciarGeneracion();
    }
  }, [isOpen, config]);

  const getStepIcon = () => {
    if (progress.hasError) return <XCircle className="h-6 w-6 text-red-500" />;
    if (progress.isComplete)
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    return <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />;
  };

  const getStepDescription = (step: string) => {
    switch (step) {
      case "init":
        return "Iniciando proceso de generación";
      case "request":
        return "Enviando solicitud al servidor";
      case "connecting":
        return "Estableciendo conexión";
      case "processing":
        return "Procesando datos en el servidor";
      case "download":
        return "Preparando descarga del archivo";
      case "complete":
        return "¡Reporte generado exitosamente!";
      case "error":
        return "Error en la generación del reporte";
      default:
        return "Procesando...";
    }
  };

  const formatearTiempo = (segundos: number) => {
    if (segundos < 60) return `${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos}m ${segsRestantes}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStepIcon()}
            Generando Reporte
          </DialogTitle>
          <DialogDescription>
            {config && `${config.titulo} (${config.formato.toUpperCase()})`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getStepDescription(progress.step)}</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress
              value={progress.percentage}
              className={`h-2 ${
                progress.hasError
                  ? "bg-red-100"
                  : progress.isComplete
                    ? "bg-green-100"
                    : ""
              }`}
            />
          </div>

          {/* Mensaje de estado */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {progress.message}
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Tiempo: {formatearTiempo(tiempoTranscurrido)}
            </div>
            {config && (
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                Formato: {config.formato.toUpperCase()}
              </div>
            )}
          </div>

          {/* Alerta de estado */}
          {progress.hasError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{progress.message}</AlertDescription>
            </Alert>
          )}

          {progress.isComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Reporte generado exitosamente. El archivo se ha descargado
                automáticamente.
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            {progress.hasError && (
              <Button
                variant="outline"
                onClick={iniciarGeneracion}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Reintentar"
                )}
              </Button>
            )}

            <Button
              variant={progress.isComplete ? "default" : "outline"}
              onClick={onClose}
              disabled={isGenerating && !progress.hasError}
            >
              {progress.isComplete ? "Cerrar" : "Cancelar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
