import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Step 1: Function started");

  if (req.method === "OPTIONS") {
    console.log("Step 2: CORS handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Step 3: Processing request");
    
    // Read and log request body
    const body = await req.json();
    console.log("Step 4: Request body:", JSON.stringify(body));
    
    const { amount, currency, oil_coins } = body;
    
    if (!amount || amount < 100) {
      console.log("Step 5: Invalid amount:", amount);
      return new Response(
        JSON.stringify({ error: "Минимальная сумма 100₽" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Step 6: Valid amount, creating test payment URL");
    
    // For now, return a test structure that matches what client expects
    const testPaymentUrl = `https://securepayments.tinkoff.ru/test?amount=${amount}&currency=${currency}`;
    
    console.log("Step 7: Returning payment URL:", testPaymentUrl);
    
    return new Response(
      JSON.stringify({ 
        url: testPaymentUrl,
        confirmation_url: testPaymentUrl,
        amount: amount,
        oil_coins: oil_coins,
        status: "test_payment"
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Step ERROR:", error.message);
    console.error("Step ERROR stack:", error.stack);
    return new Response(
      JSON.stringify({ error: "Internal error: " + error.message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});