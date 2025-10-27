-- RPC function to create projects while handling profile creation
-- Run this in your Lovable Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_project_with_profile(
  project_name TEXT,
  project_description TEXT,
  user_email TEXT,
  user_full_name TEXT
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  owner_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
  project_record RECORD;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Ensure the user has a profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (user_id, user_email, user_full_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

  -- Create the project
  INSERT INTO public.projects (name, description, owner_id)
  VALUES (project_name, project_description, user_id)
  RETURNING * INTO project_record;

  -- Return the created project
  RETURN QUERY SELECT 
    project_record.id,
    project_record.name,
    project_record.description,
    project_record.owner_id,
    project_record.created_at,
    project_record.updated_at;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_project_with_profile TO authenticated;
