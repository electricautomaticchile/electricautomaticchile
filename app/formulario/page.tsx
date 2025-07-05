"use client";
import React, { useState, useRef } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  Send,
  Building2,
  Phone,
  AtSign,
  User,
  FileText,
  Briefcase,
  Clock,
  Upload,
} from "lucide-react";
import { apiService } from "@/lib/api/apiService";
import { API_URL } from "@/lib/api/utils/config";

export default function FormularioContacto() {
  // Referencia al input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    servicio: "",
    plazo: "",
    mensaje: "",
    archivoUrl: "",
  });

  // Estado para el archivo seleccionado
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(
    null
  );
  const [archivoNombre, setArchivoNombre] = useState("");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [progresoSubida, setProgresoSubida] = useState(0);

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

  // Manejar cambio en el select
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, servicio: value }));
  };

  // Manejar cambio en el select de plazo
  const handlePlazoChange = (value: string) => {
    setFormData((prev) => ({ ...prev, plazo: value }));
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Verificar tamaño máximo (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg(`El archivo excede el tamaño máximo permitido de 10MB`);
        setArchivoSeleccionado(null);
        setArchivoNombre("");
        return;
      }

      setArchivoSeleccionado(file);
      setArchivoNombre(file.name);
      setErrorMsg("");
    } else {
      setArchivoSeleccionado(null);
      setArchivoNombre("");
    }
  };

  // Función para subir archivo a S3 (mantenemos la lógica existente)
  const subirArchivoS3 = async (file: File): Promise<string> => {
    try {
      setSubiendoArchivo(true);
      setProgresoSubida(0);

      // Crear FormData para el archivo
      const fd = new FormData();
      fd.append("archivo", file);
      fd.append("tipoDocumento", "reporte_tecnico");
      fd.append("entidadRelacionada", "cotizacion");
      fd.append("referenciaId", "formulario-contacto");
      fd.append("entidadModelo", "Cotizacion");
      fd.append("nombre", file.name);
      fd.append("esPublico", "false");
      fd.append("email", formData.email);

      // Headers especiales para indicar que es un formulario público
      const headers = {
        "Content-Type": "multipart/form-data",
        "X-Form-Type": "contacto",
      };

      // Subir archivo a S3 mediante nuestra API interna (temporal)
      const response = await fetch(`${API_URL}/documentos/upload`, {
        method: "POST",
        body: fd,
        headers: {
          "X-Form-Type": "contacto",
        },
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const result = await response.json();

      // Actualizar progreso
      setProgresoSubida(100);

      // Retornar la URL del archivo subido
      return result.data?.url || "";
    } catch (error: any) {
      console.error("Error al subir archivo:", error);
      const mensajeError =
        error.response?.data?.mensaje || "Error al subir el archivo";
      throw new Error(mensajeError);
    } finally {
      setSubiendoArchivo(false);
    }
  };

  // Manejar envío del formulario
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setEstado("idle");
    setErrorMsg("");
    setErrores({});

    try {
      // Variables para el manejo de archivos
      let archivoUrl = "";
      let archivoTipo = "";
      let archivoNombreCompleto = "";

      // Si hay un archivo seleccionado
      if (archivoSeleccionado) {
        try {
          archivoUrl = await subirArchivoS3(archivoSeleccionado);
          archivoTipo = archivoSeleccionado.type;
          archivoNombreCompleto = archivoSeleccionado.name;
        } catch (error: any) {
          throw new Error(`Error al subir archivo: ${error.message}`);
        }
      }

      // Preparar datos para enviar al backend externo
      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email,
        empresa: formData.empresa || undefined,
        telefono: formData.telefono || undefined,
        servicio: formData.servicio,
        plazo: formData.plazo || undefined,
        mensaje: formData.mensaje,
        archivoUrl: archivoUrl || undefined,
        archivo: archivoNombreCompleto || undefined,
        archivoTipo: archivoTipo || undefined,
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
        servicio: "",
        plazo: "",
        mensaje: "",
        archivoUrl: "",
      });
      setArchivoSeleccionado(null);
      setArchivoNombre("");
      setErrores({});

      // Resetear form
      try {
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (resetError) {
        console.log(
          "No se pudo resetear el formulario, pero los datos se enviaron correctamente"
        );
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
          <h1 className="text-3xl font-bold mb-2">Solicitud de Cotización</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Completa el formulario para recibir una cotización personalizada
            según tus necesidades. Nuestro equipo técnico evaluará tu solicitud
            y te contactará a la brevedad.
          </p>
        </div>

        {/* Mensaje de éxito */}
        {estado === "success" && (
          <Alert className="mb-8 border-green-500/30 bg-green-500/10 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>¡Solicitud enviada con éxito!</AlertTitle>
            <AlertDescription>
              Gracias por solicitar una cotización. Tu solicitud ha sido
              registrada
              {numeroCotizacion && (
                <span className="font-semibold">
                  {" "}
                  con el número: {numeroCotizacion}
                </span>
              )}
              . Un especialista preparará tu cotización personalizada y te
              contactaremos dentro de las próximas 24-48 horas hábiles.
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
            <CardTitle className="text-xl">Formulario de Cotización</CardTitle>
            <CardDescription>
              Completa todos los campos marcados con * para enviarnos tu
              solicitud
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

                {/* Servicio */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="servicio" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-orange-500" />
                    Tipo de cotización <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.servicio}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger
                      className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.servicio ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Selecciona el tipo de cotización" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cotizacion_reposicion">
                        Cotización de Sistema de Reposición
                      </SelectItem>
                      <SelectItem value="cotizacion_monitoreo">
                        Cotización de Sistema de Monitoreo
                      </SelectItem>
                      <SelectItem value="cotizacion_mantenimiento">
                        Cotización de Mantenimiento
                      </SelectItem>
                      <SelectItem value="cotizacion_completa">
                        Cotización de Solución Integral
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.servicio && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.servicio}
                    </p>
                  )}
                </div>

                {/* Plazo */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="plazo" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Plazo deseado
                  </Label>
                  <Select
                    value={formData.plazo}
                    onValueChange={handlePlazoChange}
                  >
                    <SelectTrigger
                      className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.plazo ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="¿Cuál es tu plazo ideal?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgente">
                        Urgente (1-2 días)
                      </SelectItem>
                      <SelectItem value="pronto">Pronto (3-7 días)</SelectItem>
                      <SelectItem value="normal">
                        Normal (1-2 semanas)
                      </SelectItem>
                      <SelectItem value="planificacion">
                        En planificación (1 mes o más)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.plazo && (
                    <p className="text-red-500 text-xs mt-1">{errores.plazo}</p>
                  )}
                </div>

                {/* Mensaje */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mensaje" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Detalles adicionales <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="mensaje"
                    placeholder="Describe tu proyecto o necesidad para que podamos preparar una cotización más precisa"
                    className={`min-h-[120px] border-input/60 focus-visible:ring-orange-500/30 ${errores.mensaje ? "border-red-500" : ""}`}
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

                {/* Archivo */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Adjuntar archivo (opcional)
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`border-2 border-dashed rounded-md p-4 ${archivoSeleccionado ? "border-orange-300 bg-orange-50" : "border-gray-200"}`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload
                          className={`h-8 w-8 ${archivoSeleccionado ? "text-orange-500" : "text-gray-400"}`}
                        />
                        <p
                          className={`text-sm font-medium ${archivoSeleccionado ? "text-orange-500" : "text-gray-500"}`}
                        >
                          {archivoSeleccionado
                            ? "Archivo listo para enviar"
                            : "Haz clic para seleccionar archivo"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Formato aceptado: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="mt-2 text-sm"
                          size="sm"
                        >
                          {archivoSeleccionado
                            ? "Cambiar archivo"
                            : "Seleccionar archivo"}
                        </Button>
                      </div>
                    </div>

                    {archivoNombre && (
                      <div className="flex items-center p-2 bg-orange-50 rounded border border-orange-100">
                        <FileText className="h-4 w-4 text-orange-500 mr-2" />
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {archivoNombre}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setArchivoSeleccionado(null);
                            setArchivoNombre("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          Quitar
                        </Button>
                      </div>
                    )}

                    {subiendoArchivo && (
                      <div className="w-full mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${progresoSubida}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Subiendo archivo: {progresoSubida}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end px-0 pt-4">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  disabled={enviando || subiendoArchivo}
                >
                  {enviando ? "Enviando..." : "Solicitar Cotización"}
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
