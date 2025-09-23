import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, description = 'Пополнение баланса Oil Tycoon' }: PaymentRequest = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Некорректная сумма' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Получаем конфигурацию Robokassa из переменных окружения
    const merchantLogin = Deno.env.get('ROBOKASSA_MERCHANT_LOGIN');
    const password1 = Deno.env.get('ROBOKASSA_PASSWORD1');
    
    if (!merchantLogin || !password1) {
      console.error('Missing Robokassa configuration');
      return new Response(
        JSON.stringify({ error: 'Настройки платежной системы не найдены' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Генерируем уникальный ID заказа
    const invoiceId = Date.now().toString();
    
    // Создаем подпись для Robokassa
    // Формат: MerchantLogin:OutSum:InvoiceID:Password#1
    const signatureString = `${merchantLogin}:${amount}:${invoiceId}:${password1}`;
    
    // Создаем MD5 хеш
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Получаем текущий домен для URL возврата
    const referer = req.headers.get('referer') || 'https://your-domain.com';
    const baseUrl = new URL(referer).origin;

    // Параметры для формы Robokassa
    const robokassaParams = {
      MerchantLogin: merchantLogin,
      OutSum: amount.toString(),
      InvoiceID: invoiceId,
      Description: description,
      SignatureValue: signature,
      Culture: 'ru',
      Shp_user_id: 'anonymous', // Анонимный пользователь
      SuccessURL: `${baseUrl}/?payment=success`,
      FailURL: `${baseUrl}/?payment=fail`
    };

    console.log('Created Robokassa payment:', {
      merchantLogin,
      amount,
      invoiceId,
      signature: signature.substring(0, 8) + '...' // Логируем только начало подписи для безопасности
    });

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: 'https://auth.robokassa.ru/Merchant/Index.aspx',
        params: robokassaParams,
        invoiceId
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Robokassa payment creation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Ошибка при создании платежа',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});