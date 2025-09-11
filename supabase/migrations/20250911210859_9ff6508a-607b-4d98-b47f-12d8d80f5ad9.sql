-- Update the trigger to only assign 'user' role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Always assign 'user' role to new users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'user');
    
    RETURN NEW;
END;
$$;

-- Remove the promote_to_admin function as it's no longer needed
DROP FUNCTION IF EXISTS public.promote_to_admin(_user_id UUID);