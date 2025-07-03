"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, User } from "lucide-react";
import { useRegistroClientes } from "./hooks/useRegistroClientes";
import { RegistroClientesProps } from "./types";

// Importar componentes modulares (se crearán a continuación)
import { FormularioNuevoCliente } from "./components/FormularioNuevoCliente";
import { ListaClientesExistentes } from "./components/ListaClientesExistentes";
import { DialogoConfirmacion } from "./components/DialogoConfirmacion";
import { EstadoExito } from "./components/EstadoExito";

export function RegistroClientes(props: RegistroClientesProps = {}) {
  const {
    // Estados
    formCliente,
    estadosUI,
    estadoRegistro,
    clientes,
    validacion,
    planes,

    // Acciones
    handleInputChange,
    handlePlanSeleccionado,
    togglePlanExpandido,
    cambiarTab,
    abrirConfirmacion,
    confirmarRegistro,
    copiarCredenciales,
    setEstadosUI,
    setEstadoRegistro,
    actualizarCliente,
    eliminarCliente,
  } = useRegistroClientes(props);

  // Handler para el cambio de tab compatible con Tabs
  const handleTabChange = (value: string) => {
    cambiarTab(value as "nuevo-cliente" | "clientes-existentes");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-orange-600" />
            Registro y Gestión de Clientes
          </CardTitle>
          <CardDescription>
            Administre clientes nuevos y existentes desde un solo lugar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={estadosUI.tabActivo} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="nuevo-cliente"
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Nuevo Cliente
              </TabsTrigger>
              <TabsTrigger
                value="clientes-existentes"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Clientes Existentes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nuevo-cliente" className="space-y-6 mt-6">
              {estadoRegistro.exito ? (
                <EstadoExito
                  cliente={formCliente}
                  onVolverClientes={() => cambiarTab("clientes-existentes")}
                />
              ) : (
                <FormularioNuevoCliente
                  formCliente={formCliente}
                  onInputChange={handleInputChange}
                  planSeleccionado={estadosUI.planSeleccionado}
                  onPlanSeleccionado={handlePlanSeleccionado}
                  validacion={validacion}
                  onRegistrar={abrirConfirmacion}
                  planes={planes}
                  planAbierto={estadosUI.planAbierto}
                  onPlanAbierto={(abierto) =>
                    setEstadosUI((prev) => ({ ...prev, planAbierto: abierto }))
                  }
                  planesExpandidos={estadosUI.planesExpandidos}
                  onTogglePlanExpandido={togglePlanExpandido}
                />
              )}
            </TabsContent>

            <TabsContent value="clientes-existentes" className="space-y-6 mt-6">
              <ListaClientesExistentes
                clientes={clientes}
                onActualizarCliente={actualizarCliente}
                onEliminarCliente={eliminarCliente}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <DialogoConfirmacion
        abierto={estadosUI.confirmarDialogoAbierto}
        onAbierto={(abierto) =>
          setEstadosUI((prev) => ({
            ...prev,
            confirmarDialogoAbierto: abierto,
          }))
        }
        cliente={formCliente}
        passwordTemporal={estadosUI.passwordTemporal}
        enviarCorreo={estadoRegistro.enviarCorreo}
        onEnviarCorreo={(enviar) =>
          setEstadoRegistro((prev) => ({ ...prev, enviarCorreo: enviar }))
        }
        creandoCliente={estadoRegistro.creandoCliente}
        onConfirmar={confirmarRegistro}
        onCopiarCredenciales={copiarCredenciales}
        copiado={estadoRegistro.copiado}
      />
    </div>
  );
}
