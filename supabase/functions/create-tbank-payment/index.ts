import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== T-Bank Payment Function Start ===");
  console.log("Method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("CORS preflight handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Step 1: Reading request body");
    const body = await req.text();
    console.log("Raw body:", body);
    
    let requestData;
    try {
      requestData = JSON.parse(body);
      console.log("Parsed data:", requestData);
    } catch (parseError) {
      console.error("JSON parse failed:", parseError.message);
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Step 2: Validating amount");
    const { amount, currency = 'RUB' } = requestData;
    if (!amount || amount <= 0) {
      console.error("Invalid amount:", amount);
      return new Response(
        JSON.stringify({ error: "Invalid amount" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Step 3: Getting credentials");
    const terminalKey = Deno.env.get("TBANK_TERMINAL_KEY");
    const password = Deno.env.get("TBANK_PASSWORD");
    
    console.log("Terminal key exists:", !!terminalKey);
    console.log("Password exists:", !!password);
    
    if (!terminalKey || !password) {
      console.error("Missing T-Bank credentials");
      return new Response(
        JSON.stringify({ error: "T-Bank not configured" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Step 4: Success response");
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Function is working",
        amount: amount,
        terminalKey: terminalKey.substring(0, 5) + "***"
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error.message);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});