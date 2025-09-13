-- Add status titles to profiles table
ALTER TABLE public.profiles ADD COLUMN status_titles TEXT[] DEFAULT '{}';

-- Create function to calculate status multiplier
CREATE OR REPLACE FUNCTION public.calculate_status_multiplier(user_titles TEXT[])
RETURNS NUMERIC AS $$
DECLARE
    multiplier NUMERIC := 1.0;
BEGIN
    -- Oil King: +5% income
    IF 'oil_king' = ANY(user_titles) THEN
        multiplier := multiplier + 0.05;
    END IF;
    
    -- Leader: +3% income  
    IF 'leader' = ANY(user_titles) THEN
        multiplier := multiplier + 0.03;
    END IF;
    
    -- Ambassador: +10% referral bonus (handled separately)
    -- Other titles: +2% income each
    IF 'industrialist' = ANY(user_titles) THEN
        multiplier := multiplier + 0.02;
    END IF;
    
    RETURN multiplier;
END;
$$ LANGUAGE plpgsql IMMUTABLE;