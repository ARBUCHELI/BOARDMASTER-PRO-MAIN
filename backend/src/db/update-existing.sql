-- Update existing database with new columns and tables
-- Safe to run multiple times

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);

-- Add missing column to project_members table  
ALTER TABLE project_members ADD COLUMN IF NOT EXISTS project_role_id UUID;

-- Now run this to add the foreign key if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_members_project_role_id_fkey'
    ) THEN
        ALTER TABLE project_members 
        ADD CONSTRAINT project_members_project_role_id_fkey 
        FOREIGN KEY (project_role_id) REFERENCES project_roles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_project_roles_project ON project_roles(project_id);

-- Done!
SELECT 'Database updated successfully!' as message;
