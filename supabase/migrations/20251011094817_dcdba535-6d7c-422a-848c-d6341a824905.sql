-- Улучшаем функцию apply_promo_code с обработкой ошибок
CREATE OR REPLACE FUNCTION public.apply_promo_code(p_code text, p_user_id uuid, p_invoice_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_promo_code RECORD;
  v_bonus_amount NUMERIC;
BEGIN
  -- Проверяем промокод
  SELECT * INTO v_promo_code
  FROM public.promo_codes
  WHERE code = UPPER(TRIM(p_code))
    AND is_active = true;
  
  -- Проверка существования промокода
  IF v_promo_code IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Промокод не найден');
  END IF;
  
  -- Проверка срока действия
  IF v_promo_code.expires_at IS NOT NULL AND v_promo_code.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Срок действия промокода истек');
  END IF;
  
  -- Проверка лимита использований
  IF v_promo_code.max_uses IS NOT NULL AND v_promo_code.current_uses >= v_promo_code.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Промокод больше недоступен');
  END IF;
  
  -- Проверка, использовал ли пользователь этот промокод
  IF EXISTS (
    SELECT 1 FROM public.promo_code_usage
    WHERE promo_code_id = v_promo_code.id
      AND user_id = p_user_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Вы уже использовали этот промокод');
  END IF;
  
  -- Применяем промокод
  v_bonus_amount := v_promo_code.bonus_amount;
  
  -- Добавляем бонус на баланс
  UPDATE public.profiles
  SET balance = balance + v_bonus_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Проверяем, что обновление прошло успешно
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Пользователь не найден');
  END IF;
  
  -- Записываем использование
  INSERT INTO public.promo_code_usage (promo_code_id, user_id, invoice_id, bonus_received)
  VALUES (v_promo_code.id, p_user_id, p_invoice_id, v_bonus_amount);
  
  -- Увеличиваем счетчик использований
  UPDATE public.promo_codes
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = v_promo_code.id;
  
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
    p_user_id,
    p_user_id,
    v_bonus_amount,
    'Бонус по промокоду: ' || v_promo_code.code,
    'promo_code',
    'completed',
    p_user_id
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'bonus_amount', v_bonus_amount,
    'message', 'Промокод применен! Начислено ' || v_bonus_amount || '₽'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Ошибка при применении промокода: ' || SQLERRM
    );
END;
$function$;