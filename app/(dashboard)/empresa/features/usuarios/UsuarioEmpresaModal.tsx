"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usuariosEmpresaService } from "@/lib/api/services/usuariosEmpresaService";
import type { UsuarioEmpresa, RoleEmpresa } from "@/types/usuario-empresa";

interface UsuarioEmpresaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuario: UsuarioEmpresa | null;
}

export function UsuarioEmpresaModal({ open, onClose, onSuccess, usuario }: UsuarioEmpresaModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    role: "EMPRESA_OPERADOR" as RoleEmpresa,
    telefono: "",
    cargo: "",
    activo: true,
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
        telefono: usuario.telefono || "",
        cargo: usuario.cargo || "",
        activo: usuario.activo,
      });
    } else {
      setFormData({
        nombre: "",
        email: "",
        role: "EMPRESA_OPERADOR",
        telefono: "",
        cargo: "",
        activo: true,
      });
    }
  }, [usuario, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (usuario) {
        await usuariosEmpresaService.actualizar(usuario.id, {
          nombre: formData.nombre,
          telefono: formData.telefono,
          cargo: formData.cargo,
          role: formData.role,
          activo: formData.activo,
        });
      } else {
        await usuariosEmpresaService.crear({
          nombre: formData.nombre,
          email: formData.email,
          role: formData.role,
          telefono: formData.telefono,
          cargo: formData.cargo,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error guardando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!usuario}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as RoleEmpresa })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPRESA_ADMIN">Administrador</SelectItem>
                <SelectItem value="EMPRESA_OPERADOR">Operador</SelectItem>
                <SelectItem value="EMPRESA_SOPORTE">Soporte</SelectItem>
                <SelectItem value="EMPRESA_FINANCIERO">Financiero</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>

          {usuario && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="activo">Usuario activo</Label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
