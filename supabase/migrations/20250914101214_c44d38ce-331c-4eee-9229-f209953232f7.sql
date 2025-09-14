-- Create 20 demo accounts for testing
-- These will appear in leaderboard alongside real players

INSERT INTO public.profiles (user_id, nickname, balance, daily_income, created_at, updated_at) VALUES
-- Generate UUID for demo accounts using gen_random_uuid()
(gen_random_uuid(), 'Нефтяной Магнат', 150000000, 2500000, now() - interval '30 days', now()),
(gen_random_uuid(), 'Барон Буровых', 125000000, 2100000, now() - interval '28 days', now()),
(gen_random_uuid(), 'Король Нефти', 98000000, 1800000, now() - interval '25 days', now()),
(gen_random_uuid(), 'Газовый Гигант', 87500000, 1650000, now() - interval '22 days', now()),
(gen_random_uuid(), 'Промышленник', 76200000, 1420000, now() - interval '20 days', now()),
(gen_random_uuid(), 'Энергетический Босс', 68900000, 1280000, now() - interval '18 days', now()),
(gen_random_uuid(), 'Скважинный Эксперт', 59800000, 1150000, now() - interval '16 days', now()),
(gen_random_uuid(), 'Ресурсный Лидер', 52300000, 980000, now() - interval '14 days', now()),
(gen_random_uuid(), 'Топливный Тайкун', 46700000, 890000, now() - interval '12 days', now()),
(gen_random_uuid(), 'Буровой Специалист', 41200000, 780000, now() - interval '10 days', now()),
(gen_random_uuid(), 'Нефтяной Инвестор', 36800000, 690000, now() - interval '9 days', now()),
(gen_random_uuid(), 'Энергетический Гуру', 32500000, 610000, now() - interval '8 days', now()),
(gen_random_uuid(), 'Газовый Магистр', 28900000, 540000, now() - interval '7 days', now()),
(gen_random_uuid(), 'Промышленный Гений', 25600000, 480000, now() - interval '6 days', now()),
(gen_random_uuid(), 'Ресурсный Мастер', 22800000, 420000, now() - interval '5 days', now()),
(gen_random_uuid(), 'Скважинный Виртуоз', 20300000, 380000, now() - interval '4 days', now()),
(gen_random_uuid(), 'Топливный Эксперт', 18100000, 340000, now() - interval '3 days', now()),
(gen_random_uuid(), 'Буровой Мастер', 16200000, 310000, now() - interval '2 days', now()),
(gen_random_uuid(), 'Нефтяной Стратег', 14600000, 280000, now() - interval '1 day', now()),
(gen_random_uuid(), 'Энергетический Новатор', 13200000, 250000, now(), now());

-- Add some wells for demo accounts to make them more realistic
-- Get demo account IDs and add wells for top 10 demo accounts
WITH demo_accounts AS (
  SELECT user_id, nickname, balance 
  FROM public.profiles 
  WHERE nickname IN (
    'Нефтяной Магнат', 'Барон Буровых', 'Король Нефти', 'Газовый Гигант', 
    'Промышленник', 'Энергетический Босс', 'Скважинный Эксперт', 
    'Ресурсный Лидер', 'Топливный Тайкун', 'Буровой Специалист'
  )
  ORDER BY balance DESC
)
INSERT INTO public.wells (user_id, well_type, level, daily_income, created_at)
SELECT 
  da.user_id,
  CASE 
    WHEN da.balance > 120000000 THEN 'Cosmic Well'
    WHEN da.balance > 90000000 THEN 'Legendary Well'
    WHEN da.balance > 70000000 THEN 'Elite Well'
    WHEN da.balance > 50000000 THEN 'Super Well'
    ELSE 'Premium Well'
  END as well_type,
  CASE 
    WHEN da.balance > 120000000 THEN 15
    WHEN da.balance > 90000000 THEN 12
    WHEN da.balance > 70000000 THEN 10
    WHEN da.balance > 50000000 THEN 8
    ELSE 6
  END as level,
  CASE 
    WHEN da.balance > 120000000 THEN 180000
    WHEN da.balance > 90000000 THEN 150000
    WHEN da.balance > 70000000 THEN 120000
    WHEN da.balance > 50000000 THEN 95000
    ELSE 70000
  END as daily_income,
  now() - interval '15 days' as created_at
FROM demo_accounts da;

-- Add multiple wells for top demo accounts
WITH top_demo AS (
  SELECT user_id FROM public.profiles 
  WHERE nickname IN ('Нефтяной Магнат', 'Барон Буровых', 'Король Нефти')
)
INSERT INTO public.wells (user_id, well_type, level, daily_income, created_at)
SELECT 
  td.user_id,
  'Elite Well',
  8,
  95000,
  now() - interval '10 days'
FROM top_demo td;

-- Add some user achievements for demo accounts
WITH demo_with_achievements AS (
  SELECT user_id FROM public.profiles 
  WHERE nickname LIKE '%Магнат%' OR nickname LIKE '%Барон%' OR nickname LIKE '%Король%'
)
INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at, claimed)
SELECT 
  da.user_id,
  a.id,
  now() - interval '5 days',
  true
FROM demo_with_achievements da
CROSS JOIN (
  SELECT id FROM public.achievements 
  WHERE requirement_type = 'balance' AND requirement_value <= 50000000
  LIMIT 3
) a;

-- Add some boosters for top demo accounts
WITH top_demo_boosters AS (
  SELECT user_id FROM public.profiles 
  WHERE nickname IN ('Нефтяной Магнат', 'Барон Буровых', 'Король Нефти', 'Газовый Гигант')
)
INSERT INTO public.user_boosters (user_id, booster_type, level, expires_at, created_at)
SELECT 
  tdb.user_id,
  'advanced_equipment',
  3,
  now() + interval '7 days',
  now() - interval '2 days'
FROM top_demo_boosters tdb;