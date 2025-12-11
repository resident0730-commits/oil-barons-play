-- Удаляем две записи по 50₽ бонуса 1-го уровня для Cheh
DELETE FROM public.money_transfers
WHERE to_user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f'
  AND transfer_type = 'referral_bonus'
  AND amount = 50
  AND description LIKE '%1-го уровня%';

-- Создаём одну объединённую запись на 100₽
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
  100,
  'Реферальный бонус 1-го уровня от пополнения Cheh14',
  'referral_bonus',
  'completed',
  '7c4808eb-6a92-40a6-9130-572715ecbb8f'
);