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
    // Parse POST data from form body
    const formData = await req.formData()
    const outSum = formData.get('OutSum')?.toString()
    const invId = formData.get('InvId')?.toString()
    const signatureValue = formData.get('SignatureValue')?.toString()

    console.log('Robokassa Result callback received (POST):', { 
      outSum, 
      invId, 
      signatureValue
    })

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

    // Verify signature БЕЗ дополнительных параметров
    // Формат для Result URL: OutSum:InvId:Password#2
    // Robokassa передает сумму в разных форматах, попробуем все варианты
    const outSumFormatted = parseFloat(outSum).toFixed(2)
    
    // Вариант 1: с .00
    const signatureString1 = `${outSumFormatted}:${invId}:${password2}`
    // Вариант 2: как пришло
    const signatureString2 = `${outSum}:${invId}:${password2}`
    // Вариант 3: как целое число
    const signatureString3 = `${Math.floor(parseFloat(outSum))}:${invId}:${password2}`
    
    console.log('Testing multiple signature formats:', {
      variant1: signatureString1,
      variant2: signatureString2,
      variant3: signatureString3,
      received: signatureValue
    })
    
    const encoder = new TextEncoder();
    
    // Проверяем все варианты
    const variants = [signatureString1, signatureString2, signatureString3]
    let isValid = false
    let matchedVariant = ''
    
    for (const variant of variants) {
      const data = encoder.encode(variant);
      const hashBuffer = await crypto.subtle.digest('MD5', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      if (calculatedSignature === signatureValue) {
        isValid = true
        matchedVariant = variant
        console.log('✅ Signature matched with variant:', variant)
        break
      }
    }

    console.log('Signature verification result:', { 
      received: signatureValue,
      isValid,
      matchedVariant
    })

    if (!isValid) {
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

    // Получаем userId из таблицы payment_invoices
    const { data: invoice, error: invoiceError } = await supabase
      .from('payment_invoices')
      .select('user_id, status, total_amount')
      .eq('invoice_id', invId)
      .single()

    if (invoiceError || !invoice) {
      console.error('Invoice not found:', invoiceError)
      return new Response('Invoice not found', { 
        status: 404,
        headers: corsHeaders 
      })
    }

    if (invoice.status === 'completed') {
      console.log('Invoice already processed, skipping')
      return new Response('OK', {
        status: 200,
        headers: corsHeaders
      })
    }

    const userId = invoice.user_id
    const totalAmount = invoice.total_amount || parseFloat(outSum) // Используем total_amount с бонусом
    console.log('Found userId from invoice:', userId, 'Total amount with bonus:', totalAmount)

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

    const rubPaid = parseFloat(outSum) // Сумма в рублях, которую заплатил пользователь
    
    console.log(`Processing payment for user ${userId}, paid: ${rubPaid}₽, will receive: ${totalAmount}₽ (bonus: ${totalAmount - rubPaid}₽)`)
    console.log(`Current balance: ${profile.balance}, New balance will be: ${profile.balance + totalAmount}`)

    // Update user balance - зачисляем сумму с бонусом
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        balance: profile.balance + totalAmount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return new Response('Failed to update balance', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Обновляем статус инвойса
    await supabase
      .from('payment_invoices')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('invoice_id', invId)

    // Log the transaction
    const bonusAmount = totalAmount - rubPaid
    const { error: logError } = await supabase
      .from('money_transfers')
      .insert({
        from_user_id: userId,
        to_user_id: userId,
        amount: rubPaid,
        transfer_type: 'topup',
        description: `Пополнение через Robokassa (${rubPaid}₽ = ${totalAmount}₽${bonusAmount > 0 ? `, бонус: +${bonusAmount}₽` : ''}) #${invId}`,
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
