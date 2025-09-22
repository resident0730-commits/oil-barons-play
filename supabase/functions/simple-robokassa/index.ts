import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.177.0/hash/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🎯 ROBOKASSA PAYMENT FUNCTION STARTED');
    
    const { amount, description = 'Пополнение баланса Oil Tycoon' } = await req.json();
    console.log('💰 Received payment request:', { amount, description });

    // Валидация суммы
    if (!amount || amount <= 0 || typeof amount !== 'number') {
      console.log('❌ Invalid amount:', amount, typeof amount);
      return new Response(
        JSON.stringify({ error: 'Некорректная сумма' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Получаем секреты Robokassa
    const merchantLogin = Deno.env.get('ROBOKASSA_MERCHANT_LOGIN');
    const password1 = Deno.env.get('ROBOKASSA_PASSWORD1');
    
    console.log('🔑 Environment variables check:', {
      merchantLogin: merchantLogin ? `Found: "${merchantLogin}"` : 'MISSING',
      password1: password1 ? `Found (${password1.length} chars)` : 'MISSING',
      allEnvKeys: Object.keys(Deno.env.toObject()).filter(key => key.includes('ROBOKASSA'))
    });

    if (!merchantLogin || !password1) {
      console.error('❌ Missing required Robokassa credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Настройки Робокассы не найдены',
          debug: {
            merchantLogin: !!merchantLogin,
            password1: !!password1
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Приводим сумму к строке для формирования подписи
    const amountStr = amount.toString();
    
    // Генерируем уникальный ID заказа
    const invoiceId = Date.now().toString();
    
    // Создаем подпись MD5 для Robokassa (по официальной документации)
    // Формат: MerchantLogin:OutSum:InvoiceID:Password#1
    const signatureString = `${merchantLogin}:${amountStr}:${invoiceId}:${password1}`;
    
    console.log('🔐 Signature generation:', {
      formula: 'MerchantLogin:OutSum:InvoiceID:Password#1',
      merchantLogin,
      amount: amountStr,
      invoiceId,
      passwordLength: password1.length,
      fullString: `${merchantLogin}:${amountStr}:${invoiceId}:***`
    });
    
    const hash = createHash("md5");
    hash.update(signatureString);
    const signature = hash.toString().toUpperCase(); // Robokassa требует uppercase

    // Получаем домен для URL возврата
    const referer = req.headers.get('referer') || 'https://your-domain.com';
    const baseUrl = new URL(referer).origin;

    // Параметры для Robokassa
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

    console.log('✅ Payment parameters prepared:', {
      merchantLogin,
      outSum: amountStr,
      invoiceId,
      signature: signature.substring(0, 8) + '...',
      signatureLength: signature.length,
      paymentUrl: 'https://auth.robokassa.ru/Merchant/Index.aspx'
    });

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: 'https://auth.robokassa.ru/Merchant/Index.aspx',
        params: params,
        invoiceId: invoiceId,
        debug: {
          signatureString: `${merchantLogin}:${amountStr}:${invoiceId}:***`,
          signatureValue: signature
        }
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
