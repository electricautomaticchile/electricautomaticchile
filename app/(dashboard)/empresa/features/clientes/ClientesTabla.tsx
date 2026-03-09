"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, LoadingState, EmptyState } from "@/components/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, Edit, Trash2, Eye,
  Mail, Phone, MapPin, Building2, User, Users,
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

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch { return "—"; }
  };

  if (loading) return <LoadingState message="Cargando clientes..." />;

  if (clientes.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay clientes"
        description="No se encontraron clientes con los filtros aplicados."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((cliente, index) => {
          const isActivo = cliente.activo;
          const isEmpresa = cliente.tipoCliente === "empresa";

          return (
            <div
              key={cliente._id || `cliente-${index}`}
              className={`
                group relative rounded-xl border bg-[#0a0a0a]
                transition-all duration-200
                hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]
                hover:-translate-y-0.5
                ${isActivo ? "border-orange-500/30 hover:border-orange-500/60" : "border-white/10 hover:border-white/20"}
              `}
            >
              {/* Franja top */}
              <div className={`h-1 w-full rounded-t-xl ${isActivo ? "bg-orange-500" : "bg-white/20"}`} />

              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${isEmpresa ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-white/50"}
                    `}>
                      {isEmpresa ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-base text-white truncate">{cliente.nombre}</p>
                      {cliente.empresa && (
                        <p className="text-sm text-white/50 truncate">{cliente.empresa}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                      ${isActivo
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                        : "bg-white/5 text-white/30 border-white/10"
                      }
                    `}>
                      {isActivo ? "Activo" : "Inactivo"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-white/5 text-white/40 border-white/10">
                      {isEmpresa ? "Empresa" : "Particular"}
                    </span>
                  </div>
                </div>

                {/* Contacto */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Mail className="h-4 w-4 shrink-0 text-orange-500/60" />
                    <span className="truncate">{cliente.correo}</span>
                  </div>
                  {cliente.telefono && (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Phone className="h-4 w-4 shrink-0 text-orange-500/60" />
                      <span>{cliente.telefono}</span>
                    </div>
                  )}
                  {cliente.ciudad && (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <MapPin className="h-4 w-4 shrink-0 text-orange-500/60" />
                      <span>{cliente.ciudad}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-white/30">
                    Registro: {formatearFecha(cliente.fechaRegistro)}
                  </span>
                  {cliente.rut && (
                    <span className="text-xs text-white/30">RUT: {cliente.rut}</span>
                  )}
                </div>

                {/* Acciones */}
                {showActions && (
                  <div className="flex gap-2">
                    {onView && (
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-sm bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500"
                        onClick={() => onView(cliente)}
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Ver
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="flex-1 h-9 text-sm bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                      onClick={() => onEdit(cliente)}
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      Editar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-white/30 hover:text-white hover:bg-white/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 bg-[#0a0a0a] border-white/10">
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={() => setClienteEliminar(cliente)}
                          className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
