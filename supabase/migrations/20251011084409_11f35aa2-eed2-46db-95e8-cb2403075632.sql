-- Добавляем колонку для хранения суммы с бонусом
ALTER TABLE public.payment_invoices 
ADD COLUMN IF NOT EXISTS total_amount numeric NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.payment_invoices.total_amount IS 'Сумма с учетом бонусов, которую получит пользователь';