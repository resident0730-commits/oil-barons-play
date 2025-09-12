-- Fix function security by adding proper search_path
CREATE OR REPLACE FUNCTION public.update_daily_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.game_statistics 
  SET 
    current_value = FLOOR(current_value * (1 + daily_growth_rate + (RANDOM() * 0.02 - 0.01))), -- Add some randomness ±1%
    last_updated = now()
  WHERE 
    DATE(last_updated) < CURRENT_DATE; -- Only update if not already updated today
END;
$$;