-- Пересоздаём функцию handle_new_user для обработки регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_referrer_id uuid;
  v_referral_code text;
BEGIN
  -- Получаем referred_by и referral_code из метаданных
  v_referrer_id := (NEW.raw_user_meta_data ->> 'referred_by')::uuid;
  v_referral_code := NEW.raw_user_meta_data ->> 'referral_code';

  -- Создаём профиль с referred_by
  INSERT INTO public.profiles (user_id, nickname, balance, daily_income, referred_by)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', 'Игрок'), 
    1000.00, 
    0.00,
    v_referrer_id
  );

  -- Если есть реферер, создаём запись в таблице referrals
  IF v_referrer_id IS NOT NULL AND v_referral_code IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id, referral_code, is_active)
    VALUES (v_referrer_id, NEW.id, v_referral_code, true);
  END IF;

  RETURN NEW;
END;
$$;

-- Удаляем триггер если существует и создаём заново
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Создаём триггер для автоматического создания профиля при регистрации
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();