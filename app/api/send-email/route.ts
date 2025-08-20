import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Verifica que la API key esté configurada
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY no está configurada en las variables de entorno');
  throw new Error('RESEND_API_KEY no configurada');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar email de forma asíncrona
async function sendEmailAsync(userName: string, userPhone: string, emailContent: string): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'dicsuresh@gmail.com',
      subject: `Nuevo pedido de Funko - ${userName}`,
      html: emailContent,
    });

    if (error) {
      console.error('Error de Resend:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log('Email enviado exitosamente:', data);
  } catch (error) {
    console.error('Error enviando email:', error);
    // No relanzamos el error para que no afecte la respuesta al cliente
  }
}

export async function POST(request: Request) {
  try {
    // Verifica el contenido de la solicitud
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Datos recibidos:', body);

    // Validación de campos requeridos
    const requiredFields = ['userName', 'userPhone', 'emailContent'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: "Faltan campos requeridos",
          missingFields
        },
        { status: 400 }
      );
    }

    // Enviar email de forma asíncrona (fire and forget)
    sendEmailAsync(body.userName, body.userPhone, body.emailContent)
      .catch(error => {
        console.error('Error en proceso asíncrono de email:', error);
      });

    // Responder inmediatamente
    return NextResponse.json({
      success: true,
      message: "Pedido recibido. Te contactaremos pronto."
    });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}