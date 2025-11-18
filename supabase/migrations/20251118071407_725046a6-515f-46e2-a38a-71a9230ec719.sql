-- Add last_barrel_claim field to track when barrels were last collected
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_barrel_claim TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to automatically claim barrels based on time passed
CREATE OR REPLACE FUNCTION public.claim_accumulated_barrels(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
  v_hours_passed NUMERIC;
  v_barrels_earned NUMERIC;
BEGIN
  -- Get user profile
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  -- Calculate hours passed since last claim
  v_hours_passed := EXTRACT(EPOCH FROM (now() - COALESCE(v_profile.last_barrel_claim, v_profile.created_at))) / 3600.0;
  
  -- Calculate barrels earned (daily_income / 24 * hours_passed)
  v_barrels_earned := (v_profile.daily_income / 24.0) * v_hours_passed;
  
  -- Update profile with new barrel balance and claim time
  UPDATE public.profiles
  SET 
    barrel_balance = barrel_balance + v_barrels_earned,
    last_barrel_claim = now(),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'barrels_earned', v_barrels_earned,
    'hours_passed', v_hours_passed,
    'new_balance', v_profile.barrel_balance + v_barrels_earned
  );
END;
$$;

-- Create trigger to auto-claim barrels on login
CREATE OR REPLACE FUNCTION public.auto_claim_barrels_on_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hours_passed NUMERIC;
  v_barrels_earned NUMERIC;
BEGIN
  -- Only process if last_login is being updated (user is logging in)
  IF NEW.last_login IS DISTINCT FROM OLD.last_login THEN
    -- Calculate hours passed since last claim
    v_hours_passed := EXTRACT(EPOCH FROM (NEW.last_login - COALESCE(OLD.last_barrel_claim, OLD.created_at))) / 3600.0;
    
    -- Calculate barrels earned (daily_income / 24 * hours_passed)
    v_barrels_earned := (NEW.daily_income / 24.0) * v_hours_passed;
    
    -- Update barrel balance and claim time
    NEW.barrel_balance := NEW.barrel_balance + v_barrels_earned;
    NEW.last_barrel_claim := NEW.last_login;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_auto_claim_barrels ON public.profiles;
CREATE TRIGGER trigger_auto_claim_barrels
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_claim_barrels_on_login();