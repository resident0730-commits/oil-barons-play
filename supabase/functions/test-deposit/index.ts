import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization')
    console.log('AUTH HEADER:', authHeader ? 'Present' : 'Missing')
    
    const { userId, rubAmount, ocAmount } = await req.json()
    
    console.log('TEST DEPOSIT:', { userId, rubAmount, ocAmount })

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return new Response(JSON.stringify({ error: 'User not found' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const oldBalance = profile.balance
    const newBalance = oldBalance + ocAmount

    console.log('BALANCE UPDATE:', { oldBalance, ocAmount, newBalance })

    // Update user balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to update balance' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Log the transaction
    const { error: logError } = await supabase
      .from('money_transfers')
      .insert({
        from_user_id: userId,
        to_user_id: userId,
        amount: ocAmount,
        transfer_type: 'deposit',
        description: `ТЕСТ: Пополнение ${rubAmount}₽ → ${ocAmount} OC`,
        status: 'completed',
        created_by: userId
      })

    if (logError) {
      console.error('Error logging transaction:', logError)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      oldBalance, 
      newBalance,
      transactionLogged: !logError
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Test deposit error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})