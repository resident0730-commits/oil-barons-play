-- Добавляем 'topup' в разрешенные типы для money_transfers
ALTER TABLE public.money_transfers 
DROP CONSTRAINT IF EXISTS money_transfers_transfer_type_check;

ALTER TABLE public.money_transfers 
ADD CONSTRAINT money_transfers_transfer_type_check 
CHECK (transfer_type IN ('admin_transfer', 'withdrawal', 'topup', 'deposit', 'payment'));