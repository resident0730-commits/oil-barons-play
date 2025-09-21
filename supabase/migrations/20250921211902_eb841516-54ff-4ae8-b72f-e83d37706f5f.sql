-- Создаем функцию для безопасного добавления баланса пользователю
CREATE OR REPLACE FUNCTION public.add_user_balance(
  user_id UUID,
  amount_to_add NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Обновляем баланс пользователя
  UPDATE public.profiles 
  SET 
    balance = balance + amount_to_add,
    updated_at = now()
  WHERE profiles.user_id = add_user_balance.user_id;
  
  -- Если пользователь не найден, выбрасываем исключение
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', user_id;
  END IF;
END;
$$;