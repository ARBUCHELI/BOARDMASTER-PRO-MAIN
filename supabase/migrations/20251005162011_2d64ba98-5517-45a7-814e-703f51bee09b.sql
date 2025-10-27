-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE app_role AS ENUM ('owner', 'member', 'viewer');

-- Create enum for task priority
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create enum for task status
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create boards table (columns in Kanban)
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
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

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they are members of" ON public.projects FOR SELECT
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = projects.id
    AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create projects" ON public.projects FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects" ON public.projects FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects" ON public.projects FOR DELETE
USING (owner_id = auth.uid());

-- Project members policies
CREATE POLICY "Users can view project members" ON public.project_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_members.project_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members pm
                 WHERE pm.project_id = projects.id AND pm.user_id = auth.uid()))
  )
);

CREATE POLICY "Project owners can manage members" ON public.project_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_members.project_id
    AND projects.owner_id = auth.uid()
  )
);

CREATE POLICY "Project owners can update members" ON public.project_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_members.project_id
    AND projects.owner_id = auth.uid()
  )
);

CREATE POLICY "Project owners can delete members" ON public.project_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_members.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Boards policies
CREATE POLICY "Users can view boards in their projects" ON public.boards FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = boards.project_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()))
  )
);

CREATE POLICY "Project members can create boards" ON public.boards FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = boards.project_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()
                 AND role IN ('owner', 'member')))
  )
);

CREATE POLICY "Project members can update boards" ON public.boards FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = boards.project_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()
                 AND role IN ('owner', 'member')))
  )
);

CREATE POLICY "Project owners can delete boards" ON public.boards FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = boards.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Tasks policies
CREATE POLICY "Users can view tasks in their projects" ON public.tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.boards
    JOIN public.projects ON projects.id = boards.project_id
    WHERE boards.id = tasks.board_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()))
  )
);

CREATE POLICY "Project members can create tasks" ON public.tasks FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.boards
    JOIN public.projects ON projects.id = boards.project_id
    WHERE boards.id = tasks.board_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()
                 AND role IN ('owner', 'member')))
  )
);

CREATE POLICY "Project members can update tasks" ON public.tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.boards
    JOIN public.projects ON projects.id = boards.project_id
    WHERE boards.id = tasks.board_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()
                 AND role IN ('owner', 'member')))
  )
);

CREATE POLICY "Project members can delete tasks" ON public.tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.boards
    JOIN public.projects ON projects.id = boards.project_id
    WHERE boards.id = tasks.board_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()
                 AND role IN ('owner', 'member')))
  )
);

-- Comments policies
CREATE POLICY "Users can view comments on tasks they can see" ON public.comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tasks
    JOIN public.boards ON boards.id = tasks.board_id
    JOIN public.projects ON projects.id = boards.project_id
    WHERE tasks.id = comments.task_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()))
  )
);

CREATE POLICY "Project members can create comments" ON public.comments FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.tasks
    JOIN public.boards ON boards.id = tasks.board_id
    JOIN public.projects ON projects.id = boards.project_id
    WHERE tasks.id = comments.task_id
    AND (projects.owner_id = auth.uid() OR
         EXISTS (SELECT 1 FROM public.project_members
                 WHERE project_members.project_id = projects.id
                 AND project_members.user_id = auth.uid()
                 AND role IN ('owner', 'member')))
  )
);

CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE
USING (auth.uid() = user_id);

-- Create function to handle new user signup
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
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON public.boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();