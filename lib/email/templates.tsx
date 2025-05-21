import * as React from 'react';
import { IContactForm } from '../models/contacto-formulario';
import Head from 'next/head';
import Image from 'next/image';

// Función para formatear el tipo de cotización
const formatServicio = (servicio: string): string => {
  if (!servicio) return '';
  
  if (servicio === 'cotizacion_reposicion') return 'Sistema de Reposición';
  if (servicio === 'cotizacion_monitoreo') return 'Sistema de Monitoreo';
  if (servicio === 'cotizacion_mantenimiento') return 'Mantenimiento';
  if (servicio === 'cotizacion_completa') return 'Solución Integral';
  
  // Formato genérico si no coincide con ninguno de los anteriores
  return servicio.replace('cotizacion_', '').split('_').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Función para formatear el plazo
const formatPlazo = (plazo: string): string => {
  if (!plazo) return 'No especificado';
  
  if (plazo === 'urgente') return 'Urgente (1-2 días)';
  if (plazo === 'pronto') return 'Pronto (3-7 días)';
  if (plazo === 'normal') return 'Normal (1-2 semanas)';
  if (plazo === 'planificacion') return 'En planificación (1 mes o más)';
  
  return plazo;
};

// Plantilla para la notificación de nuevo contacto
export const ContactNotificationEmail: React.FC<{ 
  formData: Omit<IContactForm, 'estado' | 'fecha'> 
}> = ({ 
  formData 
}) => (
  <div style={{ 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#ffffff'
  }}>
    {/* Cabecera */}
    <div style={{
      backgroundColor: '#f8f8f8',
      padding: '15px 20px',
      borderRadius: '5px',
      marginBottom: '20px',
      borderLeft: '4px solid #e05d11'
    }}>
      <h2 style={{ 
        color: '#e05d11',
        margin: '0 0 10px 0'
      }}>
        Nueva solicitud de cotización
      </h2>
      <p style={{ margin: '0', color: '#666' }}>
        Fecha: {new Date().toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
    
    {/* Datos del solicitante */}
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ 
        color: '#333', 
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        marginTop: '0'
      }}>
        Datos del solicitante
      </h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', fontWeight: 'bold', width: '35%' }}>Nombre completo:</td>
            <td style={{ padding: '8px 0' }}>{formData.nombre}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Correo electrónico:</td>
            <td style={{ padding: '8px 0' }}>
              <a href={`mailto:${formData.email}`} style={{ color: '#e05d11' }}>
                {formData.email}
              </a>
            </td>
          </tr>
          {formData.empresa && (
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Empresa:</td>
              <td style={{ padding: '8px 0' }}>{formData.empresa}</td>
            </tr>
          )}
          {formData.telefono && (
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Teléfono:</td>
              <td style={{ padding: '8px 0' }}>{formData.telefono}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
    {/* Detalles de la cotización */}
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ 
        color: '#333', 
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        marginTop: '0'
      }}>
        Detalles de la cotización
      </h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', fontWeight: 'bold', width: '35%' }}>Tipo de cotización:</td>
            <td style={{ padding: '8px 0' }}>
              <span style={{ 
                backgroundColor: '#e05d11', 
                color: 'white',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '0.9em'
              }}>
                {formatServicio(formData.servicio || '')}
              </span>
            </td>
          </tr>
          {formData.plazo && (
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Plazo deseado:</td>
              <td style={{ padding: '8px 0' }}>{formatPlazo(formData.plazo)}</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div style={{
        background: '#f9f9f9',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '15px',
        border: '1px solid #eee'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.1em' }}>Descripción del proyecto:</h3>
        <p style={{ whiteSpace: 'pre-line', margin: 0, lineHeight: '1.5' }}>{formData.mensaje}</p>
      </div>
      
      {formData.archivo && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <p style={{ margin: '0' }}>
            <strong>Archivo adjunto:</strong> {formData.archivo}
            <span style={{ display: 'block', fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
              El archivo está incluido como adjunto en este correo electrónico.
            </span>
          </p>
        </div>
      )}
    </div>
    
    {/* Acciones */}
    <div style={{ marginTop: '25px', textAlign: 'center' as const }}>
      <a 
        href="https://electricautomaticchile.vercel.app/dashboard" 
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#e05d11',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Ver en el Panel de Administración
      </a>
    </div>
    
    {/* Pie de página */}
    <div style={{ 
      marginTop: '30px', 
      padding: '15px',
      borderTop: '1px solid #eee',
      fontSize: '14px',
      color: '#777',
      textAlign: 'center' as const
    }}>
      <p>
        Este es un mensaje automático del sistema de cotizaciones de 
        Electricautomaticchile. Por favor, no responda directamente a este correo.
      </p>
      <p style={{ marginTop: '10px', fontSize: '12px' }}>
        &copy; {new Date().getFullYear()} Electricautomaticchile. Todos los derechos reservados.
      </p>
    </div>
  </div>
);

// Plantilla para la respuesta automática al usuario
export const AutoResponseEmail: React.FC<{
  nombre: string;
}> = ({
  nombre
}) => (
  <div style={{ 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd'
  }}>
    <h2 style={{ 
      color: '#e05d11',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px'
    }}>
      Gracias por solicitar una cotización con Electricautomaticchile
    </h2>
    
    <div style={{ marginTop: '20px' }}>
      <p>Estimado/a {nombre},</p>
      
      <p>
        Hemos recibido su solicitud de cotización y queremos agradecerle por contactarnos.
        Nuestro equipo técnico está revisando su solicitud y nos pondremos en contacto
        con usted lo antes posible con su cotización personalizada.
      </p>
      
      <p>
        Mientras tanto, lo invitamos a visitar nuestra página web para conocer
        más sobre nuestros servicios y soluciones.
      </p>
      
      <div style={{
        marginTop: '30px',
        textAlign: 'center' as const
      }}>
        <a 
          href="https://www.electricautomaticchile.com" 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#e05d11',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Visitar nuestra web
        </a>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px',
        borderTop: '1px solid #eee',
        fontSize: '14px',
        color: '#777'
      }}>
        <p>
          Este es un mensaje automático. Por favor, no responda directamente a este correo.
        </p>
        <p style={{ marginTop: '10px' }}>
          &copy; {new Date().getFullYear()} Electricautomaticchile. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
);

// Template para correo de confirmación de registro
interface UserRegistrationEmailProps {
  nombre: string;
  numeroCliente: string;
  correo: string;
  password: string;
}

export function UserRegistrationEmail({ nombre, numeroCliente, correo, password }: UserRegistrationEmailProps) {
  return (
    <html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style dangerouslySetInnerHTML={{ __html: `
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9f9; 
            color: #333;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #eeeeee;
            border-radius: 8px;
          }
          .header { 
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 8px 8px 0 0;
            border-bottom: 3px solid #FB923C;
          }
          .logo { 
            max-width: 200px; 
            margin: 0 auto;
          }
          .content { 
            padding: 30px 20px;
            line-height: 1.6;
          }
          .footer { 
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
            background-color: #f5f5f5;
            border-radius: 0 0 8px 8px;
            border-top: 1px solid #eeeeee;
          }
          h1 { 
            color: #FB923C;
            margin-top: 0;
          }
          .credentials {
            background-color: #f8f8f8;
            border: 1px solid #eeeeee;
            border-left: 3px solid #FB923C;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            background-color: #FB923C;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
          }
          .important {
            font-weight: bold;
            color: #FB923C;
          }
        `}} />
      </Head>
      <body>
        <div className="container">
          <div className="header">
            <Image 
              src="https://electricautomaticchile.com/logo.png" 
              alt="Electric Automatic Chile"
              className="logo"
              width={200}
              height={100}
            />
            <h1>¡Bienvenido a Electricautomaticchile!</h1>
          </div>
          <div className="content">
            <p>Estimado/a <strong>{nombre}</strong>,</p>
            
            <p>Nos complace informarle que su solicitud ha sido <span className="important">aprobada</span> y hemos creado su cuenta de usuario en nuestro sistema.</p>
            
            <p>Dentro de los próximos <span className="important">minutos</span>, su cuenta estará completamente activada y recibirá acceso a todas las funcionalidades de nuestra plataforma.</p>
            
            <div className="credentials">
              <p><strong>Sus credenciales de acceso son:</strong></p>
              <p>Número de cliente: <strong>{numeroCliente}</strong></p>
              <p>Correo electrónico: <strong>{correo}</strong></p>
              <p>Contraseña temporal: <strong>{password}</strong></p>
            </div>
            
            <p><strong>Importante:</strong> Por seguridad, le recomendamos cambiar su contraseña temporal la primera vez que ingrese al sistema.</p>
            
            <p>Una vez que su cuenta esté activada, podrá acceder a través del siguiente enlace:</p>
            
            <div style={{ textAlign: 'center' }}>
              <a href="https://electricautomaticchile.com/login" className="button">
                Acceder a mi cuenta
              </a>
            </div>
            
            <p>Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.</p>
            
            <p>Saludos cordiales,</p>
            <p><strong>Equipo de Electricautomaticchile</strong></p>
          </div>
          <div className="footer">
            <p>© {new Date().getFullYear()} Electricautomaticchile. Todos los derechos reservados.</p>
            <p>Este es un mensaje automático. Por favor, no responda directamente a este correo.</p>
          </div>
        </div>
      </body>
    </html>
  );
} 