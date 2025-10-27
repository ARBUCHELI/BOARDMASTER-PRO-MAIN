-- Fix infinite recursion in RLS policies by creating security definer functions

-- Function to check if user is project member
CREATE OR REPLACE FUNCTION public.is_project_member(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE user_id = _user_id
      AND project_id = _project_id
  )
$$;

-- Function to check if user is project owner
CREATE OR REPLACE FUNCTION public.is_project_owner(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.projects
    WHERE id = _project_id
      AND owner_id = _user_id
  )
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user can access project
CREATE OR REPLACE FUNCTION public.can_access_project(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_project_owner(_user_id, _project_id) 
    OR public.is_project_member(_user_id, _project_id)
$$;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can update members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can delete members" ON public.project_members;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view project members"
ON public.project_members
FOR SELECT
USING (public.can_access_project(auth.uid(), project_id));

CREATE POLICY "Project owners can insert members"
ON public.project_members
FOR INSERT
WITH CHECK (public.is_project_owner(auth.uid(), project_id));

CREATE POLICY "Project owners can update members"
ON public.project_members
FOR UPDATE
USING (public.is_project_owner(auth.uid(), project_id));

CREATE POLICY "Project owners can delete members"
ON public.project_members
FOR DELETE
USING (public.is_project_owner(auth.uid(), project_id));

-- Update projects policies to use the function
DROP POLICY IF EXISTS "Users can view projects they are members of" ON public.projects;

CREATE POLICY "Users can view projects they are members of"
ON public.projects
FOR SELECT
USING (public.can_access_project(auth.uid(), id));

-- Enable RLS on user_roles if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));