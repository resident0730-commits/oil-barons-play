-- Add daily chest tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN last_daily_chest_claim TIMESTAMP WITH TIME ZONE,
ADD COLUMN daily_chest_streak INTEGER DEFAULT 0,
ADD COLUMN total_daily_chests_opened INTEGER DEFAULT 0;