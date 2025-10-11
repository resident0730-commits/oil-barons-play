-- Удаляем старые политики если существуют
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.referral_rewards_claimed;
DROP POLICY IF EXISTS "Admins can view all rewards" ON public.referral_rewards_claimed;

-- Удаляем таблицу если существует, чтобы пересоздать
DROP TABLE IF EXISTS public.referral_rewards_claimed CASCADE;

-- Создаем таблицу для отслеживания выданных реферальных наград
CREATE TABLE public.referral_rewards_claimed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_tier INTEGER NOT NULL,
  reward_amount NUMERIC NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reward_tier)
);

-- Включаем RLS
ALTER TABLE public.referral_rewards_claimed ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи видят свои награды
CREATE POLICY "Users can view their own rewards"
ON public.referral_rewards_claimed
FOR SELECT
USING (auth.uid() = user_id);

-- Политика: админы видят все награды
CREATE POLICY "Admins can view all rewards"
ON public.referral_rewards_claimed
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Функция для проверки и выдачи реферальных наград
CREATE OR REPLACE FUNCTION public.check_and_award_referral_milestones(p_referrer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_paid_referrals_count INTEGER;
  v_total_referrals_count INTEGER;
BEGIN
  -- Считаем количество рефералов, которые пополнили счет
  SELECT COUNT(DISTINCT r.referred_id)
  INTO v_paid_referrals_count
  FROM public.referrals r
  INNER JOIN public.payment_invoices pi ON pi.user_id = r.referred_id
  WHERE r.referrer_id = p_referrer_id
    AND r.is_active = true
    AND pi.status = 'completed';

  -- Считаем общее количество рефералов для VIP статуса
  SELECT COUNT(*)
  INTO v_total_referrals_count
  FROM public.referrals
  WHERE referrer_id = p_referrer_id
    AND is_active = true;

  -- Проверяем каждый порог и выдаем награду если еще не выдана
  
  -- 50 рефералов с пополнением = 50,000₽
  IF v_paid_referrals_count >= 50 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.referral_rewards_claimed 
      WHERE user_id = p_referrer_id AND reward_tier = 50
    ) THEN
      -- Начисляем награду
      UPDATE public.profiles
      SET balance = balance + 50000
      WHERE user_id = p_referrer_id;
      
      -- Записываем в таблицу наград
      INSERT INTO public.referral_rewards_claimed (user_id, reward_tier, reward_amount)
      VALUES (p_referrer_id, 50, 50000);
      
      -- Логируем транзакцию
      INSERT INTO public.money_transfers (
        from_user_id,
        to_user_id,
        amount,
        description,
        transfer_type,
        status,
        created_by
      ) VALUES (
        p_referrer_id,
        p_referrer_id,
        50000,
        'Награда за 50 рефералов с пополнением',
        'referral_reward',
        'completed',
        p_referrer_id
      );
    END IF;
  END IF;

  -- 15 рефералов с пополнением = 15,000₽
  IF v_paid_referrals_count >= 15 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.referral_rewards_claimed 
      WHERE user_id = p_referrer_id AND reward_tier = 15
    ) THEN
      UPDATE public.profiles
      SET balance = balance + 15000
      WHERE user_id = p_referrer_id;
      
      INSERT INTO public.referral_rewards_claimed (user_id, reward_tier, reward_amount)
      VALUES (p_referrer_id, 15, 15000);
      
      INSERT INTO public.money_transfers (
        from_user_id,
        to_user_id,
        amount,
        description,
        transfer_type,
        status,
        created_by
      ) VALUES (
        p_referrer_id,
        p_referrer_id,
        15000,
        'Награда за 15 рефералов с пополнением',
        'referral_reward',
        'completed',
        p_referrer_id
      );
    END IF;
  END IF;

  -- 5 рефералов с пополнением = 5,000₽
  IF v_paid_referrals_count >= 5 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.referral_rewards_claimed 
      WHERE user_id = p_referrer_id AND reward_tier = 5
    ) THEN
      UPDATE public.profiles
      SET balance = balance + 5000
      WHERE user_id = p_referrer_id;
      
      INSERT INTO public.referral_rewards_claimed (user_id, reward_tier, reward_amount)
      VALUES (p_referrer_id, 5, 5000);
      
      INSERT INTO public.money_transfers (
        from_user_id,
        to_user_id,
        amount,
        description,
        transfer_type,
        status,
        created_by
      ) VALUES (
        p_referrer_id,
        p_referrer_id,
        5000,
        'Награда за 5 рефералов с пополнением',
        'referral_reward',
        'completed',
        p_referrer_id
      );
    END IF;
  END IF;

  -- VIP статус за 100 рефералов (любых, не обязательно с пополнением)
  IF v_total_referrals_count >= 100 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.referral_rewards_claimed 
      WHERE user_id = p_referrer_id AND reward_tier = 100
    ) THEN
      -- Добавляем VIP статус через status_titles
      UPDATE public.profiles
      SET status_titles = array_append(status_titles, 'vip')
      WHERE user_id = p_referrer_id
        AND NOT ('vip' = ANY(status_titles));
      
      INSERT INTO public.referral_rewards_claimed (user_id, reward_tier, reward_amount)
      VALUES (p_referrer_id, 100, 0);
    END IF;
  END IF;
END;
$$;

-- Триггер для проверки наград при успешном пополнении
CREATE OR REPLACE FUNCTION public.trigger_check_referral_rewards()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  -- Проверяем только при завершении платежа
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Находим реферера этого пользователя
    SELECT referred_by INTO v_referrer_id
    FROM public.profiles
    WHERE user_id = NEW.user_id;
    
    -- Если есть реферер, проверяем награды
    IF v_referrer_id IS NOT NULL THEN
      PERFORM public.check_and_award_referral_milestones(v_referrer_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Создаем триггер на таблице payment_invoices
DROP TRIGGER IF EXISTS on_payment_completed_check_rewards ON public.payment_invoices;
CREATE TRIGGER on_payment_completed_check_rewards
  AFTER INSERT OR UPDATE OF status ON public.payment_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_check_referral_rewards();