-- Удаляем дублирующий триггер, который вызывает конфликт
DROP TRIGGER IF EXISTS on_profile_referral_set ON public.profiles;

-- Также удаляем функцию, она больше не нужна
DROP FUNCTION IF EXISTS public.handle_new_referral();