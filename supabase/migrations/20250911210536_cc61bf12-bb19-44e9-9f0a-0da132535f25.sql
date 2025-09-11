-- Update the trigger to make the first user an admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Count existing users
    SELECT COUNT(*) INTO user_count FROM public.profiles;
    
    -- If this is the first user, make them admin
    IF user_count <= 1 THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.user_id, 'admin');
    ELSE
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.user_id, 'user');
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create a function to promote user to admin (for testing)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Delete existing role
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin');
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;