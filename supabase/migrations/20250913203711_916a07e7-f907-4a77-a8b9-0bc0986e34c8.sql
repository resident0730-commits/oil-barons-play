-- Add status column to money_transfers table
ALTER TABLE public.money_transfers 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected'));

-- Add withdrawal details column
ALTER TABLE public.money_transfers 
ADD COLUMN withdrawal_details JSONB;

-- Create function to process withdrawal
CREATE OR REPLACE FUNCTION public.process_withdrawal(
  p_transfer_id UUID,
  p_status TEXT,
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
    RAISE EXCEPTION 'Only admins can process withdrawals';
  END IF;

  -- Update transfer status
  UPDATE public.money_transfers 
  SET status = p_status,
      updated_at = now()
  WHERE id = p_transfer_id;

  RETURN TRUE;
END;
$function$;