import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts";

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

    console.log('Robokassa Result callback received:', { outSum, invId, signatureValue })

    if (!outSum || !invId || !signatureValue) {
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

    // Verify signature
    const signatureString = `${outSum}:${invId}:${password2}`
    const hash = createHash("md5")
    hash.update(signatureString)
    const calculatedSignature = hash.toString().toUpperCase()

    console.log('Signature verification:', { 
      received: signatureValue, 
      calculated: calculatedSignature,
      match: signatureValue === calculatedSignature 
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

    // Get recent profiles to find the user (you may want to improve this logic)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return new Response('Database error', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    if (!profiles || profiles.length === 0) {
      console.error('No profiles found')
      return new Response('No users found', { 
        status: 404,
        headers: corsHeaders 
      })
    }

    // Use the first profile (you may want to implement better user identification)
    const userId = profiles[0].id
    const amount = parseFloat(outSum)

    console.log(`Processing payment for user ${userId}, amount: ${amount}`)

    // Update user balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        balance: profiles[0].balance + amount 
      })
      .eq('id', userId)

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
        user_id: userId,
        amount: amount,
        type: 'deposit',
        description: `Пополнение через Robokassa (Invoice: ${invId})`,
        status: 'completed'
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
