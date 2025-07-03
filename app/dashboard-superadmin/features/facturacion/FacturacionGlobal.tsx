"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { 
  DollarSign, 
  FileText, 
  Download, 
  TrendingUp, 
  Filter, 
  Search, 
  AlertCircle,
  CheckCircle,
  CalendarDays,
  Building2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Datos simulados de facturación
const facturacionMensual = [
  { mes: 'Ene 2023', total: 142538690, clientes: 43, pagadas: 40, pendientes: 3, vencidas: 0 },
  { mes: 'Feb 2023', total: 156732450, clientes: 45, pagadas: 45, pendientes: 0, vencidas: 0 },
  { mes: 'Mar 2023', total: 168954230, clientes: 46, pagadas: 45, pendientes: 1, vencidas: 0 },
  { mes: 'Abr 2023', total: 175640120, clientes: 46, pagadas: 42, pendientes: 4, vencidas: 0 },
  { mes: 'May 2023', total: 184327800, clientes: 48, pagadas: 45, pendientes: 3, vencidas: 0 },
  { mes: 'Jun 2023', total: 193845690, clientes: 49, pagadas: 47, pendientes: 2, vencidas: 0 },
  { mes: 'Jul 2023', total: 201432560, clientes: 51, pagadas: 48, pendientes: 3, vencidas: 0 },
  { mes: 'Ago 2023', total: 215678390, clientes: 52, pagadas: 49, pendientes: 3, vencidas: 0 },
  { mes: 'Sep 2023', total: 220345670, clientes: 54, pagadas: 50, pendientes: 4, vencidas: 0 },
  { mes: 'Oct 2023', total: 235678540, clientes: 57, pagadas: 52, pendientes: 5, vencidas: 0 },
  { mes: 'Nov 2023', total: 248954670, clientes: 60, pagadas: 55, pendientes: 5, vencidas: 0 }
];

// Datos simulados de facturación por sector
const facturacionPorSector = [
  { sector: 'Industrial', porcentaje: 45, total: 112029602, clientes: 12 },
  { sector: 'Comercial', porcentaje: 30, total: 74686401, clientes: 22 },
  { sector: 'Residencial', porcentaje: 25, total: 62238667, clientes: 26 }
];

// Datos simulados de facturación por cliente
const facturacionPorCliente = [
  { 
    nombre: 'Constructora Santiago S.A.', 
    sector: 'Industrial',
    total: 28560450, 
    facturasMes: 1,
    ultimaFactura: '15/11/2023',
    estado: 'pagada',
    tendencia: '+5.2%'
  },
  { 
    nombre: 'Inmobiliaria Norte Grande', 
    sector: 'Industrial',
    total: 24320560, 
    facturasMes: 1,
    ultimaFactura: '12/11/2023',
    estado: 'pagada',
    tendencia: '+3.8%'
  },
  { 
    nombre: 'Metalúrgica del Sur', 
    sector: 'Industrial',
    total: 18750320, 
    facturasMes: 1,
    ultimaFactura: '10/11/2023',
    estado: 'pendiente',
    tendencia: '+4.1%'
  },
  { 
    nombre: 'Hotel Costa Pacífico', 
    sector: 'Comercial',
    total: 15320450, 
    facturasMes: 1,
    ultimaFactura: '08/11/2023',
    estado: 'pagada',
    tendencia: '+1.5%'
  },
  { 
    nombre: 'Mall Central', 
    sector: 'Comercial',
    total: 12670890, 
    facturasMes: 1,
    ultimaFactura: '05/11/2023',
    estado: 'pendiente',
    tendencia: '+2.3%'
  },
  { 
    nombre: 'Supermercados Unidos', 
    sector: 'Comercial',
    total: 10980560, 
    facturasMes: 1,
    ultimaFactura: '03/11/2023',
    estado: 'pagada',
    tendencia: '-1.2%'
  },
  { 
    nombre: 'Condominio Vista Mar', 
    sector: 'Residencial',
    total: 9560780, 
    facturasMes: 1,
    ultimaFactura: '02/11/2023',
    estado: 'pagada',
    tendencia: '+0.8%'
  },
  { 
    nombre: 'Edificio Central Park', 
    sector: 'Residencial',
    total: 8760450, 
    facturasMes: 1,
    ultimaFactura: '01/11/2023',
    estado: 'pendiente',
    tendencia: '+1.4%'
  }
];

// Estadísticas de facturación
const estadisticasFacturacion = {
  totalMes: 248954670,
  variacionMesAnterior: 5.6,
  promedioFactura: 4149244,
  totalPendienteCobro: 43560000,
  tasaMorosidad: 0.8,
  facturasEmitidas: 60,
  facturasPagadas: 55,
  facturasPendientes: 5,
  facturasVencidas: 0
};

interface FacturacionGlobalProps {
  reducida?: boolean;
}

export function FacturacionGlobal({ reducida = false }: FacturacionGlobalProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  const [busqueda, setBusqueda] = useState('');
  const [filtroSector, setFiltroSector] = useState('todos');
  
  // Formatear número como moneda CLP
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };
  
  // Formatear número como entero con separador de miles
  const formatearNumero = (valor: number) => {
    return new Intl.NumberFormat('es-CL').format(valor);
  };
  
  // Filtrar clientes según búsqueda y sector
  const clientesFiltrados = facturacionPorCliente.filter(cliente => {
    // Aplicar filtro de búsqueda
    const coincideBusqueda = busqueda.trim() === '' || 
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    // Aplicar filtro de sector
    const coincideSector = filtroSector === 'todos' || cliente.sector === filtroSector;
    
    return coincideBusqueda && coincideSector;
  });
  
  // Renderizar badge de estado de factura
  const renderizarEstadoFactura = (estado: string) => {
    switch (estado) {
      case 'pagada':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pagada
          </div>
        );
      case 'pendiente':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <CalendarDays className="h-3 w-3 mr-1" />
            Pendiente
          </div>
        );
      case 'vencida':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vencida
          </div>
        );
      default:
        return null;
    }
  };
  
  // Renderizar indicador de tendencia
  const renderizarTendencia = (tendencia: string) => {
    const valor = parseFloat(tendencia.replace('%', ''));
    if (valor > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-3 w-3 mr-1" />
          {tendencia}
        </div>
      );
    } else if (valor < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDown className="h-3 w-3 mr-1" />
          {tendencia.replace('-', '')}
        </div>
      );
    } else {
      return <span>0%</span>;
    }
  };
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-600" />
            Facturación Global
          </CardTitle>
          <CardDescription>
            Resumen financiero del mes actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Facturación Total (Nov 2023)</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatearMoneda(estadisticasFacturacion.totalMes)}
              </div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{estadisticasFacturacion.variacionMesAnterior}% respecto al mes anterior
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Pagadas</div>
                <div className="text-xl font-bold text-green-600">{estadisticasFacturacion.facturasPagadas}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Pendientes</div>
                <div className="text-xl font-bold text-amber-600">{estadisticasFacturacion.facturasPendientes}</div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
              <div className="text-sm font-medium mb-2">Distribución por Sector</div>
              <div className="space-y-2">
                {facturacionPorSector.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        sector.sector === 'Industrial' ? 'bg-blue-500' : 
                        sector.sector === 'Comercial' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm">{sector.sector}</span>
                    </div>
                    <div className="text-sm font-medium">{sector.porcentaje}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-orange-600" />
          Facturación Global
        </h2>
        
        <div className="flex items-center gap-3">
          <Select defaultValue={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nov-2023">Noviembre 2023</SelectItem>
              <SelectItem value="oct-2023">Octubre 2023</SelectItem>
              <SelectItem value="sep-2023">Septiembre 2023</SelectItem>
              <SelectItem value="ago-2023">Agosto 2023</SelectItem>
              <SelectItem value="jul-2023">Julio 2023</SelectItem>
              <SelectItem value="jun-2023">Junio 2023</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Facturación Total</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatearMoneda(estadisticasFacturacion.totalMes)}
          </div>
          <div className="text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{estadisticasFacturacion.variacionMesAnterior}% respecto al mes anterior
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900">
          <div className="text-sm text-gray-500">Promedio por Cliente</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatearMoneda(estadisticasFacturacion.promedioFactura)}
          </div>
          <div className="text-xs text-gray-500">
            {estadisticasFacturacion.facturasEmitidas} facturas emitidas
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900">
          <div className="text-sm text-gray-500">Pendiente de Cobro</div>
          <div className="text-2xl font-bold text-amber-600">
            {formatearMoneda(estadisticasFacturacion.totalPendienteCobro)}
          </div>
          <div className="text-xs text-gray-500">
            {estadisticasFacturacion.facturasPendientes} facturas pendientes
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900">
          <div className="text-sm text-gray-500">Tasa de Morosidad</div>
          <div className="text-2xl font-bold text-green-600">
            {estadisticasFacturacion.tasaMorosidad}%
          </div>
          <div className="text-xs text-gray-500">
            {estadisticasFacturacion.facturasVencidas} facturas vencidas
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="tendencias" className="mb-6">
        <TabsList>
          <TabsTrigger value="tendencias" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Tendencias
          </TabsTrigger>
          <TabsTrigger value="sectores" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            Por Sector
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Por Cliente
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tendencias" className="mt-4">
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Facturación Mensual 2023</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={facturacionMensual}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                    tickMargin={10}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatearMoneda(value), 'Total']}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#f97316" 
                    fillOpacity={1}
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Facturas por Estado</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={facturacionMensual}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="mes" 
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                    />
                    <Tooltip />
                    <Bar dataKey="pagadas" stackId="a" fill="#22c55e" name="Pagadas" />
                    <Bar dataKey="pendientes" stackId="a" fill="#f59e0b" name="Pendientes" />
                    <Bar dataKey="vencidas" stackId="a" fill="#ef4444" name="Vencidas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sectores" className="mt-4">
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Distribución por Sector</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={facturacionPorSector}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 40, bottom: 0 }}
                    >
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis 
                        dataKey="sector" 
                        type="category" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip formatter={(value: number) => [formatearMoneda(value), 'Total']} />
                      <Bar dataKey="total" fill="#f97316" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                {facturacionPorSector.map((sector, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${
                          sector.sector === 'Industrial' ? 'bg-blue-500' : 
                          sector.sector === 'Comercial' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <h4 className="font-medium">{sector.sector}</h4>
                      </div>
                      <div className="text-lg font-bold">{sector.porcentaje}%</div>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total facturado:</span>
                        <span className="font-medium">{formatearMoneda(sector.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Clientes:</span>
                        <span className="font-medium">{sector.clientes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Promedio por cliente:</span>
                        <span className="font-medium">{formatearMoneda(sector.total / sector.clientes)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${
                        sector.sector === 'Industrial' ? 'bg-blue-500' : 
                        sector.sector === 'Comercial' ? 'bg-orange-500' : 'bg-green-500'
                      }`} style={{ width: `${sector.porcentaje}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="clientes" className="mt-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar cliente..."
                className="w-full pl-9 pr-4"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <div>
              <Select value={filtroSector} onValueChange={setFiltroSector}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los sectores</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Residencial">Residencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Facturación</TableHead>
                  <TableHead className="text-center">Facturas</TableHead>
                  <TableHead>Última Factura</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Tendencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.sector}</TableCell>
                    <TableCell className="text-right">{formatearMoneda(cliente.total)}</TableCell>
                    <TableCell className="text-center">{cliente.facturasMes}</TableCell>
                    <TableCell>{cliente.ultimaFactura}</TableCell>
                    <TableCell className="text-center">{renderizarEstadoFactura(cliente.estado)}</TableCell>
                    <TableCell className="text-right">{renderizarTendencia(cliente.tendencia)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {clientesFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron clientes con los filtros actuales.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 