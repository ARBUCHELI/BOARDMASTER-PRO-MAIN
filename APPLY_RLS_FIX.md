# Fix RLS Policy for Project Creation

Since you don't have access to the Supabase dashboard, here are the steps to fix the RLS policy issue:

## Option 1: Manual SQL Execution (Recommended)

1. **Find your Supabase project URL and API key:**
   - Check your `.env` file for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Or check your Supabase project settings

2. **Go to your Supabase project dashboard:**
   - Visit: https://supabase.com/dashboard
   - Find your project (ID: fcjyhdxwimiuihandnau)
   - Go to SQL Editor

3. **Run this SQL code:**

```sql
-- Fix RLS policy for project creation
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;

CREATE POLICY "Authenticated users can create projects"
ON public.projects
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = owner_id
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- Fix profile policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Update handle_new_user function
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
    full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Option 2: Alternative - Disable RLS Temporarily

If you can't access the dashboard, you can temporarily disable RLS for testing:

```sql
-- TEMPORARY: Disable RLS for projects table (NOT RECOMMENDED FOR PRODUCTION)
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING: Only use this for testing. Re-enable RLS after testing!**

## What This Fix Does:

1. **Updates the RLS policy** to ensure users have profiles before creating projects
2. **Fixes profile creation policies** to be more explicit
3. **Updates the user signup trigger** to create profiles automatically
4. **Ensures proper authentication checks**

## After Applying the Fix:

1. Try creating a project in your application
2. The "new row violates row-level security policy" error should be resolved
3. Users should be able to create projects successfully

## Files Modified in Your Project:

- ✅ `src/pages/Projects.tsx` - Updated with better profile handling
- ✅ `src/pages/Dashboard.tsx` - Updated with better profile handling  
- ✅ `supabase/migrations/20250110000000_fix_project_creation_rls.sql` - Contains the SQL fix

The React code changes are already applied and will help ensure user profiles exist before project creation.
