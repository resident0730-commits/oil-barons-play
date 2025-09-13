-- Fix remaining function search path issue
CREATE OR REPLACE FUNCTION public.update_referral_bonus(referrer_user_id uuid, earned_amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.referrals 
  SET bonus_earned = bonus_earned + earned_amount,
      updated_at = now()
  WHERE referrer_id = referrer_user_id;
END;
$function$;