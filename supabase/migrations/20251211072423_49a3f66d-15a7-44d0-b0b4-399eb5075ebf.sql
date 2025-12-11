
-- Доначисляем недостающие 50₽ бонуса 1-го уровня пользователю Cheh
UPDATE public.profiles
SET ruble_balance = ruble_balance + 50
WHERE user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f';

-- Записываем транзакцию
INSERT INTO public.money_transfers (
  from_user_id,
  to_user_id,
  amount,
  description,
  transfer_type,
  status,
  created_by
) VALUES (
  '7c4808eb-6a92-40a6-9130-572715ecbb8f',
  '7c4808eb-6a92-40a6-9130-572715ecbb8f',
  50,
  'Реферальный бонус 1-го уровня от пополнения Cheh14 (доначисление)',
  'referral_bonus',
  'completed',
  '7c4808eb-6a92-40a6-9130-572715ecbb8f'
);

-- Обновляем bonus_earned в referrals (должно быть 100, а не текущее значение)
UPDATE public.referrals
SET bonus_earned = 100
WHERE referrer_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f'
  AND referred_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa';
