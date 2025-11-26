-- Исправление критических проблем безопасности в profiles и payment_invoices
-- Проблема: RESTRICTIVE политики могут не блокировать анонимный доступ эффективно

-- 1. Полностью удаляем все политики для profiles и создаем заново с правильным приоритетом
DROP POLICY IF EXISTS "Deny all anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON public.profiles;

-- Создаем RESTRICTIVE политику первой (она будет проверяться всегда)
CREATE POLICY "Deny all anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Теперь создаем PERMISSIVE политики для authenticated пользователей
CREATE POLICY "Authenticated users can view own profile only"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND is_banned = false
);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
AS PERMISSIVE
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

CREATE POLICY "Admins can update all profiles"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own profile on signup"
ON public.profiles
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Полностью удаляем все политики для payment_invoices и создаем заново
DROP POLICY IF EXISTS "Deny all anonymous access to payment_invoices" ON public.payment_invoices;
DROP POLICY IF EXISTS "Authenticated users can view own invoices only" ON public.payment_invoices;
DROP POLICY IF EXISTS "Admins can view all invoices" ON public.payment_invoices;

-- Создаем RESTRICTIVE политику первой для payment_invoices
CREATE POLICY "Deny all anonymous access to payment_invoices"
ON public.payment_invoices
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Создаем PERMISSIVE политики для authenticated пользователей
CREATE POLICY "Authenticated users can view own invoices only"
ON public.payment_invoices
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Admins can view all invoices"
ON public.payment_invoices
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Проверка: убеждаемся что политики созданы корректно
DO $$
DECLARE
  profiles_restrictive_count INTEGER;
  invoices_restrictive_count INTEGER;
BEGIN
  -- Проверяем наличие RESTRICTIVE политик
  SELECT COUNT(*) INTO profiles_restrictive_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND policyname = 'Deny all anonymous access to profiles'
    AND permissive = 'RESTRICTIVE';
    
  SELECT COUNT(*) INTO invoices_restrictive_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'payment_invoices'
    AND policyname = 'Deny all anonymous access to payment_invoices'
    AND permissive = 'RESTRICTIVE';
  
  IF profiles_restrictive_count = 0 THEN
    RAISE EXCEPTION 'RESTRICTIVE policy for profiles was not created!';
  END IF;
  
  IF invoices_restrictive_count = 0 THEN
    RAISE EXCEPTION 'RESTRICTIVE policy for payment_invoices was not created!';
  END IF;
  
  RAISE NOTICE 'Security fix completed: % RESTRICTIVE policies verified', 
    profiles_restrictive_count + invoices_restrictive_count;
END $$;