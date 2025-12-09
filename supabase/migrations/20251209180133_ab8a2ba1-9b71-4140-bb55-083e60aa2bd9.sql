
-- КОРРЕКЦИЯ всех недостающих реферальных бонусов

-- 1. Cheh: добавляем недостающие 50 OC от платежа Cheh14 (уровень 1, 10% от 1000)
-- Сейчас в referrals.bonus_earned = 50, должно быть 100
UPDATE public.referrals 
SET bonus_earned = 100
WHERE referrer_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f' 
  AND referred_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa';

-- 2. Cheh: начисляем недостающие 50 OC на баланс
UPDATE public.profiles 
SET oilcoin_balance = oilcoin_balance + 50
WHERE user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f';

-- 3. Запись в историю для Cheh
INSERT INTO public.money_transfers (
  from_user_id, to_user_id, amount, description, transfer_type, status, created_by
) VALUES (
  '7c4808eb-6a92-40a6-9130-572715ecbb8f',
  '7c4808eb-6a92-40a6-9130-572715ecbb8f',
  50,
  'Реферальный бонус 1-го уровня от пополнения Cheh14 (коррекция)',
  'referral_bonus',
  'completed',
  '7c4808eb-6a92-40a6-9130-572715ecbb8f'
);

-- 4. Alexandr55: добавляем 4 OC от платежей Alexandr (уровень 1, 10% от 40)
UPDATE public.referrals 
SET bonus_earned = 4
WHERE referrer_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c' 
  AND referred_id = '6aa50831-acdc-42d9-87bb-67899957712a';

-- 5. Alexandr55: начисляем 4 OC на баланс
UPDATE public.profiles 
SET oilcoin_balance = oilcoin_balance + 4
WHERE user_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c';

-- 6. Запись в историю для Alexandr55
INSERT INTO public.money_transfers (
  from_user_id, to_user_id, amount, description, transfer_type, status, created_by
) VALUES (
  'd41e012f-b980-48d5-8d73-9ffbff0a408c',
  'd41e012f-b980-48d5-8d73-9ffbff0a408c',
  4,
  'Реферальный бонус 1-го уровня от пополнений Alexandr (коррекция)',
  'referral_bonus',
  'completed',
  'd41e012f-b980-48d5-8d73-9ffbff0a408c'
);
