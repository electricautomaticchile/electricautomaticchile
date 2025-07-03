// Componente principal
export { RegistroClientes } from "./RegistroClientes";

// Hook principal
export { useRegistroClientes } from "./hooks/useRegistroClientes";

// Tipos e interfaces
export type {
  PlanServicio,
  Cliente,
  CotizacionInicial,
  RegistroClientesProps,
  FormularioCliente,
  ValidacionFormulario,
  EstadoRegistro,
  EstadosUI,
  FormularioNuevoClienteProps,
  ListaClientesExistentesProps,
  SelectorPlanesProps,
  DialogoConfirmacionProps,
  EstadoExitoProps,
  ApiResponse,
  CrearClienteRequest,
  EnviarConfirmacionRequest,
} from "./types";

// Configuraciones
export {
  PLANES_SERVICIO,
  CLIENTES_EJEMPLO,
  VALIDACION_CONFIG,
  GENERACION_CONFIG,
  UI_CONFIG,
  MENSAJES,
  API_ENDPOINTS,
} from "./config";

// Utilidades
export {
  validarFormularioCompleto,
  validarCampo,
  validarRutChileno,
  formatearRut,
  formatearTelefono,
  limpiarDatosFormulario,
} from "./utils/validaciones";

export {
  crearCliente,
  enviarConfirmacion,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
} from "./utils/clienteApi";

// Componentes modulares
export { FormularioNuevoCliente } from "./components/FormularioNuevoCliente";
export { ListaClientesExistentes } from "./components/ListaClientesExistentes";
export { SelectorPlanes } from "./components/SelectorPlanes";
export { DialogoConfirmacion } from "./components/DialogoConfirmacion";
export { EstadoExito } from "./components/EstadoExito";
