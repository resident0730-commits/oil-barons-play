-- Расширяем RLS политику для просмотра многоуровневых рефералов
-- Пользователь должен видеть рефералов своих рефералов (уровни 2 и 3)

-- Удаляем старую политику просмотра
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;

-- Создаём новую политику, которая позволяет видеть рефералов по всей цепочке
CREATE POLICY "Users can view referrals in their chain"
ON public.referrals
FOR SELECT
USING (
  auth.uid() = referrer_id  -- Прямые рефералы (уровень 1)
  OR 
  referrer_id IN (  -- Рефералы уровня 2 (рефералы моих рефералов)
    SELECT r.referred_id 
    FROM public.referrals r 
    WHERE r.referrer_id = auth.uid()
  )
  OR
  referrer_id IN (  -- Рефералы уровня 3
    SELECT r2.referred_id
    FROM public.referrals r1
    INNER JOIN public.referrals r2 ON r2.referrer_id = r1.referred_id
    WHERE r1.referrer_id = auth.uid()
  )
);