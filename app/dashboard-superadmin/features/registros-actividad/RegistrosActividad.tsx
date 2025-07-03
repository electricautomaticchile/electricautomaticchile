"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Activity, Search, UserCog, Building2, Shield, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCcw, Loader2 } from 'lucide-react';

interface Actividad {
  id: string;
  timestamp: string;
  usuario: string;
  tipoUsuario: string;
  empresa: string;
  accion: string;
  modulo: string;
  severidad: 'alta' | 'media' | 'baja';
  resultado: 'exitoso' | 'fallido';
  ip: string;
}

interface EstadisticasActividad {
  totalAcciones: number;
  exitosas: number;
  fallidas: number;
  alertasSeguridad: number;
  sesionesActivas: number;
  actividadHoy: number;
  empresaMasActiva: string;
}

interface RegistrosActividadProps {
  reducida?: boolean;
}

export function RegistrosActividad({ reducida = false }: RegistrosActividadProps) {
  const [registros, setRegistros] = useState<Actividad[]>([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<Actividad[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasActividad>({
    totalAcciones: 0,
    exitosas: 0,
    fallidas: 0,
    alertasSeguridad: 0,
    sesionesActivas: 0,
    actividadHoy: 0,
    empresaMasActiva: ''
  });
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroSeveridad, setFiltroSeveridad] = useState('todas');
  const [filtroResultado, setFiltroResultado] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar datos de la API
  useEffect(() => {
    async function cargarRegistros() {
      try {
        setCargando(true);
        setError(null);
        
        // Construir URL con parámetros de filtro
        const params = new URLSearchParams();
        if (busqueda) params.append('busqueda', busqueda);
        if (filtroSeveridad !== 'todas') params.append('severidad', filtroSeveridad);
        if (filtroResultado !== 'todos') params.append('resultado', filtroResultado);
        
        // Hacer petición a la API
        const respuesta = await fetch(`/api/actividad/listar?${params}`);
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar los registros de actividad');
        }
        
        const datos = await respuesta.json();
        
        // Actualizar estado con los datos recibidos
        setRegistros(datos.actividades || []);
        setRegistrosFiltrados(datos.actividades || []);
        setEstadisticas(datos.estadisticas || {
          totalAcciones: 0,
          exitosas: 0,
          fallidas: 0,
          alertasSeguridad: 0,
          sesionesActivas: 0,
          actividadHoy: 0,
          empresaMasActiva: 'No hay datos'
        });
        
      } catch (error) {
        console.error('Error al cargar los registros:', error);
        setError('No se pudieron cargar los registros de actividad.');
        
        // Datos de ejemplo para modo fallback
        const registrosEjemplo = [
          {
            id: '1542',
            timestamp: '15/11/2023 19:45:32',
            usuario: 'admin@eauto.cl',
            tipoUsuario: 'superadmin',
            empresa: 'Electric Automatic Chile',
            accion: 'Actualización configuración global de seguridad',
            modulo: 'Seguridad',
            severidad: 'alta',
            resultado: 'exitoso',
            ip: '186.54.32.112'
          },
          {
            id: '1541',
            timestamp: '15/11/2023 18:32:15',
            usuario: 'gerente@constructorasantiago.cl',
            tipoUsuario: 'admin_empresa',
            empresa: 'Constructora Santiago S.A.',
            accion: 'Registro nuevo cliente',
            modulo: 'Clientes',
            severidad: 'media',
            resultado: 'exitoso',
            ip: '190.45.87.123'
          },
          {
            id: '1540',
            timestamp: '15/11/2023 17:15:48',
            usuario: 'soporte@eauto.cl',
            tipoUsuario: 'soporte',
            empresa: 'Electric Automatic Chile',
            accion: 'Actualización firmware dispositivos',
            modulo: 'Dispositivos',
            severidad: 'alta',
            resultado: 'exitoso',
            ip: '186.54.32.115'
          }
        ];
        
        setRegistros(registrosEjemplo as any);
        setRegistrosFiltrados(registrosEjemplo as any);
        setEstadisticas({
          totalAcciones: 1542,
          exitosas: 1428,
          fallidas: 114,
          alertasSeguridad: 27,
          sesionesActivas: 42,
          actividadHoy: 87,
          empresaMasActiva: 'Constructora Santiago S.A.'
        });
      } finally {
        setCargando(false);
      }
    }
    
    cargarRegistros();
  }, [busqueda, filtroSeveridad, filtroResultado]);
  
  // Renderizar badge de tipo de usuario
  const renderizarTipoUsuario = (tipo: string) => {
    switch (tipo) {
      case 'superadmin':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Shield className="h-3 w-3 mr-1" />
            Superadmin
          </div>
        );
      case 'admin_empresa':
      case 'empresa':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Building2 className="h-3 w-3 mr-1" />
            Admin Empresa
          </div>
        );
      case 'soporte':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <UserCog className="h-3 w-3 mr-1" />
            Soporte
          </div>
        );
      case 'tecnico':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <UserCog className="h-3 w-3 mr-1" />
            Técnico
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <UserCog className="h-3 w-3 mr-1" />
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </div>
        );
    }
  };
  
  // Renderizar badge de severidad
  const renderizarSeveridad = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alta
          </div>
        );
      case 'media':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Media
          </div>
        );
      case 'baja':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Baja
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {severidad.charAt(0).toUpperCase() + severidad.slice(1)}
          </div>
        );
    }
  };
  
  // Renderizar badge de resultado
  const renderizarResultado = (resultado: string) => {
    switch (resultado) {
      case 'exitoso':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Exitoso
          </div>
        );
      case 'fallido':
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Fallido
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            {resultado.charAt(0).toUpperCase() + resultado.slice(1)}
          </div>
        );
    }
  };
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Actividad Reciente
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/dashboard-superadmin?vista=registros-actividad'}
            className="text-orange-600"
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" />
            Actualizar
          </Button>
        </div>
        
        {cargando ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hoy</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.actividadHoy}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Alertas</p>
                  <p className="text-2xl font-bold text-red-500">{estadisticas.alertasSeguridad}</p>
                </CardContent>
              </Card>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.slice(0, 4).map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{registro.usuario.split('@')[0]}</span>
                        {renderizarTipoUsuario(registro.tipoUsuario)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={registro.accion}>
                        {registro.accion}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {registro.modulo}
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderizarResultado(registro.resultado)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  // Vista completa (no reducida)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-orange-600" />
          Registros de Actividad
        </h2>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="text-orange-600"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{estadisticas.totalAcciones.toLocaleString()}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Acciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{estadisticas.exitosas.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Exitosas</p>
            </div>
            <div className="h-8 border-l border-gray-200 dark:border-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{estadisticas.fallidas.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fallidas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-center gap-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{estadisticas.actividadHoy.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hoy</p>
            </div>
            <div className="h-8 border-l border-gray-200 dark:border-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{estadisticas.sesionesActivas.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sesiones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Empresa más activa</div>
            <div className="text-lg font-bold truncate" title={estadisticas.empresaMasActiva}>
              {estadisticas.empresaMasActiva}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              className="w-full pl-10" 
              placeholder="Buscar por usuario, acción, empresa..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filtroSeveridad} onValueChange={setFiltroSeveridad}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filtroResultado} onValueChange={setFiltroResultado}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Resultado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="exitoso">Exitoso</SelectItem>
              <SelectItem value="fallido">Fallido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {cargando ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-white dark:bg-slate-800 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                <TableHead className="w-[150px]">Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="w-[100px]">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrosFiltrados.slice(0, 20).map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="whitespace-nowrap">{registro.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{registro.usuario.split('@')[0]}</span>
                      {renderizarTipoUsuario(registro.tipoUsuario)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={registro.accion}>
                      {registro.accion}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {registro.empresa}
                    </div>
                  </TableCell>
                  <TableCell>{registro.modulo}</TableCell>
                  <TableCell>{renderizarSeveridad(registro.severidad)}</TableCell>
                  <TableCell>{renderizarResultado(registro.resultado)}</TableCell>
                  <TableCell className="font-mono text-xs">{registro.ip}</TableCell>
                </TableRow>
              ))}
              
              {registrosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    No se encontraron registros que coincidan con los criterios de búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 