
-- Корректировка балансов: вычитаем дублированные бонусы

-- Cheh14: получил 200 вместо 100, вычитаем 100
UPDATE public.profiles 
SET oilcoin_balance = oilcoin_balance - 100
WHERE user_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa';

-- Cheh: получил 100 вместо 50, вычитаем 50
UPDATE public.profiles 
SET oilcoin_balance = oilcoin_balance - 50
WHERE user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f';

-- Alexandr55: получил 60 вместо 30, вычитаем 30
UPDATE public.profiles 
SET oilcoin_balance = oilcoin_balance - 30
WHERE user_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c';

-- Удаляем дублированные записи о бонусах (оставляем по одной записи для каждого уровня)
DELETE FROM public.money_transfers
WHERE id IN (
  '7a3551e5-ae99-4861-8534-ec75d2e759c6',  -- дубль Cheh14 level 1
  'd3cdfa5a-70cd-4687-9e51-ce2a47bd4fb7',  -- дубль Cheh level 2
  '38513331-144f-478d-892c-90a54a8ed9b9'   -- дубль Alexandr55 level 3
);
