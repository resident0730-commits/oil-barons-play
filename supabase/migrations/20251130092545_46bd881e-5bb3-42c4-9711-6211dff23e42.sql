-- Создаем функцию для получения цепочки рефереров
CREATE OR REPLACE FUNCTION public.get_referral_chain(p_user_id uuid, p_max_levels integer DEFAULT 3)
RETURNS TABLE(referrer_id uuid, level integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_id uuid := p_user_id;
  current_level integer := 1;
BEGIN
  WHILE current_level <= p_max_levels LOOP
    -- Находим реферера текущего пользователя
    SELECT p.referred_by INTO current_user_id
    FROM public.profiles p
    WHERE p.user_id = current_user_id
    AND p.referred_by IS NOT NULL;
    
    -- Если реферера нет, выходим из цикла
    EXIT WHEN current_user_id IS NULL;
    
    -- Возвращаем реферера и его уровень
    RETURN QUERY SELECT current_user_id, current_level;
    
    current_level := current_level + 1;
  END LOOP;
  
  RETURN;
END;
$$;

-- Создаем функцию для распределения реферальных бонусов по уровням
CREATE OR REPLACE FUNCTION public.distribute_referral_bonuses(p_referred_user_id uuid, p_amount numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referrer RECORD;
  v_bonus_amount numeric;
  v_total_distributed numeric := 0;
  v_results jsonb := '[]'::jsonb;
BEGIN
  -- Проходим по всем рефереррам в цепочке (до 3 уровней)
  FOR v_referrer IN 
    SELECT * FROM public.get_referral_chain(p_referred_user_id, 3)
  LOOP
    -- Рассчитываем бонус в зависимости от уровня
    CASE v_referrer.level
      WHEN 1 THEN v_bonus_amount := FLOOR(p_amount * 0.10); -- 10% для 1-го уровня
      WHEN 2 THEN v_bonus_amount := FLOOR(p_amount * 0.05); -- 5% для 2-го уровня
      WHEN 3 THEN v_bonus_amount := FLOOR(p_amount * 0.03); -- 3% для 3-го уровня
      ELSE v_bonus_amount := 0;
    END CASE;
    
    IF v_bonus_amount > 0 THEN
      -- Начисляем бонус на баланс реферера
      UPDATE public.profiles
      SET oilcoin_balance = oilcoin_balance + v_bonus_amount,
          updated_at = now()
      WHERE user_id = v_referrer.referrer_id;
      
      -- Обновляем статистику в таблице referrals
      -- Ищем связь между рефререром и пользователем в его цепочке
      DECLARE
        v_direct_referred_id uuid;
      BEGIN
        -- Для уровня 1 - это сам пользователь
        IF v_referrer.level = 1 THEN
          v_direct_referred_id := p_referred_user_id;
        -- Для уровней 2+ находим промежуточного реферала
        ELSE
          SELECT referrer_id INTO v_direct_referred_id
          FROM public.get_referral_chain(p_referred_user_id, v_referrer.level - 1)
          WHERE level = v_referrer.level - 1;
        END IF;
        
        -- Обновляем bonus_earned в таблице referrals
        UPDATE public.referrals
        SET bonus_earned = bonus_earned + v_bonus_amount,
            updated_at = now()
        WHERE referrer_id = v_referrer.referrer_id
          AND referred_id = v_direct_referred_id;
      END;
      
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
        v_referrer.referrer_id,
        v_referrer.referrer_id,
        v_bonus_amount,
        'Реферальный бонус ' || v_referrer.level || '-го уровня от пополнения',
        'referral_bonus',
        'completed',
        v_referrer.referrer_id
      );
      
      v_total_distributed := v_total_distributed + v_bonus_amount;
      
      -- Добавляем информацию о начислении в результат
      v_results := v_results || jsonb_build_object(
        'referrer_id', v_referrer.referrer_id,
        'level', v_referrer.level,
        'bonus_amount', v_bonus_amount
      );
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'total_distributed', v_total_distributed,
    'distributions', v_results
  );
END;
$$;

-- Обновляем триггерную функцию для проверки реферальных наград
-- Теперь она также вызывает distribute_referral_bonuses
CREATE OR REPLACE FUNCTION public.trigger_check_referral_rewards()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referrer_id UUID;
  v_distribution_result jsonb;
BEGIN
  -- Проверяем только при завершении платежа
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Начисляем реферальные бонусы по всей цепочке (до 3 уровней)
    SELECT public.distribute_referral_bonuses(NEW.user_id, NEW.amount) INTO v_distribution_result;
    
    -- Находим прямого реферера этого пользователя для проверки наград
    SELECT referred_by INTO v_referrer_id
    FROM public.profiles
    WHERE user_id = NEW.user_id;
    
    -- Если есть реферер, проверяем награды за майлстоуны
    IF v_referrer_id IS NOT NULL THEN
      PERFORM public.check_and_award_referral_milestones(v_referrer_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;