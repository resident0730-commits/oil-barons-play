-- Удаляем небезопасное представление public_profiles
-- Оно дублирует функционал get_public_profiles(), которая уже защищена
DROP VIEW IF EXISTS public.public_profiles;

-- Создаём представление заново с security_invoker = true
-- Это заставляет представление использовать RLS политики вызывающего пользователя
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS 
SELECT 
  p.id,
  p.user_id,
  p.nickname,
  p.created_at,
  p.status_titles,
  p.is_banned
FROM public.profiles p
WHERE p.is_banned = false;