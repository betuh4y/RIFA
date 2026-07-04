import { NextRequest, NextResponse } from 'next/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'Token do Mercado Pago não configurado.' },
        { status: 500, headers: CORS }
      );
    }

    const body = await req.json();
    const { amount, description } = body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido.' },
        { status: 400, headers: CORS }
      );
    }

    const valor = Number(Number(amount).toFixed(2));

    // Chama a API do Mercado Pago diretamente via fetch
    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Idempotency-Key': `rifa-${Date.now()}-${Math.random()}`,
      },
      body: JSON.stringify({
        transaction_amount: valor,
        description: description || 'Rifa da Ava',
        payment_method_id: 'pix',
        payer: {
          email: 'participante@rifa.com.br',
        },
      }),
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      console.error('[criar-pix] MP error:', data);
      return NextResponse.json(
        { error: data?.message || 'Erro no Mercado Pago.' },
        { status: 500, headers: CORS }
      );
    }

    const txData = data?.point_of_interaction?.transaction_data;

    if (!txData?.qr_code) {
      console.error('[criar-pix] sem QR:', data);
      return NextResponse.json(
        { error: 'QR Code não retornado pelo Mercado Pago.' },
        { status: 502, headers: CORS }
      );
    }

    return NextResponse.json({
      paymentId: data.id,
      status:    data.status,
      qrCode:    txData.qr_code,
      qrBase64:  txData.qr_code_base64 || '',
    }, { headers: CORS });

  } catch (err: any) {
    console.error('[criar-pix] erro:', err);
    return NextResponse.json(
      { error: err?.message || 'Erro interno.' },
      { status: 500, headers: CORS }
    );
  }
}
