-- Создаем недостающие записи в referrals на основе данных из profiles
INSERT INTO public.referrals (referrer_id, referred_id, referral_code, bonus_earned, is_active)
SELECT 
  p.referred_by as referrer_id,
  p.user_id as referred_id,
  referrer.referral_code as referral_code,
  0 as bonus_earned,
  true as is_active
FROM public.profiles p
JOIN public.profiles referrer ON referrer.user_id = p.referred_by
WHERE p.referred_by IS NOT NULL
ON CONFLICT DO NOTHING;

-- Создаем триггер для автоматического создания записи в referrals
-- когда пользователь регистрируется с реферальным кодом
CREATE OR REPLACE FUNCTION public.handle_new_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_code TEXT;
BEGIN
  -- Если у нового пользователя есть referred_by
  IF NEW.referred_by IS NOT NULL THEN
    -- Получаем реферальный код реферера
    SELECT referral_code INTO referrer_code
    FROM public.profiles
    WHERE user_id = NEW.referred_by;
    
    -- Создаем запись в таблице referrals
    INSERT INTO public.referrals (referrer_id, referred_id, referral_code, bonus_earned, is_active)
    VALUES (NEW.referred_by, NEW.user_id, referrer_code, 0, true)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Создаем триггер на таблице profiles
DROP TRIGGER IF EXISTS on_profile_referral_set ON public.profiles;
CREATE TRIGGER on_profile_referral_set
  AFTER INSERT OR UPDATE OF referred_by ON public.profiles
  FOR EACH ROW
  WHEN (NEW.referred_by IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_referral();