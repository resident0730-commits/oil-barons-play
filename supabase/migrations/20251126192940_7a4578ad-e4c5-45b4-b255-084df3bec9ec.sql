-- Исправление проблемы Security Definer View
-- Удаляем view и создаем его без security definer

DROP VIEW IF EXISTS public.public_profiles;

-- Пересоздаем view без SECURITY DEFINER
-- Используем RLS политики для контроля доступа вместо SECURITY DEFINER
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  nickname,
  created_at,
  status_titles,
  is_banned
FROM public.profiles
WHERE is_banned = false;

-- Отзываем все права и даем только SELECT
REVOKE ALL ON public.public_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_profiles TO authenticated, anon;

COMMENT ON VIEW public.public_profiles IS 'Публичный view профилей без чувствительных финансовых данных. Использует security_invoker для проверки прав через RLS.';