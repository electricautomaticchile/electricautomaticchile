"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Plus,
  X,
} from "lucide-react";
import { useClientes } from "@/lib/hooks/useApi";
import { ICliente } from "@/lib/api/apiService";
import {
  reportesService,
  IConfigReporte,
  IProgressCallback,
} from "@/lib/api/services/reportesService";
import { ReporteProgress } from "@/components/ui/reporte-progress";

interface GestionClientesProps {
  reducida?: boolean;
}

// Modal para crear/editar cliente
const ClienteModal = ({
  isOpen,
  onClose,
  cliente,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  cliente?: ICliente | null;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    rut: "",
    tipoCliente: "particular" as "particular" | "empresa",
    empresa: "",
    planSeleccionado: "",
    montoMensual: 0,
    notas: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { crear, actualizar } = useClientes();

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        correo: cliente.correo || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        ciudad: cliente.ciudad || "",
        rut: cliente.rut || "",
        tipoCliente: cliente.tipoCliente || "particular",
        empresa: cliente.empresa || "",
        planSeleccionado: cliente.planSeleccionado || "",
        montoMensual: cliente.montoMensual || 0,
        notas: cliente.notas || "",
      });
    } else {
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        rut: "",
        tipoCliente: "particular",
        empresa: "",
        planSeleccionado: "",
        montoMensual: 0,
        notas: "",
      });
    }
  }, [cliente, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (cliente) {
        // Actualizar cliente existente
        await actualizar(cliente._id, formData);
        toast({
          title: "Cliente actualizado",
          description:
            "Los datos del cliente se han actualizado correctamente.",
        });
      } else {
        // Crear nuevo cliente
        await crear(formData);
        toast({
          title: "Cliente creado",
          description: "El nuevo cliente se ha registrado exitosamente.",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al ${cliente ? "actualizar" : "crear"} cliente: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {cliente
              ? "Modifica los datos del cliente"
              : "Registra un nuevo cliente en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Email *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="+56 9 1234 5678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input
                id="rut"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
                placeholder="12.345.678-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
              <Select
                value={formData.tipoCliente}
                onValueChange={(value: "particular" | "empresa") =>
                  setFormData({ ...formData, tipoCliente: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipoCliente === "empresa" && (
              <div className="space-y-2">
                <Label htmlFor="empresa">Nombre de Empresa</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) =>
                    setFormData({ ...formData, empresa: e.target.value })
                  }
                  placeholder="Nombre de la empresa"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) =>
                  setFormData({ ...formData, ciudad: e.target.value })
                }
                placeholder="Santiago, Valparaíso, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planSeleccionado">Plan</Label>
              <Select
                value={formData.planSeleccionado}
                onValueChange={(value) =>
                  setFormData({ ...formData, planSeleccionado: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="montoMensual">Monto Mensual ($)</Label>
              <Input
                id="montoMensual"
                type="number"
                min="0"
                value={formData.montoMensual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    montoMensual: Number(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              placeholder="Dirección completa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
              placeholder="Notas adicionales..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {cliente ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>{cliente ? "Actualizar Cliente" : "Crear Cliente"}</>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente principal
export function GestionClientes({ reducida = false }: GestionClientesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCiudad, setFiltroCiudad] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ICliente | null>(null);
  const [clienteEliminar, setClienteEliminar] = useState<ICliente | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados para el sistema de reportes
  const [isReporteModalOpen, setIsReporteModalOpen] = useState(false);
  const [reporteConfig, setReporteConfig] = useState<IConfigReporte | null>(
    null
  );

  const { clientes, loading, error, obtenerClientes, eliminar } = useClientes();
  const { toast } = useToast();

  // Cargar clientes iniciales
  useEffect(() => {
    fetchClientes();
  }, [currentPage]);

  const fetchClientes = async () => {
    try {
      await obtenerClientes({
        page: currentPage,
        limit: reducida ? 5 : 10,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar clientes",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchClientes();
    setIsRefreshing(false);
  };

  const handleEdit = (cliente: ICliente) => {
    setClienteEditando(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!clienteEliminar) return;

    try {
      await eliminar(clienteEliminar._id);
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente.",
      });
      setClienteEliminar(null);
      fetchClientes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar cliente",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setClienteEditando(null);
  };

  const handleModalSuccess = () => {
    fetchClientes();
  };

  // Manejar exportación de reportes con progreso
  const handleExportar = async (formato: "excel" | "csv") => {
    const filtros = {
      ...(filtroTipo !== "todos" && { tipoCliente: filtroTipo }),
      ...(filtroCiudad !== "todos" && { ciudad: filtroCiudad }),
      ...(searchTerm && { busqueda: searchTerm }),
    };

    const config: IConfigReporte = {
      titulo: "Reporte de Clientes",
      tipo: "clientes",
      formato,
      filtros,
    };

    // Vista previa de filtros
    const vistaPrevia = reportesService.generarVistaPrevia(config);
    const tiempoEstimado = reportesService.estimarTiempoGeneracion(config);

    // Mostrar confirmación con vista previa
    const confirmar = window.confirm(
      `¿Generar reporte de clientes?\n\n` +
        `Formato: ${formato.toUpperCase()}\n` +
        `${vistaPrevia}\n` +
        `Tiempo estimado: ${tiempoEstimado}\n\n` +
        `¿Continuar?`
    );

    if (!confirmar) return;

    // Configurar y abrir modal de progreso
    setReporteConfig(config);
    setIsReporteModalOpen(true);
  };

  // Función para generar el reporte (llamada desde el modal de progreso)
  const generarReporte = async (
    config: IConfigReporte,
    onProgress: IProgressCallback
  ) => {
    try {
      await reportesService.generarReporteCompleto(config, onProgress);

      toast({
        title: "Reporte generado",
        description: `El reporte de clientes en formato ${config.formato.toUpperCase()} se ha descargado exitosamente.`,
      });
    } catch (error) {
      console.error("Error generando reporte:", error);
      throw error;
    }
  };

  // Filtrar clientes
  const clientesFiltrados = Array.isArray(clientes)
    ? clientes.filter((cliente: ICliente) => {
        const matchSearch =
          cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.numeroCliente
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchTipo =
          filtroTipo === "todos" || cliente.tipoCliente === filtroTipo;
        const matchCiudad =
          filtroCiudad === "todos" || cliente.ciudad === filtroCiudad;

        return matchSearch && matchTipo && matchCiudad;
      })
    : [];

  // Obtener ciudades únicas para filtro
  const ciudadesUnicas = Array.isArray(clientes)
    ? Array.from(
        new Set(
          clientes
            .map((c: ICliente) => c.ciudad)
            .filter((ciudad): ciudad is string => Boolean(ciudad))
        )
      )
    : [];

  // Calcular estadísticas
  const stats = {
    total: Array.isArray(clientes) ? clientes.length : 0,
    activos: Array.isArray(clientes)
      ? clientes.filter(
          (c: ICliente) => c.activo !== false && c.esActivo !== false
        ).length
      : 0,
    empresas: Array.isArray(clientes)
      ? clientes.filter((c: ICliente) => c.tipoCliente === "empresa").length
      : 0,
    particulares: Array.isArray(clientes)
      ? clientes.filter((c: ICliente) => c.tipoCliente === "particular").length
      : 0,
  };

  // Versión reducida para dashboard
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Activos
            </div>
            <div className="text-xl font-bold text-green-600">
              {stats.activos}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total
            </div>
            <div className="text-xl font-bold text-blue-600">{stats.total}</div>
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            </div>
          ) : (
            clientesFiltrados.slice(0, 3).map((cliente: ICliente) => (
              <div
                key={cliente._id}
                className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{cliente.nombre}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cliente.tipoCliente === "empresa" ? (
                        <>
                          <Building2 className="h-3 w-3 inline mr-1" />
                          {cliente.empresa || "Empresa"}
                        </>
                      ) : (
                        <>
                          <Users className="h-3 w-3 inline mr-1" />
                          Particular
                        </>
                      )}
                      {cliente.numeroCliente && ` • ${cliente.numeroCliente}`}
                    </div>
                  </div>
                  <Badge
                    variant={
                      cliente.activo !== false && cliente.esActivo !== false
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {cliente.activo !== false && cliente.esActivo !== false
                      ? "Activo"
                      : "Inactivo"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && stats.total > 3 && (
          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs">
              Ver todos ({stats.total})
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Versión completa
  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-orange-600" />
            Gestión de Clientes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administre su cartera de clientes y sus datos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Activos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activos}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Empresas
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.empresas}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Particulares
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.particulares}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="particular">Particulares</SelectItem>
                  <SelectItem value="empresa">Empresas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroCiudad} onValueChange={setFiltroCiudad}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las ciudades</SelectItem>
                  {ciudadesUnicas.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExportar("excel")}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportar("csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({clientesFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">Cargando clientes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Error al cargar clientes
              </p>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ||
                filtroTipo !== "todos" ||
                filtroCiudad !== "todos"
                  ? "No se encontraron clientes con los filtros aplicados"
                  : "No hay clientes registrados"}
              </p>
              {!searchTerm &&
                filtroTipo === "todos" &&
                filtroCiudad === "todos" && (
                  <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear primer cliente
                  </Button>
                )}
            </div>
          ) : (
            <>
              {/* Tabla desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Cliente
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Tipo
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Contacto
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Ubicación
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Plan
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Estado
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente: ICliente) => (
                      <tr
                        key={cliente._id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {cliente.nombre}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {cliente.numeroCliente || "Sin número"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {cliente.tipoCliente === "empresa" ? (
                              <>
                                <Building2 className="h-3 w-3 mr-1" />
                                Empresa
                              </>
                            ) : (
                              <>
                                <Users className="h-3 w-3 mr-1" />
                                Particular
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              {cliente.correo}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-2 text-gray-400" />
                              {cliente.telefono}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {cliente.ciudad && (
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                              {cliente.ciudad}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {cliente.planSeleccionado && (
                            <Badge variant="secondary" className="capitalize">
                              {cliente.planSeleccionado}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              cliente.activo !== false &&
                              cliente.esActivo !== false
                                ? "default"
                                : "secondary"
                            }
                          >
                            {cliente.activo !== false &&
                            cliente.esActivo !== false
                              ? "Activo"
                              : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(cliente)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setClienteEliminar(cliente)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista móvil */}
              <div className="lg:hidden space-y-3">
                {clientesFiltrados.map((cliente: ICliente) => (
                  <Card key={cliente._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {cliente.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cliente.numeroCliente || "Sin número"}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(cliente)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setClienteEliminar(cliente)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-gray-400" />
                          {cliente.correo}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2 text-gray-400" />
                          {cliente.telefono}
                        </div>
                        {cliente.ciudad && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                            {cliente.ciudad}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {cliente.tipoCliente === "empresa" ? (
                              <>
                                <Building2 className="h-3 w-3 mr-1" />
                                Empresa
                              </>
                            ) : (
                              <>
                                <Users className="h-3 w-3 mr-1" />
                                Particular
                              </>
                            )}
                          </Badge>
                          {cliente.planSeleccionado && (
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {cliente.planSeleccionado}
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant={
                            cliente.activo !== false &&
                            cliente.esActivo !== false
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {cliente.activo !== false &&
                          cliente.esActivo !== false
                            ? "Activo"
                            : "Inactivo"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal para crear/editar cliente */}
      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cliente={clienteEditando}
        onSuccess={handleModalSuccess}
      />

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={!!clienteEliminar}
        onOpenChange={() => setClienteEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al cliente{" "}
              <strong>{clienteEliminar?.nombre}</strong> del sistema. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de progreso de reporte */}
      <ReporteProgress
        isOpen={isReporteModalOpen}
        onClose={() => setIsReporteModalOpen(false)}
        onGenerate={generarReporte}
        config={reporteConfig}
      />
    </div>
  );
}
