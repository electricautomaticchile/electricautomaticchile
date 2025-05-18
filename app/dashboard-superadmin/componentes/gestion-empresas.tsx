"use client";
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Search, Building2, Loader2 } from 'lucide-react';

interface Empresa {
  id: string;
  nombre: string;
  rut: string;
  contacto: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  estado: 'activo' | 'suspendido' | 'inactivo';
}

interface ClienteDB {
  _id: string;
  nombre: string;
  correo: string;
  telefono: string;
  empresa?: string;
  rut: string;
  numeroCliente: string;
  direccion: string;
  fechaRegistro: Date;
  esActivo: boolean;
  passwordTemporal?: string;
  role: string;
  planSeleccionado?: string;
  montoMensual?: number;
  notas?: string;
}

interface GestionEmpresasProps {
  reducida?: boolean;
}

export function GestionEmpresas({ reducida = false }: GestionEmpresasProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaActual, setEmpresaActual] = useState<Empresa | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar datos reales de clientes empresas desde MongoDB
  useEffect(() => {
    async function cargarClientesEmpresas() {
      try {
        setCargando(true);
        setError(null);
        
        // Realizamos la petición a nuestra API
        const respuesta = await fetch('/api/cliente/listar');
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar los clientes empresas');
        }
        
        const data = await respuesta.json();
        
        // Convertimos los datos de MongoDB al formato que usa nuestro componente
        const empresasFormateadas: Empresa[] = data.clientes.map((cliente: ClienteDB) => ({
          id: cliente._id,
          nombre: cliente.empresa || cliente.nombre, // Usamos el nombre de la empresa si existe, sino el nombre del contacto
          rut: cliente.rut || 'No registrado',
          contacto: cliente.nombre,
          email: cliente.correo,
          telefono: cliente.telefono || 'No registrado',
          fechaRegistro: new Date(cliente.fechaRegistro).toLocaleDateString('es-CL'),
          estado: cliente.esActivo ? 'activo' : 'inactivo'
        }));
        
        setEmpresas(empresasFormateadas);
      } catch (err) {
        console.error('Error al cargar los clientes:', err);
        setError('No se pudieron cargar los clientes.');
        // Mientras no exista el endpoint, usamos datos de ejemplo
        setEmpresas([
          {
            id: '1',
            nombre: 'Constructora Santiago S.A.',
            rut: '76.123.456-7',
            contacto: 'María González',
            email: 'contacto@constructorasantiago.cl',
            telefono: '+56 2 2345 6789',
            fechaRegistro: '15/01/2025',
            estado: 'activo'
          },
          {
            id: '2',
            nombre: 'Inmobiliaria Norte Grande',
            rut: '77.234.567-8',
            contacto: 'Carlos Martínez',
            email: 'cmartinez@inmobiliarianorte.cl',
            telefono: '+56 2 3456 7890',
            fechaRegistro: '22/03/2023',
            estado: 'activo'
          },
          {
            id: '3',
            nombre: 'Hotel Costa Pacífico',
            rut: '78.345.678-9',
            contacto: 'Ana Rodríguez',
            email: 'gerencia@hotelcostap.cl',
            telefono: '+56 32 296 7845',
            fechaRegistro: '10/05/2023',
            estado: 'suspendido'
          }
        ]);
      } finally {
        setCargando(false);
      }
    }
    
    cargarClientesEmpresas();
  }, []);

  // Filtrar empresas según la búsqueda
  const empresasFiltradas = empresas.filter(empresa => 
    empresa.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    empresa.rut.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir formulario para crear nueva empresa
  const abrirFormularioNuevo = () => {
    setEmpresaActual({
      id: '',
      nombre: '',
      rut: '',
      contacto: '',
      email: '',
      telefono: '',
      fechaRegistro: new Date().toLocaleDateString('es-CL'),
      estado: 'activo'
    });
    setModoEdicion(false);
    setModalAbierto(true);
  };

  // Abrir formulario para editar empresa existente
  const abrirFormularioEditar = (empresa: Empresa) => {
    setEmpresaActual(empresa);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  // Guardar empresa (nueva o editada)
  const guardarEmpresa = () => {
    if (!empresaActual) return;
    
    if (modoEdicion) {
      // Actualizar empresa existente
      setEmpresas(empresas.map(emp => 
        emp.id === empresaActual.id ? empresaActual : emp
      ));
    } else {
      // Crear nueva empresa
      const nuevaEmpresa = {
        ...empresaActual,
        id: `${empresas.length + 1}` // En una implementación real, esto sería generado por el backend
      };
      setEmpresas([...empresas, nuevaEmpresa]);
    }
    
    setModalAbierto(false);
    setEmpresaActual(null);
  };

  // Eliminar empresa
  const eliminarEmpresa = (id: string) => {
    // En una implementación real, confirmaríamos con el usuario antes de eliminar
    setEmpresas(empresas.filter(empresa => empresa.id !== id));
  };

  // Actualizar campo de empresa en edición
  const actualizarCampo = (campo: keyof Empresa, valor: string) => {
    if (empresaActual) {
      setEmpresaActual({
        ...empresaActual,
        [campo]: valor
      });
    }
  };

  if (reducida) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            Empresas Cliente
          </h2>
          <Button size="sm" variant="outline" onClick={() => abrirFormularioNuevo()}>
            <PlusCircle className="h-4 w-4 mr-1" /> Agregar
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
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresasFiltradas.slice(0, 3).map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.nombre}</TableCell>
                    <TableCell>{empresa.rut}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        empresa.estado === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        empresa.estado === 'suspendido' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {empresa.estado.charAt(0).toUpperCase() + empresa.estado.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => abrirFormularioEditar(empresa)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => eliminarEmpresa(empresa.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {empresasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No se encontraron empresas cliente registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {empresasFiltradas.length > 3 && (
              <div className="mt-2 text-center">
                <Button variant="link" size="sm" className="text-orange-600">
                  Ver todas las empresas
                </Button>
              </div>
            )}
          </>
        )}

        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modoEdicion ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {empresaActual && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre de la empresa</Label>
                      <Input 
                        id="nombre" 
                        value={empresaActual.nombre} 
                        onChange={(e) => actualizarCampo('nombre', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT</Label>
                      <Input 
                        id="rut" 
                        value={empresaActual.rut} 
                        onChange={(e) => actualizarCampo('rut', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contacto">Persona de contacto</Label>
                      <Input 
                        id="contacto" 
                        value={empresaActual.contacto} 
                        onChange={(e) => actualizarCampo('contacto', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={empresaActual.email} 
                        onChange={(e) => actualizarCampo('email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input 
                      id="telefono" 
                      value={empresaActual.telefono} 
                      onChange={(e) => actualizarCampo('telefono', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={guardarEmpresa}>
                {modoEdicion ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Vista completa (no reducida)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-orange-600" />
          Gestión de Empresas Cliente
        </h2>
        <Button onClick={() => abrirFormularioNuevo()}>
          <PlusCircle className="h-4 w-4 mr-2" /> Registrar Empresa
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
        <Search className="h-5 w-5 text-gray-500 ml-2" />
        <Input 
          className="border-0 focus-visible:ring-0 h-9"
          placeholder="Buscar por nombre o RUT..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
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
                <TableHead>Empresa</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fecha registro</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresasFiltradas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-medium">{empresa.nombre}</TableCell>
                  <TableCell>{empresa.rut}</TableCell>
                  <TableCell>
                    <div>{empresa.contacto}</div>
                    <div className="text-sm text-gray-500">{empresa.email}</div>
                  </TableCell>
                  <TableCell>{empresa.fechaRegistro}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      empresa.estado === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      empresa.estado === 'suspendido' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {empresa.estado.charAt(0).toUpperCase() + empresa.estado.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => abrirFormularioEditar(empresa)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => eliminarEmpresa(empresa.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {empresasFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-gray-500">
                    No se encontraron empresas que coincidan con la búsqueda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modoEdicion ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {empresaActual && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la empresa</Label>
                    <Input 
                      id="nombre" 
                      value={empresaActual.nombre} 
                      onChange={(e) => actualizarCampo('nombre', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT</Label>
                    <Input 
                      id="rut" 
                      value={empresaActual.rut} 
                      onChange={(e) => actualizarCampo('rut', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contacto">Persona de contacto</Label>
                    <Input 
                      id="contacto" 
                      value={empresaActual.contacto} 
                      onChange={(e) => actualizarCampo('contacto', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={empresaActual.email} 
                      onChange={(e) => actualizarCampo('email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input 
                    id="telefono" 
                    value={empresaActual.telefono} 
                    onChange={(e) => actualizarCampo('telefono', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select 
                    id="estado"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={empresaActual.estado}
                    onChange={(e) => actualizarCampo('estado', e.target.value as 'activo' | 'suspendido' | 'inactivo')}
                  >
                    <option value="activo">Activo</option>
                    <option value="suspendido">Suspendido</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={guardarEmpresa}>
              {modoEdicion ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 