
CREATE OR REPLACE FUNCTION public.distribute_referral_bonuses(p_referred_user_id uuid, p_amount numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
      -- Начисляем бонус на РУБЛЁВЫЙ баланс реферера (изменено с oilcoin_balance)
      UPDATE public.profiles
      SET ruble_balance = ruble_balance + v_bonus_amount,
          updated_at = now()
      WHERE user_id = v_referrer.referrer_id;
      
      -- Для уровня 1: обновляем bonus_earned на записи referrer → payer
      IF v_referrer.level = 1 THEN
        UPDATE public.referrals
        SET bonus_earned = bonus_earned + v_bonus_amount,
            updated_at = now()
        WHERE referrer_id = v_referrer.referrer_id
          AND referred_id = p_referred_user_id;
      END IF;
      
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
$function$;
