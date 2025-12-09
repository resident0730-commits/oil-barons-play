
-- Исправляем балансы пользователей (вычитаем дублированные бонусы)
UPDATE public.profiles SET oilcoin_balance = oilcoin_balance - 100 WHERE user_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa';
UPDATE public.profiles SET oilcoin_balance = oilcoin_balance - 50 WHERE user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f';
UPDATE public.profiles SET oilcoin_balance = oilcoin_balance - 30 WHERE user_id = 'd41e012f-b980-48d5-8d73-9ffbff0a408c';

-- Исправляем bonus_earned в referrals (Cheh14 получил 200 вместо 100)
UPDATE public.referrals SET bonus_earned = 100 WHERE id = 'eae4576b-1cd3-4641-841c-4acbad88e40d';

-- Исправляем bonus_earned у Cheh (100 вместо 50 для level 1 реферала)
UPDATE public.referrals SET bonus_earned = 50 WHERE id = '46da84dc-f592-4c49-a9f9-fbcfdbe8a075';
