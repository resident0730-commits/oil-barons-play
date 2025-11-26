-- Исправление public_profiles view с использованием security_barrier
-- Это заставит представление использовать RLS политики базовой таблицы profiles

-- Удаляем старое представление
DROP VIEW IF EXISTS public.public_profiles;

-- Создаем новое представление с security_barrier
-- security_barrier = true заставляет PostgreSQL применять RLS политики базовой таблицы
-- security_invoker = true выполняет представление с правами вызывающего пользователя
CREATE VIEW public.public_profiles 
WITH (security_barrier = true, security_invoker = true) AS
SELECT 
  id,
  user_id,
  nickname,
  created_at,
  status_titles,
  is_banned
FROM profiles
WHERE is_banned = false;

-- Добавляем комментарий для документации
COMMENT ON VIEW public.public_profiles IS 
'Public view of non-banned user profiles for leaderboard functionality. 
Uses security_barrier and security_invoker to inherit RLS policies from profiles table.
Only exposes non-sensitive data: nickname, created_at, status_titles.
Financial data (balance, income) remains protected in the profiles table.';

-- Проверка
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_views
    WHERE schemaname = 'public'
      AND viewname = 'public_profiles'
  ) THEN
    RAISE EXCEPTION 'public_profiles view was not created';
  END IF;
  
  RAISE NOTICE 'public_profiles view secured with security_barrier and security_invoker';
END $$;