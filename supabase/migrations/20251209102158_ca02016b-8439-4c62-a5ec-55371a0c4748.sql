-- 1. Удаляем циклическую связь (Alexandr → Alexandr55)
DELETE FROM public.referrals 
WHERE referrer_id = '6aa50831-acdc-42d9-87bb-67899957712a' 
  AND referred_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c';

-- 2. Создаём триггер для автоматического начисления реферальных бонусов при пополнении
CREATE OR REPLACE TRIGGER on_payment_completed
  AFTER UPDATE ON public.payment_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_check_referral_rewards();

-- 3. Вручную начисляем бонусы за пропущенное пополнение Cheh14 (1000₽)
-- Cheh14 → Cheh → Alexandr55
-- Уровень 1 (Cheh): 1000 * 10% = 100
-- Уровень 2 (Alexandr55): 1000 * 5% = 50

UPDATE public.profiles
SET oilcoin_balance = oilcoin_balance + 100
WHERE user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f'; -- Cheh

UPDATE public.profiles
SET oilcoin_balance = oilcoin_balance + 50
WHERE user_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c'; -- Alexandr55

-- Обновляем bonus_earned в referrals
UPDATE public.referrals
SET bonus_earned = bonus_earned + 100
WHERE referrer_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f'
  AND referred_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa'; -- Cheh → Cheh14

UPDATE public.referrals
SET bonus_earned = bonus_earned + 50
WHERE referrer_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c'
  AND referred_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f'; -- Alexandr55 → Cheh