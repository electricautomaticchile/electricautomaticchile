"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User,
  ThumbsUp,
  Lightbulb,
  FileText,
  Plus
} from 'lucide-react';

// Datos simulados de tickets de soporte
const ticketsEjemplo = [
  {
    id: 'TIC-2023-042',
    asunto: 'Problemas con la visualización del consumo',
    descripcion: 'No puedo ver el gráfico de consumo horario correctamente en la aplicación móvil.',
    fecha: '10/11/2023 15:30',
    estado: 'abierto',
    prioridad: 'media',
    categoria: 'app',
    respuestas: [
      {
        fecha: '10/11/2023 16:15',
        autor: 'soporte@eauto.cl',
        mensaje: 'Hemos recibido su solicitud. Estamos investigando el problema. ¿Podría indicarnos qué dispositivo móvil está utilizando?',
        esCliente: false
      },
      {
        fecha: '10/11/2023 17:30',
        autor: 'juan.perez@gmail.com',
        mensaje: 'Estoy usando un iPhone 12 con la última versión de la aplicación.',
        esCliente: true
      },
      {
        fecha: '11/11/2023 09:20',
        autor: 'soporte@eauto.cl',
        mensaje: 'Gracias por la información. Hemos identificado un problema con la visualización en iOS. Estamos trabajando en una actualización que estará disponible en los próximos 2 días. Como solución temporal, puede acceder a través del navegador web.',
        esCliente: false
      }
    ]
  },
  {
    id: 'TIC-2023-037',
    asunto: 'Consulta sobre facturación de octubre',
    descripcion: 'Tengo una duda respecto al cobro del mes de octubre, que parece más alto de lo habitual.',
    fecha: '05/11/2023 10:15',
    estado: 'en_progreso',
    prioridad: 'baja',
    categoria: 'facturacion',
    respuestas: [
      {
        fecha: '05/11/2023 11:30',
        autor: 'finanzas@eauto.cl',
        mensaje: 'Hemos recibido su consulta sobre la facturación. Estamos revisando los registros de consumo del mes de octubre para verificar si hay alguna anomalía.',
        esCliente: false
      },
      {
        fecha: '06/11/2023 09:45',
        autor: 'finanzas@eauto.cl',
        mensaje: 'Después de revisar, hemos detectado que hubo un pico de consumo el día 20 de octubre entre las 18:00 y 22:00 horas que generó el incremento. Puede verificarlo en el gráfico de consumo diario. ¿Hubo algún evento especial o uso de equipos de alto consumo en ese horario?',
        esCliente: false
      }
    ]
  },
  {
    id: 'TIC-2023-028',
    asunto: 'Problema con el medidor',
    descripcion: 'El medidor muestra una luz roja intermitente desde ayer.',
    fecha: '28/10/2023 14:20',
    estado: 'resuelto',
    prioridad: 'alta',
    categoria: 'hardware',
    respuestas: [
      {
        fecha: '28/10/2023 14:45',
        autor: 'soporte@eauto.cl',
        mensaje: 'Hemos recibido su reporte sobre el problema con el medidor. La luz roja intermitente indica un problema de comunicación. Intentaremos realizar un diagnóstico remoto.',
        esCliente: false
      },
      {
        fecha: '28/10/2023 15:30',
        autor: 'tecnico@eauto.cl',
        mensaje: 'Hemos realizado un reinicio remoto del dispositivo. ¿Podría verificar si la luz roja sigue apareciendo?',
        esCliente: false
      },
      {
        fecha: '28/10/2023 16:15',
        autor: 'juan.perez@gmail.com',
        mensaje: 'Acabo de revisar y la luz ahora es verde constante. Parece que se ha solucionado.',
        esCliente: true
      },
      {
        fecha: '28/10/2023 16:20',
        autor: 'tecnico@eauto.cl',
        mensaje: 'Excelente. Hemos verificado en nuestro sistema y el medidor está funcionando correctamente ahora. El problema fue solucionado con el reinicio remoto. Si vuelve a observar alguna anomalía, no dude en contactarnos.',
        esCliente: false
      }
    ]
  }
];

// FAQ - Preguntas frecuentes
const preguntasFrecuentes = [
  {
    pregunta: '¿Cómo interpretar mi consumo eléctrico?',
    respuesta: 'El consumo eléctrico se mide en kWh (kilovatios-hora). En la sección "Consumo Eléctrico" puede visualizar gráficos diarios, mensuales y horarios para entender sus patrones de consumo. Las horas pico suelen estar entre 18:00 y 22:00 horas.'
  },
  {
    pregunta: '¿Qué significa cuando el medidor tiene luz roja?',
    respuesta: 'La luz roja en el medidor puede indicar diferentes estados: parpadeo lento (problema de comunicación), parpadeo rápido (batería baja) o luz fija (error crítico). Si observa luz roja, reporte inmediatamente al soporte técnico.'
  },
  {
    pregunta: '¿Cómo puedo reducir mi consumo eléctrico?',
    respuesta: 'Para reducir su consumo, recomendamos: apagar dispositivos en stand-by, usar electrodomésticos eficientes, aprovechar la luz natural, y programar el uso de equipos de alto consumo fuera de horas pico (18:00-22:00).'
  },
  {
    pregunta: '¿Qué hacer si no estoy de acuerdo con mi facturación?',
    respuesta: 'Si tiene dudas sobre su facturación, primero revise los gráficos de consumo para identificar posibles picos. Si aún tiene dudas, abra un ticket de soporte seleccionando la categoría "Facturación" para una revisión detallada.'
  },
  {
    pregunta: '¿Cuándo se realiza el mantenimiento del medidor?',
    respuesta: 'El mantenimiento preventivo del medidor se realiza una vez al año. Recibirá una notificación con anticipación para programar la visita técnica. En caso de fallas, el mantenimiento correctivo se realiza según sea necesario.'
  }
];

// Información de contacto
const infoContacto = {
  telefono: '+56 2 2345 6789',
  email: 'soporte@electricauto.cl',
  horario: 'Lunes a Viernes de 09:00 a 18:00 hrs',
  whatsapp: '+56 9 8765 4321'
};

interface SoporteTecnicoProps {
  reducida?: boolean;
}

export function SoporteTecnico({ reducida = false }: SoporteTecnicoProps) {
  const [tabActiva, setTabActiva] = useState('tickets');
  const [ticketSeleccionado, setTicketSeleccionado] = useState<string | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [formularioSoporte, setFormularioSoporte] = useState({
    asunto: '',
    categoria: '',
    descripcion: ''
  });
  
  // Obtener ticket seleccionado
  const obtenerTicketSeleccionado = () => {
    return ticketsEjemplo.find(ticket => ticket.id === ticketSeleccionado);
  };
  
  // Renderizar badge de estado del ticket
  const renderizarEstadoTicket = (estado: string) => {
    switch (estado) {
      case 'abierto':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <MessageSquare className="h-3 w-3 mr-1" />
            Abierto
          </div>
        );
      case 'en_progreso':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            En progreso
          </div>
        );
      case 'resuelto':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resuelto
          </div>
        );
      case 'cerrado':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cerrado
          </div>
        );
      default:
        return null;
    }
  };
  
  // Renderizar badge de prioridad del ticket
  const renderizarPrioridadTicket = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alta
          </div>
        );
      case 'media':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Media
          </div>
        );
      case 'baja':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Baja
          </div>
        );
      default:
        return null;
    }
  };
  
  // Renderizar icono de categoría
  const renderizarIconoCategoria = (categoria: string, tamano: 'sm' | 'md' = 'md') => {
    const clasesTamano = tamano === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    switch (categoria) {
      case 'app':
        return <Lightbulb className={`${clasesTamano} text-purple-600`} />;
      case 'facturacion':
        return <FileText className={`${clasesTamano} text-green-600`} />;
      case 'hardware':
        return <AlertTriangle className={`${clasesTamano} text-red-600`} />;
      default:
        return <MessageSquare className={`${clasesTamano} text-blue-600`} />;
    }
  };
  
  // Manejar envío de un nuevo ticket
  const manejarEnvioTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el ticket al backend
    // Después de enviar, limpiamos el formulario
    setFormularioSoporte({
      asunto: '',
      categoria: '',
      descripcion: ''
    });
    // Y mostramos un mensaje de éxito o cambiamos a la pestaña de tickets
    setTabActiva('tickets');
  };
  
  // Manejar envío de respuesta a un ticket
  const manejarEnvioRespuesta = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la respuesta al backend
    
    // Limpiamos el campo de mensaje
    setNuevoMensaje('');
  };
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5 text-orange-600" />
            Soporte Técnico
          </CardTitle>
          <CardDescription>
            Centro de ayuda y asistencia técnica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span className="text-sm">{infoContacto.telefono}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{infoContacto.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{infoContacto.horario}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Tickets Recientes</div>
            {ticketsEjemplo.slice(0, 2).map((ticket, index) => (
              <div key={index} className="p-2 border border-gray-100 dark:border-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium text-sm truncate">{ticket.asunto}</div>
                  {renderizarEstadoTicket(ticket.estado)}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">{ticket.fecha}</div>
                  {renderizarPrioridadTicket(ticket.prioridad)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Nuevo Ticket
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HeadphonesIcon className="h-6 w-6 text-orange-600" />
          Soporte Técnico
        </h2>
      </div>
      
      <Tabs defaultValue="tickets" className="mb-6" onValueChange={setTabActiva}>
        <TabsList>
          <TabsTrigger value="tickets" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Mis Tickets
          </TabsTrigger>
          <TabsTrigger value="nuevo" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Ticket
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Preguntas Frecuentes
          </TabsTrigger>
          <TabsTrigger value="contacto" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            Contacto
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets" className="mt-4">
          {ticketSeleccionado ? (
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4"
                onClick={() => setTicketSeleccionado(null)}
              >
                ← Volver a la lista
              </Button>
              
              {(() => {
                const ticket = obtenerTicketSeleccionado();
                if (!ticket) return null;
                
                return (
                  <div>
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{ticket.asunto}</h3>
                        <div className="flex gap-2">
                          {renderizarEstadoTicket(ticket.estado)}
                          {renderizarPrioridadTicket(ticket.prioridad)}
                        </div>
                      </div>
                      <div className="flex gap-3 text-sm text-gray-500">
                        <div>ID: {ticket.id}</div>
                        <div>Fecha: {ticket.fecha}</div>
                        <div className="flex items-center gap-1">
                          {renderizarIconoCategoria(ticket.categoria, 'sm')}
                          <span>
                            {ticket.categoria === 'app' ? 'Aplicación' : 
                             ticket.categoria === 'facturacion' ? 'Facturación' : 
                             ticket.categoria === 'hardware' ? 'Hardware' : 'General'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg mb-6">
                      <div className="text-sm font-medium mb-2">Descripción</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.descripcion}</p>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-sm font-medium mb-3">Conversación</div>
                      <div className="space-y-4">
                        {ticket.respuestas.map((respuesta, index) => (
                          <div 
                            key={index} 
                            className={`flex gap-3 ${respuesta.esCliente ? 'justify-end' : ''}`}
                          >
                            {!respuesta.esCliente && (
                              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                                <HeadphonesIcon className="h-4 w-4 text-orange-600" />
                              </div>
                            )}
                            
                            <div className={`max-w-[80%] ${
                              respuesta.esCliente 
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            } p-3 rounded-lg`}>
                              <div className="text-xs mb-1 flex justify-between">
                                <span className="font-medium">{respuesta.autor}</span>
                                <span className="text-gray-500 dark:text-gray-400">{respuesta.fecha}</span>
                              </div>
                              <p className="text-sm">{respuesta.mensaje}</p>
                            </div>
                            
                            {respuesta.esCliente && (
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {(ticket.estado === 'abierto' || ticket.estado === 'en_progreso') && (
                      <form onSubmit={manejarEnvioRespuesta} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="mb-3">
                          <label htmlFor="respuesta" className="block text-sm font-medium mb-1">
                            Responder
                          </label>
                          <Textarea 
                            id="respuesta" 
                            placeholder="Escriba su respuesta aquí..." 
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          {ticket.estado !== 'resuelto' && (
                            <Button variant="outline" type="button" className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Marcar como resuelto
                            </Button>
                          )}
                          <Button type="submit" disabled={!nuevoMensaje.trim()}>Enviar respuesta</Button>
                        </div>
                      </form>
                    )}
                    
                    {ticket.estado === 'resuelto' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 p-4 rounded-lg flex items-start gap-2">
                        <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800 dark:text-green-200">Ticket resuelto</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Este ticket ha sido marcado como resuelto. Si tiene más consultas o el problema persiste, puede reabrirlo o crear un nuevo ticket.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{ticketsEjemplo.length}</div>
                      <div className="text-sm text-gray-500">Total de tickets</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600">
                        {ticketsEjemplo.filter(t => t.estado === 'abierto' || t.estado === 'en_progreso').length}
                      </div>
                      <div className="text-sm text-gray-500">Tickets activos</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {ticketsEjemplo.filter(t => t.estado === 'resuelto').length}
                      </div>
                      <div className="text-sm text-gray-500">Tickets resueltos</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                {ticketsEjemplo.map((ticket, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer transition-colors"
                    onClick={() => setTicketSeleccionado(ticket.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {renderizarIconoCategoria(ticket.categoria)}
                        <div>
                          <div className="font-medium">{ticket.asunto}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{ticket.descripcion}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {renderizarEstadoTicket(ticket.estado)}
                        {renderizarPrioridadTicket(ticket.prioridad)}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {ticket.id} • {ticket.fecha}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.respuestas.length} {ticket.respuestas.length === 1 ? 'respuesta' : 'respuestas'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="nuevo" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Ticket de Soporte</CardTitle>
              <CardDescription>
                Complete el formulario para abrir un nuevo ticket de soporte. Nos pondremos en contacto lo antes posible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={manejarEnvioTicket} className="space-y-4">
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium mb-1">
                    Asunto
                  </label>
                  <Input 
                    id="asunto" 
                    placeholder="Resumen de su consulta o problema" 
                    value={formularioSoporte.asunto}
                    onChange={(e) => setFormularioSoporte({...formularioSoporte, asunto: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium mb-1">
                    Categoría
                  </label>
                  <select 
                    id="categoria"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formularioSoporte.categoria}
                    onChange={(e) => setFormularioSoporte({...formularioSoporte, categoria: e.target.value})}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="app">Aplicación/Dashboard</option>
                    <option value="hardware">Hardware/Dispositivo</option>
                    <option value="facturacion">Facturación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <Textarea 
                    id="descripcion" 
                    placeholder="Describa en detalle su consulta o problema" 
                    value={formularioSoporte.descripcion}
                    onChange={(e) => setFormularioSoporte({...formularioSoporte, descripcion: e.target.value})}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full">Enviar Ticket</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
              <CardDescription>
                Respuestas a las consultas más comunes de nuestros clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {preguntasFrecuentes.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-orange-600" />
                      {item.pregunta}
                    </h3>
                    <p className="text-sm text-gray-500 pl-7">{item.respuesta}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacto" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>
                Diferentes formas de contactar con nuestro equipo de soporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg flex items-start gap-3">
                  <Phone className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Teléfono de Soporte</h3>
                    <p className="text-lg font-bold text-orange-600">{infoContacto.telefono}</p>
                    <p className="text-sm text-gray-500">{infoContacto.horario}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg flex items-start gap-3">
                  <Mail className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Correo Electrónico</h3>
                    <p className="text-lg font-bold text-orange-600">{infoContacto.email}</p>
                    <p className="text-sm text-gray-500">Respuesta en 24 horas hábiles</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-lg font-bold text-orange-600">{infoContacto.whatsapp}</p>
                    <p className="text-sm text-gray-500">Atención de lunes a viernes</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg flex items-start gap-3">
                  <HeadphonesIcon className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Soporte Técnico</h3>
                    <p className="text-lg">Para emergencias</p>
                    <p className="text-sm text-gray-500">Disponible 24/7 para incidencias críticas</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  También puede generar un ticket de soporte para que nuestro equipo le contacte
                </p>
                <Button onClick={() => setTabActiva('nuevo')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Crear Nuevo Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}