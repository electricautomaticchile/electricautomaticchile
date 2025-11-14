"use client";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Headphones,
  MessageSquare,
  FileText,
  Search,
  Filter,
  Loader2,
  Send,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import {
  ticketsService,
  Ticket,
  EstadisticasTickets,
} from "@/lib/api/ticketsService";
import { useToast } from "@/components/ui/use-toast";

export function GestionTickets() {
  const { user } = useApi();
  const { toast } = useToast();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null
  );
  const [estadisticas, setEstadisticas] = useState<EstadisticasTickets | null>(
    null
  );
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    estado: "",
    categoria: "",
    prioridad: "",
    busqueda: "",
  });

  // Estado para nueva respuesta
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");

  // Obtener ID de la empresa
  const empresaId = (user as any)?._id?.toString() || user?.id?.toString();
  const nombreEmpresa = (user as any)?.nombre || user?.name || "Soporte";

  // Debug
  useEffect(() => {
    console.log("🔍 Debug Empresa:", { empresaId, user });
  }, [empresaId, user]);

  // Cargar tickets y estadísticas
  useEffect(() => {
    console.log("🔄 useEffect ejecutado:", { empresaId, filtros });
    if (empresaId) {
      cargarTickets();
      cargarEstadisticas();
    }
  }, [empresaId, filtros.estado, filtros.categoria, filtros.prioridad]);

  const cargarTickets = async () => {
    if (!empresaId) return;

    setCargando(true);
    try {
      const response = await ticketsService.obtenerTickets({
        empresaId,
        estado: filtros.estado || undefined,
        categoria: filtros.categoria || undefined,
        prioridad: filtros.prioridad || undefined,
        limit: 100,
      });

      console.log("📋 Tickets empresa cargados:", response);

      if (response.success && response.data) {
        // Los tickets están en response.data directamente (es un array)
        let ticketsFiltrados: Ticket[] = Array.isArray(response.data)
          ? response.data
          : [];

        // Filtro de búsqueda local
        if (filtros.busqueda) {
          const busqueda = filtros.busqueda.toLowerCase();
          ticketsFiltrados = ticketsFiltrados.filter(
            (t: Ticket) =>
              t.numeroTicket.toLowerCase().includes(busqueda) ||
              t.asunto.toLowerCase().includes(busqueda) ||
              t.nombreCliente.toLowerCase().includes(busqueda) ||
              t.numeroCliente.toLowerCase().includes(busqueda)
          );
        }

        setTickets(ticketsFiltrados);
        console.log("✅ Tickets en estado:", ticketsFiltrados);
      }
    } catch (error) {
      console.error("Error cargando tickets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    if (!empresaId) return;

    try {
      const response = await ticketsService.obtenerEstadisticas({ empresaId });
      if (response.success && response.data) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const enviarRespuesta = async () => {
    if (!mensajeRespuesta.trim() || !ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.agregarRespuesta(
        ticketSeleccionado._id,
        {
          autorId: empresaId!,
          autorNombre: nombreEmpresa,
          autorTipo: "soporte",
          mensaje: mensajeRespuesta,
        }
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Respuesta enviada",
          description: "La respuesta ha sido enviada al cliente",
        });

        setTicketSeleccionado(response.data);
        setMensajeRespuesta("");
        cargarTickets();
      }
    } catch (error: any) {
      console.error("Error enviando respuesta:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo enviar la respuesta",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.actualizarEstado(
        ticketSeleccionado._id,
        nuevoEstado as any
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Estado actualizado",
          description: `El ticket ahora está ${formatoEstado(nuevoEstado).label}`,
        });

        setTicketSeleccionado(response.data);
        cargarTickets();
        cargarEstadisticas();
      }
    } catch (error: any) {
      console.error("Error cambiando estado:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo cambiar el estado",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const cambiarPrioridad = async (nuevaPrioridad: string) => {
    if (!ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.actualizarPrioridad(
        ticketSeleccionado._id,
        nuevaPrioridad as any
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Prioridad actualizada",
          description: `La prioridad ahora es ${formatoPrioridad(nuevaPrioridad).label}`,
        });

        setTicketSeleccionado(response.data);
        cargarTickets();
      }
    } catch (error: any) {
      console.error("Error cambiando prioridad:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo cambiar la prioridad",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const formatoEstado = (estado: string) => {
    const estados: Record<string, { label: string; color: string; icon: any }> =
      {
        abierto: {
          label: "Abierto",
          color: "bg-blue-100 text-blue-800",
          icon: AlertCircle,
        },
        "en-proceso": {
          label: "En Proceso",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        },
        resuelto: {
          label: "Resuelto",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle2,
        },
        cerrado: {
          label: "Cerrado",
          color: "bg-gray-100 text-gray-800",
          icon: CheckCircle2,
        },
      };
    return (
      estados[estado] || {
        label: estado,
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
      }
    );
  };

  const formatoPrioridad = (prioridad: string) => {
    const prioridades: Record<string, { label: string; color: string }> = {
      baja: { label: "Baja", color: "bg-gray-100 text-gray-800" },
      media: { label: "Media", color: "bg-blue-100 text-blue-800" },
      alta: { label: "Alta", color: "bg-orange-100 text-orange-800" },
      urgente: {
        label: "Urgente",
        color: "bg-red-100 text-red-800 animate-pulse",
      },
    };
    return (
      prioridades[prioridad] || {
        label: prioridad,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const formatoCategoria = (categoria: string) => {
    const categorias: Record<string, string> = {
      tecnico: "🔧 Técnico",
      facturacion: "💰 Facturación",
      consulta: "❓ Consulta",
      reclamo: "⚠️ Reclamo",
    };
    return categorias[categoria] || categoria;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Headphones className="h-8 w-8 text-orange-600" />
            Gestión de Tickets
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra y responde tickets de soporte
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estadisticas.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Abiertos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {estadisticas.porEstado.abiertos}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Proceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {estadisticas.porEstado.enProceso}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resueltos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {estadisticas.porEstado.resueltos}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {ticketSeleccionado ? (
        // Vista de detalle del ticket
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTicketSeleccionado(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                  </Button>
                </div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  {ticketSeleccionado.asunto}
                </CardTitle>
                <CardDescription>
                  Ticket #{ticketSeleccionado.numeroTicket} •{" "}
                  {new Date(ticketSeleccionado.fechaCreacion).toLocaleString(
                    "es-CL"
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Select
                  value={ticketSeleccionado.estado}
                  onValueChange={cambiarEstado}
                  disabled={enviando}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abierto">Abierto</SelectItem>
                    <SelectItem value="en-proceso">En Proceso</SelectItem>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                    <SelectItem value="cerrado">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={ticketSeleccionado.prioridad}
                  onValueChange={cambiarPrioridad}
                  disabled={enviando}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Información del cliente y ticket */}
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <p className="font-medium">
                    {ticketSeleccionado.nombreCliente} (
                    {ticketSeleccionado.numeroCliente})
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">
                    {ticketSeleccionado.emailCliente}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Categoría:</span>
                  <p className="font-medium">
                    {formatoCategoria(ticketSeleccionado.categoria)}
                  </p>
                </div>
                {ticketSeleccionado.numeroDispositivo && (
                  <div>
                    <span className="text-muted-foreground">Dispositivo:</span>
                    <p className="font-medium">
                      {ticketSeleccionado.nombreDispositivo ||
                        ticketSeleccionado.numeroDispositivo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción inicial */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Descripción:</h4>
              <p className="text-muted-foreground">
                {ticketSeleccionado.descripcion}
              </p>
            </div>

            {/* Conversación */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold">Conversación:</h4>
              {ticketSeleccionado.respuestas.map((respuesta) => (
                <div
                  key={respuesta._id}
                  className={`p-4 rounded-lg ${
                    respuesta.autorTipo === "cliente"
                      ? "bg-blue-50 dark:bg-blue-950/30 mr-8 border border-blue-200 dark:border-blue-800"
                      : "bg-orange-50 dark:bg-orange-950/30 ml-8 border border-orange-200 dark:border-orange-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {respuesta.autorNombre}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {respuesta.autorTipo === "cliente"
                          ? "Cliente"
                          : "Soporte"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(respuesta.fecha).toLocaleString("es-CL")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{respuesta.mensaje}</p>
                </div>
              ))}
            </div>

            {/* Formulario de respuesta */}
            {ticketSeleccionado.estado !== "cerrado" && (
              <div className="border-t pt-6">
                <Label htmlFor="respuesta">Responder al Cliente</Label>
                <Textarea
                  id="respuesta"
                  placeholder="Escribe tu respuesta aquí..."
                  value={mensajeRespuesta}
                  onChange={(e) => setMensajeRespuesta(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
                <Button
                  onClick={enviarRespuesta}
                  disabled={!mensajeRespuesta.trim() || enviando}
                  className="mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Respuesta
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Lista de tickets con filtros
        <div className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="busqueda">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="busqueda"
                      placeholder="Ticket, cliente..."
                      value={filtros.busqueda}
                      onChange={(e) =>
                        setFiltros({ ...filtros, busqueda: e.target.value })
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={filtros.estado || "todos"}
                    onValueChange={(value) =>
                      setFiltros({
                        ...filtros,
                        estado: value === "todos" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="abierto">Abierto</SelectItem>
                      <SelectItem value="en-proceso">En Proceso</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={filtros.categoria || "todas"}
                    onValueChange={(value) =>
                      setFiltros({
                        ...filtros,
                        categoria: value === "todas" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="facturacion">Facturación</SelectItem>
                      <SelectItem value="consulta">Consulta</SelectItem>
                      <SelectItem value="reclamo">Reclamo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select
                    value={filtros.prioridad || "todas"}
                    onValueChange={(value) =>
                      setFiltros({
                        ...filtros,
                        prioridad: value === "todas" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de tickets */}
          {cargando ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : !tickets || tickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay tickets que coincidan con los filtros
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Debug: tickets={JSON.stringify(tickets?.length || 0)},
                  cargando={cargando.toString()}
                </p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => {
              const estado = formatoEstado(ticket.estado);
              const Icon = estado.icon;

              return (
                <Card
                  key={ticket._id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setTicketSeleccionado(ticket)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            #{ticket.numeroTicket}
                          </Badge>
                          <Badge
                            className={formatoPrioridad(ticket.prioridad).color}
                          >
                            {formatoPrioridad(ticket.prioridad).label}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {ticket.asunto}
                        </CardTitle>
                        <CardDescription>
                          {ticket.nombreCliente} ({ticket.numeroCliente}) •{" "}
                          {new Date(ticket.fechaCreacion).toLocaleDateString(
                            "es-CL"
                          )}
                        </CardDescription>
                      </div>
                      <Badge className={estado.color}>
                        <Icon className="h-3 w-3 mr-1" />
                        {estado.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.descripcion}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>{formatoCategoria(ticket.categoria)}</span>
                      <span>•</span>
                      <span>{ticket.respuestas.length} respuestas</span>
                      {ticket.numeroDispositivo && (
                        <>
                          <span>•</span>
                          <span>🔧 {ticket.numeroDispositivo}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
