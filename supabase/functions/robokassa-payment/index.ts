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
    console.log('🎯 ROBOKASSA PAYMENT FUNCTION STARTED - v1.3');
    
    const { amount, userId, description = 'Пополнение баланса Oil Tycoon' } = await req.json();
    console.log('💰 Received payment request:', { amount, userId, description });

    if (!userId) {
      console.error('❌ User ID not provided');
      return new Response(
        JSON.stringify({ error: 'ID пользователя не указан' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('👤 User ID:', userId);

    // Валидация суммы
    if (!amount || amount <= 0 || typeof amount !== 'number') {
      console.log('❌ Invalid amount:', amount, typeof amount);
      return new Response(
        JSON.stringify({ error: 'Некорректная сумма' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Получаем секреты Robokassa
    const merchantLogin = "Oiltycoon"; // Хардкод, так как раньше работало именно так
    const password1 = Deno.env.get('ROBOKASSA_PASSWORD1');
    
    console.log('🔑 Environment variables check:', {
      merchantLogin: `HARDCODED: "${merchantLogin}"`,
      password1: password1 ? `Found (${password1.length} chars)` : 'MISSING'
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

    // Приводим сумму к строке с двумя десятичными знаками (требование Robokassa)
    const amountStr = amount.toFixed(2);
    
    // Генерируем уникальный ID заказа согласно требованиям Robokassa (1 - 9223372036854775807)
    const invoiceId = (Math.floor(Math.random() * 1000000) + Date.now() % 1000000).toString();
    
    // Создаем подпись MD5 для Robokassa (по официальной документации)
    // ВАЖНО: в формуле подписи shp_ параметры должны быть строчными (lowercase)
    // Формат: MerchantLogin:OutSum:InvoiceID:shp_user_id=value:Password#1
    const signatureString = `${merchantLogin}:${amountStr}:${invoiceId}:shp_user_id=${userId}:${password1}`;
    
    console.log('🔐 Signature generation:', {
      formula: 'MerchantLogin:OutSum:InvoiceID:shp_user_id=value:Password#1',
      merchantLogin,
      amount: amountStr,
      invoiceId,
      userId,
      passwordLength: password1.length,
      fullString: `${merchantLogin}:${amountStr}:${invoiceId}:shp_user_id=${userId}:***`
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase(); // Robokassa требует uppercase

    // Параметры для Robokassa (включая user_id)
    // Success и Fail URL будут использоваться из настроек магазина
    const params = {
      MerchantLogin: merchantLogin,
      OutSum: amountStr,
      InvoiceID: invoiceId,
      Description: description,
      SignatureValue: signature,
      Culture: 'ru',
      Shp_user_id: userId // Передаем user_id как дополнительный параметр
    };

    console.log('✅ Payment parameters prepared:', {
      merchantLogin,
      outSum: amountStr,
      invoiceId,
      userId,
      signature: signature.substring(0, 8) + '...',
      signatureLength: signature.length,
      paymentUrl: 'https://auth.robokassa.ru/Merchant/Index.aspx',
      fullSignatureString: signatureString
    });

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: 'https://auth.robokassa.ru/Merchant/Index.aspx',
        params: params,
        invoiceId: invoiceId,
      debug: {
        signatureString: `${merchantLogin}:${amountStr}:${invoiceId}:shp_user_id=${userId}:***`,
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
