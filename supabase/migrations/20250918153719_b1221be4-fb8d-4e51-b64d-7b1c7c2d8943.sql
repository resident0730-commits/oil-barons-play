-- Удаляем существующую политику, которая дает доступ всем
DROP POLICY IF EXISTS "Bot players are viewable by everyone" ON public.bot_players;

-- Создаем новую политику - доступ только для администраторов
CREATE POLICY "Only admins can view bot players" 
ON public.bot_players 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Также добавляем политику для администраторов на управление ботами
CREATE POLICY "Admins can manage bot players" 
ON public.bot_players 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));