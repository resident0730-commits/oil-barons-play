-- Удаляем текущую сложную политику и создаём упрощённую
DROP POLICY IF EXISTS "Users can view referrals in their chain" ON public.referrals;

-- Создаём новую политику, использующую security definer функцию
CREATE POLICY "Users can view referrals in their chain"
ON public.referrals
FOR SELECT
USING (
  -- Прямые рефералы (где я реферер)
  auth.uid() = referrer_id
  OR
  -- Все рефералы в моей цепочке (через security definer функцию)
  referred_id IN (SELECT r.referred_id FROM public.get_referral_ids_in_chain(auth.uid()) r)
  OR
  -- Записи где referrer_id это кто-то из моей цепочки (для получения 2-3 уровней)
  referrer_id IN (SELECT r.referred_id FROM public.get_referral_ids_in_chain(auth.uid()) r)
);