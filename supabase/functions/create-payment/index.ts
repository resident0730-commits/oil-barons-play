import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'RUB' } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Укажите корректную сумму");
    }

    // Get YooKassa credentials
    const shopId = Deno.env.get("YOOKASSA_SHOP_ID");
    const secretKey = Deno.env.get("YOOKASSA_SECRET_KEY");
    
    if (!shopId || !secretKey) {
      throw new Error("Платежная система не настроена");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      (Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "")
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    let userEmail = "guest@example.com";

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
      }
    }

    // Build base URL for redirects
    const originHeader = req.headers.get("origin");
    const refererHeader = req.headers.get("referer");
    let baseUrl = originHeader ?? "";
    if (!baseUrl && refererHeader) {
      try {
        baseUrl = new URL(refererHeader).origin;
      } catch (_) {
        // ignore parse error
      }
    }
    baseUrl = baseUrl || Deno.env.get("PUBLIC_SITE_URL") || Deno.env.get("FRONTEND_URL") || "https://lovable.dev";

    // Create YooKassa payment
    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: currency
      },
      confirmation: {
        type: "redirect",
        return_url: `${baseUrl}/dashboard?payment=success`
      },
      capture: true,
      description: "Пополнение баланса Oil Tycoon",
      receipt: {
        customer: {
          email: userEmail
        },
        items: [{
          description: "Пополнение игрового баланса",
          quantity: "1.00",
          amount: {
            value: amount.toFixed(2),
            currency: currency
          },
          vat_code: 1
        }]
      }
    };

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${shopId}:${secretKey}`)}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': crypto.randomUUID()
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('YooKassa error:', errorData);
      throw new Error('Ошибка создания платежа');
    }

    const payment = await response.json();

    return new Response(
      JSON.stringify({ 
        url: payment.confirmation.confirmation_url,
        paymentId: payment.id
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});