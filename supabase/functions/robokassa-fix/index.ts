import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🎯 ROBOKASSA FIX FUNCTION - USING CORRECT MERCHANT ID');
    
    const { amount, description = 'Пополнение баланса Oil Tycoon' } = await req.json();
    console.log('💰 Received payment request:', { amount, description });

    if (!amount || amount <= 0 || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Некорректная сумма' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ИСПРАВЛЕНИЕ - используем правильный идентификатор магазина
    const merchantLogin = "Oiltycoon";
    const password1 = Deno.env.get('ROBOKASSA_PASSWORD1');
    
    console.log('🔑 CORRECT MERCHANT LOGIN USED:', merchantLogin);
    console.log('🔑 Password1 found:', !!password1);

    if (!password1) {
      return new Response(
        JSON.stringify({ error: 'Password1 не найден' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const amountStr = amount.toString();
    const invoiceId = (Math.floor(Math.random() * 1000000) + Date.now() % 1000000).toString();
    const signatureString = `${merchantLogin}:${amountStr}:${invoiceId}:${password1}`;
    
    console.log('🔐 Signature string format:', `${merchantLogin}:${amountStr}:${invoiceId}:***`);
    
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const referer = req.headers.get('referer') || 'https://your-domain.com';
    const baseUrl = new URL(referer).origin;

    const params = {
      MerchantLogin: merchantLogin,
      OutSum: amountStr,
      InvoiceID: invoiceId,
      Description: description,
      SignatureValue: signature,
      Culture: 'ru',
      SuccessURL: `${baseUrl}/?payment=success`,
      FailURL: `${baseUrl}/?payment=fail`
    };

    console.log('✅ FIXED - Payment with correct merchant:', merchantLogin);

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: 'https://auth.robokassa.ru/Merchant/Index.aspx',
        params: params,
        invoiceId: invoiceId
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
