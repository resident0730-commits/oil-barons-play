-- Fix remaining Function Search Path Mutable warning

-- Update update_referral_bonus function
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

-- Update get_leaderboard function  
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE(nickname text, balance numeric, daily_income numeric, created_at timestamp with time zone, player_type text)
LANGUAGE sql
STABLE
SET search_path = public
AS $function$
  SELECT 
    p.nickname,
    p.balance,
    p.daily_income,
    p.created_at,
    'player'::text as player_type
  FROM public.profiles p
  WHERE p.is_banned = false
  
  UNION ALL
  
  SELECT 
    b.nickname,
    b.balance,
    b.daily_income,
    b.created_at,
    'bot'::text as player_type  
  FROM public.bot_players b
  
  ORDER BY balance DESC;
$function$;