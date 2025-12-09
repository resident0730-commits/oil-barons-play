-- Исправляем связь Cheh14 → Cheh
-- Cheh14 user_id: 524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa
-- Cheh user_id: 7c4808eb-6a92-40a6-9130-572715ecbb8f

-- 1. Обновляем referred_by в профиле Cheh14
UPDATE public.profiles
SET referred_by = '7c4808eb-6a92-40a6-9130-572715ecbb8f'
WHERE user_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa'
  AND referred_by IS NULL;

-- 2. Создаем запись в таблице referrals (если не существует)
INSERT INTO public.referrals (referrer_id, referred_id, referral_code, is_active, bonus_earned)
SELECT 
  '7c4808eb-6a92-40a6-9130-572715ecbb8f',
  '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa',
  (SELECT referral_code FROM public.profiles WHERE user_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f'),
  true,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM public.referrals 
  WHERE referrer_id = '7c4808eb-6a92-40a6-9130-572715ecbb8f' 
    AND referred_id = '524c90c0-23a5-4b0b-a3bd-d6c63b00b1aa'
);