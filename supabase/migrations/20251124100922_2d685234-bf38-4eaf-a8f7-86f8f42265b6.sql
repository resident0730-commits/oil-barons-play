-- Отключаем триггер автоматического начисления баррелей
DROP TRIGGER IF EXISTS trigger_auto_claim_barrels ON public.profiles;

-- Удаляем функцию автоматического начисления
DROP FUNCTION IF EXISTS public.auto_claim_barrels_on_login();