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

    // Get T-Bank credentials
    const terminalKey = Deno.env.get("TBANK_TERMINAL_KEY");
    const password = Deno.env.get("TBANK_PASSWORD");
    
    if (!terminalKey || !password) {
      throw new Error("Т-Банк не настроен");
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

    // Generate order ID
    const orderId = crypto.randomUUID();

    // Create T-Bank payment request
    const paymentData = {
      TerminalKey: terminalKey,
      Amount: Math.round(amount * 100), // T-Bank expects amount in kopecks
      OrderId: orderId,
      Description: "Пополнение баланса Oil Tycoon",
      PayType: "O", // One-step payment
      Language: "ru",
      CustomerKey: userEmail,
      SuccessURL: `${baseUrl}/dashboard?payment=success`,
      FailURL: `${baseUrl}/dashboard?payment=failed`,
      NotificationURL: `${baseUrl}/api/tbank-webhook`, // For future webhook implementation
      Receipt: {
        Email: userEmail,
        Taxation: "usn_income",
        Items: [{
          Name: "Пополнение игрового баланса",
          Price: Math.round(amount * 100),
          Quantity: 1.00,
          Amount: Math.round(amount * 100),
          Tax: "none"
        }]
      }
    };

    // Generate token for T-Bank API
    // Create a copy without Token field for token generation
    const tokenData = { ...paymentData };
    delete tokenData.Token;
    
    // Convert values to strings and sort keys
    const tokenValues = Object.keys(tokenData)
      .filter(key => tokenData[key] !== undefined && tokenData[key] !== null)
      .sort()
      .map(key => tokenData[key].toString())
      .join('');
    
    const tokenString = tokenValues + password;
    
    console.log('Token string for hash:', tokenString.replace(password, '[PASSWORD]'));

    const token = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tokenString));
    const hashArray = Array.from(new Uint8Array(token));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    paymentData.Token = hashHex;

    console.log('Creating T-Bank payment with data:', { ...paymentData, Token: '[HIDDEN]' });

    // Use test API endpoint for T-Bank
    const apiUrl = 'https://rest-api-test.tinkoff.ru/v2/Init';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('T-Bank error:', errorData);
      throw new Error('Ошибка создания платежа в Т-Банк');
    }

    const payment = await response.json();

    if (!payment.Success) {
      console.error('T-Bank payment error:', payment);
      throw new Error(payment.Message || 'Ошибка создания платежа');
    }

    return new Response(
      JSON.stringify({ 
        url: payment.PaymentURL,
        paymentId: payment.PaymentId
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("T-Bank payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});