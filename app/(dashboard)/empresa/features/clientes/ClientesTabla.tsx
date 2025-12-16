"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ConfirmDialog, LoadingState, EmptyState } from "@/components/shared";
import type { Column } from "@/components/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
} from "lucide-react";
import { ICliente } from "@/lib/api/apiService";

interface ClientesTablaProps {
  clientes: ICliente[];
  loading?: boolean;
  onEdit: (cliente: ICliente) => void;
  onDelete: (cliente: ICliente) => void;
  onView?: (cliente: ICliente) => void;
  showActions?: boolean;
}

export function ClientesTabla({
  clientes,
  loading = false,
  onEdit,
  onDelete,
  onView,
  showActions = true,
}: ClientesTablaProps) {
  const [clienteEliminar, setClienteEliminar] = useState<ICliente | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (clienteEliminar) {
      setDeleting(true);
      await onDelete(clienteEliminar);
      setDeleting(false);
      setClienteEliminar(null);
    }
  };

  const formatearTelefono = (telefono?: string) => {
    if (!telefono) return "No disponible";
    if (telefono.startsWith("+56")) return telefono;
    if (telefono.startsWith("9") && telefono.length === 9) {
      return `+56 ${telefono}`;
    }
    return telefono;
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "No disponible";
    try {
      return new Date(fecha).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  if (loading) {
    return <LoadingState message="Cargando clientes..." />;
  }

  if (clientes.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No hay clientes"
        description="No se encontraron clientes que coincidan con los filtros aplicados."
      />
    );
  }

  const columns: Column<ICliente>[] = [
    {
      key: "nombre",
      label: "Cliente",
      sortable: true,
      render: (_, cliente) => (
        <div className="space-y-1">
          <div className="font-medium">{cliente.nombre}</div>
          {cliente.empresa && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="h-3 w-3" />
              {cliente.empresa}
            </div>
          )}
          {cliente.rut && (
            <div className="text-xs text-muted-foreground">RUT: {cliente.rut}</div>
          )}
        </div>
      ),
    },
    {
      key: "correo",
      label: "Contacto",
      render: (_, cliente) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]">{cliente.correo}</span>
          </div>
          {cliente.telefono && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {formatearTelefono(cliente.telefono)}
            </div>
          )}
          {cliente.ciudad && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {cliente.ciudad}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "tipoCliente",
      label: "Tipo",
      sortable: true,
      render: (value) => (
        <Badge variant={value === "empresa" ? "default" : "secondary"}>
          {value === "empresa" ? "Empresa" : "Particular"}
        </Badge>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      sortable: true,
      render: (value) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "fechaRegistro",
      label: "Registro",
      sortable: true,
      render: (value) => (
        <div className="text-sm text-muted-foreground">
          {formatearFecha(value)}
        </div>
      ),
    },
  ];

  if (showActions) {
    columns.push({
      key: "acciones",
      label: "",
      className: "w-[50px]",
      render: (_, cliente) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onView && (
              <DropdownMenuItem onClick={() => onView(cliente)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalles
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(cliente)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setClienteEliminar(cliente)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });
  }

  return (
    <>
      <DataTable
        data={clientes}
        columns={columns}
        searchPlaceholder="Buscar clientes..."
        pageSize={10}
        emptyMessage="No se encontraron clientes"
      />

      <ConfirmDialog
        open={!!clienteEliminar}
        onOpenChange={() => setClienteEliminar(null)}
        title="Confirmar eliminación"
        description={`¿Estás seguro de que deseas eliminar al cliente ${clienteEliminar?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar cliente"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        loading={deleting}
      />
    </>
  );
}
