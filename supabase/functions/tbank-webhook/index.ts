import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const notification = await req.json();
    console.log('T-Bank webhook received:', notification);

    // Проверяем статус платежа T-Bank
    if (notification.Status === 'CONFIRMED') {
      const paymentId = notification.PaymentId;
      const amount = parseFloat(notification.Amount) / 100; // T-Bank передает в копейках
      
      // Получаем данные из Description или других полей
      let ocAmount = amount; // По умолчанию 1:1
      let userId = notification.DATA?.user_id;

      if (!userId) {
        console.error('User ID not found in T-Bank notification');
        return new Response(
          JSON.stringify({ error: 'User ID not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Обновляем баланс пользователя
      const { error: balanceError } = await supabaseClient.rpc('add_user_balance', {
        user_id: userId,
        amount_to_add: ocAmount
      });

      if (balanceError) {
        console.error('Error updating user balance:', balanceError);
        return new Response(
          JSON.stringify({ error: 'Failed to update balance' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Создаем запись о пополнении
      const { error: transferError } = await supabaseClient
        .from('money_transfers')
        .insert({
          from_user_id: userId,
          to_user_id: userId,
          amount: amount,
          description: `Пополнение через Т-Банк (${ocAmount.toLocaleString()} OC) #${paymentId}`,
          transfer_type: 'topup',
          status: 'completed'
        });

      if (transferError) {
        console.error('Error creating transfer record:', transferError);
      }

      console.log(`T-Bank payment processed: ${amount}₽ → ${ocAmount} OC for user ${userId}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('T-Bank webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});