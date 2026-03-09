"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usuariosEmpresaService } from "@/lib/api/services/usuariosEmpresaService";
import { Users, Plus, Pencil, Trash2, Shield } from "lucide-react";
import type { UsuarioEmpresa } from "@/types/usuario-empresa";
import { UsuarioEmpresaModal } from "../features/usuarios/UsuarioEmpresaModal";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<UsuarioEmpresa | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await usuariosEmpresaService.obtenerTodos();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setUsuarioEditar(null);
    setModalOpen(true);
  };

  const handleEditar = (usuario: UsuarioEmpresa) => {
    setUsuarioEditar(usuario);
    setModalOpen(true);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await usuariosEmpresaService.eliminar(id);
      cargarUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      EMPRESA_ADMIN: { label: "Administrador", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
      EMPRESA_OPERADOR: { label: "Operador", color: "bg-white/10 text-white/70 border border-white/20" },
      EMPRESA_SOPORTE: { label: "Soporte", color: "bg-orange-500/10 text-orange-300 border border-orange-500/20" },
      EMPRESA_FINANCIERO: { label: "Financiero", color: "bg-white/10 text-white/60 border border-white/20" },
    };

    const roleInfo = roles[role] || { label: role, color: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
        {roleInfo.label}
      </span>
    );
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios de tu empresa
          </p>
        </div>
        <Button onClick={handleNuevo} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{usuario.nombre}</h3>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    {usuario.cargo && (
                      <p className="text-xs text-gray-500">{usuario.cargo}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getRoleBadge(usuario.role)}
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      usuario.activo 
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30" 
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditar(usuario)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminar(usuario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {usuarios.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay usuarios registrados</p>
              <Button onClick={handleNuevo} className="mt-4">
                Crear primer usuario
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <UsuarioEmpresaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setUsuarioEditar(null);
        }}
        onSuccess={cargarUsuarios}
        usuario={usuarioEditar}
      />
    </div>
  );
}
