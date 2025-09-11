-- Fix Security Definer View issue by recreating leaderboard view properly
DROP VIEW IF EXISTS public.leaderboard;

-- Create leaderboard view without SECURITY DEFINER (default is SECURITY INVOKER)
CREATE VIEW public.leaderboard AS
SELECT 
  nickname,
  balance,
  daily_income,
  created_at,
  'player'::text as player_type
FROM public.profiles 
WHERE is_banned = false
UNION ALL
SELECT 
  nickname,
  balance,
  daily_income,
  created_at,
  'bot'::text as player_type
FROM public.bot_players
ORDER BY balance DESC;

-- Ensure proper permissions for the view
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;