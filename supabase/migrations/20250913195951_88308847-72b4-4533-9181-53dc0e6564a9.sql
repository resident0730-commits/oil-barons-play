-- Fix Function Search Path Mutable warnings by setting search_path for functions

-- Update generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$function$;

-- Update handle_referral_code_generation function  
CREATE OR REPLACE FUNCTION public.handle_referral_code_generation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = NEW.referral_code) LOOP
      NEW.referral_code := generate_referral_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;

-- Update calculate_status_multiplier function
CREATE OR REPLACE FUNCTION public.calculate_status_multiplier(user_titles text[])
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $function$
DECLARE
    multiplier NUMERIC := 1.0;
BEGIN
    -- Oil King: +5% income
    IF 'oil_king' = ANY(user_titles) THEN
        multiplier := multiplier + 0.05;
    END IF;
    
    -- Leader: +3% income  
    IF 'leader' = ANY(user_titles) THEN
        multiplier := multiplier + 0.03;
    END IF;
    
    -- Ambassador: +10% referral bonus (handled separately)
    -- Other titles: +2% income each
    IF 'industrialist' = ANY(user_titles) THEN
        multiplier := multiplier + 0.02;
    END IF;
    
    RETURN multiplier;
END;
$function$;

-- Update record_daily_stats function
CREATE OR REPLACE FUNCTION public.record_daily_stats(p_user_id uuid, p_balance_start numeric DEFAULT NULL::numeric, p_balance_end numeric DEFAULT NULL::numeric, p_daily_income_total numeric DEFAULT NULL::numeric, p_wells_count integer DEFAULT NULL::integer, p_investments_made numeric DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.daily_stats (
    user_id, 
    date, 
    balance_start, 
    balance_end, 
    daily_income_total, 
    wells_count, 
    investments_made
  )
  VALUES (
    p_user_id,
    current_date,
    COALESCE(p_balance_start, 0),
    COALESCE(p_balance_end, 0),
    COALESCE(p_daily_income_total, 0),
    COALESCE(p_wells_count, 0),
    COALESCE(p_investments_made, 0)
  )
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    balance_end = COALESCE(EXCLUDED.balance_end, daily_stats.balance_end),
    daily_income_total = COALESCE(EXCLUDED.daily_income_total, daily_stats.daily_income_total),
    wells_count = COALESCE(EXCLUDED.wells_count, daily_stats.wells_count),
    investments_made = daily_stats.investments_made + COALESCE(EXCLUDED.investments_made, 0);
END;
$function$;