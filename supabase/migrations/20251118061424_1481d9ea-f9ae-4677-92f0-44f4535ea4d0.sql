-- Add new balance columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS barrel_balance NUMERIC DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS oilcoin_balance NUMERIC DEFAULT 1000 NOT NULL,
ADD COLUMN IF NOT EXISTS ruble_balance NUMERIC DEFAULT 0 NOT NULL;

-- Migrate existing balance to oilcoin_balance (1:1)
UPDATE public.profiles 
SET oilcoin_balance = balance
WHERE oilcoin_balance = 1000; -- Only update if it's still the default value

-- Multiply daily_income in wells by 1000 (now producing barrels instead of rubles)
UPDATE public.wells 
SET daily_income = daily_income * 1000;

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default exchange rates
INSERT INTO public.exchange_rates (from_currency, to_currency, rate, is_active)
VALUES 
  ('BARREL', 'OILCOIN', 0.001, true),  -- 1000 barrels = 1 oilcoin
  ('OILCOIN', 'RUBLE', 1, true),       -- 1 oilcoin = 1 ruble
  ('RUBLE', 'OILCOIN', 1, true)        -- 1 ruble = 1 oilcoin (bidirectional)
ON CONFLICT DO NOTHING;

-- Create exchange_transactions table
CREATE TABLE IF NOT EXISTS public.exchange_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  from_amount NUMERIC NOT NULL,
  to_amount NUMERIC NOT NULL,
  exchange_rate NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for exchange_rates (everyone can view, only admins can modify)
CREATE POLICY "Anyone can view active exchange rates"
  ON public.exchange_rates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage exchange rates"
  ON public.exchange_rates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for exchange_transactions (users can view their own, admins can view all)
CREATE POLICY "Users can view their own exchange transactions"
  ON public.exchange_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exchange transactions"
  ON public.exchange_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all exchange transactions"
  ON public.exchange_transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to handle currency exchange
CREATE OR REPLACE FUNCTION public.exchange_currency(
  p_user_id UUID,
  p_from_currency TEXT,
  p_to_currency TEXT,
  p_from_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rate NUMERIC;
  v_to_amount NUMERIC;
  v_current_balance NUMERIC;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Get exchange rate
  SELECT rate INTO v_rate
  FROM public.exchange_rates
  WHERE from_currency = p_from_currency
    AND to_currency = p_to_currency
    AND is_active = true
  LIMIT 1;

  IF v_rate IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Exchange rate not found');
  END IF;

  -- Calculate to_amount
  v_to_amount := p_from_amount * v_rate;

  -- Check minimum exchange for barrels
  IF p_from_currency = 'BARREL' AND p_from_amount < 1000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Minimum exchange amount is 1000 barrels');
  END IF;

  -- Get current balance based on currency
  IF p_from_currency = 'BARREL' THEN
    SELECT barrel_balance INTO v_current_balance FROM public.profiles WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'OILCOIN' THEN
    SELECT oilcoin_balance INTO v_current_balance FROM public.profiles WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'RUBLE' THEN
    SELECT ruble_balance INTO v_current_balance FROM public.profiles WHERE user_id = p_user_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid currency');
  END IF;

  -- Check if user has enough balance
  IF v_current_balance < p_from_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
  END IF;

  -- Perform the exchange (deduct from_currency, add to_currency)
  IF p_from_currency = 'BARREL' THEN
    UPDATE public.profiles SET barrel_balance = barrel_balance - p_from_amount WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'OILCOIN' THEN
    UPDATE public.profiles SET oilcoin_balance = oilcoin_balance - p_from_amount WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'RUBLE' THEN
    UPDATE public.profiles SET ruble_balance = ruble_balance - p_from_amount WHERE user_id = p_user_id;
  END IF;

  IF p_to_currency = 'BARREL' THEN
    UPDATE public.profiles SET barrel_balance = barrel_balance + v_to_amount WHERE user_id = p_user_id;
  ELSIF p_to_currency = 'OILCOIN' THEN
    UPDATE public.profiles SET oilcoin_balance = oilcoin_balance + v_to_amount WHERE user_id = p_user_id;
  ELSIF p_to_currency = 'RUBLE' THEN
    UPDATE public.profiles SET ruble_balance = ruble_balance + v_to_amount WHERE user_id = p_user_id;
  END IF;

  -- Record transaction
  INSERT INTO public.exchange_transactions (user_id, from_currency, to_currency, from_amount, to_amount, exchange_rate)
  VALUES (p_user_id, p_from_currency, p_to_currency, p_from_amount, v_to_amount, v_rate);

  RETURN jsonb_build_object(
    'success', true,
    'from_amount', p_from_amount,
    'to_amount', v_to_amount,
    'rate', v_rate
  );
END;
$$;

-- Update add_user_balance function to work with oilcoin_balance
CREATE OR REPLACE FUNCTION public.add_user_balance(user_id uuid, amount_to_add numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update oilcoin balance (this is what top-ups should add to)
  UPDATE public.profiles 
  SET 
    oilcoin_balance = oilcoin_balance + amount_to_add,
    updated_at = now()
  WHERE profiles.user_id = add_user_balance.user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', user_id;
  END IF;
END;
$function$;