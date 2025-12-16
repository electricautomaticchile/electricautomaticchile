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
import { ConfiguracionContactoProps } from "./types";
import { CAMPOS_CONTACTO, VALIDADORES, FORMATEADORES } from "./config";
import { useState } from "react";
import { ProfileImageManager } from "@/components/ui/profile-image-manager";
import { RefreshCw, User } from "lucide-react";

export function ConfiguracionContacto({
  contactoPrincipal,
  onContactoChange,
  loading = false,
  saving = false,
  userId,
  userType,
  userName,
  userLoading,
}: ConfiguracionContactoProps & {
  userId?: string;
  userType?: string;
  userName?: string;
  userLoading?: boolean;
}) {
  const [erroresValidacion, setErroresValidacion] = useState<
    Record<string, string>
  >({});

  const validarCampo = (campo: string, valor: string) => {
    let error = "";

    switch (campo) {
      case "correo":
        if (valor && !VALIDADORES.validarEmail(valor)) {
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
    if (campo === "telefono") {
      valorFormateado = FORMATEADORES.formatearTelefono(valor);
    }

    // Validar el campo
    validarCampo(campo, valorFormateado);

    // Actualizar los datos
    onContactoChange({ [campo]: valorFormateado });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacto Principal</CardTitle>
        <CardDescription>
          Información del representante principal de la empresa (editable)
        </CardDescription>
        <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✏️ Puede modificar libremente los datos del contacto principal.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layout con imagen de perfil y campos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Imagen de Perfil - Columna izquierda */}
          {userId && (
            <div className="flex flex-col items-center justify-start space-y-3">
              <div className="text-center">
                <h3 className="text-sm font-semibold flex items-center justify-center gap-2 mb-1">
                  <User className="h-4 w-4 text-orange-600" />
                  Imagen de Perfil
                </h3>
                <p className="text-xs text-muted-foreground">
                  Logo de la empresa
                </p>
              </div>
              {userLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="mt-2 text-xs text-muted-foreground">
                    Cargando...
                  </span>
                </div>
              ) : (
                <ProfileImageManager
                  userId={userId}
                  tipoUsuario={(userType as any) || "empresa"}
                  userName={userName || "Empresa"}
                  size="lg"
                  showEditButton={true}
                  className="w-full"
                />
              )}
            </div>
          )}

          {/* Campos del contacto - Columnas derecha */}
          <div
            className={`${userId ? "lg:col-span-2" : "lg:col-span-3"} grid grid-cols-1 md:grid-cols-2 gap-4`}
          >
            {CAMPOS_CONTACTO.map((campo) => {
              const valor =
                contactoPrincipal[campo.id as keyof typeof contactoPrincipal];
              const tieneError = erroresValidacion[campo.id];

              return (
                <div key={campo.id} className="space-y-2">
                  <Label htmlFor={`contacto-${campo.id}`}>
                    {campo.label}
                    {campo.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  <Input
                    id={`contacto-${campo.id}`}
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
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Recomendación:</strong> Complete todos los datos del
            contacto principal para facilitar la comunicación directa con su
            empresa.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente compacto para modal o vista reducida
export function ConfiguracionContactoCompacto({
  contactoPrincipal,
  onContactoChange,
}: {
  contactoPrincipal: any;
  onContactoChange: (contacto: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="contacto-nombre-compacto" className="text-sm">
            Nombre Completo
          </Label>
          <Input
            id="contacto-nombre-compacto"
            value={contactoPrincipal.nombre}
            onChange={(e) => onContactoChange({ nombre: e.target.value })}
            placeholder="Nombre del contacto"
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contacto-cargo-compacto" className="text-sm">
            Cargo
          </Label>
          <Input
            id="contacto-cargo-compacto"
            value={contactoPrincipal.cargo}
            onChange={(e) => onContactoChange({ cargo: e.target.value })}
            placeholder="Cargo/Posición"
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contacto-correo-compacto" className="text-sm">
            Correo
          </Label>
          <Input
            id="contacto-correo-compacto"
            type="email"
            value={contactoPrincipal.correo}
            onChange={(e) => onContactoChange({ correo: e.target.value })}
            placeholder="correo@empresa.com"
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contacto-telefono-compacto" className="text-sm">
            Teléfono
          </Label>
          <Input
            id="contacto-telefono-compacto"
            value={contactoPrincipal.telefono}
            onChange={(e) =>
              onContactoChange({
                telefono: FORMATEADORES.formatearTelefono(e.target.value),
              })
            }
            placeholder="+56 9 1234 5678"
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}

// Componente solo para visualización (sin edición)
export function ConfiguracionContactoVisualizacion({
  contactoPrincipal,
}: {
  contactoPrincipal: any;
}) {
  const campos = [
    { label: "Nombre", valor: contactoPrincipal.nombre || "No especificado" },
    { label: "Cargo", valor: contactoPrincipal.cargo || "No especificado" },
    { label: "Correo", valor: contactoPrincipal.correo || "No especificado" },
    {
      label: "Teléfono",
      valor: contactoPrincipal.telefono || "No especificado",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {campos.map((campo, index) => (
        <div key={index} className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {campo.label}:
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {campo.valor}
          </span>
        </div>
      ))}
    </div>
  );
}
