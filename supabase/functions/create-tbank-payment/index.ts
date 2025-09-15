import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== T-Bank Payment Function Start ===");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("CORS preflight handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing payment request...");
    const { amount, currency = 'RUB' } = await req.json();
    console.log("Amount:", amount, "Currency:", currency);

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
    baseUrl = baseUrl || "https://lovable.dev";

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

    // Generate token for T-Bank API - correct format: key=value pairs joined + password
    const tokenParams = {
      Amount: paymentData.Amount,
      CustomerKey: paymentData.CustomerKey,
      Description: paymentData.Description,
      FailURL: paymentData.FailURL,
      Language: paymentData.Language,
      OrderId: paymentData.OrderId,
      PayType: paymentData.PayType,
      SuccessURL: paymentData.SuccessURL,
      TerminalKey: paymentData.TerminalKey
    };
    
    const sortedKeys = Object.keys(tokenParams).sort();
    const tokenPairs = sortedKeys.map(key => `${key}=${tokenParams[key]}`);
    const tokenString = tokenPairs.join('') + password;
    
    console.log('Token generation completed');

    const token = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tokenString));
    const hashArray = Array.from(new Uint8Array(token));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    paymentData.Token = hashHex;

    console.log('Sending request to T-Bank API...');

    // Use test API endpoint for T-Bank
    const response = await fetch('https://rest-api-test.tinkoff.ru/v2/Init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const responseData = await response.json();
    console.log('T-Bank response:', responseData);

    if (!response.ok) {
      console.error('T-Bank HTTP error:', response.status, responseData);
      throw new Error('Ошибка создания платежа в Т-Банк');
    }

    if (!responseData.Success) {
      console.error('T-Bank payment error:', responseData);
      throw new Error(responseData.Message || 'Ошибка создания платежа');
    }

    return new Response(
      JSON.stringify({ 
        url: responseData.PaymentURL,
        paymentId: responseData.PaymentId
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("T-Bank payment error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});