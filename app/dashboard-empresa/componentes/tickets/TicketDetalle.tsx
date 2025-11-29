import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, Loader2, Send } from "lucide-react";
import { Ticket } from "@/lib/api/ticketsService";

interface TicketDetalleProps {
  ticket: Ticket;
  onVolver: () => void;
  onCambiarEstado: (estado: string) => Promise<void>;
  onCambiarPrioridad: (prioridad: string) => Promise<void>;
  onEnviarRespuesta: (mensaje: string) => Promise<void>;
  enviando: boolean;
}

export function TicketDetalle({
  ticket,
  onVolver,
  onCambiarEstado,
  onCambiarPrioridad,
  onEnviarRespuesta,
  enviando,
}: TicketDetalleProps) {
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");

  const handleEnviar = async () => {
    if (!mensajeRespuesta.trim()) return;
    await onEnviarRespuesta(mensajeRespuesta);
    setMensajeRespuesta("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={onVolver}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              {ticket.asunto}
            </CardTitle>
            <CardDescription>
              Ticket #{ticket.numeroTicket} •{" "}
              {new Date(ticket.fechaCreacion).toLocaleString("es-CL")}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Select
              value={ticket.estado}
              onValueChange={onCambiarEstado}
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
              value={ticket.prioridad}
              onValueChange={onCambiarPrioridad}
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
        {/* Información del cliente */}
        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Cliente:</span>
              <p className="font-medium">
                {ticket.nombreCliente} ({ticket.numeroCliente})
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{ticket.emailCliente}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Categoría:</span>
              <p className="font-medium">{formatoCategoria(ticket.categoria)}</p>
            </div>
            {ticket.numeroDispositivo && (
              <div>
                <span className="text-muted-foreground">Dispositivo:</span>
                <p className="font-medium">
                  {ticket.nombreDispositivo || ticket.numeroDispositivo}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Descripción:</h4>
          <p className="text-muted-foreground">{ticket.descripcion}</p>
        </div>

        {/* Conversación */}
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold">Conversación:</h4>
          {ticket.respuestas.map((respuesta) => (
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
                    {respuesta.autorTipo === "cliente" ? "Cliente" : "Soporte"}
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
        {ticket.estado !== "cerrado" && (
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
              onClick={handleEnviar}
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
  );
}
