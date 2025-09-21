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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }
    
    console.log('Robokassa webhook received:', params);

    const merchantLogin = Deno.env.get('ROBOKASSA_MERCHANT_LOGIN');
    const password2 = Deno.env.get('ROBOKASSA_PASSWORD2');
    
    if (!merchantLogin || !password2) {
      console.error('Missing Robokassa configuration for webhook');
      return new Response('Invalid configuration', { status: 500 });
    }

    // Проверяем подпись
    const outSum = params.OutSum;
    const invoiceId = params.InvoiceID;
    const signatureValue = params.SignatureValue;
    
    // Создаем строку для проверки подписи: OutSum:InvoiceID:Password#2
    const signatureString = `${outSum}:${invoiceId}:${password2}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    if (signatureValue?.toUpperCase() !== expectedSignature) {
      console.error('Invalid Robokassa signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const amount = parseFloat(outSum);
    const ocAmount = amount; // По умолчанию 1:1
    
    // Получаем user_id (нужно добавить в URL при создании платежа)
    let userId = params.Shp_user_id; // Дополнительный параметр
    
    if (!userId) {
      console.error('User ID not found in Robokassa parameters');
      return new Response('User ID not found', { status: 400 });
    }

    // Обновляем баланс пользователя
    const { error: balanceError } = await supabaseClient.rpc('add_user_balance', {
      user_id: userId,
      amount_to_add: ocAmount
    });

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      return new Response('Failed to update balance', { status: 500 });
    }

    // Создаем запись о пополнении
    const { error: transferError } = await supabaseClient
      .from('money_transfers')
      .insert({
        from_user_id: userId,
        to_user_id: userId,
        amount: amount,
        description: `Пополнение через Robokassa (${ocAmount.toLocaleString()} OC) #${invoiceId}`,
        transfer_type: 'topup',
        status: 'completed'
      });

    if (transferError) {
      console.error('Error creating transfer record:', transferError);
    }

    console.log(`Robokassa payment processed: ${amount}₽ → ${ocAmount} OC for user ${userId}`);

    // Robokassa ожидает ответ OK
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Robokassa webhook error:', error);
    return new Response('Error', { status: 500 });
  }
});