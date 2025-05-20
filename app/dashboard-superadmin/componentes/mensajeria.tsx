"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useSocket } from '@/lib/socket/socket-provider';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface MensajeriaProps {
  reducida?: boolean;
}

export function Mensajeria({ reducida = false }: MensajeriaProps) {
  const [conversaciones, setConversaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const { 
    messages, 
    unreadMessagesCount,
    markMessageAsRead
  } = useSocket();

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
  
  const formatearTiempo = (fecha: Date) => {
    try {
      return formatDistanceToNow(new Date(fecha), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };
  
  // Versión reducida para mostrar en un widget
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-1">
            <MessageSquare className="h-5 w-5" />
            Mensajes
          </CardTitle>
          {unreadMessagesCount > 0 && (
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
              {unreadMessagesCount} nuevos
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b p-4">
          {cargando ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : conversaciones.length > 0 ? (
            <div className="space-y-3">
              {conversaciones.slice(0, 3).map((conv) => (
                <div key={conv.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={conv.participantes[0]?.image || ''} />
                    <AvatarFallback>{conv.participantes[0]?.nombre?.substring(0, 2) || 'US'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="font-medium truncate">{conv.participantes[0]?.nombre || 'Usuario'}</span>
                      {conv.noLeidos > 0 && (
                        <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conv.ultimoMensaje ? formatearTiempo(conv.ultimoMensaje) : 'Sin mensajes'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay conversaciones recientes
            </div>
          )}
        </div>
        <div className="p-4">
          <Link href="/dashboard-superadmin/mensajes">
            <Button variant="ghost" className="w-full justify-center">
              Ver todos los mensajes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 