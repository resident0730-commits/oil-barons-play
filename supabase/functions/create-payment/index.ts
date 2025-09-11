import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      (Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "")
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    let userEmail = "guest@example.com";
    let customerId = undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
        
        // Check if customer exists
        const customers = await stripe.customers.list({ 
          email: userEmail, 
          limit: 1 
        });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }
      }
    }

    // Build base URL for redirects (origin -> referer -> env -> fallback)
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { 
              name: "Пополнение баланса Oil Tycoon"
            },
            unit_amount: Math.round(amount * 100), // Convert to kopecks
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/settings?payment=cancelled`,
    });

    return new Response(
      JSON.stringify({ url: session.url }), 
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