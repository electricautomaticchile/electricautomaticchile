/**
 * Archivo de retrocompatibilidad para apiService
 *
 * Este archivo mantiene la compatibilidad con el código existente
 * mientras usa la nueva estructura modular de servicios.
 *
 * NOTA: Para nuevo código, se recomienda importar los servicios
 * específicos desde lib/api/services
 */

// Importar todos los servicios individuales
import { authService } from "./services/authService";
import { cotizacionesService } from "./services/cotizacionesService";
import { clientesService } from "./services/clientesService";
import { usuariosService } from "./services/usuariosService";
import { dispositivosService } from "./services/dispositivosService";
import { estadisticasService } from "./services/estadisticasService";
import { leadMagnetService } from "./services/leadMagnetService";
import { superusuariosService } from "./services/superusuariosService";
import { empresasService } from "./services/empresasService";
import { alertasService } from "./services/alertasService";
// import { arduinoService } from "./services/arduinoService"; // Temporalmente deshabilitado

// Re-exportar todos los tipos para mantener compatibilidad
export * from "./types";

// Re-exportar utilidades
export { TokenManager } from "./utils/tokenManager";
export { API_URL, API_BASE_URL, API_VERSION } from "./utils/config";

// Clase ApiService que combina todos los servicios para mantener retrocompatibilidad
class ApiService {
  // =================== AUTENTICACIÓN ===================
  login = authService.login.bind(authService);
  logout = authService.logout.bind(authService);
  getProfile = authService.getProfile.bind(authService);
  cambiarPassword = authService.cambiarPassword.bind(authService);
  solicitarRecuperacion = authService.solicitarRecuperacion.bind(authService);
  restablecerPassword = authService.restablecerPassword.bind(authService);

  // =================== COTIZACIONES ===================
  enviarFormularioContacto =
    cotizacionesService.enviarFormularioContacto.bind(cotizacionesService);
  obtenerCotizaciones =
    cotizacionesService.obtenerCotizaciones.bind(cotizacionesService);
  obtenerCotizacionesPendientes =
    cotizacionesService.obtenerCotizacionesPendientes.bind(cotizacionesService);
  obtenerEstadisticasCotizaciones =
    cotizacionesService.obtenerEstadisticasCotizaciones.bind(
      cotizacionesService
    );
  obtenerCotizacion =
    cotizacionesService.obtenerCotizacion.bind(cotizacionesService);
  cambiarEstadoCotizacion =
    cotizacionesService.cambiarEstadoCotizacion.bind(cotizacionesService);
  agregarCotizacion =
    cotizacionesService.agregarCotizacion.bind(cotizacionesService);
  convertirCotizacionACliente =
    cotizacionesService.convertirCotizacionACliente.bind(cotizacionesService);
  eliminarCotizacion =
    cotizacionesService.eliminarCotizacion.bind(cotizacionesService);

  // =================== CLIENTES ===================
  obtenerClientes = clientesService.obtenerClientes.bind(clientesService);
  obtenerCliente = clientesService.obtenerCliente.bind(clientesService);
  crearCliente = clientesService.crearCliente.bind(clientesService);
  actualizarCliente = clientesService.actualizarCliente.bind(clientesService);
  eliminarCliente = clientesService.eliminarCliente.bind(clientesService);

  // =================== USUARIOS ===================
  obtenerUsuarios = usuariosService.obtenerUsuarios.bind(usuariosService);
  obtenerUsuario = usuariosService.obtenerUsuario.bind(usuariosService);
  crearUsuario = usuariosService.crearUsuario.bind(usuariosService);
  actualizarUsuario = usuariosService.actualizarUsuario.bind(usuariosService);
  eliminarUsuario = usuariosService.eliminarUsuario.bind(usuariosService);

  // =================== DISPOSITIVOS IoT ===================
  obtenerDispositivos =
    dispositivosService.obtenerDispositivos.bind(dispositivosService);
  obtenerDispositivo =
    dispositivosService.obtenerDispositivo.bind(dispositivosService);
  crearDispositivo =
    dispositivosService.crearDispositivo.bind(dispositivosService);
  agregarLecturaDispositivo =
    dispositivosService.agregarLecturaDispositivo.bind(dispositivosService);

  // =================== ESTADÍSTICAS ===================
  obtenerEstadisticasConsumoCliente =
    estadisticasService.obtenerEstadisticasConsumoCliente.bind(
      estadisticasService
    );
  obtenerEstadisticasGlobales =
    estadisticasService.obtenerEstadisticasGlobales.bind(estadisticasService);

  // =================== LEAD MAGNET ===================
  enviarLeadMagnet = leadMagnetService.enviarLeadMagnet.bind(leadMagnetService);
  obtenerEstadisticasLeads =
    leadMagnetService.obtenerEstadisticasLeads.bind(leadMagnetService);

  // =================== SUPERUSUARIOS ===================
  obtenerSuperusuarios =
    superusuariosService.obtenerSuperusuarios.bind(superusuariosService);
  crearSuperusuario =
    superusuariosService.crearSuperusuario.bind(superusuariosService);
  obtenerEstadisticasSuperusuarios =
    superusuariosService.obtenerEstadisticasSuperusuarios.bind(
      superusuariosService
    );

  // =================== EMPRESAS ===================
  obtenerEmpresas = empresasService.obtenerEmpresas.bind(empresasService);
  obtenerEmpresa = empresasService.obtenerEmpresa.bind(empresasService);
  crearEmpresa = empresasService.crearEmpresa.bind(empresasService);
  actualizarEmpresa = empresasService.actualizarEmpresa.bind(empresasService);
  eliminarEmpresa = empresasService.eliminarEmpresa.bind(empresasService);
  cambiarEstadoEmpresa =
    empresasService.cambiarEstadoEmpresa.bind(empresasService);
  resetearPasswordEmpresa =
    empresasService.resetearPasswordEmpresa.bind(empresasService);
  obtenerEstadisticasEmpresas =
    empresasService.obtenerEstadisticasEmpresas.bind(empresasService);

  // =================== ALERTAS ===================
  obtenerAlertas = alertasService.obtenerAlertas.bind(alertasService);
  obtenerAlertasActivas =
    alertasService.obtenerAlertasActivas.bind(alertasService);
  obtenerAlertasPorEmpresa =
    alertasService.obtenerAlertasPorEmpresa.bind(alertasService);
  obtenerResumenAlertas =
    alertasService.obtenerResumenAlertas.bind(alertasService);
  crearAlerta = alertasService.crearAlerta.bind(alertasService);
  resolverAlerta = alertasService.resolverAlerta.bind(alertasService);
  asignarAlerta = alertasService.asignarAlerta.bind(alertasService);
  eliminarAlerta = alertasService.eliminarAlerta.bind(alertasService);
  simularAlerta = alertasService.simularAlerta.bind(alertasService);
  simularAlertasBatch = alertasService.simularAlertasBatch.bind(alertasService);

  // =================== ARDUINO IoT ===================
  // Temporalmente deshabilitado hasta implementar Arduino
  // obtenerEstadoArduino = arduinoService.obtenerEstado.bind(arduinoService);
  // conectarArduino = arduinoService.conectar.bind(arduinoService);
  // desconectarArduino = arduinoService.desconectar.bind(arduinoService);
  // enviarComandoArduino = arduinoService.enviarComando.bind(arduinoService);
  // obtenerEstadisticasArduino =
  //   arduinoService.obtenerEstadisticas.bind(arduinoService);
  // exportarDatosArduino = arduinoService.exportarDatos.bind(arduinoService);
  // obtenerDispositivosArduino =
  //   arduinoService.obtenerDispositivosEmpresa.bind(arduinoService);
  // registrarDispositivoArduino =
  //   arduinoService.registrarDispositivo.bind(arduinoService);
  // configurarDispositivoArduino =
  //   arduinoService.configurarDispositivo.bind(arduinoService);
}

// Exportar instancia única del servicio para retrocompatibilidad
export const apiService = new ApiService();

// Exportar también la clase para casos especiales
export { ApiService };

// Exportar servicios individuales para nuevo código
export {
  authService,
  cotizacionesService,
  clientesService,
  usuariosService,
  dispositivosService,
  estadisticasService,
  leadMagnetService,
  superusuariosService,
  empresasService,
  alertasService,
  // arduinoService, // Temporalmente deshabilitado
};
