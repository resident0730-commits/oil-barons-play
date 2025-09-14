-- Create 20 demo accounts using bot_players table
-- These will automatically appear in leaderboard alongside real players

INSERT INTO public.bot_players (nickname, balance, daily_income, created_at) VALUES
('Нефтяной Магнат', 150000000, 2500000, now() - interval '30 days'),
('Барон Буровых', 125000000, 2100000, now() - interval '28 days'), 
('Король Нефти', 98000000, 1800000, now() - interval '25 days'),
('Газовый Гигант', 87500000, 1650000, now() - interval '22 days'),
('Промышленник', 76200000, 1420000, now() - interval '20 days'),
('Энергетический Босс', 68900000, 1280000, now() - interval '18 days'),
('Скважинный Эксперт', 59800000, 1150000, now() - interval '16 days'),
('Ресурсный Лидер', 52300000, 980000, now() - interval '14 days'),
('Топливный Тайкун', 46700000, 890000, now() - interval '12 days'),
('Буровой Специалист', 41200000, 780000, now() - interval '10 days'),
('Нефтяной Инвестор', 36800000, 690000, now() - interval '9 days'),
('Энергетический Гуру', 32500000, 610000, now() - interval '8 days'),
('Газовый Магистр', 28900000, 540000, now() - interval '7 days'),
('Промышленный Гений', 25600000, 480000, now() - interval '6 days'),
('Ресурсный Мастер', 22800000, 420000, now() - interval '5 days'),
('Скважинный Виртуоз', 20300000, 380000, now() - interval '4 days'),
('Топливный Эксперт', 18100000, 340000, now() - interval '3 days'),
('Буровой Мастер', 16200000, 310000, now() - interval '2 days'),
('Нефтяной Стратег', 14600000, 280000, now() - interval '1 day'),
('Энергетический Новатор', 13200000, 250000, now());