"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown, Copy, Save, User, UserPlus, Building, Mail, Phone, ClipboardCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Tipos y interfaces
interface PlanServicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  caracteristicas: string[];
}

interface Cliente {
  id: string;
  numeroCliente: string;
  nombre: string;
  correo: string;
  telefono: string;
  empresa?: string;
  rut: string;
  direccion: string;
  planSeleccionado: string;
  activo: boolean;
  fechaRegistro: string;
  ultimaFacturacion?: string;
  montoMensual: number;
  notas?: string;
  passwordTemporal?: string;
}

// Datos iniciales para cliente proveniente de cotización
interface CotizacionInicial {
  nombre: string;
  correo: string;
  telefono: string;
  empresa?: string;
  montoMensual: number;
  planSugerido?: string;
}

interface RegistroClientesProps {
  cotizacionInicial?: CotizacionInicial;
  onComplete?: () => void;
}

// Planes de servicio disponibles
const planesServicio: PlanServicio[] = [
  {
    id: "basico",
    nombre: "Básico",
    descripcion: "Monitoreo básico de consumo",
    precio: 25000,
    caracteristicas: [
      "Monitoreo en tiempo real",
      "Alertas de consumo excesivo",
      "Reportes mensuales",
      "Acceso a plataforma web",
    ]
  },
  {
    id: "estandar",
    nombre: "Estándar",
    descripcion: "Monitoreo y reposición automática",
    precio: 45000,
    caracteristicas: [
      "Todas las características del plan Básico",
      "Reposición automática limitada",
      "Alertas avanzadas",
      "Soporte telefónico 8/5",
    ]
  },
  {
    id: "premium",
    nombre: "Premium",
    descripcion: "Solución completa de administración energética",
    precio: 85000,
    caracteristicas: [
      "Todas las características del plan Estándar",
      "Reposición automática ilimitada",
      "Asesoría energética personalizada",
      "Soporte técnico 24/7",
      "Mantenimiento preventivo trimestral",
    ]
  },
  {
    id: "corporativo",
    nombre: "Corporativo",
    descripcion: "Solución empresarial a medida",
    precio: 150000,
    caracteristicas: [
      "Todas las características del plan Premium",
      "API para integración con sistemas empresariales",
      "Panel de administración multi-usuario",
      "Personalización de la plataforma",
      "Asesoramiento técnico dedicado",
      "Servicio de instalación incluido",
    ]
  }
];

export function RegistroClientes({ cotizacionInicial, onComplete }: RegistroClientesProps = {}) {
  // Agregar toast para notificaciones
  const { toast } = useToast();
  
  // Estados para el formulario principal
  const [tabActivo, setTabActivo] = useState("nuevo-cliente");
  const [planAbierto, setPlanAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<string>(cotizacionInicial?.planSugerido || "");
  const [planesExpandidos, setPlanesExpandidos] = useState<Record<string, boolean>>({});
  const [confirmarDialogoAbierto, setConfirmarDialogoAbierto] = useState(false);
  const [exito, setExito] = useState(false);
  const [copiado, setCopiado] = useState(false);
  
  const [passwordTemporal, setPasswordTemporal] = useState<string>('');
  const [enviarCorreo, setEnviarCorreo] = useState<boolean>(true);
  const [creandoCliente, setCreandoCliente] = useState<boolean>(false);
  
  // Estados para los campos del formulario
  const [formCliente, setFormCliente] = useState<Omit<Cliente, 'id' | 'fechaRegistro' | 'activo'>>({
    numeroCliente: generarNumeroCliente(),
    nombre: cotizacionInicial?.nombre || '',
    correo: cotizacionInicial?.correo || '',
    telefono: cotizacionInicial?.telefono || '',
    empresa: cotizacionInicial?.empresa || '',
    rut: '',
    direccion: '',
    planSeleccionado: cotizacionInicial?.planSugerido || '',
    montoMensual: cotizacionInicial?.montoMensual || 0,
    notas: '',
  });
  
  // Datos para vista de clientes existentes (ejemplo)
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: "1",
      numeroCliente: "123456-7",
      nombre: "Juan Pérez",
      correo: "juan@empresa.cl",
      telefono: "+56 9 1234 5678",
      empresa: "Empresa ABC",
      rut: "12.345.678-9",
      direccion: "Av. Principal 123, Santiago",
      planSeleccionado: "premium",
      activo: true,
      fechaRegistro: "2023-06-15",
      ultimaFacturacion: "2023-11-01",
      montoMensual: 85000,
      notas: "Cliente desde junio 2023, tiene equipos en 3 sucursales diferentes."
    },
    {
      id: "2",
      numeroCliente: "234567-8",
      nombre: "María González",
      correo: "maria@gmail.com",
      telefono: "+56 9 8765 4321",
      rut: "23.456.789-0",
      direccion: "Calle Secundaria 456, Viña del Mar",
      planSeleccionado: "basico",
      activo: true,
      fechaRegistro: "2023-08-20",
      ultimaFacturacion: "2023-11-01",
      montoMensual: 25000,
    }
  ]);
  
  // Generar un número de cliente aleatorio con formato XXXXXX-X
  function generarNumeroCliente(): string {
    const numero = Math.floor(100000 + Math.random() * 900000);
    const verificador = Math.floor(Math.random() * 10);
    return `${numero}-${verificador}`;
  }
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormCliente(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar selección de plan
  const handlePlanSeleccionado = (id: string) => {
    setPlanSeleccionado(id);
    const planElegido = planesServicio.find(plan => plan.id === id);
    if (planElegido) {
      setFormCliente(prev => ({ 
        ...prev, 
        planSeleccionado: id,
        montoMensual: planElegido.precio 
      }));
    }
    setPlanAbierto(false);
  };
  
  // Expandir/contraer detalles de un plan
  const togglePlanExpandido = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlanesExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Registrar un nuevo cliente
  const registrarCliente = () => {
    // Validar datos básicos del formulario
    if (!formCliente.nombre || !formCliente.correo || !formCliente.rut || !formCliente.planSeleccionado) {
      return; // Agregar validación adecuada en una implementación real
    }
    
    setConfirmarDialogoAbierto(true);
  };
  
  // Generar una contraseña aleatoria segura
  const generarPasswordAleatorio = (): string => {
    const longitud = 10;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    
    let password = '';
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      password += caracteres.charAt(indice);
    }
    
    // Actualizar el estado con la nueva contraseña
    setPasswordTemporal(password);
    return password;
  };
  
  // Función para generar una contraseña basada en los datos del cliente
  const generarPasswordDefault = (): string => {
    const password = `Cliente${formCliente.numeroCliente.replace('-', '')}`;
    setPasswordTemporal(password);
    return password;
  };
  
  // Confirmar registro de cliente
  const confirmarRegistro = async () => {
    try {
      setCreandoCliente(true);
      
      // Usar la contraseña generada o generar una por defecto si no existe
      const password = passwordTemporal || generarPasswordDefault();
      
      // Crear nuevo cliente
      const nuevoCliente: Cliente = {
        id: Date.now().toString(),
        fechaRegistro: new Date().toISOString().split('T')[0],
        activo: true,
        passwordTemporal: password,
        ...formCliente
      };
      
      // Guardar el cliente en la base de datos
      try {
        const respuesta = await fetch('/api/cliente/crear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...nuevoCliente,
            passwordTemporal: password
          }),
        });
        
        const resultado = await respuesta.json();
        
        if (!respuesta.ok) {
          throw new Error(resultado.message || 'Error al guardar el cliente en la base de datos');
        }
        
        toast({
          title: "Cliente registrado",
          description: "El cliente ha sido registrado correctamente en la base de datos.",
          variant: "success",
        });
        
        // Agregar a la lista de clientes local
        setClientes(prev => [nuevoCliente, ...prev]);
      } catch (error) {
        console.error('Error al guardar el cliente en la base de datos:', error);
        toast({
          title: "Error al guardar cliente",
          description: "No se pudo guardar el cliente en la base de datos. Por favor, inténtelo nuevamente.",
          variant: "destructive",
        });
        return; // Detener el proceso si hay error al guardar
      }
      
      // Enviar correo electrónico con las credenciales si la opción está activada
      if (enviarCorreo) {
        try {
          await fetch('/api/cliente/enviar-confirmacion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nombre: nuevoCliente.nombre,
              correo: nuevoCliente.correo,
              numeroCliente: nuevoCliente.numeroCliente,
              password: password
            }),
          });
          
          toast({
            title: "Correo enviado",
            description: `Se ha enviado un correo a ${nuevoCliente.correo} con las credenciales de acceso.`,
            variant: "success",
          });
        } catch (error) {
          console.error('Error al enviar correo de confirmación:', error);
          toast({
            title: "Error al enviar correo",
            description: "No se pudo enviar el correo electrónico. Por favor, inténtelo nuevamente.",
            variant: "destructive",
          });
        }
      }
      
      // Reiniciar formulario y mostrar éxito
      setConfirmarDialogoAbierto(false);
      setExito(true);
      setCreandoCliente(false);
      
      // Reiniciar formulario después de un tiempo
      setTimeout(() => {
        setExito(false);
        setFormCliente({
          numeroCliente: generarNumeroCliente(),
          nombre: '',
          correo: '',
          telefono: '',
          empresa: '',
          rut: '',
          direccion: '',
          planSeleccionado: '',
          montoMensual: 0,
          notas: '',
        });
        setPlanSeleccionado("");
        setPasswordTemporal("");
        
        // Notificar al componente padre si se proporcionó una función onComplete
        if (onComplete) {
          onComplete();
        }
      }, 2000);
    } catch (error) {
      setCreandoCliente(false);
      console.error('Error al registrar cliente:', error);
      toast({
        title: "Error al registrar cliente",
        description: "Ocurrió un error al intentar registrar el cliente. Por favor, inténtelo nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  // Copiar credenciales al portapapeles
  const copiarCredenciales = () => {
    const password = passwordTemporal || `Cliente${formCliente.numeroCliente.replace('-', '')}`;
    
    const texto = `Número de cliente: ${formCliente.numeroCliente}\nNombre: ${formCliente.nombre}\nCorreo: ${formCliente.correo}\nContraseña temporal: ${password}`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-orange-600" />
            Registro y Gestión de Clientes
          </CardTitle>
          <CardDescription>
            Administre clientes nuevos y existentes desde un solo lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tabActivo} onValueChange={setTabActivo}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nuevo-cliente" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Nuevo Cliente
              </TabsTrigger>
              <TabsTrigger value="clientes-existentes" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Clientes Existentes
              </TabsTrigger>
            </TabsList>
            
            {/* Formulario para nuevos clientes */}
            <TabsContent value="nuevo-cliente" className="space-y-6 mt-6">
              {exito ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">¡Cliente Registrado Exitosamente!</h3>
                  <p className="text-green-700 mb-4">
                    El cliente se ha agregado a la plataforma y ahora puede comenzar a usar el sistema.
                  </p>
                  <Button
                    variant="outline"
                    className="mx-auto"
                    onClick={() => setTabActivo("clientes-existentes")}
                  >
                    Ver Clientes
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información Personal</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-gray-500" />
                          Nombre Completo
                        </Label>
                        <Input 
                          id="nombre" 
                          name="nombre" 
                          placeholder="Nombre del cliente"
                          value={formCliente.nombre}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="correo" className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-gray-500" />
                          Correo Electrónico
                        </Label>
                        <Input 
                          id="correo" 
                          name="correo" 
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={formCliente.correo}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefono" className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-gray-500" />
                          Teléfono
                        </Label>
                        <Input 
                          id="telefono" 
                          name="telefono" 
                          placeholder="+56 9 XXXX XXXX"
                          value={formCliente.telefono}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="empresa" className="flex items-center gap-1.5">
                          <Building className="h-4 w-4 text-gray-500" />
                          Empresa (Opcional)
                        </Label>
                        <Input 
                          id="empresa" 
                          name="empresa" 
                          placeholder="Nombre de la empresa"
                          value={formCliente.empresa || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rut">RUT</Label>
                        <Input 
                          id="rut" 
                          name="rut" 
                          placeholder="XX.XXX.XXX-X"
                          value={formCliente.rut}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input 
                          id="direccion" 
                          name="direccion" 
                          placeholder="Dirección completa"
                          value={formCliente.direccion}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Detalles del Servicio</h3>
                      
                      <div className="space-y-2">
                        <Label>Número de Cliente</Label>
                        <div className="flex">
                          <Input 
                            value={formCliente.numeroCliente}
                            readOnly
                            className="bg-gray-50"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="ml-2" 
                            onClick={() => setFormCliente(prev => ({...prev, numeroCliente: generarNumeroCliente()}))}
                          >
                            <ChevronsUpDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Número único para identificar al cliente en el sistema
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Plan de Servicio</Label>
                        <Popover open={planAbierto} onOpenChange={setPlanAbierto}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={planAbierto}
                              className="w-full justify-between"
                            >
                              {planSeleccionado
                                ? planesServicio.find((plan) => plan.id === planSeleccionado)?.nombre
                                : "Seleccionar plan..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar plan..." />
                              <CommandEmpty>No se encontraron planes</CommandEmpty>
                              <CommandGroup>
                                {planesServicio.map((plan) => (
                                  <div key={plan.id}>
                                    <CommandItem
                                      value={plan.id}
                                      onSelect={() => handlePlanSeleccionado(plan.id)}
                                      className="cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          planSeleccionado === plan.id ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <span>{plan.nombre}</span>
                                          <span className="text-sm font-medium">
                                            ${plan.precio.toLocaleString('es-CL')} /mes
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{plan.descripcion}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => togglePlanExpandido(plan.id, e)}
                                      >
                                        <ChevronsUpDown className="h-3 w-3" />
                                      </Button>
                                    </CommandItem>
                                    
                                    {planesExpandidos[plan.id] && (
                                      <div className="px-7 py-2 text-sm text-gray-600">
                                        <ul className="list-disc pl-5 space-y-1">
                                          {plan.caracteristicas.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="montoMensual">Monto Mensual</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="montoMensual" 
                            name="montoMensual" 
                            className="pl-7"
                            value={formCliente.montoMensual.toLocaleString('es-CL')}
                            readOnly
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Basado en el plan seleccionado (personalizable para planes corporativos)
                        </p>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="notas">Notas adicionales</Label>
                        <Textarea 
                          id="notas" 
                          name="notas" 
                          placeholder="Información adicional relevante sobre el cliente"
                          rows={4}
                          value={formCliente.notas || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => {
                      setFormCliente({
                        numeroCliente: generarNumeroCliente(),
                        nombre: '',
                        correo: '',
                        telefono: '',
                        empresa: '',
                        rut: '',
                        direccion: '',
                        planSeleccionado: '',
                        montoMensual: 0,
                        notas: '',
                      });
                      setPlanSeleccionado("");
                    }}>
                      Limpiar Formulario
                    </Button>
                    <Button onClick={registrarCliente} className="bg-orange-600 hover:bg-orange-700">
                      <Save className="mr-2 h-4 w-4" />
                      Registrar Cliente
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
            
            {/* Lista de clientes existentes */}
            <TabsContent value="clientes-existentes" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Input 
                    placeholder="Buscar cliente..." 
                    className="max-w-sm"
                  />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todos los planes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los planes</SelectItem>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="estandar">Estándar</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="corporativo">Corporativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Facturación
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {clientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                                {cliente.nombre.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {cliente.nombre}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {cliente.correo}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  Cliente #{cliente.numeroCliente}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {planesServicio.find(p => p.id === cliente.planSeleccionado)?.nombre || 'No asignado'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ${cliente.montoMensual.toLocaleString('es-CL')} /mes
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              cliente.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {cliente.activo ? 'Activo' : 'Inactivo'}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Desde: {cliente.fechaRegistro}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {cliente.ultimaFacturacion || 'No facturado'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              Próximo: {cliente.ultimaFacturacion ? '01/12/2023' : 'Pendiente'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              Ver
                            </Button>
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmación */}
      <Dialog open={confirmarDialogoAbierto} onOpenChange={setConfirmarDialogoAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Registro de Cliente</DialogTitle>
            <DialogDescription>
              Revise los detalles antes de confirmar el registro del cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Información del Cliente</h4>
              <p>Nombre: <span className="font-semibold">{formCliente.nombre}</span></p>
              <p>Correo: <span className="font-semibold">{formCliente.correo}</span></p>
              <p>Teléfono: <span className="font-semibold">{formCliente.telefono || 'No especificado'}</span></p>
              {formCliente.empresa && (
                <p>Empresa: <span className="font-semibold">{formCliente.empresa}</span></p>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Detalles del Plan</h4>
              <p>Plan seleccionado: 
                <span className="font-semibold">
                  {planesServicio.find(p => p.id === formCliente.planSeleccionado)?.nombre || 'No seleccionado'}
                </span>
              </p>
              <p>Monto mensual: <span className="font-semibold">${formCliente.montoMensual.toLocaleString('es-CL')}</span></p>
            </div>
            
            {/* Nuevo: Sección de contraseña y envío de correo */}
            <div className="space-y-3">
              <h4 className="font-medium">Configuración de la Cuenta</h4>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña Temporal</Label>
                <div className="flex gap-2">
                  <Input 
                    id="password"
                    value={passwordTemporal}
                    onChange={(e) => setPasswordTemporal(e.target.value)}
                    placeholder="Contraseña generada automáticamente"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => generarPasswordAleatorio()}
                    title="Generar contraseña aleatoria"
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Se generará una contraseña aleatoria o puede ingresar una personalizada.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enviar-correo" 
                  checked={enviarCorreo} 
                  onCheckedChange={setEnviarCorreo} 
                />
                <Label htmlFor="enviar-correo" className="cursor-pointer">
                  Enviar correo de confirmación con credenciales
                </Label>
              </div>
              <p className="text-xs text-gray-500 ml-7">
                Se enviará un correo al cliente informando que su solicitud ha sido aprobada 
                y que se le creará un usuario dentro de los próximos 2 días hábiles.
              </p>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmarDialogoAbierto(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={confirmarRegistro}
              disabled={creandoCliente}
            >
              {creandoCliente ? 'Registrando...' : 'Confirmar Registro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Añadir Toaster para las notificaciones */}
      <Toaster />
    </div>
  );
} 