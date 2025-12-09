-- Добавляем уникальный индекс на никнейм (регистронезависимый)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_nickname_unique_idx 
ON public.profiles (LOWER(nickname));

-- Создаем функцию для проверки уникальности никнейма
CREATE OR REPLACE FUNCTION public.check_nickname_available(p_nickname text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE LOWER(nickname) = LOWER(p_nickname)
  );
$$;