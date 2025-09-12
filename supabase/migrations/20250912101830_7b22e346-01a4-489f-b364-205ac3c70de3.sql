-- Remove the problematic view completely
DROP VIEW IF EXISTS public.leaderboard CASCADE;

-- Create a security invoker function instead of a view
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE(
  nickname text,
  balance numeric,
  daily_income numeric,
  created_at timestamp with time zone,
  player_type text
)
LANGUAGE sql
SECURITY INVOKER -- This is the key - not SECURITY DEFINER
STABLE
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon;