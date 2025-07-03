"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ConfiguracionFormProps } from "./types";
import { CAMPOS_EMPRESA, VALIDADORES, FORMATEADORES } from "./config";
import { useState } from "react";

export function ConfiguracionForm({
  datosEmpresa,
  onDatosChange,
  loading = false,
  saving = false,
}: ConfiguracionFormProps) {
  const [erroresValidacion, setErroresValidacion] = useState<
    Record<string, string>
  >({});

  const validarCampo = (campo: string, valor: string) => {
    let error = "";

    switch (campo) {
      case "nombreEmpresa":
        if (!VALIDADORES.validarRequerido(valor)) {
          error = "El nombre de la empresa es requerido";
        }
        break;
      case "rut":
        if (valor && !VALIDADORES.validarRUT(valor)) {
          error = "RUT inválido";
        }
        break;
      case "correo":
        if (!VALIDADORES.validarEmail(valor)) {
          error = "Correo electrónico inválido";
        }
        break;
      case "telefono":
        if (valor && !VALIDADORES.validarTelefono(valor)) {
          error = "Teléfono inválido";
        }
        break;
    }

    setErroresValidacion((prev) => ({
      ...prev,
      [campo]: error,
    }));

    return error === "";
  };

  const manejarCambio = (campo: string, valor: string) => {
    // Formatear ciertos campos automáticamente
    let valorFormateado = valor;
    if (campo === "rut") {
      valorFormateado = FORMATEADORES.formatearRUT(valor);
    } else if (campo === "telefono") {
      valorFormateado = FORMATEADORES.formatearTelefono(valor);
    }

    // Validar el campo
    validarCampo(campo, valorFormateado);

    // Actualizar los datos
    onDatosChange({ [campo]: valorFormateado });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Cargando datos de la empresa...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información General de la Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Datos básicos de identificación de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPOS_EMPRESA.map((campo) => {
              const valor = datosEmpresa[
                campo.id as keyof typeof datosEmpresa
              ] as string;
              const tieneError = erroresValidacion[campo.id];

              return (
                <div
                  key={campo.id}
                  className={`space-y-2 ${campo.gridCols || ""}`}
                >
                  <Label htmlFor={campo.id}>
                    {campo.label}
                    {campo.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  <Input
                    id={campo.id}
                    type={campo.type}
                    value={valor}
                    onChange={(e) => manejarCambio(campo.id, e.target.value)}
                    placeholder={campo.placeholder}
                    disabled={saving}
                    className={
                      tieneError ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {tieneError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {tieneError}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Indicador de campos requeridos */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-red-500">*</span>
            <span>Campos requeridos</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente simplificado para vista rápida
export function ConfiguracionFormReducido({
  datosEmpresa,
  onDatosChange,
}: {
  datosEmpresa: any;
  onDatosChange: (datos: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre-empresa-reducido">Nombre de la Empresa</Label>
        <Input
          id="nombre-empresa-reducido"
          value={datosEmpresa.nombreEmpresa}
          onChange={(e) => onDatosChange({ nombreEmpresa: e.target.value })}
          placeholder="Nombre comercial"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rut-reducido">RUT</Label>
        <Input
          id="rut-reducido"
          value={datosEmpresa.rut}
          onChange={(e) =>
            onDatosChange({ rut: FORMATEADORES.formatearRUT(e.target.value) })
          }
          placeholder="12.345.678-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo-reducido">Correo Electrónico</Label>
        <Input
          id="correo-reducido"
          type="email"
          value={datosEmpresa.correo}
          onChange={(e) => onDatosChange({ correo: e.target.value })}
          placeholder="contacto@empresa.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono-reducido">Teléfono</Label>
        <Input
          id="telefono-reducido"
          value={datosEmpresa.telefono}
          onChange={(e) =>
            onDatosChange({
              telefono: FORMATEADORES.formatearTelefono(e.target.value),
            })
          }
          placeholder="+56 9 1234 5678"
        />
      </div>
    </div>
  );
}
