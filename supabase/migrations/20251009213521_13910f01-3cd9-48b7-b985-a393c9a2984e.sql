-- Fix security issue: Explicitly restrict profiles table access to authenticated users only
-- This prevents any potential anonymous/public access to sensitive financial data

-- Drop existing SELECT policies to recreate them with explicit authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate SELECT policies with explicit "TO authenticated" clause
-- This ensures only authenticated users can even attempt to read the table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated  -- Explicitly require authentication
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated  -- Explicitly require authentication
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also ensure INSERT and UPDATE policies are explicitly restricted to authenticated users
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated  -- Explicitly require authentication
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated  -- Explicitly require authentication
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated  -- Explicitly require authentication
USING (has_role(auth.uid(), 'admin'::app_role));