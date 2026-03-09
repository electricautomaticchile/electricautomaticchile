"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ICliente } from "@/lib/api/apiService";
import { ClientesService } from "@/lib/api/services/clientesService";
import { ReportesService } from "@/lib/api/services/reportesService";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { TableFilters } from "@/components/ui/table-filters";
import { FilterParams } from "@/types/filters";
import { PaginatedResponse } from "@/types/pagination";

import {
  ClienteModal,
  ClientesAcciones,
  ClientesEstadisticas,
  ClientesTabla,
  EstadisticasData,
} from "./index";

interface GestionClientesProps {
  reducida?: boolean;
}

export function GestionClientes({ reducida = false }: GestionClientesProps) {
  const { toast } = useToast();
  const { params, setPage, setPageSize } = usePagination(reducida ? 5 : 10);

  const [filters, setFilters] = useState<FilterParams>({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginatedResponse<ICliente> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ICliente | null>(null);

  const clientesService = useMemo(() => new ClientesService(), []);

  const estadisticas: EstadisticasData = {
    totalClientes: data?.total || 0,
    clientesActivos: data?.data.filter(c => c.activo).length || 0,
    clientesInactivos: data?.data.filter(c => !c.activo).length || 0,
    clientesEmpresas: data?.data.filter(c => c.tipoCliente === "empresa").length || 0,
    clientesParticulares: data?.data.filter(c => c.tipoCliente === "particular").length || 0,
    ingresosMensuales: 0,
    crecimientoMensual: 5.2,
    nuevosEsteMes: 3,
  };

  const cargarClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clientesService.obtenerClientesPaginado(params, filters);
      if (response.success && response.data) {
        setData(response.data as PaginatedResponse<ICliente>);
      } else {
        toast({ title: "Error", description: response.error || "Error al cargar clientes", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Error al cargar clientes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [params, filters, toast, clientesService]);

  useEffect(() => { cargarClientes(); }, [cargarClientes]);

  const handleFilterChange = (newFilters: FilterParams) => { setFilters(newFilters); setPage(1); };
  const handleEdit = (cliente: ICliente) => { setClienteEditando(cliente); setIsModalOpen(true); };
  const handleDelete = async (cliente: ICliente) => {
    try {
      await clientesService.eliminarCliente(cliente._id);
      toast({ title: "Cliente eliminado", description: "El cliente ha sido eliminado exitosamente." });
      cargarClientes();
    } catch {
      toast({ title: "Error", description: "Error al eliminar cliente", variant: "destructive" });
    }
  };
  const handleModalClose = () => { setIsModalOpen(false); setClienteEditando(null); };
  const handleModalSuccess = () => {
    toast({ title: clienteEditando ? "Cliente actualizado" : "Cliente creado", description: `El cliente ha sido ${clienteEditando ? "actualizado" : "creado"} exitosamente.` });
    handleModalClose();
    cargarClientes();
  };
  const handleExportar = async (formato: "excel" | "pdf") => {
    try {
      if (formato === "excel") await ReportesService.clientesExcel();
      else await ReportesService.clientesPDF();
      toast({ title: "Exportación exitosa", description: `Archivo ${formato.toUpperCase()} descargado.` });
    } catch (error) {
      toast({ title: "Error al exportar", description: error instanceof Error ? error.message : "Error desconocido", variant: "destructive" });
    }
  };

  if (reducida) {
    return (
      <div className="space-y-4">
        <ClientesEstadisticas data={estadisticas} loading={loading} />
        <ClientesTabla clientes={data?.data || []} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        <ClienteModal isOpen={isModalOpen} onClose={handleModalClose} cliente={clienteEditando} onSuccess={handleModalSuccess} />
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg border border-orange-500/20 space-y-6">
      <ClientesAcciones
        onNuevoCliente={() => setIsModalOpen(true)}
        onRefresh={cargarClientes}
        onExportarExcel={() => handleExportar("excel")}
        onExportarCSV={() => {}}
        onExportarPDF={() => handleExportar("pdf")}
        isRefreshing={loading}
        totalClientes={estadisticas.totalClientes}
        clientesFiltrados={data?.data.length || 0}
      />

      <ClientesEstadisticas data={estadisticas} loading={loading} />

      <TableFilters
        onFilterChange={handleFilterChange}
        showDateFilters
        showActiveFilter
        showTypeFilter
        typeOptions={[
          { value: "empresa", label: "Empresa" },
          { value: "particular", label: "Particular" },
        ]}
      />

      <ClientesTabla
        clientes={data?.data || []}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {data && (
        <PaginationControls
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          totalPages={data.totalPages}
          hasNext={data.hasNext}
          hasPrev={data.hasPrev}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cliente={clienteEditando}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
