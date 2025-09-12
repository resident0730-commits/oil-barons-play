-- Fix Security Definer View issue with explicit ownership
DROP VIEW IF EXISTS public.leaderboard CASCADE;

-- Create the view with explicit security invoker behavior
CREATE OR REPLACE VIEW public.leaderboard 
WITH (security_invoker = true) AS
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

-- Set proper ownership to avoid security definer behavior
ALTER VIEW public.leaderboard OWNER TO authenticated;

-- Grant appropriate permissions
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;