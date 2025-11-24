-- Исправление безопасности таблицы profiles
-- Удаляем старые политики и создаем новые с явной проверкой авторизации
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Новая политика для пользователей - явно требуем авторизации
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Новая политика для админов - явно требуем авторизации
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Исправление безопасности таблицы money_transfers
-- Удаляем старую политику просмотра
DROP POLICY IF EXISTS "Users can view their own transfers" ON public.money_transfers;

-- Создаем функцию для безопасного отображения переводов
-- Пользователи-получатели не должны видеть withdrawal_details отправителя
CREATE OR REPLACE FUNCTION public.get_user_transfers()
RETURNS TABLE (
  id uuid,
  from_user_id uuid,
  to_user_id uuid,
  amount numeric,
  status text,
  transfer_type text,
  description text,
  withdrawal_details jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mt.id,
    mt.from_user_id,
    mt.to_user_id,
    mt.amount,
    mt.status,
    mt.transfer_type,
    mt.description,
    -- Показываем withdrawal_details только если пользователь - отправитель или админ
    CASE 
      WHEN auth.uid() = mt.from_user_id OR has_role(auth.uid(), 'admin'::app_role) 
      THEN mt.withdrawal_details
      ELSE NULL
    END as withdrawal_details,
    mt.created_at,
    mt.updated_at,
    mt.created_by
  FROM public.money_transfers mt
  WHERE auth.uid() = mt.from_user_id 
     OR auth.uid() = mt.to_user_id
     OR has_role(auth.uid(), 'admin'::app_role);
END;
$$;

-- Создаем новую политику для просмотра переводов
CREATE POLICY "Users can view their own transfers" 
ON public.money_transfers 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = from_user_id 
  OR auth.uid() = to_user_id
);

-- Комментарий для разработчиков
COMMENT ON FUNCTION public.get_user_transfers() IS 
'Безопасная функция для получения переводов пользователя. Скрывает withdrawal_details для получателей.';