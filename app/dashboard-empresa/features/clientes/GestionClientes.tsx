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
import { ICliente } from "@/lib/api/apiService";
import {
  reportesService,
  IConfigReporte,
  IProgressCallback,
} from "@/lib/api/services/reportesService";
import { ReporteProgress } from "@/components/ui/reporte-progress";

// Importar los subcomponentes
import {
  ClienteModal,
  ClientesFiltros,
  ClientesAcciones,
  ClientesEstadisticas,
  ClientesTabla,
  EstadisticasData,
} from "./index";

// Importar el nuevo hook con React Query
import {
  useClientes,
  useClientesStats,
} from "@/lib/hooks/queries/useClientesQuery";

interface GestionClientesProps {
  reducida?: boolean;
}

// Componente principal
export function GestionClientes({ reducida = false }: GestionClientesProps) {
  // Estados principales
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCiudad, setFiltroCiudad] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ICliente | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para el sistema de reportes
  const [isReporteModalOpen, setIsReporteModalOpen] = useState(false);
  const [reporteConfig, setReporteConfig] = useState<IConfigReporte | null>(
    null
  );

  const { toast } = useToast();
  const itemsPerPage = reducida ? 5 : 10;

  // Hook con React Query - con parámetros optimizados
  const clientesParams = {
    page: currentPage,
    limit: itemsPerPage,
    ...(filtroTipo !== "todos" && { tipoCliente: filtroTipo }),
    ...(filtroCiudad !== "todos" && { ciudad: filtroCiudad }),
    ...(searchTerm && { busqueda: searchTerm }),
  };

  const {
    clientes,
    loading,
    error,
    isRefetching,
    crear,
    actualizar,
    eliminar,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useClientes(clientesParams);

  // Hook para estadísticas
  const { data: statsData, isLoading: statsLoading } = useClientesStats();

  // Generar estadísticas con datos de React Query
  const estadisticas: EstadisticasData = {
    totalClientes: statsData?.total || 0,
    clientesActivos: statsData?.activos || 0,
    clientesInactivos: statsData?.inactivos || 0,
    clientesEmpresas: statsData?.empresas || 0,
    clientesParticulares: statsData?.particulares || 0,
    ingresosMensuales: statsData?.ingresosMensuales || 0,
    crecimientoMensual: 5.2, // Esto vendría del API en el futuro
    nuevosEsteMes: 3, // Esto vendría del API en el futuro
  };

  // Efecto para refetch cuando cambian los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filtroTipo, filtroCiudad, currentPage, refetch]);

  // Filtrar clientes localmente (solo para la versión reducida)
  const clientesFiltrados = reducida
    ? clientes.filter((cliente: ICliente) => {
        const matchesSearch =
          !searchTerm ||
          cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefono?.includes(searchTerm) ||
          cliente.rut?.includes(searchTerm);

        const matchesTipo =
          filtroTipo === "todos" || cliente.tipoCliente === filtroTipo;
        const matchesCiudad =
          filtroCiudad === "todos" || cliente.ciudad === filtroCiudad;

        return matchesSearch && matchesTipo && matchesCiudad;
      })
    : clientes;

  // Manejadores de eventos optimizados con React Query
  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de clientes se ha actualizado correctamente.",
    });
  };

  const handleEdit = (cliente: ICliente) => {
    setClienteEditando(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async (cliente: ICliente) => {
    try {
      await eliminar(cliente._id);
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente.",
      });
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
    // No necesitamos hacer refetch manual, React Query se encarga automáticamente
    toast({
      title: clienteEditando ? "Cliente actualizado" : "Cliente creado",
      description: `El cliente ha sido ${clienteEditando ? "actualizado" : "creado"} exitosamente.`,
    });
    handleModalClose();
  };

  const handleLimpiarFiltros = () => {
    setSearchTerm("");
    setFiltroTipo("todos");
    setFiltroCiudad("todos");
    setCurrentPage(1);
  };

  // Manejar exportación de reportes
  const handleExportar = async (formato: "excel" | "csv" | "pdf") => {
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

    // Mostrar confirmación
    const confirmar = window.confirm(
      `¿Generar reporte de clientes?\n\n` +
        `Formato: ${formato.toUpperCase()}\n` +
        `${vistaPrevia}\n` +
        `Tiempo estimado: ${tiempoEstimado}\n\n` +
        `¿Continuar?`
    );

    if (!confirmar) return;

    setReporteConfig(config);
    setIsReporteModalOpen(true);
  };

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
      toast({
        title: "Error al generar reporte",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  // Calcular paginación
  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);
  const clientesPaginados = reducida
    ? clientesFiltrados.slice(0, itemsPerPage)
    : clientesFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  // Mostrar errores si los hay
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Versión reducida para el dashboard
  if (reducida) {
    return (
      <div className="space-y-4">
        {/* Estadísticas resumidas */}
        <ClientesEstadisticas data={estadisticas} loading={statsLoading} />

        {/* Tabla simplificada */}
        <ClientesTabla
          clientes={clientesPaginados}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          itemsPerPage={itemsPerPage}
          showActions={false}
        />

        {/* Modal */}
        <ClienteModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          cliente={clienteEditando}
          onSuccess={handleModalSuccess}
        />
      </div>
    );
  }

  // Versión completa
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Gestión de Clientes
          </CardTitle>
          <CardDescription>
            Administra tu cartera de clientes y sus datos de contacto
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Acciones principales */}
          <ClientesAcciones
            onNuevoCliente={() => setIsModalOpen(true)}
            onRefresh={handleRefresh}
            onExportarExcel={() => handleExportar("excel")}
            onExportarCSV={() => handleExportar("csv")}
            onExportarPDF={() => handleExportar("pdf")}
            isRefreshing={isRefetching}
            totalClientes={estadisticas.totalClientes}
            clientesFiltrados={clientesFiltrados.length}
          />

          {/* Filtros */}
          <ClientesFiltros
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filtroTipo={filtroTipo}
            onFiltroTipoChange={setFiltroTipo}
            filtroCiudad={filtroCiudad}
            onFiltroCiudadChange={setFiltroCiudad}
            onLimpiarFiltros={handleLimpiarFiltros}
          />

          {/* Estadísticas */}
          <ClientesEstadisticas data={estadisticas} loading={statsLoading} />

          {/* Tabla */}
          <ClientesTabla
            clientes={clientesPaginados}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Modal de cliente */}
      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cliente={clienteEditando}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de progreso de reportes */}
      {reporteConfig && (
        <ReporteProgress
          isOpen={isReporteModalOpen}
          onClose={() => setIsReporteModalOpen(false)}
          config={reporteConfig}
          onGenerate={generarReporte}
        />
      )}
    </div>
  );
}
