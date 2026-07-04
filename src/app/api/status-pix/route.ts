import { NextRequest, NextResponse } from 'next/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const id = req.nextUrl.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID inválido.' },
        { status: 400, headers: CORS }
      );
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await mpRes.json();

    return NextResponse.json({
      status:   data.status,
      approved: data.status === 'approved',
    }, { headers: CORS });

  } catch (err: any) {
    console.error('[status-pix] erro:', err);
    return NextResponse.json(
      { error: err?.message || 'Erro interno.' },
      { status: 500, headers: CORS }
    );
  }
}
