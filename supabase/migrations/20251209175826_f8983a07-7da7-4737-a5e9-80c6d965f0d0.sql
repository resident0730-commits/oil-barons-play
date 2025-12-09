
-- Добавляем недостающий бонус Alexandr55 от платежа Cheh14 (уровень 2, 5%)
-- Платёж был 1000 OC, бонус 5% = 50 OC

-- 1. Начисляем на баланс
UPDATE public.profiles 
SET oilcoin_balance = oilcoin_balance + 50
WHERE user_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c';

-- 2. Создаём запись в истории
INSERT INTO public.money_transfers (
  from_user_id,
  to_user_id,
  amount,
  description,
  transfer_type,
  status,
  created_by
) VALUES (
  'd41e012f-b980-48d5-8d73-9ffbff0a408c',
  'd41e012f-b980-48d5-8d73-9ffbff0a408c',
  50,
  'Реферальный бонус 2-го уровня от пополнения (коррекция)',
  'referral_bonus',
  'completed',
  'd41e012f-b980-48d5-8d73-9ffbff0a408c'
);
