"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, MessageSquare, Phone, FileText, Search, Clock, AlertCircle, Check, HelpCircle } from 'lucide-react';

interface Ticket {
  id: string;
  asunto: string;
  descripcion: string;
  fecha: string;
  estado: 'abierto' | 'en-proceso' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta';
  categoria: string;
  respuestas: Respuesta[];
}

interface Respuesta {
  id: string;
  tipo: 'cliente' | 'soporte';
  nombre: string;
  mensaje: string;
  fecha: string;
}

interface Faq {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
}

// Datos de ejemplo
const tickets: Ticket[] = [
  {
    id: 'TIC-2023-001',
    asunto: 'Problema con la lectura del medidor',
    descripcion: 'El medidor muestra valores incorrectos de consumo, significativamente mayores a los habituales.',
    fecha: '2023-05-15 09:30',
    estado: 'en-proceso',
    prioridad: 'media',
    categoria: 'Medidor',
    respuestas: [
      {
        id: 'RES-001',
        tipo: 'cliente',
        nombre: 'Juan Pérez',
        mensaje: 'Desde hace una semana el medidor ha estado mostrando valores muy superiores a mi consumo habitual, casi el doble.',
        fecha: '2023-05-15 09:30'
      },
      {
        id: 'RES-002',
        tipo: 'soporte',
        nombre: 'Carlos Mendoza (Soporte)',
        mensaje: 'Gracias por reportar el problema. Hemos registrado su caso y un técnico realizará una revisión remota del medidor en las próximas 24 horas.',
        fecha: '2023-05-15 11:45'
      },
      {
        id: 'RES-003',
        tipo: 'soporte',
        nombre: 'Ana Silva (Técnico)',
        mensaje: 'Hemos realizado una revisión remota de su medidor y efectivamente detectamos una anomalía en las lecturas. Programaremos una visita técnica para revisar el dispositivo en terreno.',
        fecha: '2023-05-16 14:20'
      }
    ]
  },
  {
    id: 'TIC-2023-002',
    asunto: 'Consulta sobre plan tarifario',
    descripcion: 'Quisiera saber si es posible cambiar mi plan actual a uno con tarifa diferenciada por horario.',
    fecha: '2023-05-10 15:45',
    estado: 'cerrado',
    prioridad: 'baja',
    categoria: 'Facturación',
    respuestas: [
      {
        id: 'RES-004',
        tipo: 'cliente',
        nombre: 'Juan Pérez',
        mensaje: 'Me gustaría conocer las opciones para cambiar a un plan con tarifa diferenciada, ya que consumo más energía en horario nocturno.',
        fecha: '2023-05-10 15:45'
      },
      {
        id: 'RES-005',
        tipo: 'soporte',
        nombre: 'Patricio Gómez (Ejecutivo)',
        mensaje: 'Buenas tardes, efectivamente contamos con un plan BT1-H que tiene tarifas diferenciadas según horario. Le adjunto documento con detalles y requisitos para el cambio.',
        fecha: '2023-05-10 16:30'
      },
      {
        id: 'RES-006',
        tipo: 'cliente',
        nombre: 'Juan Pérez',
        mensaje: 'Muchas gracias por la información. Revisaré el documento y me pondré en contacto para realizar el cambio.',
        fecha: '2023-05-11 09:15'
      },
      {
        id: 'RES-007',
        tipo: 'soporte',
        nombre: 'Patricio Gómez (Ejecutivo)',
        mensaje: 'Perfecto, quedamos atentos a su decisión. ¿Hay algo más en lo que podamos ayudarle?',
        fecha: '2023-05-11 10:00'
      },
      {
        id: 'RES-008',
        tipo: 'cliente',
        nombre: 'Juan Pérez',
        mensaje: 'No, eso es todo por ahora. Gracias por su ayuda.',
        fecha: '2023-05-11 10:20'
      }
    ]
  }
];

// FAQs de ejemplo
const faqs: Faq[] = [
  {
    id: '1',
    pregunta: '¿Cómo puedo entender mi factura eléctrica?',
    respuesta: 'Su factura eléctrica está dividida en varias secciones: datos del cliente, resumen de consumo, detalle de cargos y métodos de pago. El consumo se mide en kWh y se multiplica por la tarifa de su plan para calcular el cargo por energía. Además, pueden aplicarse otros cargos como servicios de transmisión, impuestos y contribuciones.',
    categoria: 'Facturación'
  },
  {
    id: '2',
    pregunta: '¿Qué hacer en caso de un corte de energía?',
    respuesta: 'Si experimenta un corte de energía, primero verifique si es solo en su domicilio o afecta a toda la zona. Revise sus interruptores y el medidor. Si el problema persiste, repórtelo a través de nuestra plataforma o llame a nuestra línea de emergencia 600 123 4567. Nuestro equipo atenderá la situación con la mayor brevedad posible.',
    categoria: 'Emergencias'
  },
  {
    id: '3',
    pregunta: '¿Cómo puedo reducir mi consumo eléctrico?',
    respuesta: 'Para reducir su consumo eléctrico puede: utilizar electrodomésticos eficientes con etiqueta A+++, reemplazar bombillas por LED, desconectar aparatos en standby, aislar correctamente su hogar, aprovechar la luz natural, y mantener una temperatura adecuada en calefacción y refrigeración. También puede solicitar una asesoría energética personalizada contactando a nuestro servicio de atención al cliente.',
    categoria: 'Consumo'
  },
  {
    id: '4',
    pregunta: '¿Puedo cambiar la fecha de vencimiento de mi factura?',
    respuesta: 'Sí, puede solicitar un cambio en la fecha de vencimiento de su factura. Para ello, debe ingresar una solicitud en la sección "Solicitudes" de su portal cliente o contactar directamente con nuestro servicio al cliente. El proceso puede tomar hasta dos ciclos de facturación para hacerse efectivo.',
    categoria: 'Facturación'
  },
  {
    id: '5',
    pregunta: '¿Cómo funcionan los medidores inteligentes?',
    respuesta: 'Los medidores inteligentes registran su consumo eléctrico en tiempo real y transmiten esta información automáticamente a nuestra empresa, eliminando la necesidad de lecturas manuales. Estos dispositivos le permiten visualizar su consumo detallado, facilitando la identificación de patrones y oportunidades de ahorro energético.',
    categoria: 'Medidores'
  },
  {
    id: '6',
    pregunta: '¿Qué hago si detecto un problema en mi medidor?',
    respuesta: 'Si detecta algún problema en su medidor (lecturas anormales, displays apagados, ruidos extraños), debe reportarlo inmediatamente a través de nuestro portal o línea de atención. Un técnico especializado evaluará si es necesaria una revisión remota o una visita en terreno para diagnosticar y solucionar el problema.',
    categoria: 'Medidores'
  }
];

export function SoporteUsuario() {
  const [tabActiva, setTabActiva] = useState('tickets');
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');
  const [busquedaFAQ, setBusquedaFAQ] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  
  const [nuevoTicket, setNuevoTicket] = useState({
    asunto: '',
    categoria: '',
    descripcion: ''
  });
  
  const [envioExitoso, setEnvioExitoso] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoTicket(prev => ({ ...prev, [name]: value }));
  };
  
  const formatoEstadoTicket = (estado: string) => {
    switch (estado) {
      case 'abierto':
        return {
          texto: 'Abierto',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
        };
      case 'en-proceso':
        return {
          texto: 'En proceso',
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
        };
      case 'cerrado':
        return {
          texto: 'Resuelto',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
        };
      default:
        return {
          texto: 'Desconocido',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
        };
    }
  };
  
  const formatoPrioridadTicket = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return {
          texto: 'Alta',
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        };
      case 'media':
        return {
          texto: 'Media',
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
        };
      case 'baja':
        return {
          texto: 'Baja',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
        };
      default:
        return {
          texto: 'Normal',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
        };
    }
  };
  
  const enviarRespuesta = () => {
    if (!mensajeRespuesta.trim() || !ticketSeleccionado) return;
    
    // Aquí se enviaría la respuesta a la API
    console.log('Enviando respuesta:', mensajeRespuesta);
    
    // Simulamos el envío exitoso
    setMensajeRespuesta('');
    setTicketSeleccionado(null);
    setTabActiva('tickets');
  };
  
  const crearNuevoTicket = () => {
    if (!nuevoTicket.asunto || !nuevoTicket.categoria || !nuevoTicket.descripcion) return;
    
    // Aquí se enviaría el nuevo ticket a la API
    console.log('Creando ticket:', nuevoTicket);
    
    // Simulamos el envío exitoso
    setEnvioExitoso(true);
    setNuevoTicket({
      asunto: '',
      categoria: '',
      descripcion: ''
    });
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      setEnvioExitoso(false);
      setTabActiva('tickets');
    }, 3000);
  };
  
  // Extraer categorías únicas de FAQs sin usar Set para evitar problemas de hidratación
  const extraerCategorias = () => {
    const categorias = ['todas'];
    faqs.forEach(faq => {
      if (!categorias.includes(faq.categoria)) {
        categorias.push(faq.categoria);
      }
    });
    return categorias;
  };
  
  const categoriasFAQ = extraerCategorias();
  
  const faqsFiltrados = faqs.filter(faq => {
    const coincideBusqueda = faq.pregunta.toLowerCase().includes(busquedaFAQ.toLowerCase()) || 
                             faq.respuesta.toLowerCase().includes(busquedaFAQ.toLowerCase());
    const coincideCategoria = categoriaSeleccionada === 'todas' || faq.categoria === categoriaSeleccionada;
    
    return coincideBusqueda && coincideCategoria;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Headphones className="h-8 w-8 text-orange-600" />
            Soporte y Ayuda
          </h2>
          <p className="text-muted-foreground mt-1">
            Asistencia técnica y respuestas a sus consultas
          </p>
        </div>
        
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => setTabActiva('nuevo-ticket')}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Nuevo Ticket
        </Button>
      </div>

      <Tabs defaultValue="tickets" value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="mb-4 grid grid-cols-3 gap-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Mis Tickets</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Preguntas Frecuentes</span>
          </TabsTrigger>
          <TabsTrigger value="contacto" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Contacto Directo</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Vista de Tickets */}
        <TabsContent value="tickets">
          {ticketSeleccionado ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      {ticketSeleccionado.asunto}
                    </CardTitle>
                    <CardDescription>
                      Ticket #{ticketSeleccionado.id} - {ticketSeleccionado.fecha}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatoEstadoTicket(ticketSeleccionado.estado).color}`}>
                      {formatoEstadoTicket(ticketSeleccionado.estado).texto}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatoPrioridadTicket(ticketSeleccionado.prioridad).color}`}>
                      Prioridad: {formatoPrioridadTicket(ticketSeleccionado.prioridad).texto}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                  <h3 className="font-medium mb-2">Descripción Original:</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {ticketSeleccionado.descripcion}
                  </p>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                  {ticketSeleccionado.respuestas.map(respuesta => (
                    <div 
                      key={respuesta.id}
                      className={`p-4 rounded-lg ${
                        respuesta.tipo === 'cliente' 
                          ? 'bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30 ml-auto max-w-[80%]' 
                          : 'bg-gray-50 border border-gray-100 dark:bg-slate-900 dark:border-gray-800 mr-auto max-w-[80%]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{respuesta.nombre}</span>
                        <span className="text-xs text-gray-500">{respuesta.fecha}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {respuesta.mensaje}
                      </p>
                    </div>
                  ))}
                </div>
                
                {ticketSeleccionado.estado !== 'cerrado' && (
                  <div className="space-y-3">
                    <Label htmlFor="respuesta">Su respuesta</Label>
                    <Textarea 
                      id="respuesta" 
                      placeholder="Escriba su respuesta aquí..." 
                      rows={4}
                      value={mensajeRespuesta}
                      onChange={(e) => setMensajeRespuesta(e.target.value)}
                    />
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setTicketSeleccionado(null)}
                      >
                        Volver
                      </Button>
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={enviarRespuesta}
                        disabled={!mensajeRespuesta.trim()}
                      >
                        Enviar Respuesta
                      </Button>
                    </div>
                  </div>
                )}
                
                {ticketSeleccionado.estado === 'cerrado' && (
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setTicketSeleccionado(null)}
                    >
                      Volver
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-orange-600 border-orange-600"
                    >
                      Reabrir Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-5 w-5 text-orange-600" />
                          <h3 className="font-medium">{ticket.asunto}</h3>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <span>#{ticket.id}</span>
                          <span>{ticket.fecha}</span>
                          <span>Categoría: {ticket.categoria}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatoEstadoTicket(ticket.estado).color}`}>
                          {formatoEstadoTicket(ticket.estado).texto}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTicketSeleccionado(ticket)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {tickets.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tiene tickets activos</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Cree un nuevo ticket si necesita asistencia técnica o tiene consultas
                  </p>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setTabActiva('nuevo-ticket')}
                  >
                    Crear Nuevo Ticket
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Vista de Nuevo Ticket */}
        <TabsContent value="nuevo-ticket">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Ticket de Soporte</CardTitle>
              <CardDescription>
                Complete el formulario para solicitar asistencia técnica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {envioExitoso ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ticket Creado Exitosamente</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Su solicitud ha sido recibida. Nos pondremos en contacto a la brevedad.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto</Label>
                    <Input 
                      id="asunto" 
                      name="asunto" 
                      placeholder="Describa brevemente su problema" 
                      value={nuevoTicket.asunto}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select 
                      value={nuevoTicket.categoria} 
                      onValueChange={(value) => setNuevoTicket(prev => ({ ...prev, categoria: value }))}
                    >
                      <SelectTrigger id="categoria">
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medidor">Medidor</SelectItem>
                        <SelectItem value="Facturación">Facturación</SelectItem>
                        <SelectItem value="Servicio">Servicio</SelectItem>
                        <SelectItem value="Técnico">Soporte Técnico</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción Detallada</Label>
                    <Textarea 
                      id="descripcion" 
                      name="descripcion" 
                      placeholder="Describa detalladamente su problema o consulta" 
                      rows={6}
                      value={nuevoTicket.descripcion}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-300">Información importante</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-1">
                          <li>Su ticket será asignado a un especialista en la materia</li>
                          <li>El tiempo de respuesta inicial es de máximo 24 horas hábiles</li>
                          <li>Recibirá notificaciones sobre su ticket por email</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setTabActiva('tickets')}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={crearNuevoTicket}
                      disabled={!nuevoTicket.asunto || !nuevoTicket.categoria || !nuevoTicket.descripcion}
                    >
                      Enviar Ticket
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vista de FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
              <CardDescription>
                Respuestas a las consultas más comunes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar en preguntas frecuentes..." 
                    className="pl-10"
                    value={busquedaFAQ}
                    onChange={(e) => setBusquedaFAQ(e.target.value)}
                  />
                </div>
                <Select 
                  value={categoriaSeleccionada} 
                  onValueChange={setCategoriaSeleccionada}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasFAQ.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'todas' ? 'Todas las categorías' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {faqsFiltrados.length > 0 ? (
                  faqsFiltrados.map(faq => (
                    <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-slate-900 font-medium flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-orange-600" />
                        {faq.pregunta}
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.respuesta}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Categoría: {faq.categoria}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Intente con otra búsqueda o cree un ticket de soporte
                    </p>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => setTabActiva('nuevo-ticket')}
                    >
                      Crear Ticket de Soporte
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vista de Contacto Directo */}
        <TabsContent value="contacto">
          <Card>
            <CardHeader>
              <CardTitle>Contacto Directo</CardTitle>
              <CardDescription>
                Otras formas de contactar con nuestro equipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Atención Telefónica</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Contáctenos directamente por teléfono para atención inmediata
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">600 123 4567</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lunes a Viernes: 8:00 - 20:00 hrs
                      <br />
                      Sábados: 9:00 - 14:00 hrs
                    </p>
                  </div>
                </div>
                
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Chat en Vivo</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Converse en tiempo real con uno de nuestros agentes
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Iniciar Chat
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Tiempo estimado de espera: 5 minutos
                  </p>
                </div>
                
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Agendar Llamada</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Programe una llamada con uno de nuestros especialistas
                  </p>
                  <Button variant="outline" className="w-full">
                    Agendar Hora
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Recibirá confirmación por email
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300">Emergencias 24/7</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Para reportar emergencias como cortes de energía o situaciones de riesgo,
                      contáctenos al <span className="font-medium">600 987 6543</span>, disponible
                      las 24 horas del día, los 7 días de la semana.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}