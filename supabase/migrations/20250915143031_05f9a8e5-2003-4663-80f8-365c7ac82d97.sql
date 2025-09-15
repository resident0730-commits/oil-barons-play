-- Allow users to search profiles by referral code (for applying referral codes)
CREATE POLICY "Allow referral code lookup" 
ON public.profiles 
FOR SELECT 
USING (referral_code IS NOT NULL);