"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard, Download, Calendar as CalendarIcon, ChevronRight, FileText, CircleDollarSign, AlertCircle } from 'lucide-react';

interface Factura {
  id: string;
  fecha: Date;
  monto: number;
  estado: 'pendiente' | 'pagada' | 'vencida';
  consumo: number;
  fechaVencimiento: Date;
}

interface MetodoPago {
  id: string;
  tipo: 'tarjeta' | 'transferencia';
  nombre: string;
  ultimosDigitos?: string;
  predeterminado: boolean;
}

// Datos de ejemplo
const facturas: Factura[] = [
  {
    id: 'FAC-2023-05',
    fecha: new Date(2023, 4, 15), // 15 Mayo 2023
    monto: 45800,
    estado: 'pendiente',
    consumo: 240.5,
    fechaVencimiento: new Date(2023, 5, 5), // 5 Junio 2023
  },
  {
    id: 'FAC-2023-04',
    fecha: new Date(2023, 3, 15), // 15 Abril 2023
    monto: 42300,
    estado: 'pagada',
    consumo: 225.8,
    fechaVencimiento: new Date(2023, 4, 5), // 5 Mayo 2023
  },
  {
    id: 'FAC-2023-03',
    fecha: new Date(2023, 2, 15), // 15 Marzo 2023
    monto: 48200,
    estado: 'pagada',
    consumo: 258.1,
    fechaVencimiento: new Date(2023, 3, 5), // 5 Abril 2023
  },
  {
    id: 'FAC-2023-02',
    fecha: new Date(2023, 1, 15), // 15 Febrero 2023
    monto: 51500,
    estado: 'pagada',
    consumo: 270.4,
    fechaVencimiento: new Date(2023, 2, 5), // 5 Marzo 2023
  },
  {
    id: 'FAC-2023-01',
    fecha: new Date(2023, 0, 15), // 15 Enero 2023
    monto: 49200,
    estado: 'pagada',
    consumo: 262.7,
    fechaVencimiento: new Date(2023, 1, 5), // 5 Febrero 2023
  },
];

const metodosPago: MetodoPago[] = [
  {
    id: 'mp-1',
    tipo: 'tarjeta',
    nombre: 'Visa terminada en 4587',
    ultimosDigitos: '4587',
    predeterminado: true
  },
  {
    id: 'mp-2',
    tipo: 'tarjeta',
    nombre: 'Mastercard terminada en 8924',
    ultimosDigitos: '8924',
    predeterminado: false
  },
  {
    id: 'mp-3',
    tipo: 'transferencia',
    nombre: 'Transferencia bancaria',
    predeterminado: false
  }
];

interface PagosFacturasProps {
  reducida?: boolean;
}

export function PagosFacturas({ reducida = false }: PagosFacturasProps) {
  const [tabActiva, setTabActiva] = useState('facturas');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(metodosPago[0].id);
  
  const formatoMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };
  
  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300';
      case 'pagada':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300';
      case 'vencida':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Pagos y Facturas
          </CardTitle>
          <CardDescription>
            Últimas facturas y pagos pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {facturas.filter(f => f.estado === 'pendiente').length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                  Factura pendiente de pago
                </h3>
                <Button variant="outline" size="sm" className="text-sm h-8">
                  Pagar ahora
                </Button>
              </div>
              
              <div className="space-y-3">
                {facturas.filter(f => f.estado === 'pendiente').slice(0, 1).map(factura => (
                  <div key={factura.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{factura.id}</div>
                      <div className="font-bold text-orange-600">{formatoMoneda(factura.monto)}</div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                      <div>Vence: {format(factura.fechaVencimiento, 'dd/MM/yyyy')}</div>
                      <div>{factura.consumo} kWh</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">No tiene facturas pendientes</p>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
              Últimos pagos
            </h3>
            <div className="space-y-2">
              {facturas.filter(f => f.estado === 'pagada').slice(0, 2).map(factura => (
                <div key={factura.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-green-600" />
                    <span>{factura.id}</span>
                  </div>
                  <div className="font-medium">{formatoMoneda(factura.monto)}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-orange-600" />
            Pagos y Facturas
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Administre sus facturas y realice pagos
          </p>
        </div>
        
        {facturas.filter(f => f.estado === 'pendiente').length > 0 && (
          <Button className="bg-orange-600 hover:bg-orange-700">
            Pagar factura pendiente
          </Button>
        )}
      </div>

      <Tabs defaultValue="facturas" value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="mb-4 grid grid-cols-2 gap-4">
          <TabsTrigger value="facturas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Mis Facturas</span>
          </TabsTrigger>
          <TabsTrigger value="pagar" className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <span>Realizar Pago</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="facturas" className="space-y-4">
          {facturas.filter(f => f.estado === 'pendiente').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Factura Pendiente</CardTitle>
                <CardDescription>
                  Tienes una factura pendiente de pago
                </CardDescription>
              </CardHeader>
              <CardContent>
                {facturas.filter(f => f.estado === 'pendiente').map(factura => (
                  <div key={factura.id} className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800/50">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-orange-600" />
                          <span className="font-medium">{factura.id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha emisión</p>
                            <p className="font-medium">{format(factura.fecha, 'dd/MM/yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha vencimiento</p>
                            <p className="font-medium">{format(factura.fechaVencimiento, 'dd/MM/yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Consumo</p>
                            <p className="font-medium">{factura.consumo} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                            <p className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                              Pendiente
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center md:text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monto a pagar</p>
                        <p className="text-3xl font-bold text-orange-600 mb-2">{formatoMoneda(factura.monto)}</p>
                        <div className="flex flex-col gap-2">
                          <Button onClick={() => setTabActiva('pagar')}>
                            Pagar ahora
                          </Button>
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Historial de Facturas</CardTitle>
              <CardDescription>
                Todas sus facturas de los últimos meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facturas.map(factura => (
                  <div key={factura.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-900">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-slate-800">
                        <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{factura.id}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${obtenerColorEstado(factura.estado)}`}>
                            {factura.estado === 'pendiente' ? 'Pendiente' : 
                             factura.estado === 'pagada' ? 'Pagada' : 'Vencida'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <span>Emisión: {format(factura.fecha, 'dd/MM/yyyy')}</span>
                          <span>Consumo: {factura.consumo} kWh</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
                      <div className="text-right sm:mr-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monto</p>
                        <p className="font-bold text-lg">{formatoMoneda(factura.monto)}</p>
                      </div>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Realizar Pago</CardTitle>
              <CardDescription>
                Complete la información para realizar su pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {facturas.filter(f => f.estado === 'pendiente').length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label>Factura a pagar</Label>
                    <Select defaultValue={facturas.find(f => f.estado === 'pendiente')?.id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar factura" />
                      </SelectTrigger>
                      <SelectContent>
                        {facturas.filter(f => f.estado === 'pendiente').map(factura => (
                          <SelectItem key={factura.id} value={factura.id}>
                            {factura.id} - {formatoMoneda(factura.monto)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800/50">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Monto a pagar:</span>
                      <span className="font-bold text-orange-600">
                        {formatoMoneda(facturas.find(f => f.estado === 'pendiente')?.monto || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Fecha de vencimiento:</span>
                      <span>{format(facturas.find(f => f.estado === 'pendiente')?.fechaVencimiento || new Date(), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Método de pago</Label>
                    <Select value={metodoPagoSeleccionado} onValueChange={setMetodoPagoSeleccionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        {metodosPago.map(metodo => (
                          <SelectItem key={metodo.id} value={metodo.id}>
                            {metodo.nombre} {metodo.predeterminado ? '(Predeterminado)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {metodoPagoSeleccionado === 'mp-3' && (
                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/50">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-300">Instrucciones para transferencia bancaria</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-1">
                            <li>Banco: Banco Estado</li>
                            <li>Titular: Electric Automatic Chile SpA</li>
                            <li>RUT: 76.123.456-7</li>
                            <li>Tipo de cuenta: Cuenta Corriente</li>
                            <li>N° de cuenta: 12345678901</li>
                            <li>Email: pagos@electricautomaticchile.cl</li>
                            <li>Asunto: {facturas.find(f => f.estado === 'pendiente')?.id}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {metodoPagoSeleccionado !== 'mp-3' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                        <Input id="card-name" placeholder="Como aparece en la tarjeta" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Número de tarjeta</Label>
                        <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Fecha de expiración</Label>
                        <Input id="card-expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-cvc">Código de seguridad</Label>
                        <Input id="card-cvc" placeholder="CVC" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="save-payment"
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                      />
                      <Label htmlFor="save-payment" className="text-sm">
                        Guardar método de pago
                      </Label>
                    </div>
                    
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      {metodoPagoSeleccionado === 'mp-3' ? 'Confirmar transferencia' : 'Realizar pago'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <CircleDollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tienes pagos pendientes</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Todas tus facturas han sido pagadas. La próxima factura estará disponible pronto.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago Guardados</CardTitle>
              <CardDescription>
                Administre sus métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metodosPago.map(metodo => (
                  <div 
                    key={metodo.id} 
                    className="flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-slate-800">
                        <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{metodo.nombre}</p>
                        {metodo.predeterminado && (
                          <p className="text-xs text-green-600">Método predeterminado</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!metodo.predeterminado && (
                        <Button variant="outline" size="sm">Predeterminar</Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Eliminar</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Agregar nuevo método de pago
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 