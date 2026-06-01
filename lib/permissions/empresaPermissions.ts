import type { PermisosModulo, PermisosRole, RoleEmpresa } from "@/types/usuario-empresa";

export const EMPRESA_PERMISSION_MODULES: Array<{
  key: keyof PermisosRole;
  label: string;
}> = [
  { key: "clientes", label: "Clientes" },
  { key: "dispositivos", label: "Dispositivos" },
  { key: "alertas", label: "Alertas" },
  { key: "boletas", label: "Boletas" },
  { key: "tickets", label: "Tickets" },
  { key: "reportes", label: "Reportes" },
  { key: "configuracion", label: "Configuracion" },
  { key: "usuarios", label: "Usuarios" },
];

export const EMPRESA_PERMISSION_ACTIONS: Array<{
  key: keyof PermisosModulo;
  label: string;
}> = [
  { key: "ver", label: "Ver" },
  { key: "crear", label: "Crear" },
  { key: "editar", label: "Editar" },
  { key: "eliminar", label: "Eliminar" },
  { key: "exportar", label: "Exportar" },
];

const emptyModulo = (): PermisosModulo => ({
  ver: false,
  crear: false,
  editar: false,
  eliminar: false,
  exportar: false,
});

const allModulo = (): PermisosModulo => ({
  ver: true,
  crear: true,
  editar: true,
  eliminar: true,
  exportar: true,
});

export const getDefaultPermisosEmpresa = (role: RoleEmpresa | "empresa" | string): PermisosRole => {
  switch (role) {
    case "empresa":
    case "EMPRESA_ADMIN":
      return {
        clientes: allModulo(),
        dispositivos: allModulo(),
        alertas: allModulo(),
        boletas: allModulo(),
        tickets: allModulo(),
        reportes: allModulo(),
        configuracion: allModulo(),
        usuarios: allModulo(),
      };
    case "EMPRESA_OPERADOR":
      return {
        clientes: { ver: true, crear: true, editar: true, eliminar: false, exportar: false },
        dispositivos: { ver: true, crear: true, editar: true, eliminar: false, exportar: false },
        alertas: { ver: true, crear: true, editar: true, eliminar: false, exportar: false },
        boletas: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        tickets: { ver: true, crear: true, editar: true, eliminar: false, exportar: false },
        reportes: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        configuracion: emptyModulo(),
        usuarios: emptyModulo(),
      };
    case "EMPRESA_SOPORTE":
      return {
        clientes: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        dispositivos: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        alertas: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        boletas: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        tickets: { ver: true, crear: true, editar: true, eliminar: false, exportar: false },
        reportes: emptyModulo(),
        configuracion: emptyModulo(),
        usuarios: emptyModulo(),
      };
    case "EMPRESA_FINANCIERO":
      return {
        clientes: { ver: true, crear: false, editar: false, eliminar: false, exportar: true },
        dispositivos: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        alertas: emptyModulo(),
        boletas: { ver: true, crear: true, editar: true, eliminar: false, exportar: true },
        tickets: { ver: true, crear: false, editar: false, eliminar: false, exportar: false },
        reportes: { ver: true, crear: false, editar: false, eliminar: false, exportar: true },
        configuracion: emptyModulo(),
        usuarios: emptyModulo(),
      };
    default:
      return {
        clientes: emptyModulo(),
        dispositivos: emptyModulo(),
        alertas: emptyModulo(),
        boletas: emptyModulo(),
        tickets: emptyModulo(),
        reportes: emptyModulo(),
        configuracion: emptyModulo(),
        usuarios: emptyModulo(),
      };
  }
};

export const mergePermisosEmpresa = (
  permisos: Partial<PermisosRole> | undefined,
  role: RoleEmpresa | "empresa" | string
): PermisosRole => {
  const defaults = getDefaultPermisosEmpresa(role);
  return EMPRESA_PERMISSION_MODULES.reduce((acc, module) => {
    acc[module.key] = {
      ...defaults[module.key],
      ...(permisos?.[module.key] || {}),
    };
    return acc;
  }, {} as PermisosRole);
};

export const hasEmpresaPermission = (
  permisos: Partial<PermisosRole> | undefined,
  module: keyof PermisosRole,
  action: keyof PermisosModulo,
  role?: string
) => {
  if (role === "empresa") return true;
  return Boolean(permisos?.[module]?.[action]);
};
