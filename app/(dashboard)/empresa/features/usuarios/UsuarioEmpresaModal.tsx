"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  EMPRESA_PERMISSION_ACTIONS,
  EMPRESA_PERMISSION_MODULES,
  getDefaultPermisosEmpresa,
  mergePermisosEmpresa,
} from "@/lib/permissions/empresaPermissions";
import { usuariosEmpresaService } from "@/lib/api/services/usuariosEmpresaService";
import type { PermisosModulo, PermisosRole, UsuarioEmpresa, RoleEmpresa } from "@/types/usuario-empresa";

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
  const [permisos, setPermisos] = useState<PermisosRole>(() => getDefaultPermisosEmpresa("EMPRESA_OPERADOR"));

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
      setPermisos(mergePermisosEmpresa(usuario.permisos, usuario.role));
    } else {
      setFormData({
        nombre: "",
        email: "",
        role: "EMPRESA_OPERADOR",
        telefono: "",
        cargo: "",
        activo: true,
      });
      setPermisos(getDefaultPermisosEmpresa("EMPRESA_OPERADOR"));
    }
  }, [usuario, open]);

  const handleRoleChange = (value: RoleEmpresa) => {
    setFormData({ ...formData, role: value });
    setPermisos(getDefaultPermisosEmpresa(value));
  };

  const togglePermiso = (
    modulo: keyof PermisosRole,
    accion: keyof PermisosModulo,
    checked: boolean
  ) => {
    setPermisos((current) => ({
      ...current,
      [modulo]: {
        ...current[modulo],
        [accion]: checked,
      },
    }));
  };

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
          permisos,
        });
      } else {
        await usuariosEmpresaService.crear({
          nombre: formData.nombre,
          email: formData.email,
          role: formData.role,
          telefono: formData.telefono,
          cargo: formData.cargo,
          permisos,
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              onValueChange={(value) => handleRoleChange(value as RoleEmpresa)}
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

          <div className="space-y-3 rounded-lg border border-border/70 p-4">
            <div>
              <Label className="text-sm font-semibold">Permisos</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Ajusta que modulos puede ver, crear, editar, eliminar o exportar este usuario.
              </p>
            </div>

            <div className="space-y-3">
              {EMPRESA_PERMISSION_MODULES.map((modulo) => (
                <div key={modulo.key} className="grid gap-2 rounded-md bg-muted/30 p-3 md:grid-cols-[130px_1fr] md:items-center">
                  <div className="text-sm font-medium">{modulo.label}</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {EMPRESA_PERMISSION_ACTIONS.map((accion) => (
                      <label key={accion.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Checkbox
                          checked={permisos[modulo.key][accion.key]}
                          onCheckedChange={(checked) => togglePermiso(modulo.key, accion.key, checked === true)}
                        />
                        {accion.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
