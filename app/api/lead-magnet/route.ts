import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Resend } from 'resend';

// Configurar S3
const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

// Configurar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Obtener el PDF desde S3
    const getObjectParams = {
      Bucket: process.env.PDF_PROMO_BUCKET || 'pdf-promo',
      Key: 'El Futuro de la Gestión Energética en Chile  De la Reacción a la Proactividad.pdf',
    };

    try {
      console.log('Intentando obtener archivo desde S3:', getObjectParams);
      const command = new GetObjectCommand(getObjectParams);
      const response = await s3Client.send(command);
      
      if (!response.Body) {
        throw new Error('No se pudo obtener el archivo PDF');
      }
      
      console.log('Archivo obtenido exitosamente desde S3');

      // Convertir el stream a buffer
      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      const pdfBuffer = Buffer.concat(chunks);

      // Enviar email con el PDF adjunto
      const emailData = {
        from: process.env.EMAIL_FROM!,
        to: email,
        subject: '📊 Su Informe Exclusivo: El Futuro de la Gestión Energética en Chile',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">¡Gracias por su interés!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Su informe exclusivo está adjunto</p>
            </div>
            
            <div style="padding: 30px; background-color: #f8f9fa;">
              <h2 style="color: #ea580c; margin-bottom: 20px;">Análisis Exclusivo: El Futuro de la Gestión Energética en Chile</h2>
              
              <p>Estimado/a profesional,</p>
              
              <p>Nos complace enviarle nuestro informe completo sobre la infraestructura energética inteligente en Chile. Este documento incluye:</p>
              
              <ul style="color: #374151; line-height: 1.6;">
                <li>🔋 Análisis del panorama actual de la distribución eléctrica</li>
                <li>📈 Tendencias tecnológicas en IoT energético</li>
                <li>⚖️ Marco regulatorio de la SEC</li>
                <li>💡 Casos de éxito y mejores prácticas</li>
                <li>🚀 Proyecciones del mercado energético inteligente</li>
              </ul>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>¿Le interesa conocer más sobre nuestras soluciones?</strong></p>
                <p style="margin: 5px 0 0 0; color: #92400e;">Nuestro equipo de especialistas está disponible para una consulta personalizada.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/formulario" 
                   style="background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Solicitar Consulta Gratuita
                </a>
              </div>
              
              <p>Saludos cordiales,</p>
              <p><strong>Equipo Electricautomaticchile</strong><br>
              <a href="mailto:${process.env.EMAIL_FROM}" style="color: #ea580c;">${process.env.EMAIL_FROM}</a></p>
            </div>
            
            <div style="background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">Electric Automatic Chile - Automatización Energética Inteligente</p>
              <p style="margin: 5px 0 0 0;">Este email contiene información confidencial. Si lo recibió por error, por favor elimínelo.</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: 'Informe-Gestion-Energetica-Chile.pdf',
            content: pdfBuffer,
          },
        ],
      };

      await resend.emails.send(emailData);

      // También guardar el lead en la base de datos (opcional)
      // Aquí puedes agregar lógica para guardar en MongoDB si quieres tracking

      return NextResponse.json({ 
        success: true, 
        message: 'Informe enviado exitosamente a su email' 
      });

    } catch (s3Error) {
      console.error('Error al obtener PDF desde S3:', s3Error);
      return NextResponse.json(
        { error: 'Error al obtener el documento. Por favor intente más tarde.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error en lead magnet:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 