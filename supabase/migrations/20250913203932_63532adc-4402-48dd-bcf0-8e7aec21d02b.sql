-- Add withdrawal details column (status already exists)
ALTER TABLE public.money_transfers 
ADD COLUMN IF NOT EXISTS withdrawal_details JSONB;

-- Add updated_at column if it doesn't exist
ALTER TABLE public.money_transfers 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

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