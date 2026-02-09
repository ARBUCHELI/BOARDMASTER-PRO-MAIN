-- Complete schema for TaskFlow with Supabase Auth
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE permission_level AS ENUM ('full', 'edit', 'comment', 'view');

-- Profiles table (linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  job_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project roles table (custom roles like Scrum Master, Frontend Dev, etc.)
CREATE TABLE public.project_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  permission_level permission_level NOT NULL DEFAULT 'edit',
  can_manage_members BOOLEAN DEFAULT false,
  can_manage_roles BOOLEAN DEFAULT false,
  can_assign_tasks BOOLEAN DEFAULT false,
  can_delete_tasks BOOLEAN DEFAULT false,
  can_manage_project BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, name)
);

-- Project members table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  project_role_id UUID REFERENCES public.project_roles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Boards table (columns in Kanban)
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'todo',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  position INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_project_owner(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = _project_id AND owner_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_project_member(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE user_id = _user_id AND project_id = _project_id
  )
$$;

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

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they can access" ON public.projects 
  FOR SELECT USING (public.can_access_project(auth.uid(), id));
CREATE POLICY "Authenticated users can create projects" ON public.projects 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);
CREATE POLICY "Project owners can update" ON public.projects 
  FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Project owners can delete" ON public.projects 
  FOR DELETE USING (owner_id = auth.uid());

-- Project roles policies
CREATE POLICY "Users can view project roles" ON public.project_roles 
  FOR SELECT USING (public.can_access_project(auth.uid(), project_id));
CREATE POLICY "Project owners can manage roles" ON public.project_roles 
  FOR ALL USING (public.is_project_owner(auth.uid(), project_id));

-- Project members policies
CREATE POLICY "Users can view project members" ON public.project_members 
  FOR SELECT USING (public.can_access_project(auth.uid(), project_id));
CREATE POLICY "Project owners can insert members" ON public.project_members 
  FOR INSERT WITH CHECK (public.is_project_owner(auth.uid(), project_id));
CREATE POLICY "Project owners can update members" ON public.project_members 
  FOR UPDATE USING (public.is_project_owner(auth.uid(), project_id));
CREATE POLICY "Project owners can delete members" ON public.project_members 
  FOR DELETE USING (public.is_project_owner(auth.uid(), project_id));

-- Boards policies
CREATE POLICY "Users can view boards" ON public.boards 
  FOR SELECT USING (public.can_access_project(auth.uid(), project_id));
CREATE POLICY "Project members can create boards" ON public.boards 
  FOR INSERT WITH CHECK (public.can_access_project(auth.uid(), project_id));
CREATE POLICY "Project members can update boards" ON public.boards 
  FOR UPDATE USING (public.can_access_project(auth.uid(), project_id));
CREATE POLICY "Project owners can delete boards" ON public.boards 
  FOR DELETE USING (public.is_project_owner(auth.uid(), project_id));

-- Tasks policies
CREATE POLICY "Users can view tasks" ON public.tasks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.boards b
      WHERE b.id = tasks.board_id
      AND public.can_access_project(auth.uid(), b.project_id)
    )
  );
CREATE POLICY "Project members can create tasks" ON public.tasks 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards b
      WHERE b.id = tasks.board_id
      AND public.can_access_project(auth.uid(), b.project_id)
    )
  );
CREATE POLICY "Project members can update tasks" ON public.tasks 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.boards b
      WHERE b.id = tasks.board_id
      AND public.can_access_project(auth.uid(), b.project_id)
    )
  );
CREATE POLICY "Project members can delete tasks" ON public.tasks 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.boards b
      WHERE b.id = tasks.board_id
      AND public.can_access_project(auth.uid(), b.project_id)
    )
  );

-- Comments policies
CREATE POLICY "Users can view comments" ON public.comments 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.boards b ON b.id = t.board_id
      WHERE t.id = comments.task_id
      AND public.can_access_project(auth.uid(), b.project_id)
    )
  );
CREATE POLICY "Project members can create comments" ON public.comments 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.boards b ON b.id = t.board_id
      WHERE t.id = comments.task_id
      AND public.can_access_project(auth.uid(), b.project_id)
    )
  );
CREATE POLICY "Users can update own comments" ON public.comments 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments 
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to handle new user signup (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_roles_updated_at BEFORE UPDATE ON public.project_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON public.boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_user ON public.project_members(user_id);
CREATE INDEX idx_boards_project ON public.boards(project_id);
CREATE INDEX idx_tasks_board ON public.tasks(board_id);
CREATE INDEX idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX idx_comments_task ON public.comments(task_id);
