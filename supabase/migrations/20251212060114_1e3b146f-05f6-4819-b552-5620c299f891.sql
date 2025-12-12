-- Добавляем поле для отслеживания купленных (не бонусных) OilCoins
ALTER TABLE public.profiles 
ADD COLUMN purchased_oilcoin_balance numeric NOT NULL DEFAULT 0;

-- Комментарий для понимания
COMMENT ON COLUMN public.profiles.purchased_oilcoin_balance IS 'OilCoins purchased with real money (can be exchanged to rubles)';

-- Обновляем функцию add_user_balance чтобы добавлять в purchased_oilcoin_balance
CREATE OR REPLACE FUNCTION public.add_user_balance(user_id uuid, amount_to_add numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update oilcoin balance AND purchased_oilcoin_balance
  UPDATE public.profiles 
  SET 
    oilcoin_balance = oilcoin_balance + amount_to_add,
    purchased_oilcoin_balance = purchased_oilcoin_balance + amount_to_add,
    updated_at = now()
  WHERE profiles.user_id = add_user_balance.user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', user_id;
  END IF;
END;
$function$;

-- Обновляем функцию exchange_currency - обмен только purchased OC
CREATE OR REPLACE FUNCTION public.exchange_currency(p_user_id uuid, p_from_currency text, p_to_currency text, p_from_amount numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_rate NUMERIC;
  v_to_amount NUMERIC;
  v_current_balance NUMERIC;
  v_purchased_balance NUMERIC;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Get exchange rate
  SELECT rate INTO v_rate
  FROM public.exchange_rates
  WHERE from_currency = p_from_currency
    AND to_currency = p_to_currency
    AND is_active = true
  LIMIT 1;

  IF v_rate IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Exchange rate not found');
  END IF;

  -- Calculate to_amount
  v_to_amount := p_from_amount * v_rate;

  -- Check minimum exchange for barrels
  IF p_from_currency = 'BARREL' AND p_from_amount < 1000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Minimum exchange amount is 1000 barrels');
  END IF;

  -- Get current balance based on currency
  IF p_from_currency = 'BARREL' THEN
    SELECT barrel_balance INTO v_current_balance FROM public.profiles WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'OILCOIN' THEN
    SELECT oilcoin_balance, purchased_oilcoin_balance 
    INTO v_current_balance, v_purchased_balance 
    FROM public.profiles WHERE user_id = p_user_id;
    
    -- ВАЖНО: При обмене OC→RUB можно обменять только КУПЛЕННЫЕ OilCoins
    IF p_to_currency = 'RUBLE' THEN
      IF v_purchased_balance < p_from_amount THEN
        RETURN jsonb_build_object(
          'success', false, 
          'error', 'Недостаточно купленных OilCoins. Бонусные OilCoins нельзя обменять на рубли.',
          'purchased_available', v_purchased_balance,
          'requested', p_from_amount
        );
      END IF;
    END IF;
  ELSIF p_from_currency = 'RUBLE' THEN
    SELECT ruble_balance INTO v_current_balance FROM public.profiles WHERE user_id = p_user_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid currency');
  END IF;

  -- Check if user has enough balance
  IF v_current_balance < p_from_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
  END IF;

  -- Perform the exchange (deduct from_currency, add to_currency)
  IF p_from_currency = 'BARREL' THEN
    UPDATE public.profiles SET barrel_balance = barrel_balance - p_from_amount WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'OILCOIN' THEN
    UPDATE public.profiles SET 
      oilcoin_balance = oilcoin_balance - p_from_amount,
      -- При обмене на рубли списываем из purchased
      purchased_oilcoin_balance = CASE 
        WHEN p_to_currency = 'RUBLE' THEN purchased_oilcoin_balance - p_from_amount
        ELSE purchased_oilcoin_balance
      END
    WHERE user_id = p_user_id;
  ELSIF p_from_currency = 'RUBLE' THEN
    UPDATE public.profiles SET ruble_balance = ruble_balance - p_from_amount WHERE user_id = p_user_id;
  END IF;

  IF p_to_currency = 'BARREL' THEN
    UPDATE public.profiles SET barrel_balance = barrel_balance + v_to_amount WHERE user_id = p_user_id;
  ELSIF p_to_currency = 'OILCOIN' THEN
    UPDATE public.profiles SET oilcoin_balance = oilcoin_balance + v_to_amount WHERE user_id = p_user_id;
  ELSIF p_to_currency = 'RUBLE' THEN
    UPDATE public.profiles SET ruble_balance = ruble_balance + v_to_amount WHERE user_id = p_user_id;
  END IF;

  -- Record transaction
  INSERT INTO public.exchange_transactions (user_id, from_currency, to_currency, from_amount, to_amount, exchange_rate)
  VALUES (p_user_id, p_from_currency, p_to_currency, p_from_amount, v_to_amount, v_rate);

  RETURN jsonb_build_object(
    'success', true,
    'from_amount', p_from_amount,
    'to_amount', v_to_amount,
    'rate', v_rate
  );
END;
$function$;

-- Обновляем purchase_well - при покупке сначала тратим бонусные OC
CREATE OR REPLACE FUNCTION public.purchase_well(p_user_id uuid, p_well_type text, p_price numeric, p_daily_income numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_current_balance numeric;
  v_purchased_balance numeric;
  v_new_balance numeric;
  v_new_purchased numeric;
  v_bonus_balance numeric;
  v_spent_from_bonus numeric;
  v_spent_from_purchased numeric;
  v_well_id uuid;
BEGIN
  -- Получаем текущие балансы с блокировкой строки
  SELECT oilcoin_balance, purchased_oilcoin_balance 
  INTO v_current_balance, v_purchased_balance
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Профиль не найден');
  END IF;

  -- Проверяем достаточность средств
  IF v_current_balance < p_price THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Недостаточно средств',
      'required', p_price,
      'available', v_current_balance
    );
  END IF;

  -- Вычисляем бонусный баланс
  v_bonus_balance := v_current_balance - v_purchased_balance;
  
  -- Сначала тратим бонусные OC, потом purchased
  v_spent_from_bonus := LEAST(v_bonus_balance, p_price);
  v_spent_from_purchased := p_price - v_spent_from_bonus;
  
  -- Новые балансы
  v_new_balance := v_current_balance - p_price;
  v_new_purchased := v_purchased_balance - v_spent_from_purchased;

  -- Списываем средства
  UPDATE public.profiles
  SET oilcoin_balance = v_new_balance, 
      purchased_oilcoin_balance = v_new_purchased,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Создаём скважину
  INSERT INTO public.wells (user_id, well_type, level, daily_income)
  VALUES (p_user_id, p_well_type, 1, p_daily_income)
  RETURNING id INTO v_well_id;

  RETURN jsonb_build_object(
    'success', true,
    'well_id', v_well_id,
    'new_balance', v_new_balance,
    'price_paid', p_price
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;

-- Обновляем purchase_well_package - аналогичная логика
CREATE OR REPLACE FUNCTION public.purchase_well_package(p_user_id uuid, p_wells jsonb, p_price numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_current_balance numeric;
  v_purchased_balance numeric;
  v_new_balance numeric;
  v_new_purchased numeric;
  v_bonus_balance numeric;
  v_spent_from_bonus numeric;
  v_spent_from_purchased numeric;
  v_well_record jsonb;
  v_created_wells uuid[] := '{}';
  v_well_id uuid;
  i integer;
BEGIN
  -- Получаем текущие балансы с блокировкой строки
  SELECT oilcoin_balance, purchased_oilcoin_balance 
  INTO v_current_balance, v_purchased_balance
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Профиль не найден');
  END IF;

  -- Проверяем достаточность средств
  IF v_current_balance < p_price THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Недостаточно средств',
      'required', p_price,
      'available', v_current_balance
    );
  END IF;

  -- Вычисляем бонусный баланс
  v_bonus_balance := v_current_balance - v_purchased_balance;
  
  -- Сначала тратим бонусные OC, потом purchased
  v_spent_from_bonus := LEAST(v_bonus_balance, p_price);
  v_spent_from_purchased := p_price - v_spent_from_bonus;
  
  -- Новые балансы
  v_new_balance := v_current_balance - p_price;
  v_new_purchased := v_purchased_balance - v_spent_from_purchased;

  -- Списываем средства
  UPDATE public.profiles
  SET oilcoin_balance = v_new_balance, 
      purchased_oilcoin_balance = v_new_purchased,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Создаём все скважины из пакета
  FOR v_well_record IN SELECT * FROM jsonb_array_elements(p_wells)
  LOOP
    FOR i IN 1..(v_well_record->>'count')::integer
    LOOP
      INSERT INTO public.wells (user_id, well_type, level, daily_income)
      VALUES (
        p_user_id, 
        v_well_record->>'type', 
        1, 
        (v_well_record->>'daily_income')::numeric
      )
      RETURNING id INTO v_well_id;
      
      v_created_wells := array_append(v_created_wells, v_well_id);
    END LOOP;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'well_ids', v_created_wells,
    'new_balance', v_new_balance,
    'price_paid', p_price,
    'wells_created', array_length(v_created_wells, 1)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;