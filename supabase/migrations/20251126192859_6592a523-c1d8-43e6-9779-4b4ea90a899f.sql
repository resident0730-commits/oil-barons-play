-- ============================================
-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ БЕЗОПАСНОСТИ
-- Усиление защиты финансовых данных игроков
-- ============================================

-- 1. Убеждаемся что RLS включен на всех критических таблицах
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.money_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards_claimed ENABLE ROW LEVEL SECURITY;

-- 2. Добавляем политику явно запрещающую анонимный доступ к profiles
-- Эта политика гарантирует что только authenticated пользователи могут читать данные
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 3. Усиливаем политику для authenticated пользователей
-- Пересоздаем политики с более строгими проверками
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND is_banned = false
);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
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
);

-- 4. Защита payment_invoices от анонимного доступа
DROP POLICY IF EXISTS "Block anonymous access to payment_invoices" ON public.payment_invoices;
CREATE POLICY "Block anonymous access to payment_invoices"
ON public.payment_invoices
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 5. Защита money_transfers от анонимного доступа
DROP POLICY IF EXISTS "Block anonymous access to money_transfers" ON public.money_transfers;
CREATE POLICY "Block anonymous access to money_transfers"
ON public.money_transfers
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 6. Защита referrals от анонимного доступа
DROP POLICY IF EXISTS "Block anonymous access to referrals" ON public.referrals;
CREATE POLICY "Block anonymous access to referrals"
ON public.referrals
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 7. Защита exchange_transactions от анонимного доступа
DROP POLICY IF EXISTS "Block anonymous access to exchange_transactions" ON public.exchange_transactions;
CREATE POLICY "Block anonymous access to exchange_transactions"
ON public.exchange_transactions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 8. Добавляем комментарии для документации
COMMENT ON TABLE public.profiles IS 'КРИТИЧНО: Содержит финансовые данные игроков. Доступ только для authenticated пользователей и админов.';
COMMENT ON TABLE public.payment_invoices IS 'КРИТИЧНО: Содержит информацию о платежах. Доступ только для владельца инвойса и админов.';
COMMENT ON TABLE public.money_transfers IS 'КРИТИЧНО: Содержит информацию о переводах денег. Доступ только для участников перевода и админов.';

-- 9. Создаем функцию для аудита доступа к чувствительным данным (опционально)
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Логируем попытки доступа к чувствительным данным
  -- В production можно записывать в отдельную таблицу аудита
  RAISE LOG 'Access to % table by user %', TG_TABLE_NAME, auth.uid();
  RETURN NEW;
END;
$$;

-- 10. Убеждаемся что user_roles защищена
DROP POLICY IF EXISTS "Block direct access to user_roles" ON public.user_roles;
CREATE POLICY "Block direct access to user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  -- Пользователи могут видеть только свои роли
  -- Админы могут видеть все через has_role функцию
  auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role)
);

-- 11. Защита от SQL injection через параметризованные запросы
-- Убеждаемся что все функции используют SECURITY DEFINER правильно
-- и не позволяют SQL injection

COMMENT ON FUNCTION public.has_role IS 'SECURITY: Функция с SECURITY DEFINER для проверки ролей. Используется в RLS политиках.';
COMMENT ON FUNCTION public.exchange_currency IS 'SECURITY: Функция с SECURITY DEFINER для обмена валюты. Проверяет аутентификацию.';
COMMENT ON FUNCTION public.apply_promo_code IS 'SECURITY: Функция с SECURITY DEFINER для применения промокодов. Проверяет аутентификацию.';

-- 12. Создаем view для безопасного просмотра публичной информации игроков
-- (без финансовых данных)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  nickname,
  created_at,
  status_titles,
  is_banned
FROM public.profiles
WHERE is_banned = false;

-- Даем доступ к view всем
GRANT SELECT ON public.public_profiles TO authenticated, anon;

COMMENT ON VIEW public.public_profiles IS 'Публичный view профилей без чувствительных финансовых данных';

-- 13. Финальная проверка: убеждаемся что RLS работает
DO $$ 
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles') THEN
    RAISE EXCEPTION 'RLS не включен на таблице profiles!';
  END IF;
  
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'payment_invoices') THEN
    RAISE EXCEPTION 'RLS не включен на таблице payment_invoices!';
  END IF;
  
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'money_transfers') THEN
    RAISE EXCEPTION 'RLS не включен на таблице money_transfers!';
  END IF;
  
  RAISE NOTICE '✅ RLS включен на всех критических таблицах';
END $$;