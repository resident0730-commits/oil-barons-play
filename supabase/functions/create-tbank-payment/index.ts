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

    // Test basic functionality first
    return new Response(
      JSON.stringify({ 
        message: "Function works",
        timestamp: new Date().toISOString()
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Step ERROR:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal error" }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});