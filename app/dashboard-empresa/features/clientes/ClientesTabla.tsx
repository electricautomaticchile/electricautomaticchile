"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ICliente } from "@/lib/api/apiService";

interface ClientesTablaProps {
  clientes: ICliente[];
  loading?: boolean;
  onEdit: (cliente: ICliente) => void;
  onDelete: (cliente: ICliente) => void;
  onView?: (cliente: ICliente) => void;
  // Paginación
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Configuración
  itemsPerPage?: number;
  showActions?: boolean;
}

export function ClientesTabla({
  clientes,
  loading = false,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  showActions = true,
}: ClientesTablaProps) {
  const [clienteEliminar, setClienteEliminar] = useState<ICliente | null>(null);

  const handleDeleteClick = (cliente: ICliente) => {
    setClienteEliminar(cliente);
  };

  const handleDeleteConfirm = () => {
    if (clienteEliminar) {
      onDelete(clienteEliminar);
      setClienteEliminar(null);
    }
  };

  const getBadgeVariant = (activo?: boolean) => {
    if (activo === undefined) return "secondary";
    return activo ? "default" : "destructive";
  };

  const getBadgeText = (activo?: boolean) => {
    if (activo === undefined) return "Sin estado";
    return activo ? "Activo" : "Inactivo";
  };

  const formatearTelefono = (telefono?: string) => {
    if (!telefono) return "No disponible";
    // Formatear números chilenos
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
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                {showActions && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No hay clientes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No se encontraron clientes que coincidan con los filtros
              aplicados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registro</TableHead>
              {showActions && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow
                key={cliente._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {/* Información del cliente */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {cliente.nombre}
                    </div>
                    {cliente.empresa && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Building2 className="h-3 w-3" />
                        {cliente.empresa}
                      </div>
                    )}
                    {cliente.rut && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        RUT: {cliente.rut}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Información de contacto */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                        {cliente.correo}
                      </span>
                    </div>
                    {cliente.telefono && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatearTelefono(cliente.telefono)}
                        </span>
                      </div>
                    )}
                    {cliente.ciudad && (
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">
                          {cliente.ciudad}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Tipo de cliente */}
                <TableCell>
                  <Badge
                    variant={
                      cliente.tipoCliente === "empresa"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {cliente.tipoCliente === "empresa"
                      ? "Empresa"
                      : "Particular"}
                  </Badge>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Badge variant={getBadgeVariant(cliente.activo)}>
                    {getBadgeText(cliente.activo)}
                  </Badge>
                </TableCell>

                {/* Fecha de registro */}
                <TableCell>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatearFecha(cliente.fechaRegistro)}
                  </div>
                </TableCell>

                {/* Acciones */}
                {showActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
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
                          onClick={() => handleDeleteClick(cliente)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={!!clienteEliminar}
        onOpenChange={() => setClienteEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar al cliente{" "}
              <span className="font-medium">{clienteEliminar?.nombre}</span>?
              <br />
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar cliente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
