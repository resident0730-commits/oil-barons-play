-- Функция для атомарной покупки скважины
CREATE OR REPLACE FUNCTION public.purchase_well(
  p_user_id uuid,
  p_well_type text,
  p_price numeric,
  p_daily_income numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance numeric;
  v_new_balance numeric;
  v_well_id uuid;
BEGIN
  -- Получаем текущий баланс с блокировкой строки
  SELECT oilcoin_balance INTO v_current_balance
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

  -- Списываем средства
  v_new_balance := v_current_balance - p_price;
  UPDATE public.profiles
  SET oilcoin_balance = v_new_balance, updated_at = now()
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
$$;

-- Функция для атомарной покупки пакета скважин
CREATE OR REPLACE FUNCTION public.purchase_well_package(
  p_user_id uuid,
  p_wells jsonb, -- [{"type": "Мини-скважина", "count": 2, "daily_income": 20000}, ...]
  p_price numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance numeric;
  v_new_balance numeric;
  v_well_record jsonb;
  v_created_wells uuid[] := '{}';
  v_well_id uuid;
  i integer;
BEGIN
  -- Получаем текущий баланс с блокировкой строки
  SELECT oilcoin_balance INTO v_current_balance
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

  -- Списываем средства
  v_new_balance := v_current_balance - p_price;
  UPDATE public.profiles
  SET oilcoin_balance = v_new_balance, updated_at = now()
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
$$;