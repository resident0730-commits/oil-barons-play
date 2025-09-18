-- Обновляем функцию get_leaderboard чтобы она работала как SECURITY DEFINER
-- Это позволит функции получить доступ к bot_players даже для обычных пользователей
DROP FUNCTION IF EXISTS public.get_leaderboard();

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE(nickname text, balance numeric, daily_income numeric, created_at timestamp with time zone, player_type text)
LANGUAGE sql
STABLE
SECURITY DEFINER  -- Важно: функция выполняется с правами создателя
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
  
  -- Для ботов показываем данные, но можем их модифицировать для безопасности
  SELECT 
    b.nickname,
    -- Показываем примерные данные вместо точных для безопасности
    FLOOR(b.balance / 1000) * 1000 as balance,  -- Округляем до тысяч
    FLOOR(b.daily_income / 100) * 100 as daily_income,  -- Округляем до сотен  
    b.created_at,
    'bot'::text as player_type  
  FROM public.bot_players b
  
  ORDER BY balance DESC;
$function$