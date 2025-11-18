-- Multiply daily_income by 1000 for all existing wells
-- This updates the income to match the new barrel-based economy

UPDATE public.wells
SET daily_income = daily_income * 1000,
    updated_at = now()
WHERE daily_income IS NOT NULL;

-- Update daily_income in profiles (sum of all well incomes)
UPDATE public.profiles p
SET daily_income = (
  SELECT COALESCE(SUM(w.daily_income), 0)
  FROM public.wells w
  WHERE w.user_id = p.user_id
),
updated_at = now();