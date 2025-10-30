-- Manual Migration Fix
-- Run this if automatic migration failed

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);

-- Create permission_level enum if not exists
DO $$ BEGIN
    CREATE TYPE permission_level AS ENUM ('full', 'edit', 'comment', 'view');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update app_role enum to include 'admin'
DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'admin';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create project_roles table if not exists
CREATE TABLE IF NOT EXISTS project_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
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

-- Add project_role_id to project_members if not exists
ALTER TABLE project_members ADD COLUMN IF NOT EXISTS project_role_id UUID REFERENCES project_roles(id) ON DELETE SET NULL;

-- Create trigger for project_roles updated_at
DROP TRIGGER IF EXISTS update_project_roles_updated_at ON project_roles;
CREATE TRIGGER update_project_roles_updated_at BEFORE UPDATE ON project_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for project_roles
CREATE INDEX IF NOT EXISTS idx_project_roles_project ON project_roles(project_id);

COMMIT;
