-- Разрешить пользователям создавать заявки на вывод средств
CREATE POLICY "Users can create withdrawal requests" 
ON public.money_transfers 
FOR INSERT 
WITH CHECK (
  auth.uid() = from_user_id 
  AND transfer_type = 'withdrawal'
  AND created_by = auth.uid()
);