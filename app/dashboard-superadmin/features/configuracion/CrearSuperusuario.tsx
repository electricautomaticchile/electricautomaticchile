"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService, ICrearSuperusuario } from "@/lib/api/apiService";

interface SuperusuarioCreado {
  numeroCliente: string;
  correo: string;
  nombre: string;
}

interface CrearSuperusuarioProps {
  superusuarioCreado: SuperusuarioCreado | null;
  setSuperusuarioCreado: (usuario: SuperusuarioCreado | null) => void;
}

export function CrearSuperusuario({
  superusuarioCreado,
  setSuperusuarioCreado,
}: CrearSuperusuarioProps) {
  const [creandoSuperusuario, setCreandoSuperusuario] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState<ICrearSuperusuario>({
    nombre: "",
    correo: "",
    password: "",
    telefono: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarFormulario = (): boolean => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.correo.trim()) {
      toast({
        title: "Error",
        description: "El correo es requerido.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      toast({
        title: "Error",
        description: "El correo no tiene un formato válido.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Error",
        description: "La contraseña es requerida.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const crearSuperusuario = async () => {
    if (!validarFormulario()) return;

    setCreandoSuperusuario(true);

    try {
      const response = await apiService.crearSuperusuario(formData);

      if (response.success && response.data) {
        const responseWithCredentials = response as any;
        setSuperusuarioCreado({
          numeroCliente: responseWithCredentials.credenciales.numeroCliente,
          correo: responseWithCredentials.credenciales.correo,
          nombre: responseWithCredentials.data.nombre,
        });

        toast({
          title: "Éxito",
          description: "Superusuario creado correctamente.",
        });

        // Limpiar formulario
        setFormData({
          nombre: "",
          correo: "",
          password: "",
          telefono: "",
        });
        setMostrarFormulario(false);
      } else {
        toast({
          title: "Error",
          description: response.error || "No se pudo crear el superusuario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al crear superusuario:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el superusuario. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setCreandoSuperusuario(false);
    }
  };

  if (superusuarioCreado) {
    return (
      <div className="rounded-md border border-green-200 bg-green-100 p-4 dark:border-green-800 dark:bg-green-950/50 my-4">
        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
          ¡Superusuario creado con éxito!
        </h4>
        <p className="text-sm text-green-800 dark:text-green-300 mb-2">
          Guarde estas credenciales en un lugar seguro:
        </p>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md text-sm font-mono">
          <p>
            <strong>Nombre:</strong> {superusuarioCreado.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {superusuarioCreado.correo}
          </p>
          <p>
            <strong>Número de cliente:</strong>{" "}
            {superusuarioCreado.numeroCliente}
          </p>
        </div>
        <p className="text-sm text-green-800 dark:text-green-300 mt-2">
          Utilice estas credenciales para acceder al dashboard de superadmin.
        </p>
        <Button
          className="mt-4 bg-green-600 hover:bg-green-700"
          onClick={() => setSuperusuarioCreado(null)}
        >
          Cerrar
        </Button>
      </div>
    );
  }

  if (!mostrarFormulario) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Crea un nuevo superusuario con acceso al dashboard de administración.
          Este usuario tendrá permisos completos en todo el sistema.
        </p>

        <Button
          onClick={() => setMostrarFormulario(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Crear Superusuario
          <UserPlus className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Crear Nuevo Superusuario</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo *</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Correo electrónico *</Label>
          <Input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleInputChange}
            placeholder="Ej: juan@empresa.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mínimo 8 caracteres"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono (opcional)</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleInputChange}
            placeholder="Ej: +56 9 1234 5678"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={crearSuperusuario}
          className="bg-green-600 hover:bg-green-700"
          disabled={creandoSuperusuario}
        >
          {creandoSuperusuario ? "Creando..." : "Crear Superusuario"}
          <UserPlus className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={() => setMostrarFormulario(false)}
          variant="outline"
          disabled={creandoSuperusuario}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
