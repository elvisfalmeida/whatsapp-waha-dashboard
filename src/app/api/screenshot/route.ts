import { NextResponse } from 'next/server';
import { env } from '~/env';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');

  if (!session) {
    return new NextResponse('O parâmetro da sessão é obrigatório', { status: 400 });
  }

  try {
    const screenshotUrl = `${env.WAHA_API_URL}/api/screenshot?session=${session}`;
    const response = await fetch(screenshotUrl, {
      headers: {
        'accept': 'image/jpeg',
        'X-Api-Key': env.WAHA_API_KEY,
      }
    });

    if (!response.ok) {
      throw new Error(`Falha na solicitação da captura de tela: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'image/png',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Screenshot fetch error:', error);
    return new NextResponse('Não foi possível buscar a captura de tela', { status: 500 });
  }
}
