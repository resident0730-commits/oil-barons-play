-- Create a separate table for bot players to avoid foreign key issues
CREATE TABLE public.bot_players (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname text NOT NULL,
  balance numeric NOT NULL DEFAULT 1000.00,
  daily_income numeric NOT NULL DEFAULT 0.00,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for bot_players table
ALTER TABLE public.bot_players ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for leaderboards
CREATE POLICY "Bot players are viewable by everyone" 
ON public.bot_players 
FOR SELECT 
USING (true);

-- Insert bot players
INSERT INTO public.bot_players (nickname, balance, daily_income, created_at) VALUES
  ('Нефтяной_Магнат', 125000.50, 850.25, now() - interval '7 days'),
  ('Черное_Золото', 89750.00, 645.75, now() - interval '6 days'),
  ('Буровик_Профи', 156300.75, 1120.50, now() - interval '5 days'),
  ('Скважинный_Босс', 78950.25, 520.00, now() - interval '4 days'),
  ('Титан_Добычи', 245600.00, 1850.75, now() - interval '3 days'),
  ('Нефтяник_2024', 67830.50, 445.25, now() - interval '8 days'),
  ('Золотая_Вышка', 189540.75, 1325.50, now() - interval '2 days'),
  ('Энергетик_Плюс', 112750.00, 785.00, now() - interval '9 days'),
  ('Бурение_Мастер', 92400.25, 650.75, now() - interval '1 day'),
  ('Черный_Алмаз', 334750.50, 2150.25, now() - interval '10 days'),
  ('Топливный_Гигант', 55680.00, 385.50, now() - interval '12 days'),
  ('Нефть_Империя', 198750.75, 1420.00, now() - interval '11 days'),
  ('Буровая_Звезда', 76540.25, 505.75, now() - interval '13 days'),
  ('Энерго_Магнат', 287600.50, 1985.50, now() - interval '14 days'),
  ('Скважина_Про', 143250.00, 945.25, now() - interval '15 days'),
  ('Нефтегаз_Лидер', 65890.75, 425.00, now() - interval '16 days'),
  ('Черный_Поток', 176540.25, 1205.75, now() - interval '17 days'),
  ('Добыча_Элит', 108730.50, 720.50, now() - interval '18 days'),
  ('Вышка_Успеха', 89650.00, 615.25, now() - interval '19 days'),
  ('Нефтяной_Трон', 425800.75, 2850.00, now() - interval '20 days'),
  ('Буровой_Титан', 52340.25, 365.75, now() - interval '21 days'),
  ('Энерго_Власть', 234750.50, 1650.25, now() - interval '22 days'),
  ('Скважинный_Король', 87420.00, 585.50, now() - interval '23 days'),
  ('Нефть_Династия', 156780.75, 1085.75, now() - interval '24 days'),
  ('Черное_Сердце', 78650.25, 525.00, now() - interval '25 days'),
  ('Буровая_Империя', 298540.50, 2050.25, now() - interval '26 days'),
  ('Энергия_Победы', 119750.00, 825.50, now() - interval '27 days'),
  ('Нефтяная_Мощь', 65430.75, 445.75, now() - interval '28 days'),
  ('Скважина_Элит', 187650.25, 1285.00, now() - interval '29 days'),
  ('Топливный_Босс', 95820.50, 665.25, now() - interval '30 days'),
  ('Нефтяная_Корона', 456750.25, 3125.75, now() - interval '35 days'),
  ('Буровой_Император', 378920.00, 2685.50, now() - interval '40 days'),
  ('Черная_Молния', 298540.75, 2185.25, now() - interval '32 days'),
  ('Энерго_Шторм', 167830.50, 1245.00, now() - interval '36 days'),
  ('Нефтяной_Вихрь', 134760.25, 985.75, now() - interval '38 days'),
  ('Буровая_Легенда', 89420.00, 725.50, now() - interval '42 days'),
  ('Золотой_Поток', 76540.75, 565.25, now() - interval '45 days'),
  ('Энергия_Титанов', 198750.50, 1485.00, now() - interval '33 days'),
  ('Черное_Пламя', 145680.25, 1075.75, now() - interval '37 days'),
  ('Нефтяная_Сила', 234560.00, 1785.50, now() - interval '34 days'),
  ('Буровой_Дракон', 87390.75, 685.25, now() - interval '41 days'),
  ('Энерго_Феникс', 156780.50, 1165.75, now() - interval '39 days'),
  ('Золотая_Буря', 198540.25, 1425.00, now() - interval '31 days'),
  ('Нефтяной_Гром', 267830.75, 1985.50, now() - interval '43 days'),
  ('Черная_Стрела', 134760.00, 975.25, now() - interval '44 days'),
  ('Буровая_Молния', 89420.50, 685.75, now() - interval '46 days'),
  ('Энергия_Урагана', 176540.75, 1285.00, now() - interval '47 days'),
  ('Нефтяная_Лавина', 145680.25, 1065.50, now() - interval '48 days'),
  ('Золотой_Вулкан', 198750.00, 1465.75, now() - interval '49 days'),
  ('Черный_Торнадо', 234560.75, 1785.25, now() - interval '50 days');

-- Create a view for combined leaderboard (real players + bots)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  nickname,
  balance,
  daily_income,
  created_at,
  'player' as player_type
FROM public.profiles 
WHERE is_banned = false
UNION ALL
SELECT 
  nickname,
  balance,
  daily_income,
  created_at,
  'bot' as player_type
FROM public.bot_players
ORDER BY balance DESC;