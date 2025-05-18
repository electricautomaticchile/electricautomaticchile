import { Resend } from 'resend';
import * as React from 'react';
import { renderAsync } from '@react-email/components';
import { IContactForm } from '../models/contacto-formulario';
import { ContactNotificationEmail, AutoResponseEmail, UserRegistrationEmail } from './templates';

// Inicializar Resend con la API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

// Email de origen y destino
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'; // Usar dirección por defecto de Resend
const TO_EMAIL = process.env.EMAIL_TO || 'electricautomaticchile@gmail.com';

// Función para extraer el contenido del archivo base64
// El formato base64 de un FileReader es: data:application/pdf;base64,JVBERi0xLjUNCia...
const extractBase64Content = (base64String: string): string => {
  if (!base64String) return '';
  const parts = base64String.split(',');
  return parts.length > 1 ? parts[1] : base64String;
};

// Enviar notificación al administrador
export async function sendContactNotification(formData: Omit<IContactForm, 'estado' | 'fecha'>) {
  try {
    // Formatear tipo de cotización para el texto
    const formatServicio = (servicio: string): string => {
      if (!servicio) return '';
      
      if (servicio === 'cotizacion_reposicion') return 'Sistema de Reposición';
      if (servicio === 'cotizacion_monitoreo') return 'Sistema de Monitoreo';
      if (servicio === 'cotizacion_mantenimiento') return 'Mantenimiento';
      if (servicio === 'cotizacion_completa') return 'Solución Integral';
      
      return servicio.replace('cotizacion_', '').split('_').map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };
    
    // Formatear plazo para el texto
    const formatPlazo = (plazo: string): string => {
      if (!plazo) return 'No especificado';
      
      if (plazo === 'urgente') return 'Urgente (1-2 días)';
      if (plazo === 'pronto') return 'Pronto (3-7 días)';
      if (plazo === 'normal') return 'Normal (1-2 semanas)';
      if (plazo === 'planificacion') return 'En planificación (1 mes o más)';
      
      return plazo;
    };
    
    // Renderizar el template de React a HTML
    const emailComponent = React.createElement(ContactNotificationEmail, { formData });
    const html = await renderAsync(emailComponent);
    
    // Preparar el texto plano del correo
    const textContent = `NUEVA SOLICITUD DE COTIZACIÓN
--------------------------------------
Fecha: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}

DATOS DEL SOLICITANTE
--------------------------------------
Nombre: ${formData.nombre}
Correo electrónico: ${formData.email}
${formData.empresa ? `Empresa: ${formData.empresa}` : ''}
${formData.telefono ? `Teléfono: ${formData.telefono}` : ''}

DETALLES DE LA COTIZACIÓN
--------------------------------------
Tipo de cotización: ${formatServicio(formData.servicio || '')}
${formData.plazo ? `Plazo deseado: ${formatPlazo(formData.plazo)}` : ''}

DESCRIPCIÓN DEL PROYECTO
--------------------------------------
${formData.mensaje}

${formData.archivo ? `ARCHIVO ADJUNTO: ${formData.archivo}
El archivo está disponible en el sistema.` : ''}

--------------------------------------
Este es un mensaje automático del sistema de cotizaciones de Electric Automatic Chile.
Por favor, no responda directamente a este correo.`;

    // Formatear tipo de cotización para el asunto
    let tipoServicio = '';
    if (formData.servicio) {
      if (formData.servicio === 'cotizacion_reposicion') tipoServicio = 'Sistema de Reposición';
      else if (formData.servicio === 'cotizacion_monitoreo') tipoServicio = 'Sistema de Monitoreo';
      else if (formData.servicio === 'cotizacion_mantenimiento') tipoServicio = 'Mantenimiento';
      else if (formData.servicio === 'cotizacion_completa') tipoServicio = 'Solución Integral';
      else tipoServicio = formData.servicio.replace('cotizacion_', '').split('_').map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Preparar los datos del correo
    const emailData: any = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Nueva cotización: ${tipoServicio} - ${formData.nombre}`,
      html,
      text: textContent,
    };
    
    // Agregar archivo adjunto si existe
    if (formData.archivoBase64 && formData.archivo) {
      emailData.attachments = [
        {
          filename: formData.archivo,
          content: extractBase64Content(formData.archivoBase64),
          encoding: 'base64',
          disposition: 'attachment',
          contentType: formData.archivoTipo || 'application/octet-stream'
        },
      ];
    }
    
    // Enviar el correo
    const data = await resend.emails.send(emailData);

    return data;
  } catch (error) {
    if (!RESEND_API_KEY) {
      throw new Error('API Key de Resend no configurada. Verifica tu archivo .env.local');
    }
    
    throw error;
  }
}

// Enviar respuesta automática al usuario
export async function sendAutoResponse(nombre: string, email: string) {
  try {
    // Renderizar el template de React a HTML
    const emailComponent = React.createElement(AutoResponseEmail, { nombre });
    const html = await renderAsync(emailComponent);
    
    // Preparar el texto plano del correo
    const textContent = `Estimado/a ${nombre},

Hemos recibido su solicitud de cotización y queremos agradecerle por contactarnos.
Nuestro equipo técnico está revisando su solicitud y nos pondremos en contacto con usted lo antes posible con su cotización personalizada.

Mientras tanto, lo invitamos a visitar nuestra página web para conocer más sobre nuestros servicios y soluciones:
https://www.electricautomaticchile.com

Este es un mensaje automático. Por favor, no responda directamente a este correo.

© ${new Date().getFullYear()} Electric Automatic Chile. Todos los derechos reservados.`;
    
    // Enviar el correo
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Gracias por solicitar una cotización con Electricautomaticchile',
      html,
      text: textContent,
    });

    return data;
  } catch (error) {
    if (!RESEND_API_KEY) {
      throw new Error('API Key de Resend no configurada. Verifica tu archivo .env.local');
    }
    
    throw error;
  }
}

// Enviar correo de confirmación de registro con credenciales
export async function sendRegistrationConfirmation(
  nombre: string, 
  correo: string,
  numeroCliente: string,
  password: string
) {
  try {
    // Renderizar el template de React a HTML
    const emailComponent = React.createElement(UserRegistrationEmail, { 
      nombre, 
      numeroCliente, 
      correo, 
      password 
    });
    const html = await renderAsync(emailComponent);
    
    // Preparar el texto plano del correo
    const textContent = `Estimado/a ${nombre},

Nos complace informarle que su solicitud ha sido APROBADA y estamos creando su cuenta de usuario en nuestro sistema.

Dentro de los próximos 2 días hábiles, su cuenta estará completamente activada y recibirá acceso a todas las funcionalidades de nuestra plataforma.

Sus credenciales de acceso son:
Número de cliente: ${numeroCliente}
Correo electrónico: ${correo}
Contraseña temporal: ${password}

Importante: Por seguridad, le recomendamos cambiar su contraseña temporal la primera vez que ingrese al sistema.

Una vez que su cuenta esté activada, podrá acceder a través del siguiente enlace:
https://electricautomaticchile.com/login

Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.

Saludos cordiales,
Equipo de Electric Automatic Chile

© ${new Date().getFullYear()} Electric Automatic Chile. Todos los derechos reservados.
Este es un mensaje automático. Por favor, no responda directamente a este correo.`;
    
    // Enviar el correo
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: correo,
      subject: 'Bienvenido a Electric Automatic Chile - Su cuenta ha sido aprobada',
      html,
      text: textContent,
    });

    return data;
  } catch (error) {
    if (!RESEND_API_KEY) {
      throw new Error('API Key de Resend no configurada. Verifica tu archivo .env.local');
    }
    
    throw error;
  }
} 