-- Fix function search path mutable issue
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE(
  nickname text,
  balance numeric,
  daily_income numeric,
  created_at timestamp with time zone,
  player_type text
)
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = public -- Fix search path issue
AS $$
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
$$;