"use client";
import { useState, useEffect, useCallback } from "react";
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
import {
  Headphones,
  MessageSquare,
  Loader2,
  Send,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  Calendar,
  Tag,
  Hash,
  User,
} from "lucide-react";
import { useApi } from '@/hooks/useApi';
import { ticketsService, Ticket, Respuesta } from "@/lib/api/ticketsService";
import { useToast } from "@/components/ui/use-toast";

// Helpers de color por estado/prioridad
function getEstadoStyle(estado: string) {
  const map: Record<string, { label: string; color: string; top: string }> = {
    abierto:      { label: "Abierto",     color: "text-orange-400 bg-orange-500/10 border-orange-500/30", top: "bg-orange-500" },
    "en-proceso": { label: "En Proceso",  color: "text-amber-400 bg-amber-500/10 border-amber-500/30",   top: "bg-amber-500" },
    resuelto:     { label: "Resuelto",    color: "text-white/60 bg-white/5 border-white/10",              top: "bg-white/20" },
    cerrado:      { label: "Cerrado",     color: "text-white/40 bg-white/5 border-white/10",              top: "bg-white/10" },
  };
  return map[estado] || { label: estado, color: "text-white/40 bg-white/5 border-white/10", top: "bg-white/10" };
}

function getPrioridadStyle(prioridad: string) {
  const map: Record<string, { label: string; color: string }> = {
    baja:    { label: "Baja",    color: "text-white/40 bg-white/5 border-white/10" },
    media:   { label: "Media",   color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
    alta:    { label: "Alta",    color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    urgente: { label: "Urgente", color: "text-red-400 bg-red-500/10 border-red-500/30" },
  };
  return map[prioridad] || { label: prioridad, color: "text-white/40 bg-white/5 border-white/10" };
}

function formatoCategoria(categoria: string) {
  const map: Record<string, string> = {
    tecnico:     "🔧 Técnico",
    facturacion: "💰 Facturación",
    consulta:    "❓ Consulta",
    reclamo:     "⚠️ Reclamo",
  };
  return map[categoria] || categoria;
}

export function SoporteUsuarioNuevo() {
  const { user } = useApi();
  const { toast } = useToast();

  const [vista, setVista] = useState<"lista" | "detalle" | "nuevo">("lista");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [nuevoTicket, setNuevoTicket] = useState({
    asunto: "", categoria: "", prioridad: "media" as "baja" | "media" | "alta" | "urgente", descripcion: "", dispositivoId: "",
  });
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");

  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();
  const numeroCliente = (user as any)?.numeroCliente || "---";
  const nombreCliente = (user as any)?.nombre || user?.name || "Cliente";

  const cargarTickets = useCallback(async () => {
    if (!clienteId) return;
    setCargando(true);
    try {
      const response = await ticketsService.obtenerTickets({ clienteId, limit: 50 });
      if (response.success && response.data) {
        setTickets(Array.isArray(response.data) ? response.data : []);
      } else {
        setTickets([]);
      }
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar los tickets", variant: "destructive" });
    } finally {
      setCargando(false);
    }
  }, [clienteId, toast]);

  useEffect(() => {
    if (clienteId && vista === "lista") cargarTickets();
  }, [clienteId, vista, cargarTickets]);

  const crearNuevoTicket = async () => {
    if (!nuevoTicket.asunto || !nuevoTicket.categoria || !nuevoTicket.descripcion) {
      toast({ title: "Campos incompletos", description: "Por favor completa todos los campos requeridos", variant: "destructive" });
      return;
    }
    if (!clienteId) {
      toast({ title: "Error", description: "No se pudo identificar al cliente", variant: "destructive" });
      return;
    }
    setEnviando(true);
    try {
      const response = await ticketsService.crearTicket({
        clienteId, asunto: nuevoTicket.asunto, descripcion: nuevoTicket.descripcion,
        categoria: nuevoTicket.categoria as any, prioridad: nuevoTicket.prioridad,
        dispositivoId: nuevoTicket.dispositivoId || undefined,
      });
      if (response.success && response.data) {
        toast({ title: "✅ Ticket creado", description: `Tu ticket #${response.data.numeroTicket} ha sido creado exitosamente` });
        setNuevoTicket({ asunto: "", categoria: "", prioridad: "media", descripcion: "", dispositivoId: "" });
        await cargarTickets();
        setVista("lista");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "No se pudo crear el ticket", variant: "destructive" });
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
        { autorId: clienteId!, autorNombre: nombreCliente, autorTipo: "cliente", mensaje: mensajeRespuesta }
      );
      if (response.success && response.data) {
        toast({ title: "✅ Respuesta enviada", description: "Tu respuesta ha sido enviada exitosamente" });
        setTicketSeleccionado(response.data);
        setMensajeRespuesta("");
        cargarTickets();
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "No se pudo enviar la respuesta", variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  };

  const eliminarTicket = async () => {
    if (!ticketSeleccionado) return;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el ticket #${ticketSeleccionado.numeroTicket}? Esta acción no se puede deshacer.`)) return;
    setEnviando(true);
    try {
      const response = await ticketsService.eliminarTicket(ticketSeleccionado._id);
      if (response.success) {
        toast({ title: "✅ Ticket eliminado", description: "El ticket ha sido eliminado exitosamente" });
        setTicketSeleccionado(null);
        setVista("lista");
        cargarTickets();
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "No se pudo eliminar el ticket", variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-orange-500" />
            </div>
            Soporte
          </h2>
          <p className="text-white/40 mt-1 text-sm">Gestiona tus tickets de soporte</p>
        </div>
        {vista === "lista" && (
          <Button
            onClick={() => setVista("nuevo")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Ticket
          </Button>
        )}
      </div>

      {/* Vista: Lista de tickets */}
      {vista === "lista" && (
        <div className="space-y-3">
          {cargando ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
              <div className="h-1 w-full bg-orange-500" />
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-white/60 text-lg font-semibold">No tienes tickets de soporte aún</p>
                <p className="text-white/30 text-sm mt-1">Crea tu primer ticket y te responderemos pronto</p>
                <Button onClick={() => setVista("nuevo")} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2">
                  <Plus className="h-4 w-4" />Crear Primer Ticket
                </Button>
              </div>
            </div>
          ) : (
            tickets.map((ticket) => {
              const estado = getEstadoStyle(ticket.estado);
              const prioridad = getPrioridadStyle(ticket.prioridad);
              return (
                <div
                  key={ticket._id}
                  onClick={() => { setTicketSeleccionado(ticket); setVista("detalle"); }}
                  className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all duration-200 hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:-translate-y-0.5"
                >
                  <div className={`h-1 w-full ${estado.top}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${estado.color}`}>{estado.label}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${prioridad.color}`}>{prioridad.label}</span>
                        </div>
                        <p className="font-bold text-lg text-white truncate">{ticket.asunto}</p>
                        <p className="text-sm text-white/40 mt-1 line-clamp-2">{ticket.descripcion}</p>
                      </div>
                      <ChevronDown className="h-5 w-5 text-white/30 shrink-0 mt-1" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Hash className="h-4 w-4" />
                        <span>#{ticket.numeroTicket}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4" />
                        <span>{formatoCategoria(ticket.categoria)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ticket.fechaCreacion).toLocaleDateString("es-CL")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.respuestas.length} respuestas</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vista: Detalle del ticket */}
      {vista === "detalle" && ticketSeleccionado && (() => {
        const estado = getEstadoStyle(ticketSeleccionado.estado);
        const prioridad = getPrioridadStyle(ticketSeleccionado.prioridad);
        return (
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className={`h-1 w-full ${estado.top}`} />
            <div className="p-6 space-y-6">
              {/* Header detalle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => { setTicketSeleccionado(null); setVista("lista"); }}
                      className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />Volver
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${estado.color}`}>{estado.label}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${prioridad.color}`}>{prioridad.label}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{ticketSeleccionado.asunto}</h3>
                  <p className="text-sm text-white/40 mt-1">
                    #{ticketSeleccionado.numeroTicket} · {new Date(ticketSeleccionado.fechaCreacion).toLocaleString("es-CL")}
                  </p>
                </div>
                {(ticketSeleccionado.estado === "abierto" || ticketSeleccionado.estado === "cerrado") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={eliminarTicket}
                    disabled={enviando}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5"
                  >
                    {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4" />Eliminar</>}
                  </Button>
                )}
              </div>

              {/* Info del ticket */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Categoría</p>
                  <p className="text-sm font-semibold text-white">{formatoCategoria(ticketSeleccionado.categoria)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Cliente</p>
                  <p className="text-sm font-semibold text-white">{numeroCliente}</p>
                </div>
                {ticketSeleccionado.numeroDispositivo && (
                  <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Dispositivo</p>
                    <p className="text-sm font-semibold text-white">{ticketSeleccionado.nombreDispositivo || ticketSeleccionado.numeroDispositivo}</p>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/30 uppercase tracking-wide mb-2">Descripción</p>
                <p className="text-sm text-white/70">{ticketSeleccionado.descripcion}</p>
              </div>

              {/* Conversación */}
              {ticketSeleccionado.respuestas.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-white/30 uppercase tracking-wide">Conversación</p>
                  {ticketSeleccionado.respuestas.map((respuesta, index) => (
                    <div
                      key={respuesta._id || `respuesta-${index}`}
                      className={`rounded-xl p-4 border ${
                        respuesta.autorTipo === "cliente"
                          ? "bg-orange-500/5 border-orange-500/20 ml-8"
                          : "bg-white/5 border-white/10 mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${respuesta.autorTipo === "cliente" ? "bg-orange-500/20" : "bg-white/10"}`}>
                            <User className="h-3 w-3 text-white/60" />
                          </div>
                          <span className="text-sm font-semibold text-white">{respuesta.autorNombre}</span>
                          {respuesta.autorTipo === "cliente" && (
                            <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Tú</span>
                          )}
                        </div>
                        <span className="text-xs text-white/30">{new Date(respuesta.fecha).toLocaleString("es-CL")}</span>
                      </div>
                      <p className="text-sm text-white/70">{respuesta.mensaje}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Responder */}
              {ticketSeleccionado.estado !== "cerrado" && (
                <div className="border-t border-white/5 pt-5 space-y-3">
                  <p className="text-xs text-white/30 uppercase tracking-wide">Tu Respuesta</p>
                  <Textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={mensajeRespuesta}
                    onChange={(e) => setMensajeRespuesta(e.target.value)}
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50 resize-none"
                  />
                  <Button
                    onClick={enviarRespuesta}
                    disabled={!mensajeRespuesta.trim() || enviando}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2"
                  >
                    {enviando ? <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</> : <><Send className="h-4 w-4" />Enviar Respuesta</>}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Vista: Nuevo Ticket */}
      {vista === "nuevo" && (
        <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
          <div className="h-1 w-full bg-orange-500" />
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => setVista("lista")}
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />Volver
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Crear Nuevo Ticket</h3>
              <p className="text-sm text-white/40 mt-1">Nuestro equipo te responderá pronto</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-sm mb-1.5 block">Asunto *</Label>
                <Input
                  placeholder="Ej: Problema con el medidor"
                  value={nuevoTicket.asunto}
                  onChange={(e) => setNuevoTicket({ ...nuevoTicket, asunto: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-sm mb-1.5 block">Categoría *</Label>
                  <Select value={nuevoTicket.categoria} onValueChange={(v) => setNuevoTicket({ ...nuevoTicket, categoria: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-orange-500/50">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="tecnico">🔧 Técnico</SelectItem>
                      <SelectItem value="facturacion">💰 Facturación</SelectItem>
                      <SelectItem value="consulta">❓ Consulta</SelectItem>
                      <SelectItem value="reclamo">⚠️ Reclamo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/60 text-sm mb-1.5 block">Prioridad</Label>
                  <Select value={nuevoTicket.prioridad} onValueChange={(v: any) => setNuevoTicket({ ...nuevoTicket, prioridad: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-orange-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white/60 text-sm mb-1.5 block">Descripción del Problema *</Label>
                <Textarea
                  placeholder="Describe detalladamente tu problema o consulta..."
                  value={nuevoTicket.descripcion}
                  onChange={(e) => setNuevoTicket({ ...nuevoTicket, descripcion: e.target.value })}
                  rows={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50 resize-none"
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Número de Cliente</p>
                <p className="text-sm font-semibold text-white">{numeroCliente}</p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  onClick={crearNuevoTicket}
                  disabled={enviando}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2"
                >
                  {enviando ? <><Loader2 className="h-4 w-4 animate-spin" />Creando...</> : <><Send className="h-4 w-4" />Crear Ticket</>}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setVista("lista")}
                  disabled={enviando}
                  className="border-white/10 text-white/60 hover:bg-white/5"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
