-- Создаем таблицу промокодов
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  bonus_amount NUMERIC NOT NULL DEFAULT 500,
  max_uses INTEGER DEFAULT NULL, -- NULL = неограниченно
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу использований промокодов
CREATE TABLE public.promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  invoice_id UUID REFERENCES public.payment_invoices(id),
  bonus_received NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(promo_code_id, user_id) -- Один промокод один раз на пользователя
);

-- Включаем RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Политики для promo_codes
CREATE POLICY "Anyone can view active promo codes"
ON public.promo_codes
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage promo codes"
ON public.promo_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Политики для promo_code_usage
CREATE POLICY "Users can view their own usage"
ON public.promo_code_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage"
ON public.promo_code_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Функция для применения промокода
CREATE OR REPLACE FUNCTION public.apply_promo_code(
  p_code TEXT,
  p_user_id UUID,
  p_invoice_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  SET balance = balance + v_bonus_amount
  WHERE user_id = p_user_id;
  
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
END;
$$;

-- Триггер для обновления updated_at
CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();