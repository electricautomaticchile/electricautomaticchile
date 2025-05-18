"use client"
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, Send, Building2, Phone, AtSign, User, FileText, Briefcase, Clock } from 'lucide-react';

export default function FormularioContacto() {
  // Estados para campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: '',
    servicio: '',
    plazo: '',
    mensaje: ''
  });
  
  // Estados para manejo del formulario
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [archivoNombre, setArchivoNombre] = useState('');

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Manejar cambio en el select
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, servicio: value }));
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoNombre(e.target.files[0].name);
    } else {
      setArchivoNombre('');
    }
  };

  // Manejar cambio en el select de plazo
  const handlePlazoChange = (value: string) => {
    setFormData(prev => ({ ...prev, plazo: value }));
  };

  // Manejar envío del formulario
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setEstado('idle');
    setErrorMsg('');
    setErrores({});

    try {
      // Obtener el archivo si existe
      const formElement = e.currentTarget;
      const fileField = formElement.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Preparamos los datos del formulario
      let dataToSend: any = {
        ...formData,
        archivo: fileField.files && fileField.files.length > 0 ? fileField.files[0].name : undefined,
      };

      // Si hay un archivo seleccionado, lo convertimos a Base64
      if (fileField.files && fileField.files.length > 0) {
        const file = fileField.files[0];
        // Limitamos a 5MB para evitar problemas con el tamaño del payload
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('El archivo no debe superar los 5MB');
        }
        
        const fileBase64 = await convertFileToBase64(file);
        dataToSend = {
          ...dataToSend,
          archivoBase64: fileBase64,
          archivoTipo: file.type
        };
      }

    // Enviar los datos a la API
    const response = await fetch('/api/envioformulario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(dataToSend),
    });

      const responseData = await response.json();

    if (!response.ok) {
        if (responseData.errors && Array.isArray(responseData.errors)) {
          // Manejar errores de validación de Zod
          const erroresObj: Record<string, string> = {};
          responseData.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              erroresObj[err.path[0]] = err.message;
            }
          });
          setErrores(erroresObj);
          throw new Error('Por favor, corrige los errores en el formulario');
        } else {
          throw new Error(responseData.message || 'Error al enviar el formulario');
        }
      }

      // Éxito
      setEstado('success');
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        empresa: '',
        telefono: '',
        servicio: '',
        plazo: '',
        mensaje: ''
      });
      setArchivoNombre('');
      setErrores({});
      
      // Resetear form
      formElement.reset();
    } catch (error: any) {
      setEstado('error');
      setErrorMsg(error.message || 'Ocurrió un error al enviar el formulario. Por favor, intente nuevamente.');
    } finally {
    setEnviando(false);
    }
  };

  // Función para convertir archivo a Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Solicitud de Cotización</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Completa el formulario para recibir una cotización personalizada según tus necesidades.
            Nuestro equipo técnico evaluará tu solicitud y te contactará a la brevedad.
          </p>
      </div>
        
        {/* Mensaje de éxito */}
        {estado === 'success' && (
          <Alert className="mb-8 border-green-500/30 bg-green-500/10 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>¡Solicitud enviada con éxito!</AlertTitle>
            <AlertDescription>
              Gracias por solicitar una cotización. Hemos recibido tu solicitud y un especialista 
              preparará tu cotización personalizada. Te contactaremos dentro de las próximas 24-48 horas hábiles.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Mensaje de error */}
        {estado === 'error' && (
          <Alert className="mb-8 border-destructive/30 bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
          <AlertDescription>
              {errorMsg}
          </AlertDescription>
        </Alert>
        )}
        
        {/* Formulario */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Formulario de Cotización</CardTitle>
            <CardDescription>
              Completa todos los campos marcados con * para enviarnos tu solicitud
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
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.nombre ? 'border-red-500' : ''}`}
                  />
                  {errores.nombre && (
                    <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
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
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.email ? 'border-red-500' : ''}`}
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
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.empresa ? 'border-red-500' : ''}`}
                  />
                  {errores.empresa && (
                    <p className="text-red-500 text-xs mt-1">{errores.empresa}</p>
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
                    className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.telefono ? 'border-red-500' : ''}`}
                  />
                  {errores.telefono && (
                    <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
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
                    <SelectTrigger className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.servicio ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecciona el tipo de cotización" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cotizacion_reposicion">Cotización de Sistema de Reposición</SelectItem>
                      <SelectItem value="cotizacion_monitoreo">Cotización de Sistema de Monitoreo</SelectItem>
                      <SelectItem value="cotizacion_mantenimiento">Cotización de Mantenimiento</SelectItem>
                      <SelectItem value="cotizacion_completa">Cotización de Solución Integral</SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.servicio && (
                    <p className="text-red-500 text-xs mt-1">{errores.servicio}</p>
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
                    <SelectTrigger className={`border-input/60 focus-visible:ring-orange-500/30 ${errores.plazo ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="¿Cuál es tu plazo ideal?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgente">Urgente (1-2 días)</SelectItem>
                      <SelectItem value="pronto">Pronto (3-7 días)</SelectItem>
                      <SelectItem value="normal">Normal (1-2 semanas)</SelectItem>
                      <SelectItem value="planificacion">En planificación (1 mes o más)</SelectItem>
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
                    className={`min-h-[120px] border-input/60 focus-visible:ring-orange-500/30 ${errores.mensaje ? 'border-red-500' : ''}`}
                    value={formData.mensaje} 
                    onChange={handleChange} 
                    required 
                  />
                  {errores.mensaje && (
                    <p className="text-red-500 text-xs mt-1">{errores.mensaje}</p>
                  )}
                </div>
                
                {/* Archivo */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Adjuntar archivo (opcional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={handleFileChange}
                      className="border-input/60 focus-visible:ring-orange-500/30" 
                    />
                  </div>
                  {archivoNombre && (
                    <p className="text-xs text-muted-foreground">
                      Archivo seleccionado: {archivoNombre}
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
            También puedes contactarnos directamente a <a href="mailto:electricautomaticchile@gmail.com" className="text-orange-500 hover:underline">electricautomaticchile@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
