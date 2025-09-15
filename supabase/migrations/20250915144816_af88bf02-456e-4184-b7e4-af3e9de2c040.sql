-- Remove the insecure referral code lookup policy
DROP POLICY IF EXISTS "Allow referral code lookup" ON public.profiles;

-- Create a secure function for referral code lookup that only returns minimal necessary data
CREATE OR REPLACE FUNCTION public.lookup_referral_code(code text)
RETURNS TABLE(user_id uuid, referral_code text, nickname text) AS $$
BEGIN
  RETURN QUERY
  SELECT p.user_id, p.referral_code, p.nickname
  FROM public.profiles p
  WHERE p.referral_code = code
  AND p.referral_code IS NOT NULL
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.lookup_referral_code(text) TO authenticated;