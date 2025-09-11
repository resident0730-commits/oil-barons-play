-- Remove the security definer view and replace with a regular view
DROP VIEW IF EXISTS public.leaderboard;

-- Create a regular view without SECURITY DEFINER
CREATE VIEW public.leaderboard AS
SELECT 
  nickname,
  balance,
  daily_income,
  created_at,
  'player' as player_type
FROM public.profiles 
WHERE is_banned = false
UNION ALL
SELECT 
  nickname,
  balance,
  daily_income,
  created_at,
  'bot' as player_type
FROM public.bot_players
ORDER BY balance DESC;