import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // First, check if the column already exists
    try {
      const { data: existingTicket } = await supabaseAdmin
        .from('support_tickets')
        .select('attachments')
        .limit(1)
        .maybeSingle()
      
      if (existingTicket !== null && 'attachments' in existingTicket) {
        return new Response(
          JSON.stringify({ message: 'Attachments column already exists' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
    } catch (selectError) {
      // Column doesn't exist, continue with adding it
      console.log('Column does not exist, will add it')
    }

    // Use direct SQL execution through the REST API
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: 'ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS attachments TEXT[]'
      })
    })

    if (!response.ok) {
      // Alternative approach: Use the SQL editor API
      const sqlResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/`, {
        method: 'POST',
        headers: {
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/sql',
        },
        body: 'ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS attachments TEXT[]'
      })

      if (!sqlResponse.ok) {
        throw new Error(`Failed to execute SQL: ${response.status} ${response.statusText}`)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Attachments column added successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        instruction: 'Please add the attachments column manually in Supabase Dashboard: ALTER TABLE support_tickets ADD COLUMN attachments TEXT[];'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})