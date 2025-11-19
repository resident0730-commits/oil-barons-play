-- ВАЖНО: Выполните этот SQL-запрос в Supabase SQL Editor
-- чтобы отключить автоматическое начисление баррелей при логине

-- Отключаем триггер автоматического начисления баррелей
DROP TRIGGER IF EXISTS trigger_auto_claim_barrels ON public.profiles;

-- Удаляем функцию автоматического начисления
DROP FUNCTION IF EXISTS public.auto_claim_barrels_on_login();

-- Функция claim_accumulated_barrels остается для ручного сбора через кнопку "Собрать"
