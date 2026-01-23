import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Resmi sanki bizim sunucudaymış gibi geri döndürüyoruz
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Proxy hatası:', error);
    return NextResponse.json({ error: 'Görsel çekilemedi' }, { status: 500 });
  }
}