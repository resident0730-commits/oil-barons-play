import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse query parameters from URL
    const url = new URL(req.url)
    const outSum = url.searchParams.get('OutSum')
    const invId = url.searchParams.get('InvId')
    const signatureValue = url.searchParams.get('SignatureValue')
    const userId = url.searchParams.get('Shp_UserId')
    const shpAmount = url.searchParams.get('Shp_Amount')
    const shpCurrency = url.searchParams.get('Shp_Currency')

    console.log('Robokassa Result callback received:', { 
      outSum, 
      invId, 
      signatureValue, 
      userId, 
      shpAmount, 
      shpCurrency 
    })

    if (!outSum || !invId || !signatureValue || !userId) {
      console.error('Missing required parameters')
      return new Response('Missing parameters', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Get Robokassa credentials from environment
    const merchantLogin = Deno.env.get('ROBOKASSA_MERCHANT_LOGIN')
    const password2 = Deno.env.get('ROBOKASSA_PASSWORD2')

    if (!merchantLogin || !password2) {
      console.error('Missing Robokassa credentials')
      return new Response('Server configuration error', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Verify signature (with additional parameters)
    const signatureString = `${outSum}:${invId}:${password2}:Shp_Amount=${shpAmount}:Shp_Currency=${shpCurrency}:Shp_UserId=${userId}`
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    console.log('Signature verification:', { 
      received: signatureValue, 
      calculated: calculatedSignature,
      match: signatureValue === calculatedSignature,
      signatureString: signatureString 
    })

    if (signatureValue !== calculatedSignature) {
      console.error('Invalid signature')
      return new Response('Invalid signature', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user profile by the provided user ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return new Response('User not found', { 
        status: 404,
        headers: corsHeaders 
      })
    }

    if (!profile) {
      console.error('Profile not found for user:', userId)
      return new Response('User profile not found', { 
        status: 404,
        headers: corsHeaders 
      })
    }

    const amount = parseFloat(shpCurrency || outSum) // Use OC amount if available
    const rubAmount = parseFloat(outSum)

    console.log(`Processing payment for user ${userId}, OC amount: ${amount}, RUB amount: ${rubAmount}`)

    // Update user balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        balance: profile.balance + amount 
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return new Response('Failed to update balance', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Log the transaction
    const { error: logError } = await supabase
      .from('money_transfers')
      .insert({
        from_user_id: userId, // Система как отправитель
        to_user_id: userId,   // Пользователь как получатель
        amount: amount,
        transfer_type: 'deposit',
        description: `Пополнение через Robokassa (${rubAmount}₽ → ${amount.toLocaleString()} OC, Invoice: ${invId})`,
        status: 'completed',
        created_by: userId
      })

    if (logError) {
      console.error('Error logging transaction:', logError)
      // Don't return error here as the main operation (balance update) was successful
    }

    console.log(`Payment processed successfully for user ${userId}`)
    
    // Robokassa expects 'OK' response for successful processing
    return new Response('OK', {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error processing Robokassa result:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
