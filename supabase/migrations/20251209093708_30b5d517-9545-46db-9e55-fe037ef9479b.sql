-- Создаём security definer функцию для получения ID рефералов в цепочке
-- Это позволит избежать проблем с RLS при запросе профилей

CREATE OR REPLACE FUNCTION public.get_referral_ids_in_chain(p_user_id uuid)
RETURNS TABLE(referred_id uuid, level int)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Уровень 1: прямые рефералы
  RETURN QUERY
  SELECT r.referred_id, 1 as level
  FROM public.referrals r
  WHERE r.referrer_id = p_user_id;
  
  -- Уровень 2: рефералы рефералов
  RETURN QUERY
  SELECT r2.referred_id, 2 as level
  FROM public.referrals r1
  INNER JOIN public.referrals r2 ON r2.referrer_id = r1.referred_id
  WHERE r1.referrer_id = p_user_id;
  
  -- Уровень 3: рефералы рефералов рефералов
  RETURN QUERY
  SELECT r3.referred_id, 3 as level
  FROM public.referrals r1
  INNER JOIN public.referrals r2 ON r2.referrer_id = r1.referred_id
  INNER JOIN public.referrals r3 ON r3.referrer_id = r2.referred_id
  WHERE r1.referrer_id = p_user_id;
END;
$$;

-- Добавляем политику для просмотра профилей рефералов в цепочке
CREATE POLICY "Users can view profiles of referrals in chain"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id  -- Свой профиль
  OR 
  user_id IN (SELECT referred_id FROM public.get_referral_ids_in_chain(auth.uid()))  -- Профили рефералов
);