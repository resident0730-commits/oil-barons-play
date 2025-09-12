-- Создаем таблицу для бустеров пользователя
CREATE TABLE public.user_boosters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booster_type TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.user_boosters ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS
CREATE POLICY "Users can view their own boosters" 
ON public.user_boosters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boosters" 
ON public.user_boosters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boosters" 
ON public.user_boosters 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boosters" 
ON public.user_boosters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Создаем триггер для обновления timestamps
CREATE TRIGGER update_user_boosters_updated_at
BEFORE UPDATE ON public.user_boosters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем индексы для производительности
CREATE INDEX idx_user_boosters_user_id ON public.user_boosters(user_id);
CREATE INDEX idx_user_boosters_type_level ON public.user_boosters(booster_type, level);