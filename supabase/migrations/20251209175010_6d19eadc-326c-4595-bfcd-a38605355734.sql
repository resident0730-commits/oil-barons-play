
-- Удаляем дублирующий триггер, который вызывает двойное начисление бонусов
DROP TRIGGER IF EXISTS on_payment_completed_check_rewards ON public.payment_invoices;

-- Оставляем только один триггер on_payment_completed на UPDATE
