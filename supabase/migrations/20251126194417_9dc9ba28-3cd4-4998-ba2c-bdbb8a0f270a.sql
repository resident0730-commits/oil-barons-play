-- Заменяем представление public_profiles на security definer function
-- Это позволит контролировать доступ через функцию вместо представления

-- 1. Удаляем представление
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Создаем security definer function для получения публичных профилей
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  nickname text,
  created_at timestamp with time zone,
  status_titles text[],
  is_banned boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Требуем аутентификации для доступа к публичным профилям
  SELECT 
    p.id,
    p.user_id,
    p.nickname,
    p.created_at,
    p.status_titles,
    p.is_banned
  FROM profiles p
  WHERE p.is_banned = false
    AND auth.uid() IS NOT NULL; -- Только для аутентифицированных пользователей
$$;

-- 3. Даем право на выполнение функции аутентифицированным пользователям
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO authenticated;

-- 4. Создаем представление-обертку, которое использует функцию
CREATE VIEW public.public_profiles 
WITH (security_barrier = true, security_invoker = true) AS
SELECT * FROM public.get_public_profiles();

-- 5. Добавляем комментарии для документации
COMMENT ON FUNCTION public.get_public_profiles() IS 
'Returns public profiles of non-banned users for leaderboard functionality.
Requires authentication to access. Security definer function with explicit auth check.
Only exposes non-sensitive data: nickname, created_at, status_titles.
Financial data (balance, income) remains protected in the profiles table.';

COMMENT ON VIEW public.public_profiles IS 
'Public view of non-banned user profiles - wrapper for get_public_profiles() function.
Requires authentication to access.';

-- Проверка
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'get_public_profiles'
      AND pronamespace = 'public'::regnamespace
  ) THEN
    RAISE EXCEPTION 'get_public_profiles function was not created';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_views
    WHERE schemaname = 'public'
      AND viewname = 'public_profiles'
  ) THEN
    RAISE EXCEPTION 'public_profiles view was not created';
  END IF;
  
  RAISE NOTICE 'public_profiles secured with security definer function';
END $$;