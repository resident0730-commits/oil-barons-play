-- Create money transfers table for tracking admin transfers
CREATE TABLE public.money_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL, 
  amount NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  transfer_type TEXT NOT NULL DEFAULT 'admin_transfer' CHECK (transfer_type IN ('admin_transfer', 'withdrawal')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.money_transfers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all transfers" 
ON public.money_transfers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create transfers" 
ON public.money_transfers 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can view transfers they are involved in
CREATE POLICY "Users can view their own transfers" 
ON public.money_transfers 
FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Create function to transfer money between users
CREATE OR REPLACE FUNCTION public.transfer_money(
  p_from_user_id UUID,
  p_to_user_id UUID,
  p_amount NUMERIC,
  p_description TEXT DEFAULT NULL,
  p_admin_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check if admin has permission
  IF NOT has_role(COALESCE(p_admin_id, auth.uid()), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can transfer money';
  END IF;

  -- Check if from_user has enough balance (only if not admin transfer to self)
  IF p_from_user_id != COALESCE(p_admin_id, auth.uid()) THEN
    IF (SELECT balance FROM public.profiles WHERE user_id = p_from_user_id) < p_amount THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
    
    -- Deduct from sender
    UPDATE public.profiles 
    SET balance = balance - p_amount,
        updated_at = now()
    WHERE user_id = p_from_user_id;
  END IF;

  -- Add to receiver
  UPDATE public.profiles 
  SET balance = balance + p_amount,
      updated_at = now()
  WHERE user_id = p_to_user_id;

  -- Record the transfer
  INSERT INTO public.money_transfers (
    from_user_id, 
    to_user_id, 
    amount, 
    description,
    created_by
  ) VALUES (
    p_from_user_id,
    p_to_user_id,
    p_amount,
    p_description,
    COALESCE(p_admin_id, auth.uid())
  );

  RETURN TRUE;
END;
$function$;