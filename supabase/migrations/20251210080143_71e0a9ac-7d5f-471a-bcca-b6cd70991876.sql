-- 1. Удаляем небезопасную политику, которая позволяет видеть полные профили рефералов
DROP POLICY IF EXISTS "Users can view profiles of referrals in chain" ON public.profiles;

-- 2. Создаём безопасную функцию для получения данных рефералов (только несенситивные поля)
CREATE OR REPLACE FUNCTION public.get_referral_profiles(p_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  nickname text,
  created_at timestamp with time zone,
  status_titles text[],
  level integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Возвращаем только несенситивные данные рефералов
  RETURN QUERY
  SELECT 
    p.user_id,
    p.nickname,
    p.created_at,
    p.status_titles,
    r.level
  FROM public.get_referral_ids_in_chain(p_user_id) r
  INNER JOIN public.profiles p ON p.user_id = r.referred_id
  WHERE p.is_banned = false;
END;
$$;

-- 3. Усиливаем политику money_transfers - добавляем явную проверку участия в транзакции
DROP POLICY IF EXISTS "Authenticated users view own transfers only" ON public.money_transfers;

CREATE POLICY "Users can only view transfers they participate in"
ON public.money_transfers
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = from_user_id OR auth.uid() = to_user_id)
);

-- 4. Добавляем политику запрета UPDATE для обычных пользователей на money_transfers
DROP POLICY IF EXISTS "Users cannot update transfers" ON public.money_transfers;

CREATE POLICY "Users cannot update transfers"
ON public.money_transfers
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);