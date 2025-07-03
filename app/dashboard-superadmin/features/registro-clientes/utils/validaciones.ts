import {
  FormularioCliente,
  ValidacionFormulario,
  ValidacionCampo,
} from "../types";
import { VALIDACION_CONFIG, MENSAJES } from "../config";

// Validar campo individual
export const validarCampo = (campo: string, valor: string): ValidacionCampo => {
  switch (campo) {
    case "nombre":
      if (VALIDACION_CONFIG.nombre.required && !valor.trim()) {
        return { valido: false, mensaje: MENSAJES.validacion.nombreRequerido };
      }
      if (valor.length < VALIDACION_CONFIG.nombre.minLength) {
        return { valido: false, mensaje: MENSAJES.validacion.nombreMuyCorto };
      }
      if (valor.length > VALIDACION_CONFIG.nombre.maxLength) {
        return {
          valido: false,
          mensaje: `Máximo ${VALIDACION_CONFIG.nombre.maxLength} caracteres`,
        };
      }
      return { valido: true };

    case "correo":
      if (VALIDACION_CONFIG.correo.required && !valor.trim()) {
        return { valido: false, mensaje: MENSAJES.validacion.correoRequerido };
      }
      if (!VALIDACION_CONFIG.correo.pattern.test(valor)) {
        return { valido: false, mensaje: MENSAJES.validacion.correoInvalido };
      }
      return { valido: true };

    case "telefono":
      if (VALIDACION_CONFIG.telefono.required && !valor.trim()) {
        return {
          valido: false,
          mensaje: MENSAJES.validacion.telefonoRequerido,
        };
      }
      if (!VALIDACION_CONFIG.telefono.pattern.test(valor)) {
        return { valido: false, mensaje: MENSAJES.validacion.telefonoInvalido };
      }
      return { valido: true };

    case "rut":
      if (VALIDACION_CONFIG.rut.required && !valor.trim()) {
        return { valido: false, mensaje: MENSAJES.validacion.rutRequerido };
      }
      if (!validarRutChileno(valor)) {
        return { valido: false, mensaje: MENSAJES.validacion.rutInvalido };
      }
      return { valido: true };

    default:
      return { valido: true };
  }
};

// Validar RUT chileno completo
export const validarRutChileno = (rut: string): boolean => {
  // Limpiar RUT (quitar puntos y guión)
  const rutLimpio = rut.replace(/\./g, "").replace("-", "").trim();

  if (rutLimpio.length < 2) return false;

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvCalculado = (11 - (suma % 11)).toString();
  const dvFinal =
    dvCalculado === "11" ? "0" : dvCalculado === "10" ? "K" : dvCalculado;

  return dv === dvFinal;
};

// Validar formulario completo
export const validarFormularioCompleto = (
  formulario: FormularioCliente
): ValidacionFormulario => {
  const validaciones = {
    nombre: validarCampo("nombre", formulario.nombre),
    correo: validarCampo("correo", formulario.correo),
    telefono: validarCampo("telefono", formulario.telefono),
    rut: validarCampo("rut", formulario.rut),
    planSeleccionado: formulario.planSeleccionado
      ? { valido: true }
      : { valido: false, mensaje: MENSAJES.validacion.planRequerido },
  };

  const formularioValido = Object.values(validaciones).every((v) => v.valido);

  return {
    ...validaciones,
    formularioValido,
  };
};

// Formatear RUT para mostrar
export const formatearRut = (rut: string): string => {
  const rutLimpio = rut.replace(/\D/g, "");

  if (rutLimpio.length <= 1) return rutLimpio;

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  // Formatear con puntos
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${cuerpoFormateado}-${dv}`;
};

// Formatear teléfono para mostrar
export const formatearTelefono = (telefono: string): string => {
  const telefonoLimpio = telefono.replace(/\D/g, "");

  if (telefonoLimpio.startsWith("569")) {
    const numero = telefonoLimpio.slice(3);
    if (numero.length === 8) {
      return `+56 9 ${numero.slice(0, 4)} ${numero.slice(4)}`;
    }
  }

  return telefono;
};

// Limpiar datos del formulario
export const limpiarDatosFormulario = (
  formulario: FormularioCliente
): FormularioCliente => {
  return {
    ...formulario,
    nombre: formulario.nombre.trim(),
    correo: formulario.correo.trim().toLowerCase(),
    telefono: formatearTelefono(formulario.telefono.trim()),
    empresa: formulario.empresa?.trim() || "",
    rut: formatearRut(formulario.rut.trim()),
    direccion: formulario.direccion.trim(),
    notas: formulario.notas?.trim() || "",
  };
};
