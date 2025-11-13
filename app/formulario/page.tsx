"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  Send,
  Building2,
  Phone,
  AtSign,
  User,
  FileText,
} from "lucide-react";
import { apiService } from "@/lib/api/apiService";

export default function FormularioContacto() {
  // Estados para campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    mensaje: "",
  });

  // Estados para manejo del formulario
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [numeroCotizacion, setNumeroCotizacion] = useState<string>("");

  // Manejar cambios en los campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Manejar envío del formulario
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setEstado("idle");
    setErrorMsg("");
    setErrores({});

    try {
      // Preparar datos para enviar al backend externo
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        empresa: formData.empresa || undefined,
        telefono: formData.telefono || undefined,
        servicio: "Consulta General",
        mensaje: formData.mensaje,
      };

      // Enviar al backend externo usando el servicio API
      const response = await apiService.enviarFormularioContacto(dataToSend);

      if (!response.success) {
        if (response.errors && Array.isArray(response.errors)) {
          // Manejar errores de validación
          const erroresObj: Record<string, string> = {};
          response.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              erroresObj[err.path[0]] = err.message;
            }
          });
          setErrores(erroresObj);
          throw new Error("Por favor, corrige los errores en el formulario");
        } else {
          throw new Error(response.error || "Error al enviar el formulario");
        }
      }

      // Éxito
      setEstado("success");
      setNumeroCotizacion(response.data?.numero || "");

      // Limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        empresa: "",
        telefono: "",
        mensaje: "",
      });
      setErrores({});

      // Resetear form
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (error: any) {
      setEstado("error");
      setErrorMsg(
        error.message ||
          "Ocurrió un error al enviar el formulario. Por favor, intente nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes alguna consulta o necesitas más información? Completa el
            formulario y nuestro equipo te contactará a la brevedad para
            ayudarte.
          </p>
        </div>

        {/* Mensaje de éxito */}
        {estado === "success" && (
          <Alert className="mb-8 border-green-500/30 bg-green-500/10 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>¡Mensaje enviado con éxito!</AlertTitle>
            <AlertDescription>
              Gracias por contactarnos. Hemos recibido tu mensaje
              {numeroCotizacion && (
                <span className="font-semibold">
                  {" "}
                  (Ref: {numeroCotizacion})
                </span>
              )}
              . Nuestro equipo te responderá dentro de las próximas 24-48 horas
              hábiles.
            </AlertDescription>
          </Alert>
        )}

        {/* Mensaje de error */}
        {estado === "error" && (
          <Alert className="mb-8 border-destructive/30 bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Formulario de Contacto</CardTitle>
            <CardDescription>
              Completa los campos marcados con * y te responderemos pronto
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={manejarEnvio} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-500" />
                    Nombre completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ingresa tu nombre completo"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.nombre ? "border-red-500" : ""}`}
                  />
                  {errores.nombre && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.nombre}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-orange-500" />
                    Correo electrónico <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.email ? "border-red-500" : ""}`}
                  />
                  {errores.email && (
                    <p className="text-red-500 text-xs mt-1">{errores.email}</p>
                  )}
                </div>

                {/* Empresa */}
                <div className="space-y-2">
                  <Label htmlFor="empresa" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-orange-500" />
                    Empresa
                  </Label>
                  <Input
                    id="empresa"
                    placeholder="Nombre de tu empresa (opcional)"
                    value={formData.empresa}
                    onChange={handleChange}
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.empresa ? "border-red-500" : ""}`}
                  />
                  {errores.empresa && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.empresa}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-500" />
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.telefono ? "border-red-500" : ""}`}
                  />
                  {errores.telefono && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.telefono}
                    </p>
                  )}
                </div>

                {/* Mensaje */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mensaje" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Mensaje <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="mensaje"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    className={`min-h-[140px] border-input/60 focus-visible:ring-orange-500/30 ${errores.mensaje ? "border-red-500" : ""}`}
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                  />
                  {errores.mensaje && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.mensaje}
                    </p>
                  )}
                </div>
              </div>

              <CardFooter className="flex justify-end px-0 pt-4">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  disabled={enviando}
                >
                  {enviando ? "Enviando..." : "Enviar Mensaje"}
                  <Send className="h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            También puedes contactarnos directamente a{" "}
            <a
              href="mailto:electricautomaticchile@gmail.com"
              className="text-orange-500 hover:underline"
            >
              electricautomaticchile@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
