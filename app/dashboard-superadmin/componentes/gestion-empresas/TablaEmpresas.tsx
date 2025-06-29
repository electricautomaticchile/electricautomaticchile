"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
} from "lucide-react";
import { IEmpresa } from "./types";

interface TablaEmpresasProps {
  empresas: IEmpresa[];
  cargando: boolean;
  onVerDetalle: (empresa: IEmpresa) => void;
  onCambiarEstado: (
    id: string,
    estado: "activo" | "suspendido" | "inactivo",
    motivo?: string
  ) => void;
  onResetearPassword: (id: string) => void;
}

export function TablaEmpresas({
  empresas,
  cargando,
  onVerDetalle,
  onCambiarEstado,
  onResetearPassword,
}: TablaEmpresasProps) {
  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      suspendido:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      inactivo: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };

    return (
      <Badge
        className={
          variants[estado as keyof typeof variants] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }
      >
        {estado}
      </Badge>
    );
  };

  const handleCambiarEstado = (
    empresa: IEmpresa,
    nuevoEstado: "activo" | "suspendido" | "inactivo"
  ) => {
    let motivo: string | undefined;

    if (nuevoEstado === "suspendido") {
      const motivoInput = prompt("Ingrese el motivo de la suspensión:");
      if (motivoInput === null) return; // Usuario canceló
      motivo = motivoInput || undefined;
    }

    onCambiarEstado(empresa._id, nuevoEstado, motivo);
  };

  if (cargando) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Región</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
            No hay empresas registradas
          </h3>
          <p className="text-sm">Crea la primera empresa para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold">Empresa</TableHead>
              <TableHead className="font-semibold">RUT</TableHead>
              <TableHead className="font-semibold">Correo</TableHead>
              <TableHead className="font-semibold">Región</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Fecha Creación</TableHead>
              <TableHead className="font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((empresa) => (
              <TableRow
                key={empresa._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {empresa.nombreEmpresa}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      N° Cliente: {empresa.numeroCliente}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {empresa.rut}
                </TableCell>
                <TableCell className="text-sm">{empresa.correo}</TableCell>
                <TableCell className="text-sm">{empresa.region}</TableCell>
                <TableCell>{getEstadoBadge(empresa.estado)}</TableCell>
                <TableCell className="text-sm">
                  {new Date(empresa.fechaCreacion).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => onVerDetalle(empresa)}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onResetearPassword(empresa._id)}
                        className="cursor-pointer"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Resetear contraseña
                      </DropdownMenuItem>

                      {empresa.estado === "activo" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleCambiarEstado(empresa, "suspendido")
                          }
                          className="cursor-pointer text-yellow-600"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Suspender
                        </DropdownMenuItem>
                      )}

                      {empresa.estado === "suspendido" && (
                        <DropdownMenuItem
                          onClick={() => handleCambiarEstado(empresa, "activo")}
                          className="cursor-pointer text-green-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Activar
                        </DropdownMenuItem>
                      )}

                      {empresa.estado !== "inactivo" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleCambiarEstado(empresa, "inactivo")
                          }
                          className="cursor-pointer text-red-600"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Desactivar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden space-y-3">
        {empresas.map((empresa) => (
          <div
            key={empresa._id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-background"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                  {empresa.nombreEmpresa}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  N° Cliente: {empresa.numeroCliente}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getEstadoBadge(empresa.estado)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => onVerDetalle(empresa)}
                      className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onResetearPassword(empresa._id)}
                      className="cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Resetear contraseña
                    </DropdownMenuItem>

                    {empresa.estado === "activo" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleCambiarEstado(empresa, "suspendido")
                        }
                        className="cursor-pointer text-yellow-600"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Suspender
                      </DropdownMenuItem>
                    )}

                    {empresa.estado === "suspendido" && (
                      <DropdownMenuItem
                        onClick={() => handleCambiarEstado(empresa, "activo")}
                        className="cursor-pointer text-green-600"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Activar
                      </DropdownMenuItem>
                    )}

                    {empresa.estado !== "inactivo" && (
                      <DropdownMenuItem
                        onClick={() => handleCambiarEstado(empresa, "inactivo")}
                        className="cursor-pointer text-red-600"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Desactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  RUT:
                </span>
                <span className="font-mono">{empresa.rut}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Correo:
                </span>
                <span className="text-right truncate ml-2 max-w-[60%]">
                  {empresa.correo}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Región:
                </span>
                <span className="text-right ml-2">{empresa.region}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Creación:
                </span>
                <span>
                  {new Date(empresa.fechaCreacion).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
