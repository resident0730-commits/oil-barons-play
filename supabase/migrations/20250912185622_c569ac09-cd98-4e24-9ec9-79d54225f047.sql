-- Добавляем поле для отслеживания времени последнего получения ежедневного бонуса
ALTER TABLE public.profiles 
ADD COLUMN last_bonus_claim TIMESTAMP WITH TIME ZONE;