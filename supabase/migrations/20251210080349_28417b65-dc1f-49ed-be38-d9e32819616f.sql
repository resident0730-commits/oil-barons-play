-- 1. Создаём представление для money_transfers, которое скрывает чувствительные данные
DROP VIEW IF EXISTS public.user_money_transfers;

CREATE VIEW public.user_money_transfers
WITH (security_invoker = true)
AS 
SELECT 
  mt.id,
  mt.from_user_id,
  mt.to_user_id,
  mt.amount,
  mt.status,
  mt.transfer_type,
  mt.description,
  -- Скрываем withdrawal_details от всех кроме отправителя и админов
  CASE 
    WHEN auth.uid() = mt.from_user_id OR public.has_role(auth.uid(), 'admin'::app_role) 
    THEN mt.withdrawal_details
    ELSE NULL
  END as withdrawal_details,
  mt.created_at,
  mt.updated_at,
  -- Скрываем created_by от неадминов
  CASE 
    WHEN public.has_role(auth.uid(), 'admin'::app_role) 
    THEN mt.created_by
    ELSE NULL
  END as created_by
FROM public.money_transfers mt
WHERE auth.uid() = mt.from_user_id 
   OR auth.uid() = mt.to_user_id
   OR public.has_role(auth.uid(), 'admin'::app_role);

-- 2. Блокируем прямой SELECT доступ к money_transfers для обычных пользователей
-- Они должны использовать view или функцию get_user_transfers()
DROP POLICY IF EXISTS "Users can only view transfers they participate in" ON public.money_transfers;

-- Обычные пользователи не могут напрямую читать таблицу - только через view/function
CREATE POLICY "Block direct table access for non-admins"
ON public.money_transfers
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Усиливаем защиту profiles - добавляем явную проверку на анонимов
-- Удаляем старую политику deny и создаём более явную
DROP POLICY IF EXISTS "Deny all anonymous access to profiles" ON public.profiles;

-- Политика для анонимных пользователей - полный запрет
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 4. Убедимся что authenticated пользователи видят только свои профили
DROP POLICY IF EXISTS "Authenticated users can view own profile only" ON public.profiles;

CREATE POLICY "Users can only view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  AND is_banned = false
);