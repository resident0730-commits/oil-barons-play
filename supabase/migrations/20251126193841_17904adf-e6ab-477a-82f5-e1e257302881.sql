-- Исправление критической ошибки с public_profiles view и важных предупреждений

-- 1. Добавляем RLS для представления public_profiles
-- Сначала включаем RLS на представлении
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- 2. Исправляем недостающие INSERT политики для таблиц

-- payment_invoices: разрешаем пользователям создавать свои инвойсы
CREATE POLICY "Users can create their own invoices"
ON public.payment_invoices
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- payment_invoices: разрешаем обновление статуса (для edge functions через service role)
-- Эта политика не нужна для authenticated role, так как edge functions используют service_role

-- promo_code_usage: разрешаем пользователям записывать использование промокодов
CREATE POLICY "Users can record promo code usage"
ON public.promo_code_usage
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- referral_rewards_claimed: разрешаем пользователям записывать получение наград
CREATE POLICY "Users can claim their referral rewards"
ON public.referral_rewards_claimed
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Добавляем явный запрет на просмотр промокодов для не-админов
CREATE POLICY "Only admins can view promo codes"
ON public.promo_codes
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Проверка: убеждаемся что все политики созданы
DO $$
DECLARE
  missing_policies TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Проверяем payment_invoices INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payment_invoices'
      AND policyname = 'Users can create their own invoices'
      AND cmd = 'INSERT'
  ) THEN
    missing_policies := array_append(missing_policies, 'payment_invoices INSERT');
  END IF;
  
  -- Проверяем promo_code_usage INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'promo_code_usage'
      AND policyname = 'Users can record promo code usage'
      AND cmd = 'INSERT'
  ) THEN
    missing_policies := array_append(missing_policies, 'promo_code_usage INSERT');
  END IF;
  
  -- Проверяем referral_rewards_claimed INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'referral_rewards_claimed'
      AND policyname = 'Users can claim their referral rewards'
      AND cmd = 'INSERT'
  ) THEN
    missing_policies := array_append(missing_policies, 'referral_rewards_claimed INSERT');
  END IF;
  
  -- Проверяем promo_codes SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'promo_codes'
      AND policyname = 'Only admins can view promo codes'
      AND cmd = 'SELECT'
  ) THEN
    missing_policies := array_append(missing_policies, 'promo_codes SELECT');
  END IF;
  
  IF array_length(missing_policies, 1) > 0 THEN
    RAISE EXCEPTION 'Missing policies: %', array_to_string(missing_policies, ', ');
  END IF;
  
  RAISE NOTICE 'All security policies created successfully';
END $$;