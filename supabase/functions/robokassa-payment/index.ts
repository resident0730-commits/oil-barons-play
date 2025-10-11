import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
    console.log('🎯 ROBOKASSA PAYMENT FUNCTION STARTED - v1.2 - FORCE UPDATE');
    
    const { amount, userId, description = 'Пополнение баланса Oil Tycoon' } = await req.json();
    console.log('💰 Received payment request:', { amount, userId, description });
    
    // Проверка userId
    if (!userId) {
      console.error('❌ Missing userId');
      return new Response(
        JSON.stringify({ error: 'UserId обязателен' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Приводим сумму к строке для формирования подписи
    const amountStr = amount.toString();
    
    // Генерируем уникальный ID заказа согласно требованиям Robokassa (1 - 9223372036854775807)
    const invoiceId = (Math.floor(Math.random() * 1000000) + Date.now() % 1000000).toString();
    
    // Сохраняем связь InvoiceID -> UserID в базе данных
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: dbError } = await supabase
      .from('payment_invoices')
      .insert({
        invoice_id: invoiceId,
        user_id: userId,
        amount: amount,
        status: 'pending'
      });
    
    if (dbError) {
      console.error('❌ Failed to save invoice to database:', dbError);
      return new Response(
        JSON.stringify({ error: 'Не удалось создать платеж' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Создаем подпись MD5 для Robokassa БЕЗ дополнительных параметров
    // Формат: MerchantLogin:OutSum:InvoiceID:Password#1
    const signatureString = `${merchantLogin}:${amountStr}:${invoiceId}:${password1}`;
    
    console.log('🔐 Signature generation:', {
      formula: 'MerchantLogin:OutSum:InvoiceID:Password#1',
      merchantLogin,
      amount: amountStr,
      invoiceId,
      userId: `${userId} (saved to DB)`,
      passwordLength: password1.length,
      fullString: `${merchantLogin}:${amountStr}:${invoiceId}:***`
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase(); // Robokassa требует uppercase

    // Получаем домен для URL возврата
    const referer = req.headers.get('referer') || 'https://your-domain.com';
    const baseUrl = new URL(referer).origin;

    // Параметры для Robokassa БЕЗ дополнительных параметров
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
