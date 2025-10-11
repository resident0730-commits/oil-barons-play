-- Обновляем constraint для transfer_type, добавляя все существующие и новые значения
ALTER TABLE public.money_transfers 
  DROP CONSTRAINT IF EXISTS money_transfers_transfer_type_check;

ALTER TABLE public.money_transfers
  ADD CONSTRAINT money_transfers_transfer_type_check 
  CHECK (transfer_type IN ('admin_transfer', 'withdrawal', 'referral_bonus', 'referral_reward', 'promo_code', 'topup'));