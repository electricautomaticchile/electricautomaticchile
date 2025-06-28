"use client";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Key,
  Server,
  Users,
  RefreshCw,
  Clock,
  UserPlus,
  Upload,
  User,
  X,
  Edit,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/hooks/useApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiService, ICliente } from "@/lib/api/apiService";

interface ConfiguracionProps {
  reducida?: boolean;
}

export function Configuracion({ reducida = false }: ConfiguracionProps) {
  const { user } = useAuth();
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [notificacionesSistema, setNotificacionesSistema] = useState(true);
  const [backupAutomatico, setBackupAutomatico] = useState(true);
  const [depuracionRegistros, setDepuracionRegistros] = useState(true);
  const [modoMantenimiento, setModoMantenimiento] = useState(false);
  const [intervaloActualizacion, setIntervaloActualizacion] = useState("5");
  const [periodoRetencion, setPeriodoRetencion] = useState("90");
  const [creandoSuperusuario, setCreandoSuperusuario] = useState(false);
  const [superusuarioCreado, setSuperusuarioCreado] = useState<{
    numeroCliente: string;
    password: string;
  } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para gestión de perfiles de clientes
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ICliente | null>(null);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [actualizandoCliente, setActualizandoCliente] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Función para crear un superusuario
  const crearSuperusuario = async () => {
    if (creandoSuperusuario) return;

    try {
      setCreandoSuperusuario(true);

      const respuesta = await fetch("/api/admin/crear-superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.message || "Error al crear el superusuario");
      }

      // Mostrar notificación de éxito
      toast({
        title: "Superusuario creado con éxito",
        description: `Se ha creado un superusuario con número de cliente: ${resultado.numeroCliente}`,
        variant: "success",
      });

      // Guardar los datos del superusuario
      setSuperusuarioCreado({
        numeroCliente: resultado.numeroCliente,
        password: resultado.password,
      });
    } catch (error: any) {
      console.error("Error al crear superusuario:", error);

      toast({
        title: "Error al crear superusuario",
        description:
          error.message ||
          "No se pudo crear el superusuario. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setCreandoSuperusuario(false);
    }
  };

  // Función para manejar la subida de imagen de perfil
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato incorrecto",
        description:
          "Por favor, seleccione un archivo de imagen válido (JPG, PNG, GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validar el tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "La imagen debe tener un tamaño máximo de 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);

      // Crear un lector de archivos para mostrar vista previa
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Crear un FormData para enviar la imagen
      const formData = new FormData();
      formData.append("file", file);

      // Subir la imagen al servidor
      const uploadResponse = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Error al subir la imagen");
      }

      const uploadResult = await uploadResponse.json();

      // Actualizar el estado local
      setProfileImage(uploadResult.imageUrl);

      toast({
        title: "Imagen actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast({
        title: "Error al actualizar la imagen",
        description: "No se pudo subir la imagen. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProfileImage = async () => {
    if (!profileImage) return;

    try {
      setUploadingImage(true);

      // Eliminar la imagen de perfil en la base de datos
      const response = await fetch("/api/user/update-profile-image", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen de perfil");
      }

      // Actualizar el estado local
      setProfileImage(null);

      toast({
        title: "Imagen eliminada",
        description: "Tu foto de perfil ha sido eliminada.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      toast({
        title: "Error al eliminar la imagen",
        description: "No se pudo eliminar la imagen. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Cargar clientes desde la API
  const cargarClientes = async () => {
    try {
      setCargandoClientes(true);
      const response = await apiService.obtenerClientes();

      if (response.success && response.data) {
        setClientes(response.data);
      } else {
        console.error("Error cargando clientes:", response.error);
        toast({
          title: "Error",
          description:
            "No se pudieron cargar los clientes. Por favor, intente nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cargando clientes:", error);
      toast({
        title: "Error",
        description: "Error de conexión. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setCargandoClientes(false);
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  // Filtrar clientes según búsqueda y estado
  const clientesFiltrados = clientes.filter((cliente) => {
    const coincideBusqueda =
      cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      (cliente.email &&
        cliente.email.toLowerCase().includes(busquedaCliente.toLowerCase())) ||
      (cliente.correo &&
        cliente.correo.toLowerCase().includes(busquedaCliente.toLowerCase())) ||
      (cliente.numeroCliente &&
        cliente.numeroCliente
          .toLowerCase()
          .includes(busquedaCliente.toLowerCase()));

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activo" && (cliente.activo || cliente.esActivo)) ||
      (filtroEstado === "inactivo" && !cliente.activo && !cliente.esActivo);

    return coincideBusqueda && coincideEstado;
  });

  // Abrir modal para editar cliente
  const abrirModalCliente = (cliente: ICliente) => {
    setClienteSeleccionado(cliente);
    setModalClienteAbierto(true);
  };

  // Cerrar modal de cliente
  const cerrarModalCliente = () => {
    setClienteSeleccionado(null);
    setModalClienteAbierto(false);
  };

  // Actualizar cliente
  const actualizarClientePerfil = async () => {
    if (!clienteSeleccionado) return;

    try {
      setActualizandoCliente(true);

      const datosActualizacion = {
        nombre: clienteSeleccionado.nombre,
        email: clienteSeleccionado.email || clienteSeleccionado.correo,
        telefono: clienteSeleccionado.telefono,
        empresa: clienteSeleccionado.empresa,
        // No incluir numeroCliente ni role para mantenerlos bloqueados
      };

      const response = await apiService.actualizarCliente(
        clienteSeleccionado._id,
        datosActualizacion
      );

      if (response.success) {
        toast({
          title: "Cliente actualizado",
          description:
            "El perfil del cliente ha sido actualizado correctamente.",
        });

        // Actualizar la lista local
        setClientes(
          clientes.map((cliente) =>
            cliente._id === clienteSeleccionado._id
              ? { ...cliente, ...datosActualizacion }
              : cliente
          )
        );

        cerrarModalCliente();
      } else {
        throw new Error(response.error || "Error al actualizar el cliente");
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el cliente. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setActualizandoCliente(false);
    }
  };

  // Manejar cambios en los campos del cliente
  const manejarCambioCliente = (campo: keyof ICliente, valor: string) => {
    if (clienteSeleccionado) {
      setClienteSeleccionado({
        ...clienteSeleccionado,
        [campo]: valor,
      });
    }
  };

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            Configuración del Sistema
          </CardTitle>
          <CardDescription>Ajustes principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificaciones por Email</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enviar alertas por correo
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificacionesEmail}
                onCheckedChange={setNotificacionesEmail}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="backup">Respaldo Automático</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Base de datos y configuración
                </p>
              </div>
              <Switch
                id="backup"
                checked={backupAutomatico}
                onCheckedChange={setBackupAutomatico}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Modo Mantenimiento</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Suspender acceso a usuarios
                </p>
              </div>
              <Switch
                id="maintenance"
                checked={modoMantenimiento}
                onCheckedChange={setModoMantenimiento}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-orange-600" />
          Configuración del Sistema
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Administre la configuración global para toda la plataforma de Electric
          Automatic Chile
        </p>
      </div>

      <Tabs defaultValue="general" className="mb-4">
        <TabsList className="mb-4 grid grid-cols-6 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger
            value="notificaciones"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Perfiles Clientes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes Generales</CardTitle>
              <CardDescription>
                Configure los parámetros básicos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de la Empresa</Label>
                  <Input
                    id="company-name"
                    defaultValue="Electric Automatic Chile SpA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email de Soporte</Label>
                  <Input
                    id="support-email"
                    defaultValue="soporte@electricautomaticchile.cl"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria Predeterminada</Label>
                  <Select defaultValue="America/Santiago">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Santiago">
                        Santiago (GMT-3)
                      </SelectItem>
                      <SelectItem value="America/Buenos_Aires">
                        Buenos Aires (GMT-3)
                      </SelectItem>
                      <SelectItem value="America/Bogota">
                        Bogotá (GMT-5)
                      </SelectItem>
                      <SelectItem value="America/Mexico_City">
                        Ciudad de México (GMT-6)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma Predeterminado</Label>
                  <Select defaultValue="es">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Mantenimiento</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Activar el modo de mantenimiento suspenderá temporalmente
                      el acceso a todos los usuarios excepto administradores
                    </p>
                  </div>
                  <Switch
                    checked={modoMantenimiento}
                    onCheckedChange={setModoMantenimiento}
                  />
                </div>

                {modoMantenimiento && (
                  <div className="rounded-md border border-orange-200 bg-orange-100 p-4 dark:border-orange-800 dark:bg-orange-950/50">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      El modo de mantenimiento está activo. Solo los
                      superadministradores pueden acceder al sistema.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="refresh-interval">
                      Intervalo de Actualización (minutos)
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Frecuencia de actualización automática de los datos en el
                      panel
                    </p>
                  </div>
                  <div className="w-20">
                    <Input
                      id="refresh-interval"
                      value={intervaloActualizacion}
                      onChange={(e) =>
                        setIntervaloActualizacion(e.target.value)
                      }
                      type="number"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Perfil</CardTitle>
              <CardDescription>
                Actualice su información personal y foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Nombre</Label>
                  <Input
                    id="user-name"
                    defaultValue={user?.nombre || "Administrador"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Correo Electrónico</Label>
                  <Input
                    id="user-email"
                    type="email"
                    defaultValue={user?.email || "admin@electricauto.cl"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-client-number">Número de Cliente</Label>
                  <Input
                    id="user-client-number"
                    readOnly
                    defaultValue={user?.numeroCliente || "-------"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Rol</Label>
                  <Input
                    id="user-role"
                    readOnly
                    defaultValue={
                      user?.role === "admin"
                        ? "Superadministrador"
                        : "Administrador"
                    }
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <Label>Foto de Perfil</Label>

                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage src={profileImage || "/avatars/admin.jpg"} />
                      <AvatarFallback className="text-xl">
                        {user?.nombre?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>

                    {profileImage && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeProfileImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sube una foto de perfil. Se recomienda una imagen cuadrada
                      de al menos 250x250 píxeles.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={triggerFileInput}
                        disabled={uploadingImage}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingImage ? "Subiendo..." : "Cambiar Foto"}
                      </Button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Seguridad</CardTitle>
              <CardDescription>
                Configure los ajustes de seguridad y acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Key className="h-5 w-5 text-orange-600" />
                    Contraseñas
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password-length">Longitud Mínima</Label>
                      <Select defaultValue="8">
                        <SelectTrigger id="password-length">
                          <SelectValue placeholder="Longitud mínima" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8 caracteres</SelectItem>
                          <SelectItem value="10">10 caracteres</SelectItem>
                          <SelectItem value="12">12 caracteres</SelectItem>
                          <SelectItem value="14">14 caracteres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Caducidad</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="password-expiry">
                          <SelectValue placeholder="Días hasta caducidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="60">60 días</SelectItem>
                          <SelectItem value="90">90 días</SelectItem>
                          <SelectItem value="180">180 días</SelectItem>
                          <SelectItem value="365">1 año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-lowercase"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <Label htmlFor="require-lowercase">
                        Requerir minúsculas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-uppercase"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <Label htmlFor="require-uppercase">
                        Requerir mayúsculas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-numbers"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <Label htmlFor="require-numbers">Requerir números</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-symbols"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <Label htmlFor="require-symbols">Requerir símbolos</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Autenticación
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autenticación de Dos Factores (2FA)</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Requerir 2FA para todos los usuarios administradores
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">
                      Tiempo de Inactividad (minutos)
                    </Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="session-timeout">
                        <SelectValue placeholder="Tiempo de inactividad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tiempo después del cual se cerrará la sesión por
                      inactividad
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-orange-600" />
                    Crear Superusuario
                  </h3>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Crea un nuevo superusuario con acceso al dashboard de
                      administración. Este usuario tendrá permisos completos en
                      todo el sistema.
                    </p>

                    {superusuarioCreado ? (
                      <div className="rounded-md border border-green-200 bg-green-100 p-4 dark:border-green-800 dark:bg-green-950/50 my-4">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                          ¡Superusuario creado con éxito!
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                          Guarde estas credenciales en un lugar seguro:
                        </p>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md text-sm font-mono">
                          <p>
                            <strong>Número de cliente:</strong>{" "}
                            {superusuarioCreado.numeroCliente}
                          </p>
                          <p>
                            <strong>Contraseña:</strong>{" "}
                            {superusuarioCreado.password}
                          </p>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-300 mt-2">
                          Utilice estas credenciales para acceder al dashboard
                          de superadmin.
                        </p>
                        <Button
                          className="mt-4 bg-green-600 hover:bg-green-700"
                          onClick={() => setSuperusuarioCreado(null)}
                        >
                          Cerrar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={crearSuperusuario}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={creandoSuperusuario}
                      >
                        {creandoSuperusuario
                          ? "Creando..."
                          : "Crear Superusuario"}
                        <UserPlus className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registros de Seguridad</CardTitle>
              <CardDescription>
                Configuración de registro y auditoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Actividad de Usuarios</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Registrar acciones de todos los usuarios en el sistema
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Actividad Sospechosa</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notificar cuando se detecten patrones inusuales de acceso
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-retention">Retención de Registros</Label>
                  <Select
                    value={periodoRetencion}
                    onValueChange={setPeriodoRetencion}
                  >
                    <SelectTrigger id="log-retention">
                      <SelectValue placeholder="Período de retención" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="180">180 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>
                Administre cómo y cuándo se envían las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canales de Notificación</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enviar alertas y notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch
                    checked={notificacionesEmail}
                    onCheckedChange={setNotificacionesEmail}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones del Sistema</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrar notificaciones en la interfaz de usuario
                    </p>
                  </div>
                  <Switch
                    checked={notificacionesSistema}
                    onCheckedChange={setNotificacionesSistema}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enviar alertas críticas por mensaje de texto
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de Notificaciones</h3>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notify-alerts"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <Label htmlFor="notify-alerts">Alertas del sistema</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notify-devices"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <Label htmlFor="notify-devices">
                      Estado de dispositivos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notify-reports"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <Label htmlFor="notify-reports">Reportes generados</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notify-users"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <Label htmlFor="notify-users">Actividad de usuarios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notify-maintenance"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <Label htmlFor="notify-maintenance">
                      Mantenimiento programado
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notification-frequency">
                  Frecuencia de Resumen
                </Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Frecuencia del resumen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tiempo real</SelectItem>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Frecuencia con la que se envían los resúmenes de actividad
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base de Datos</CardTitle>
              <CardDescription>
                Configuración de la base de datos y respaldos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-orange-600" />
                      Respaldo Automático
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generar copias de seguridad periódicas
                    </p>
                  </div>
                  <Switch
                    checked={backupAutomatico}
                    onCheckedChange={setBackupAutomatico}
                  />
                </div>

                {backupAutomatico && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">
                        Frecuencia de Respaldo
                      </Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="backup-frequency">
                          <SelectValue placeholder="Frecuencia de respaldo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Cada hora</SelectItem>
                          <SelectItem value="daily">Diariamente</SelectItem>
                          <SelectItem value="weekly">Semanalmente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backup-retention">
                        Retención de Respaldos
                      </Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="backup-retention">
                          <SelectValue placeholder="Período de retención" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 días</SelectItem>
                          <SelectItem value="14">14 días</SelectItem>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="90">90 días</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-orange-600" />
                      Depuración de Registros
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Eliminar automáticamente registros antiguos
                    </p>
                  </div>
                  <Switch
                    checked={depuracionRegistros}
                    onCheckedChange={setDepuracionRegistros}
                  />
                </div>

                {depuracionRegistros && (
                  <div className="space-y-2">
                    <Label htmlFor="log-purge">
                      Período de Retención de Datos
                    </Label>
                    <Select defaultValue="365">
                      <SelectTrigger id="log-purge">
                        <SelectValue placeholder="Período de retención" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 días</SelectItem>
                        <SelectItem value="180">180 días</SelectItem>
                        <SelectItem value="365">1 año</SelectItem>
                        <SelectItem value="730">2 años</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Los datos más antiguos que este período se eliminarán
                      automáticamente
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Crear Respaldo Ahora
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Optimizar Base de Datos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento</CardTitle>
              <CardDescription>
                Ajustes de rendimiento y optimización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Caché de Datos
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Almacenar datos en caché para mejorar el rendimiento
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cache-duration">
                    Duración de la Caché (minutos)
                  </Label>
                  <Select defaultValue="15">
                    <SelectTrigger id="cache-duration">
                      <SelectValue placeholder="Duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-query-results">
                    Límite de Resultados por Consulta
                  </Label>
                  <Select defaultValue="1000">
                    <SelectTrigger id="max-query-results">
                      <SelectValue placeholder="Límite de resultados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500 registros</SelectItem>
                      <SelectItem value="1000">1.000 registros</SelectItem>
                      <SelectItem value="5000">5.000 registros</SelectItem>
                      <SelectItem value="10000">10.000 registros</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Número máximo de registros devueltos por consulta estándar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancelar Cambios</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Guardar Cambios
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Perfiles de Clientes</CardTitle>
              <CardDescription>
                Administre la información de perfil de los clientes registrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filtros y búsqueda */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por nombre, email o número de cliente..."
                      value={busquedaCliente}
                      onChange={(e) => setBusquedaCliente(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activos</SelectItem>
                      <SelectItem value="inactivo">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={cargarClientes}
                  disabled={cargandoClientes}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${cargandoClientes ? "animate-spin" : ""}`}
                  />
                  Actualizar
                </Button>
              </div>

              {/* Tabla de clientes */}
              {cargandoClientes ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-500">
                    Cargando clientes...
                  </span>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Número Cliente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map((cliente) => (
                          <TableRow key={cliente._id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {cliente.nombre}
                                </div>
                                {cliente.empresa && (
                                  <div className="text-sm text-gray-500">
                                    {cliente.empresa}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {cliente.email || cliente.correo || "N/A"}
                            </TableCell>
                            <TableCell>{cliente.telefono || "N/A"}</TableCell>
                            <TableCell>
                              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {cliente.numeroCliente || "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  cliente.activo || cliente.esActivo
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {cliente.activo || cliente.esActivo
                                  ? "Activo"
                                  : "Inactivo"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => abrirModalCliente(cliente)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            {busquedaCliente || filtroEstado !== "todos"
                              ? "No se encontraron clientes que coincidan con los filtros"
                              : "No hay clientes registrados"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {clientes.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {clientes.filter((c) => c.activo || c.esActivo).length}
                  </div>
                  <div className="text-sm text-gray-500">Clientes Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {clientes.filter((c) => !c.activo && !c.esActivo).length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Clientes Inactivos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para editar cliente */}
      <Dialog open={modalClienteAbierto} onOpenChange={setModalClienteAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil de Cliente</DialogTitle>
            <DialogDescription>
              Modifique la información del perfil del cliente. Los campos
              bloqueados no se pueden editar.
            </DialogDescription>
          </DialogHeader>

          {clienteSeleccionado && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre Completo</Label>
                <Input
                  id="edit-nombre"
                  value={clienteSeleccionado.nombre}
                  onChange={(e) =>
                    manejarCambioCliente("nombre", e.target.value)
                  }
                  placeholder="Nombre completo del cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo Electrónico</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={
                    clienteSeleccionado.email ||
                    clienteSeleccionado.correo ||
                    ""
                  }
                  onChange={(e) =>
                    manejarCambioCliente("email", e.target.value)
                  }
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-telefono">Teléfono</Label>
                <Input
                  id="edit-telefono"
                  value={clienteSeleccionado.telefono || ""}
                  onChange={(e) =>
                    manejarCambioCliente("telefono", e.target.value)
                  }
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-empresa">Empresa</Label>
                <Input
                  id="edit-empresa"
                  value={clienteSeleccionado.empresa || ""}
                  onChange={(e) =>
                    manejarCambioCliente("empresa", e.target.value)
                  }
                  placeholder="Nombre de la empresa"
                />
              </div>

              <Separator className="my-4" />

              {/* Campos bloqueados */}
              <div className="space-y-2">
                <Label htmlFor="edit-numero-cliente" className="text-gray-500">
                  Número de Cliente (No editable)
                </Label>
                <Input
                  id="edit-numero-cliente"
                  value={clienteSeleccionado.numeroCliente || "No asignado"}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-gray-500">
                  Rol (No editable)
                </Label>
                <Input
                  id="edit-role"
                  value={clienteSeleccionado.role || "cliente"}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500"
                />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Nota:</strong> El número de cliente y el rol son
                  campos del sistema que no se pueden modificar desde esta
                  interfaz.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={cerrarModalCliente}>
              Cancelar
            </Button>
            <Button
              onClick={actualizarClientePerfil}
              disabled={actualizandoCliente}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {actualizandoCliente ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
