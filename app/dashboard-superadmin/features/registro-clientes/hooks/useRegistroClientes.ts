import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  FormularioCliente,
  Cliente,
  EstadoRegistro,
  EstadosUI,
  RegistroClientesProps,
  ValidacionFormulario,
  CotizacionInicial,
} from "../types";
import {
  PLANES_SERVICIO,
  CLIENTES_EJEMPLO,
  GENERACION_CONFIG,
  UI_CONFIG,
  MENSAJES,
} from "../config";
import {
  validarFormularioCompleto,
  limpiarDatosFormulario,
} from "../utils/validaciones";
import { crearCliente, enviarConfirmacion } from "../utils/clienteApi";

export function useRegistroClientes({
  cotizacionInicial,
  onComplete,
}: RegistroClientesProps = {}) {
  const { toast } = useToast();

  // Estados del formulario
  const [formCliente, setFormCliente] = useState<FormularioCliente>({
    numeroCliente: generarNumeroCliente(),
    nombre: cotizacionInicial?.nombre || "",
    correo: cotizacionInicial?.correo || "",
    telefono: cotizacionInicial?.telefono || "",
    empresa: cotizacionInicial?.empresa || "",
    rut: "",
    direccion: "",
    planSeleccionado: cotizacionInicial?.planSugerido || "",
    montoMensual: cotizacionInicial?.montoMensual || 0,
    notas: "",
  });

  // Estados de UI
  const [estadosUI, setEstadosUI] = useState<EstadosUI>({
    tabActivo: UI_CONFIG.tabs.default,
    planAbierto: false,
    planSeleccionado: cotizacionInicial?.planSugerido || "",
    planesExpandidos: {},
    confirmarDialogoAbierto: false,
    passwordTemporal: "",
  });

  // Estados de registro
  const [estadoRegistro, setEstadoRegistro] = useState<EstadoRegistro>({
    creandoCliente: false,
    exito: false,
    copiado: false,
    enviarCorreo: true,
  });

  // Lista de clientes (en producción vendría de API)
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_EJEMPLO);

  // Validación del formulario
  const validacion: ValidacionFormulario =
    validarFormularioCompleto(formCliente);

  // Generar número de cliente único
  function generarNumeroCliente(): string {
    const numero = Math.floor(
      GENERACION_CONFIG.numeroCliente.rangoMinimo +
        Math.random() *
          (GENERACION_CONFIG.numeroCliente.rangoMaximo -
            GENERACION_CONFIG.numeroCliente.rangoMinimo)
    );
    const verificador = Math.floor(Math.random() * 10);
    return `${numero}-${verificador}`;
  }

  // Generar contraseña aleatoria segura
  const generarPasswordAleatorio = useCallback((): string => {
    const { longitud, caracteres } = GENERACION_CONFIG.password;
    let password = "";

    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      password += caracteres.charAt(indice);
    }

    setEstadosUI((prev) => ({ ...prev, passwordTemporal: password }));
    return password;
  }, []);

  // Generar contraseña por defecto
  const generarPasswordDefault = useCallback((): string => {
    const password = `Cliente${formCliente.numeroCliente.replace("-", "")}`;
    setEstadosUI((prev) => ({ ...prev, passwordTemporal: password }));
    return password;
  }, [formCliente.numeroCliente]);

  // Manejar cambios en inputs
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormCliente((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Manejar selección de plan
  const handlePlanSeleccionado = useCallback((id: string) => {
    const planElegido = PLANES_SERVICIO.find((plan) => plan.id === id);
    if (planElegido) {
      setFormCliente((prev) => ({
        ...prev,
        planSeleccionado: id,
        montoMensual: planElegido.precio,
      }));
      setEstadosUI((prev) => ({
        ...prev,
        planSeleccionado: id,
        planAbierto: false,
      }));
    }
  }, []);

  // Expandir/contraer planes
  const togglePlanExpandido = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEstadosUI((prev) => ({
      ...prev,
      planesExpandidos: {
        ...prev.planesExpandidos,
        [id]: !prev.planesExpandidos[id],
      },
    }));
  }, []);

  // Cambiar tab activo
  const cambiarTab = useCallback(
    (tab: "nuevo-cliente" | "clientes-existentes") => {
      setEstadosUI((prev) => ({ ...prev, tabActivo: tab }));
    },
    []
  );

  // Abrir modal de confirmación
  const abrirConfirmacion = useCallback(() => {
    if (!validacion.formularioValido) {
      toast({
        title: "Formulario incompleto",
        description: MENSAJES.error.validacionFallida,
        variant: "destructive",
      });
      return;
    }
    setEstadosUI((prev) => ({ ...prev, confirmarDialogoAbierto: true }));
  }, [validacion.formularioValido, toast]);

  // Confirmar registro de cliente
  const confirmarRegistro = useCallback(async () => {
    try {
      setEstadoRegistro((prev) => ({ ...prev, creandoCliente: true }));

      // Limpiar y validar datos
      const datosLimpios = limpiarDatosFormulario(formCliente);
      const password = estadosUI.passwordTemporal || generarPasswordDefault();

      // Crear objeto para API
      const nuevoCliente = {
        id: Date.now().toString(),
        fechaRegistro: new Date().toISOString().split("T")[0],
        activo: true,
        passwordTemporal: password,
        ...datosLimpios,
      };

      // Llamar API para crear cliente
      const resultadoCreacion = await crearCliente({
        ...datosLimpios,
        passwordTemporal: password,
      });

      if (!resultadoCreacion.success) {
        throw new Error(
          resultadoCreacion.error || MENSAJES.error.registroFallido
        );
      }

      // Mostrar éxito de creación
      toast({
        title: MENSAJES.exito.clienteRegistrado,
        description:
          "El cliente ha sido registrado correctamente en la base de datos.",
        variant: "default",
      });

      // Agregar a lista local
      setClientes((prev) => [nuevoCliente, ...prev]);

      // Enviar correo si está habilitado
      if (estadoRegistro.enviarCorreo) {
        const resultadoCorreo = await enviarConfirmacion({
          nombre: nuevoCliente.nombre,
          correo: nuevoCliente.correo,
          numeroCliente: nuevoCliente.numeroCliente,
          password: password,
        });

        if (resultadoCorreo.success) {
          toast({
            title: MENSAJES.exito.correoEnviado,
            description: `Se ha enviado un correo a ${nuevoCliente.correo} con las credenciales de acceso.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Advertencia",
            description: MENSAJES.error.correoFallido,
            variant: "destructive",
          });
        }
      }

      // Mostrar éxito y limpiar formulario
      setEstadosUI((prev) => ({ ...prev, confirmarDialogoAbierto: false }));
      setEstadoRegistro((prev) => ({
        ...prev,
        exito: true,
        creandoCliente: false,
      }));

      // Auto-limpiar después de mostrar éxito
      setTimeout(() => {
        reiniciarFormulario();
        if (onComplete) onComplete();
      }, UI_CONFIG.timeouts.exitoMostrar);
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      setEstadoRegistro((prev) => ({ ...prev, creandoCliente: false }));

      toast({
        title: MENSAJES.error.registroFallido,
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  }, [
    formCliente,
    estadosUI.passwordTemporal,
    estadoRegistro.enviarCorreo,
    generarPasswordDefault,
    toast,
    onComplete,
  ]);

  // Copiar credenciales al portapapeles
  const copiarCredenciales = useCallback(() => {
    const password =
      estadosUI.passwordTemporal ||
      `Cliente${formCliente.numeroCliente.replace("-", "")}`;
    const texto = `Número de cliente: ${formCliente.numeroCliente}\nNombre: ${formCliente.nombre}\nCorreo: ${formCliente.correo}\nContraseña temporal: ${password}`;

    navigator.clipboard.writeText(texto);
    setEstadoRegistro((prev) => ({ ...prev, copiado: true }));

    toast({
      title: MENSAJES.exito.credencialesCopiadas,
      description: "Las credenciales han sido copiadas al portapapeles.",
      variant: "default",
    });

    setTimeout(() => {
      setEstadoRegistro((prev) => ({ ...prev, copiado: false }));
    }, UI_CONFIG.timeouts.copiadoMostrar);
  }, [estadosUI.passwordTemporal, formCliente, toast]);

  // Reiniciar formulario
  const reiniciarFormulario = useCallback(() => {
    setFormCliente({
      numeroCliente: generarNumeroCliente(),
      nombre: "",
      correo: "",
      telefono: "",
      empresa: "",
      rut: "",
      direccion: "",
      planSeleccionado: "",
      montoMensual: 0,
      notas: "",
    });
    setEstadosUI({
      tabActivo: UI_CONFIG.tabs.default,
      planAbierto: false,
      planSeleccionado: "",
      planesExpandidos: {},
      confirmarDialogoAbierto: false,
      passwordTemporal: "",
    });
    setEstadoRegistro({
      creandoCliente: false,
      exito: false,
      copiado: false,
      enviarCorreo: true,
    });
  }, []);

  // Actualizar cliente existente
  const actualizarCliente = useCallback((clienteActualizado: Cliente) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteActualizado.id ? clienteActualizado : c))
    );
  }, []);

  // Eliminar cliente
  const eliminarCliente = useCallback((clienteId: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== clienteId));
  }, []);

  return {
    // Estados
    formCliente,
    estadosUI,
    estadoRegistro,
    clientes,
    validacion,
    planes: PLANES_SERVICIO,

    // Acciones de formulario
    handleInputChange,
    handlePlanSeleccionado,
    togglePlanExpandido,

    // Acciones de UI
    cambiarTab,
    abrirConfirmacion,
    setEstadosUI,
    setEstadoRegistro,

    // Acciones de registro
    confirmarRegistro,
    copiarCredenciales,

    // Utilidades
    generarPasswordAleatorio,
    generarPasswordDefault,

    // Gestión de clientes
    actualizarCliente,
    eliminarCliente,
  };
}
