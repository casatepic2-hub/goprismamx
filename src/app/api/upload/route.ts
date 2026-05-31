import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 4.5 * 1024 * 1024;

    for (const file of files) {
      if (!allowed.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo no permitido: ${file.name}. Solo JPG, PNG o WebP.` },
          { status: 400 }
        );
      }
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Archivo muy grande: ${file.name}. Máximo 4.5MB.` },
          { status: 400 }
        );
      }
    }

    const urls: string[] = [];
    for (const file of files) {
      const blob = await put(`properties/${Date.now()}-${file.name}`, file, {
        access: 'public',
      });
      urls.push(blob.url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Error al subir archivos' }, { status: 500 });
  }
}
