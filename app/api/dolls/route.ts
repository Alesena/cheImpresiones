{/**
  // app/api/dolls/route.ts
import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer'; // Ejemplo si quisieras mandar correo

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    // Desestructura los datos
    const { name, photo, dedication, accessories } = formData;

    // Aquí podrías configurar nodemailer o tu servicio de correo
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({
    //   from: 'info@tusitio.com',
    //   to: 'ventas@tusitio.com',
    //   subject: 'Nuevo Pedido de Muñeco',
    //   text: `Nombre: ${name} - Foto: ${photo} - Dedicatoria: ${dedication} - Accesorios: ${accessories}`,
    // });

    return NextResponse.json(
      { message: 'Pedido enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}

**/
}
