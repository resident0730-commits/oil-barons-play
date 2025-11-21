-- Fix security issue: Remove public access to promo_codes table
-- Users will still be able to apply promo codes through the apply_promo_code() function

-- Drop the public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;

-- Keep only admin access policy (already exists)
-- Policy "Admins can manage promo codes" remains unchanged