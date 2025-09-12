-- Create global game statistics table
CREATE TABLE public.game_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_name TEXT NOT NULL UNIQUE,
  current_value NUMERIC NOT NULL DEFAULT 0,
  daily_growth_rate NUMERIC NOT NULL DEFAULT 0.05, -- 5% daily growth by default
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial statistics
INSERT INTO public.game_statistics (stat_name, current_value, daily_growth_rate) VALUES 
  ('active_players', 1247, 0.07), -- 7% daily growth
  ('total_wells', 1057, 0.05), -- 5% daily growth  
  ('average_profit', 15842, 0.06); -- 6% daily growth

-- Function to update daily statistics
CREATE OR REPLACE FUNCTION public.update_daily_statistics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.game_statistics 
  SET 
    current_value = FLOOR(current_value * (1 + daily_growth_rate + (RANDOM() * 0.02 - 0.01))), -- Add some randomness ±1%
    last_updated = now()
  WHERE 
    DATE(last_updated) < CURRENT_DATE; -- Only update if not already updated today
END;
$$;

-- Enable RLS on the table
ALTER TABLE public.game_statistics ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read statistics (public data)
CREATE POLICY "Game statistics are viewable by everyone" 
ON public.game_statistics 
FOR SELECT 
USING (true);

-- Only admins can modify statistics
CREATE POLICY "Only admins can modify statistics" 
ON public.game_statistics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create an index for faster lookups
CREATE INDEX idx_game_statistics_stat_name ON public.game_statistics(stat_name);