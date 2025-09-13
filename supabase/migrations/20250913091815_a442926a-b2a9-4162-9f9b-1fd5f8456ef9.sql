-- Add last_login field to profiles table to track offline income
ALTER TABLE public.profiles 
ADD COLUMN last_login timestamp with time zone DEFAULT now();