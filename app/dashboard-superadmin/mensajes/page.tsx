"use client";
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Search, Send, PaperclipIcon, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useSocket } from '@/lib/socket/socket-provider';
import * as dateFns from 'date-fns';
import * as dateFnsLocale from 'date-fns/locale';
import { Encabezado } from '../componentes/encabezado';

interface Mensaje {
  id: string;
  emisor: string;
  emisorNombre: string;
  receptor: string;
  asunto: string;
  contenido: string;
  fecha: Date;
  leido: boolean;
  conversacionId: string;
}

interface Conversacion {
  id: string;
  participantes: any[];
  asunto: string;
  ultimoMensaje: Date;
  noLeidos: number;
  mensajes?: Mensaje[];
}

export default function MensajesPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  
  const { 
    joinConversation, 
    leaveConversation,
    socket,
    connected,
    markMessageAsRead
  } = useSocket();

  // Función para cargar mensajes, usando useCallback
  const cargarMensajesConversacion = useCallback(async (conversacionId: string) => {
    try {
      setCargando(true);
      const response = await fetch(`/api/mensajes/listar?conversacionId=${conversacionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensajes(data.mensajes);
        
        // Marcar mensajes como leídos
        data.mensajes.forEach((msg: Mensaje) => {
          if (!msg.leido) {
            markMessageAsRead(msg.id);
          }
        });
        
        // Actualizar contador de no leídos en la lista de conversaciones
        setConversaciones(prev => 
          prev.map(conv => 
            conv.id === conversacionId 
              ? { ...conv, noLeidos: 0 } 
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setCargando(false);
    }
  }, [markMessageAsRead, setMensajes, setCargando, setConversaciones]);
  
  // Cargar conversaciones desde la API
  useEffect(() => {
    const cargarConversaciones = async () => {
      try {
        const response = await fetch('/api/mensajes/listar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setConversaciones(data.conversaciones);
        }
      } catch (error) {
        console.error('Error al cargar conversaciones:', error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarConversaciones();
  }, []);
  
  // Escuchar eventos de socket para mensajes nuevos
  useEffect(() => {
    if (socket && connected) {
      // Escuchar mensajes nuevos en la conversación activa
      socket.on('conversation-message', (data) => {
        if (data.conversationId === conversacionActiva) {
          // Actualizar mensajes
          setMensajes(prev => [data.message, ...prev]);
          
          // Marcar como leído automáticamente si la conversación está abierta
          markMessageAsRead(data.message.id);
        }
        
        // Actualizar lista de conversaciones
        setConversaciones(prev => 
          prev.map(conv => 
            conv.id === data.conversationId 
              ? { 
                  ...conv, 
                  ultimoMensaje: new Date(), 
                  noLeidos: conversacionActiva === data.conversationId 
                    ? conv.noLeidos 
                    : conv.noLeidos + 1 
                } 
              : conv
          )
        );
      });
      
      return () => {
        socket.off('conversation-message');
      };
    }
  }, [socket, connected, conversacionActiva, markMessageAsRead]);
  
  // Unirse o abandonar una conversación cuando cambia la selección
  useEffect(() => {
    if (conversacionActiva && connected) {
      // Unirse a la conversación activa
      joinConversation(conversacionActiva);
      
      // Cargar mensajes de esta conversación
      cargarMensajesConversacion(conversacionActiva);
      
      return () => {
        // Abandonar la conversación al desmontar
        leaveConversation(conversacionActiva);
      };
    }
  }, [conversacionActiva, connected, joinConversation, leaveConversation, cargarMensajesConversacion]);
  
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !conversacionActiva) return;
    
    try {
      // Buscar datos de la conversación activa
      const conversacion = conversaciones.find(c => c.id === conversacionActiva);
      if (!conversacion) return;
      
      // Obtener el receptor (el otro participante que no soy yo)
      const receptor = conversacion.participantes[0]._id;
      
      const response = await fetch('/api/mensajes/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receptor,
          contenido: nuevoMensaje,
          conversacionId: conversacionActiva
        }),
      });
      
      if (response.ok) {
        // Limpiar campo de mensaje
        setNuevoMensaje('');
        
        // No necesitamos actualizar la UI manualmente aquí
        // El socket se encargará de actualizar la interfaz
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };
  
  const formatearFecha = (fecha: Date) => {
    return dateFns.format(new Date(fecha), 'dd MMM yyyy, HH:mm', { locale: dateFnsLocale.es });
  };
  
  // Renderizamos la página completa
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Encabezado tipoUsuario="superadmin" />
      
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Mensajes</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de conversaciones */}
          <Card className="col-span-1">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversaciones</CardTitle>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-auto">
                {cargando ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                  </div>
                ) : conversaciones.length > 0 ? (
                  conversaciones.map((conv) => (
                    <div 
                      key={conv.id} 
                      className={`p-3 border-b cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 ${conversacionActiva === conv.id ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                      onClick={() => setConversacionActiva(conv.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={conv.participantes[0]?.image || ''} />
                          <AvatarFallback>{conv.participantes[0]?.nombre?.substring(0, 2) || 'US'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{conv.participantes[0]?.nombre || 'Usuario'}</h4>
                            <span className="text-xs text-gray-500">
                              {dateFns.format(new Date(conv.ultimoMensaje), 'dd/MM', { locale: dateFnsLocale.es })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.asunto}</p>
                          {conv.noLeidos > 0 && (
                            <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {conv.noLeidos} nuevo{conv.noLeidos > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-medium text-lg">No hay conversaciones</h3>
                    <p className="text-gray-500 dark:text-gray-400">Inicia una nueva conversación</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Área de mensajes */}
          <Card className="col-span-1 md:col-span-2">
            {conversacionActiva ? (
              <>
                <CardHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden" 
                        onClick={() => setConversacionActiva(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {conversaciones.find(c => c.id === conversacionActiva)?.participantes[0]?.nombre?.substring(0, 2) || 'US'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {conversaciones.find(c => c.id === conversacionActiva)?.participantes[0]?.nombre || 'Usuario'}
                        </CardTitle>
                        <CardDescription>
                          {conversaciones.find(c => c.id === conversacionActiva)?.asunto}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem>Silenciar conversación</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3">
                    {cargando ? (
                      <div className="flex justify-center p-6">
                        <div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                      </div>
                    ) : mensajes.length > 0 ? (
                      mensajes.map((msg) => (
                        <div 
                          key={msg.id}
                          className={`flex ${msg.emisor === 'yo' ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.emisor === 'yo' 
                                ? 'bg-blue-500 text-white ml-auto' 
                                : 'bg-gray-100 dark:bg-slate-800'
                            }`}
                          >
                            <div className="text-sm">{msg.contenido}</div>
                            <div className={`text-xs mt-1 ${
                              msg.emisor === 'yo' 
                                ? 'text-blue-100' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {formatearFecha(msg.fecha)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 m-auto">
                        <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <h3 className="font-medium text-lg">No hay mensajes</h3>
                        <p className="text-gray-500 dark:text-gray-400">Comienza la conversación</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Escribe un mensaje..."
                        className="min-h-[60px] flex-1"
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            enviarMensaje();
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="Adjuntar archivo"
                        >
                          <PaperclipIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="icon" 
                          className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                          onClick={enviarMensaje}
                          title="Enviar mensaje"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center p-6">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-xl">Selecciona una conversación</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Elige una conversación de la lista para ver los mensajes
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
} 