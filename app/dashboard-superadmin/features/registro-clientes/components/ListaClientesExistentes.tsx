import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ListaClientesExistentesProps } from "../types";
import { PLANES_SERVICIO } from "../config";

export function ListaClientesExistentes({
  clientes,
  onActualizarCliente,
  onEliminarCliente,
}: ListaClientesExistentesProps) {
  const [busqueda, setBusqueda] = useState("");
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.numeroCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.empresa?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Obtener información del plan
  const obtenerInfoPlan = (planId: string) => {
    return PLANES_SERVICIO.find((plan) => plan.id === planId);
  };

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL");
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Clientes Registrados</h3>
          <p className="text-sm text-gray-600">
            {clientesFiltrados.length} de {clientes.length} clientes
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, correo, número..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">
            {clientes.length}
          </div>
          <div className="text-sm text-blue-600">Total Clientes</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">
            {clientes.filter((c) => c.activo).length}
          </div>
          <div className="text-sm text-green-600">Activos</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-900">
            $
            {clientes
              .reduce((sum, c) => sum + c.montoMensual, 0)
              .toLocaleString("es-CL")}
          </div>
          <div className="text-sm text-orange-600">Facturación Mensual</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">
            {new Set(clientes.map((c) => c.planSeleccionado)).size}
          </div>
          <div className="text-sm text-purple-600">Planes Distintos</div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {clientesFiltrados.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">📋</div>
            <h4 className="font-medium text-gray-900 mb-1">
              {busqueda
                ? "No se encontraron clientes"
                : "No hay clientes registrados"}
            </h4>
            <p className="text-sm text-gray-600">
              {busqueda
                ? "Intenta con otros términos de búsqueda"
                : "Los clientes registrados aparecerán aquí"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Facturación</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setClienteExpandido(
                      clienteExpandido === cliente.id ? null : cliente.id
                    )
                  }
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{cliente.nombre}</div>
                      <div className="text-sm text-gray-500">
                        #{cliente.numeroCliente}
                      </div>
                      {cliente.empresa && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Building className="h-3 w-3" />
                          {cliente.empresa}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {cliente.correo}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {cliente.telefono}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {obtenerInfoPlan(cliente.planSeleccionado)?.nombre ||
                          "N/A"}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        ${cliente.montoMensual.toLocaleString("es-CL")}/mes
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={cliente.activo ? "default" : "secondary"}
                      className={
                        cliente.activo ? "bg-green-100 text-green-800" : ""
                      }
                    >
                      {cliente.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {formatearFecha(cliente.fechaRegistro)}
                      </div>
                      {cliente.ultimaFacturacion && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          Última: {formatearFecha(cliente.ultimaFacturacion)}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setClienteExpandido(
                              clienteExpandido === cliente.id
                                ? null
                                : cliente.id
                            );
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Aquí iría la lógica de edición
                            console.log("Editar cliente:", cliente.id);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm("¿Está seguro de eliminar este cliente?")
                            ) {
                              onEliminarCliente(cliente.id);
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Panel expandido con detalles del cliente */}
      {clienteExpandido && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          {(() => {
            const cliente = clientes.find((c) => c.id === clienteExpandido);
            if (!cliente) return null;

            const planInfo = obtenerInfoPlan(cliente.planSeleccionado);

            return (
              <div>
                <h4 className="font-semibold mb-4">
                  Detalles de {cliente.nombre}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Información Personal</h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>RUT:</strong> {cliente.rut}
                      </p>
                      <p>
                        <strong>Dirección:</strong>{" "}
                        {cliente.direccion || "No especificada"}
                      </p>
                      <p>
                        <strong>Fecha de registro:</strong>{" "}
                        {formatearFecha(cliente.fechaRegistro)}
                      </p>
                      {cliente.ultimaFacturacion && (
                        <p>
                          <strong>Última facturación:</strong>{" "}
                          {formatearFecha(cliente.ultimaFacturacion)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Plan y Facturación</h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Plan:</strong> {planInfo?.nombre}
                      </p>
                      <p>
                        <strong>Descripción:</strong> {planInfo?.descripcion}
                      </p>
                      <p>
                        <strong>Monto mensual:</strong> $
                        {cliente.montoMensual.toLocaleString("es-CL")}
                      </p>
                      <p>
                        <strong>Monto anual:</strong> $
                        {(cliente.montoMensual * 12).toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                </div>

                {cliente.notas && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Notas</h5>
                    <p className="text-sm bg-white border border-blue-200 rounded p-3">
                      {cliente.notas}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
