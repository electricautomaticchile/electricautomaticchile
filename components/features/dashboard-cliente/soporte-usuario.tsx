"use client";
import { useState, useEffect, useCallback } from "react";
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
  Clock,
  AlertCircle,
  Check,
  Loader2,
  Send,
  ArrowLeft,
} from "lucide-react";
import { useApi } from '@/hooks/useApi';
import { ticketsService, Ticket, Respuesta } from "@/lib/api/ticketsService";
import { useToast } from "@/components/ui/use-toast";

export function SoporteUsuarioNuevo() {
  const { user } = useApi();
  const { toast } = useToast();

  const [tabActiva, setTabActiva] = useState("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null
  );
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Estado para nuevo ticket
  const [nuevoTicket, setNuevoTicket] = useState({
    asunto: "",
    categoria: "",
    prioridad: "media" as "baja" | "media" | "alta" | "urgente",
    descripcion: "",
    dispositivoId: "",
  });

  // Estado para nueva respuesta
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");

  // Obtener ID del cliente
  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();
  const numeroCliente = (user as any)?.numeroCliente || "---";
  const nombreCliente = (user as any)?.nombre || user?.name || "Cliente";

  // Debug
  useEffect(() => {
  }, [clienteId, user, tabActiva]);

  const cargarTickets = useCallback(async () => {
    if (!clienteId) return;

    setCargando(true);
    try {
      const response = await ticketsService.obtenerTickets({
        clienteId,
        limit: 50,
      });


      if (response.success && response.data) {
        // Los tickets están en response.data directamente (es un array)
        const ticketsArray = Array.isArray(response.data) ? response.data : [];
        setTickets(ticketsArray);
      } else {
        setTickets([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  }, [clienteId, toast]);

  // Cargar tickets del cliente
  useEffect(() => {
    if (clienteId && tabActiva === "tickets") {
      cargarTickets();
    }
  }, [clienteId, tabActiva, cargarTickets]);

  const crearNuevoTicket = async () => {
    if (
      !nuevoTicket.asunto ||
      !nuevoTicket.categoria ||
      !nuevoTicket.descripcion
    ) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    if (!clienteId) {
      toast({
        title: "Error",
        description: "No se pudo identificar al cliente",
        variant: "destructive",
      });
      return;
    }

    setEnviando(true);
    try {
      const response = await ticketsService.crearTicket({
        clienteId,
        asunto: nuevoTicket.asunto,
        descripcion: nuevoTicket.descripcion,
        categoria: nuevoTicket.categoria as any,
        prioridad: nuevoTicket.prioridad,
        dispositivoId: nuevoTicket.dispositivoId || undefined,
      });

      if (response.success && response.data) {
        toast({
          title: "✅ Ticket creado",
          description: `Tu ticket #${response.data.numeroTicket} ha sido creado exitosamente`,
        });

        // Limpiar formulario
        setNuevoTicket({
          asunto: "",
          categoria: "",
          prioridad: "media",
          descripcion: "",
          dispositivoId: "",
        });

        // Volver a la lista de tickets y recargar
        await cargarTickets();
        setTabActiva("tickets");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo crear el ticket",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const enviarRespuesta = async () => {
    if (!mensajeRespuesta.trim() || !ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.agregarRespuesta(
        ticketSeleccionado.id || ticketSeleccionado._id,
        {
          autorId: clienteId!,
          autorNombre: nombreCliente,
          autorTipo: "cliente",
          mensaje: mensajeRespuesta,
        }
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Respuesta enviada",
          description: "Tu respuesta ha sido enviada exitosamente",
        });

        // Actualizar ticket seleccionado
        setTicketSeleccionado(response.data);
        setMensajeRespuesta("");

        // Actualizar lista de tickets
        cargarTickets();
      }
    } catch (error: any) {
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

  const eliminarTicket = async () => {
    if (!ticketSeleccionado) return;

    // Confirmar eliminación
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar el ticket #${ticketSeleccionado.numeroTicket}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setEnviando(true);
    try {
      const response = await ticketsService.eliminarTicket(
        ticketSeleccionado._id
      );

      if (response.success) {
        toast({
          title: "✅ Ticket eliminado",
          description: "El ticket ha sido eliminado exitosamente",
        });

        // Volver a la lista y recargar
        setTicketSeleccionado(null);
        cargarTickets();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo eliminar el ticket",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const formatoEstadoTicket = (estado: string) => {
    const estados: Record<string, { label: string; color: string }> = {
      abierto: { label: "Abierto", color: "bg-blue-100 text-blue-800" },
      "en-proceso": {
        label: "En Proceso",
        color: "bg-yellow-100 text-yellow-800",
      },
      resuelto: { label: "Resuelto", color: "bg-green-100 text-green-800" },
      cerrado: { label: "Cerrado", color: "bg-gray-100 text-gray-800" },
    };
    return (
      estados[estado] || { label: estado, color: "bg-gray-100 text-gray-800" }
    );
  };

  const formatoPrioridadTicket = (prioridad: string) => {
    const prioridades: Record<string, { label: string; color: string }> = {
      baja: { label: "Baja", color: "bg-gray-100 text-gray-800" },
      media: { label: "Media", color: "bg-blue-100 text-blue-800" },
      alta: { label: "Alta", color: "bg-orange-100 text-orange-800" },
      urgente: { label: "Urgente", color: "bg-red-100 text-red-800" },
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
            Soporte y Ayuda
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona tus tickets de soporte
          </p>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => setTabActiva("nuevo-ticket")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Nuevo Ticket
        </Button>
      </div>

      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="mb-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Mis Tickets</span>
          </TabsTrigger>
          <TabsTrigger value="nuevo-ticket" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Nuevo Ticket</span>
          </TabsTrigger>
        </TabsList>

        {/* Vista de Tickets */}
        <TabsContent value="tickets">
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
                      {(ticketSeleccionado.estado === "abierto" ||
                        ticketSeleccionado.estado === "cerrado") && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={eliminarTicket}
                            disabled={enviando}
                          >
                            {enviando ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Eliminar"
                            )}
                          </Button>
                        )}
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      {ticketSeleccionado.asunto}
                    </CardTitle>
                    <CardDescription>
                      Ticket #{ticketSeleccionado.numeroTicket} •{" "}
                      {new Date(
                        ticketSeleccionado.fechaCreacion
                      ).toLocaleString("es-CL")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge
                      className={
                        formatoEstadoTicket(ticketSeleccionado.estado).color
                      }
                    >
                      {formatoEstadoTicket(ticketSeleccionado.estado).label}
                    </Badge>
                    <Badge
                      className={
                        formatoPrioridadTicket(ticketSeleccionado.prioridad)
                          .color
                      }
                    >
                      {
                        formatoPrioridadTicket(ticketSeleccionado.prioridad)
                          .label
                      }
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Información del ticket */}
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <p className="font-medium">
                        {formatoCategoria(ticketSeleccionado.categoria)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cliente:</span>
                      <p className="font-medium">{numeroCliente}</p>
                    </div>
                    {ticketSeleccionado.numeroDispositivo && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">
                          Dispositivo:
                        </span>
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
                      className={`p-4 rounded-lg ${respuesta.autorTipo === "cliente"
                        ? "bg-blue-50 dark:bg-blue-950/30 ml-8 border border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-800/50 mr-8 border border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-foreground">
                          {respuesta.autorNombre}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(respuesta.fecha).toLocaleString("es-CL")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {respuesta.mensaje}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Formulario de respuesta */}
                {ticketSeleccionado.estado !== "cerrado" && (
                  <div className="border-t pt-6">
                    <Label htmlFor="respuesta">Tu Respuesta</Label>
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
            // Lista de tickets
            <div className="space-y-4">
              {cargando ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
              ) : !tickets || tickets.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No tienes tickets de soporte aún
                    </p>
                    <Button
                      onClick={() => setTabActiva("nuevo-ticket")}
                      className="mt-4 bg-orange-600 hover:bg-orange-700"
                    >
                      Crear Primer Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card
                    key={ticket._id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setTicketSeleccionado(ticket)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {ticket.asunto}
                          </CardTitle>
                          <CardDescription>
                            #{ticket.numeroTicket} •{" "}
                            {new Date(ticket.fechaCreacion).toLocaleDateString(
                              "es-CL"
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge
                            className={formatoEstadoTicket(ticket.estado).color}
                          >
                            {formatoEstadoTicket(ticket.estado).label}
                          </Badge>
                          <Badge
                            className={
                              formatoPrioridadTicket(ticket.prioridad).color
                            }
                          >
                            {formatoPrioridadTicket(ticket.prioridad).label}
                          </Badge>
                        </div>
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
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        {/* Formulario de Nuevo Ticket */}
        <TabsContent value="nuevo-ticket">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Ticket de Soporte</CardTitle>
              <CardDescription>
                Completa el formulario para crear un nuevo ticket. Nuestro
                equipo te responderá pronto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="asunto">Asunto *</Label>
                <Input
                  id="asunto"
                  placeholder="Ej: Problema con el medidor"
                  value={nuevoTicket.asunto}
                  onChange={(e) =>
                    setNuevoTicket({ ...nuevoTicket, asunto: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select
                    value={nuevoTicket.categoria}
                    onValueChange={(value) =>
                      setNuevoTicket({ ...nuevoTicket, categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">🔧 Técnico</SelectItem>
                      <SelectItem value="facturacion">
                        💰 Facturación
                      </SelectItem>
                      <SelectItem value="consulta">❓ Consulta</SelectItem>
                      <SelectItem value="reclamo">⚠️ Reclamo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select
                    value={nuevoTicket.prioridad}
                    onValueChange={(value: any) =>
                      setNuevoTicket({ ...nuevoTicket, prioridad: value })
                    }
                  >
                    <SelectTrigger>
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

              <div>
                <Label htmlFor="descripcion">Descripción del Problema *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe detalladamente tu problema o consulta..."
                  value={nuevoTicket.descripcion}
                  onChange={(e) =>
                    setNuevoTicket({
                      ...nuevoTicket,
                      descripcion: e.target.value,
                    })
                  }
                  rows={6}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Número de Cliente:</strong> {numeroCliente}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={crearNuevoTicket}
                  disabled={enviando}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Crear Ticket
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTabActiva("tickets")}
                  disabled={enviando}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
