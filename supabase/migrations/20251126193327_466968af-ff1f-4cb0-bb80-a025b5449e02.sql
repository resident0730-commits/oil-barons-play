-- ============================================
-- УСИЛЕННАЯ ЗАЩИТА: Исправление критических проблем
-- Более строгие политики для блокировки анонимного доступа
-- ============================================

-- 1. PROFILES: Полная защита финансовых данных
-- Удаляем старые политики и создаем новые, более строгие

-- Удаляем все существующие политики для profiles
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Создаем СТРОГУЮ политику для SELECT: только аутентифицированные незаблокированные пользователи
CREATE POLICY "Authenticated users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND is_banned = false
);

-- Админы могут видеть все профили
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Политика UPDATE: только для незаблокированных пользователей
CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND is_banned = false
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
  AND is_banned = false
);

-- Админы могут обновлять все профили
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Политика INSERT: только для новых пользователей
CREATE POLICY "Users can insert own profile on signup"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- ЯВНО запрещаем anon роли любые операции
CREATE POLICY "Deny all anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- 2. PAYMENT_INVOICES: Полная защита транзакций
-- Удаляем старые политики
DROP POLICY IF EXISTS "Block anonymous access to payment_invoices" ON public.payment_invoices;
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.payment_invoices;

-- Только владелец инвойса может видеть свои инвойсы
CREATE POLICY "Authenticated users can view own invoices only"
ON public.payment_invoices
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Админы могут видеть все инвойсы
CREATE POLICY "Admins can view all invoices"
ON public.payment_invoices
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- ЯВНО запрещаем anon роли любые операции
CREATE POLICY "Deny all anonymous access to payment_invoices"
ON public.payment_invoices
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- 3. MONEY_TRANSFERS: Усиленная защита
DROP POLICY IF EXISTS "Block anonymous access to money_transfers" ON public.money_transfers;
DROP POLICY IF EXISTS "Users can view their own transfers" ON public.money_transfers;
DROP POLICY IF EXISTS "Users can create withdrawal requests" ON public.money_transfers;
DROP POLICY IF EXISTS "Admins can view all transfers" ON public.money_transfers;
DROP POLICY IF EXISTS "Admins can create transfers" ON public.money_transfers;

-- Пользователи видят только свои трансферы
CREATE POLICY "Authenticated users view own transfers only"
ON public.money_transfers
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = from_user_id OR auth.uid() = to_user_id)
);

-- Пользователи могут создавать запросы на вывод
CREATE POLICY "Users can create withdrawal requests"
ON public.money_transfers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = from_user_id 
  AND transfer_type = 'withdrawal'
  AND created_by = auth.uid()
);

-- Админы могут все
CREATE POLICY "Admins full access to transfers"
ON public.money_transfers
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- ЯВНО запрещаем anon
CREATE POLICY "Deny all anonymous access to money_transfers"
ON public.money_transfers
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- 4. Остальные критичные таблицы
-- REFERRALS
DROP POLICY IF EXISTS "Block anonymous access to referrals" ON public.referrals;

CREATE POLICY "Deny all anonymous access to referrals"
ON public.referrals
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- EXCHANGE_TRANSACTIONS
DROP POLICY IF EXISTS "Block anonymous access to exchange_transactions" ON public.exchange_transactions;

CREATE POLICY "Deny all anonymous access to exchange_transactions"
ON public.exchange_transactions
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- PROMO_CODE_USAGE
CREATE POLICY "Deny all anonymous access to promo_code_usage"
ON public.promo_code_usage
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- REFERRAL_REWARDS_CLAIMED
CREATE POLICY "Deny all anonymous access to referral_rewards_claimed"
ON public.referral_rewards_claimed
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- 5. Финальная проверка и логирование
DO $$ 
DECLARE
  policy_count INTEGER;
BEGIN
  -- Проверяем что у profiles есть RESTRICTIVE политика для anon
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Deny all anonymous access to profiles'
    AND permissive = 'RESTRICTIVE';
    
  IF policy_count = 0 THEN
    RAISE EXCEPTION 'RESTRICTIVE политика для profiles не создана!';
  END IF;
  
  -- Проверяем payment_invoices
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
    AND tablename = 'payment_invoices' 
    AND policyname = 'Deny all anonymous access to payment_invoices'
    AND permissive = 'RESTRICTIVE';
    
  IF policy_count = 0 THEN
    RAISE EXCEPTION 'RESTRICTIVE политика для payment_invoices не создана!';
  END IF;
  
  RAISE NOTICE '✅ Все RESTRICTIVE политики созданы успешно';
  RAISE NOTICE '✅ Анонимный доступ полностью заблокирован';
  RAISE NOTICE '✅ Заблокированные пользователи не могут видеть свои данные';
END $$;

-- 6. Документация
COMMENT ON POLICY "Deny all anonymous access to profiles" ON public.profiles 
IS 'CRITICAL SECURITY: RESTRICTIVE политика полностью блокирует любой анонимный доступ к финансовым данным';

COMMENT ON POLICY "Deny all anonymous access to payment_invoices" ON public.payment_invoices 
IS 'CRITICAL SECURITY: RESTRICTIVE политика полностью блокирует любой анонимный доступ к платежным данным';