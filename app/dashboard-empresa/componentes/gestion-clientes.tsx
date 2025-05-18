"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Search, Filter, ChevronDown, Check, MoreHorizontal, Mail, Phone } from 'lucide-react';

// Ejemplo de datos de clientes
const clientesEjemplo = [
  {
    id: '001',
    nombre: 'Residencial Parque Central',
    tipo: 'residencial',
    direccion: 'Av. Los Leones 2500, Las Condes',
    contacto: 'Juan Pérez',
    email: 'juan.perez@example.com',
    telefono: '+56 9 1234 5678',
    estado: 'activo',
    consumoMensual: 4250,
    dispositivosActivos: 42
  },
  {
    id: '002',
    nombre: 'Edificio Las Condes View',
    tipo: 'residencial',
    direccion: 'Av. Apoquindo 4400, Las Condes',
    contacto: 'María Rodríguez',
    email: 'maria.rodriguez@example.com',
    telefono: '+56 9 8765 4321',
    estado: 'activo',
    consumoMensual: 5600,
    dispositivosActivos: 58
  },
  {
    id: '003',
    nombre: 'Centro Comercial Alameda',
    tipo: 'comercial',
    direccion: 'Alameda 1500, Santiago',
    contacto: 'Carlos González',
    email: 'carlos.gonzalez@example.com',
    telefono: '+56 9 2345 6789',
    estado: 'pausado',
    consumoMensual: 12500,
    dispositivosActivos: 85
  },
  {
    id: '004',
    nombre: 'Torre Empresarial Costanera',
    tipo: 'comercial',
    direccion: 'Costanera Norte 2500, Vitacura',
    contacto: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    telefono: '+56 9 3456 7890',
    estado: 'activo',
    consumoMensual: 18700,
    dispositivosActivos: 120
  },
  {
    id: '005',
    nombre: 'Condominio Vista Río',
    tipo: 'residencial',
    direccion: 'Av. Manquehue Sur 1200, Las Condes',
    contacto: 'Pedro Silva',
    email: 'pedro.silva@example.com',
    telefono: '+56 9 4567 8901',
    estado: 'activo',
    consumoMensual: 3800,
    dispositivosActivos: 35
  }
];

const resumenClientes = {
  total: 24,
  activos: 22,
  pausados: 2,
  nuevosEsteAno: 5,
  dispositivosTotales: 625,
  consumoPromedio: 6250
};

interface GestionClientesProps {
  reducida?: boolean;
}

export function GestionClientes({ reducida = false }: GestionClientesProps) {
  // Si es la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Activos</div>
            <div className="text-xl font-bold text-green-600">{resumenClientes.activos}</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Pausados</div>
            <div className="text-xl font-bold text-amber-600">{resumenClientes.pausados}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {clientesEjemplo.slice(0, 3).map((cliente, index) => (
            <div key={index} className="p-2 border border-gray-100 dark:border-gray-800 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{cliente.nombre}</div>
                  <div className="text-xs text-gray-500">{cliente.tipo} • ID: {cliente.id}</div>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  cliente.estado === 'activo' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                }`}>
                  {cliente.estado === 'activo' ? 'Activo' : 'Pausado'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Versión completa del componente
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-orange-600" />
            Gestión de Clientes
          </h2>
          <p className="text-gray-500 mt-1">
            Administre los clientes finales de su empresa
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Agregar Cliente
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumen de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total clientes</div>
                <div className="text-2xl font-bold text-orange-600">{resumenClientes.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Clientes activos</div>
                <div className="text-2xl font-bold text-green-600">{resumenClientes.activos}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dispositivos</div>
                <div className="text-2xl font-bold">{resumenClientes.dispositivosTotales}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Nuevos (2023)</div>
                <div className="text-2xl font-bold text-blue-600">{resumenClientes.nuevosEsteAno}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Consumo Promedio</CardTitle>
            <CardDescription>Consumo mensual promedio por cliente (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="text-4xl font-bold text-orange-600">
              {resumenClientes.consumoPromedio.toLocaleString('es-CL')} <span className="text-base text-gray-500">kWh</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3">Contacto</th>
              <th scope="col" className="px-6 py-3">Consumo</th>
              <th scope="col" className="px-6 py-3">Dispositivos</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesEjemplo.map((cliente, index) => (
              <tr 
                key={index} 
                className="bg-white border-b dark:bg-slate-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <td className="px-6 py-4 font-medium">
                  <div>{cliente.nombre}</div>
                  <div className="text-xs text-gray-500">{cliente.direccion}</div>
                </td>
                <td className="px-6 py-4 capitalize">{cliente.tipo}</td>
                <td className="px-6 py-4">
                  <div>{cliente.contacto}</div>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {cliente.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {cliente.telefono}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{cliente.consumoMensual.toLocaleString('es-CL')} kWh</td>
                <td className="px-6 py-4">{cliente.dispositivosActivos}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    cliente.estado === 'activo' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    <Check className={`h-3 w-3 mr-1 ${cliente.estado === 'activo' ? 'opacity-100' : 'opacity-0'}`} />
                    {cliente.estado === 'activo' ? 'Activo' : 'Pausado'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {clientesEjemplo.length} de {resumenClientes.total} clientes
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>
    </div>
  );
} 