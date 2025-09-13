-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL UNIQUE,
  referral_code TEXT NOT NULL,
  bonus_earned NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  reward_type TEXT NOT NULL, -- 'coins', 'booster', 'title', 'discount'
  reward_amount NUMERIC NOT NULL DEFAULT 0,
  reward_data JSONB,
  requirement_type TEXT NOT NULL, -- 'balance', 'wells_count', 'referrals', 'login_streak', etc.
  requirement_value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, achievement_id)
);

-- Add referral_code to profiles
ALTER TABLE public.profiles ADD COLUMN referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN referred_by UUID;
ALTER TABLE public.profiles ADD COLUMN referral_bonus_expires_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for referrals
CREATE POLICY "Users can view their own referrals" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their own referrals" 
ON public.referrals 
FOR UPDATE 
USING (auth.uid() = referrer_id);

-- Create RLS policies for achievements
CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify achievements" 
ON public.achievements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
ON public.user_achievements 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to generate referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new user referral code generation
CREATE OR REPLACE FUNCTION public.handle_referral_code_generation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = NEW.referral_code) LOOP
      NEW.referral_code := generate_referral_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral code generation
CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_code_generation();

-- Update existing profiles to have referral codes
UPDATE public.profiles 
SET referral_code = generate_referral_code()
WHERE referral_code IS NULL;

-- Create trigger for updated_at on referrals
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (name, title, description, category, icon, reward_type, reward_amount, requirement_type, requirement_value) VALUES
-- Магнат категория
('first_well', 'Первая скважина', 'Купите свою первую скважину', 'magnate', '🏭', 'coins', 500, 'wells_count', 1),
('millionaire', 'Миллионер', 'Накопите 1,000,000 OC', 'magnate', '💰', 'coins', 10000, 'balance', 1000000),
('industrialist', 'Промышленник', 'Имейте 10 скважин одновременно', 'magnate', '🏗️', 'booster', 0, 'wells_count', 10),
('oil_king', 'Нефтяной король', 'Приобретите Cosmic Well', 'magnate', '👑', 'title', 0, 'cosmic_well', 1),

-- Коллекционер категория  
('diversity', 'Разнообразие', 'Имейте скважины всех типов', 'collector', '🎯', 'coins', 5000, 'well_types', 8),
('booster_master', 'Мастер усилителей', 'Используйте все типы бустеров', 'collector', '⚡', 'coins', 3000, 'booster_types', 5),
('big_spender', 'Крупный покупатель', 'Купите все типы пакетов', 'collector', '📦', 'discount', 20, 'package_types', 4),

-- Активность категория
('consistency', 'Постоянство', 'Заходите 30 дней подряд', 'activity', '📅', 'coins', 15000, 'login_streak', 30),
('lucky_one', 'Везунчик', 'Получите ежедневный бонус 100 раз', 'activity', '🎁', 'booster', 0, 'daily_bonus_count', 100),
('leader', 'Лидер', 'Попадите в топ-10 лидерборда', 'activity', '🏆', 'title', 0, 'leaderboard_position', 10),

-- Социальная категория
('mentor', 'Наставник', 'Пригласите 10 рефералов', 'social', '🤝', 'coins', 25000, 'referrals_count', 10),
('ambassador', 'Амбассадор', 'Пригласите 100 рефералов', 'social', '📢', 'title', 0, 'referrals_count', 100),
('helper', 'Помощник', 'Отправьте 10 тикетов в поддержку', 'social', '💬', 'coins', 2000, 'support_tickets', 10);