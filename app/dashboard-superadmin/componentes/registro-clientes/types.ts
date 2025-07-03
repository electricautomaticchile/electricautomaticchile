// Interfaces para el sistema de registro de clientes

export interface PlanServicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  caracteristicas: string[];
}

export interface Cliente {
  id: string;
  numeroCliente: string;
  nombre: string;
  correo: string;
  telefono: string;
  empresa?: string;
  rut: string;
  direccion: string;
  planSeleccionado: string;
  activo: boolean;
  fechaRegistro: string;
  ultimaFacturacion?: string;
  montoMensual: number;
  notas?: string;
  passwordTemporal?: string;
}

export interface CotizacionInicial {
  nombre: string;
  correo: string;
  telefono: string;
  empresa?: string;
  montoMensual: number;
  planSugerido?: string;
}

export interface RegistroClientesProps {
  cotizacionInicial?: CotizacionInicial;
  onComplete?: () => void;
}

export interface FormularioCliente
  extends Omit<Cliente, "id" | "fechaRegistro" | "activo"> {}

export interface EstadoRegistro {
  creandoCliente: boolean;
  exito: boolean;
  copiado: boolean;
  enviarCorreo: boolean;
}

export interface EstadosUI {
  tabActivo: "nuevo-cliente" | "clientes-existentes";
  planAbierto: boolean;
  planSeleccionado: string;
  planesExpandidos: Record<string, boolean>;
  confirmarDialogoAbierto: boolean;
  passwordTemporal: string;
}

export interface ValidacionCampo {
  valido: boolean;
  mensaje?: string;
}

export interface ValidacionFormulario {
  nombre: ValidacionCampo;
  correo: ValidacionCampo;
  telefono: ValidacionCampo;
  rut: ValidacionCampo;
  planSeleccionado: ValidacionCampo;
  formularioValido: boolean;
}

// Props para componentes hijos
export interface FormularioNuevoClienteProps {
  formCliente: FormularioCliente;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  planSeleccionado: string;
  onPlanSeleccionado: (id: string) => void;
  validacion: ValidacionFormulario;
  onRegistrar: () => void;
}

export interface ListaClientesExistentesProps {
  clientes: Cliente[];
  onActualizarCliente: (cliente: Cliente) => void;
  onEliminarCliente: (id: string) => void;
}

export interface SelectorPlanesProps {
  planes: PlanServicio[];
  planSeleccionado: string;
  onPlanSeleccionado: (id: string) => void;
  planAbierto: boolean;
  onPlanAbierto: (abierto: boolean) => void;
  planesExpandidos: Record<string, boolean>;
  onTogglePlanExpandido: (id: string, e: React.MouseEvent) => void;
}

export interface DialogoConfirmacionProps {
  abierto: boolean;
  onAbierto: (abierto: boolean) => void;
  cliente: FormularioCliente;
  passwordTemporal: string;
  enviarCorreo: boolean;
  onEnviarCorreo: (enviar: boolean) => void;
  creandoCliente: boolean;
  onConfirmar: () => void;
  onCopiarCredenciales: () => void;
  copiado: boolean;
}

export interface EstadoExitoProps {
  cliente: FormularioCliente;
  onVolverClientes: () => void;
}

// Tipos para API
export interface CrearClienteRequest {
  numeroCliente: string;
  nombre: string;
  correo: string;
  telefono: string;
  empresa?: string;
  rut: string;
  direccion: string;
  planSeleccionado: string;
  montoMensual: number;
  notas?: string;
  passwordTemporal: string;
}

export interface EnviarConfirmacionRequest {
  nombre: string;
  correo: string;
  numeroCliente: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
