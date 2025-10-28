# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

BoardMaster Pro is a Kanban-style project management application built with React, TypeScript, Vite, and Supabase. It's developed using the Lovable platform with shadcn/ui components.

## Essential Commands

### Development
```powershell
npm i                    # Install dependencies
npm run dev              # Start dev server on port 8080
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## Architecture

### Frontend Structure
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router v6 with protected routes
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: React Context for auth, TanStack Query for server state
- **Drag & Drop**: react-beautiful-dnd for Kanban board

### Key Directories
- `src/pages/` - Main application pages (Dashboard, Projects, ProjectBoard, Admin, Auth)
- `src/components/` - Reusable components including shadcn/ui components in `ui/` subdirectory
- `src/contexts/` - React Context providers (AuthContext)
- `src/integrations/supabase/` - Auto-generated Supabase client and types
- `src/hooks/` - Custom React hooks (use-toast, use-mobile)
- `src/lib/` - Utility functions
- `supabase/migrations/` - Database migration files

### Backend (Supabase)
Database schema includes:
- **profiles** - User profiles linked to auth.users
- **projects** - Project metadata with owner relationships
- **project_members** - Many-to-many project membership with roles
- **boards** - Kanban board columns within projects
- **tasks** - Individual tasks with priority, status, assignment, and position
- **comments** - Task comments
- **user_roles** - System-wide role assignments

Enum types: `app_role` (owner/member/viewer), `task_priority` (low/medium/high/urgent), `task_status` (todo/in_progress/done)

### Authentication Flow
1. AuthContext wraps the application and manages session state
2. Supabase Auth with localStorage persistence and auto-refresh
3. Protected routes wrapped in Layout component
4. User profiles are automatically created during registration
5. Navigation automatically redirects based on auth state

### Row Level Security (RLS)
The application has comprehensive RLS policies:
- Users can only access projects they own or are members of
- Project owners have full CRUD permissions on their projects
- Project members can view and create/update boards and tasks
- Profile updates restricted to own profile

**Known Issue**: If encountering RLS errors during project creation, the codebase includes fallback methods in `Projects.tsx` and `Dashboard.tsx` that try multiple insertion strategies.

## Import Aliases
- `@/*` maps to `src/*` (configured in vite.config.ts and tsconfig.json)
- Common imports: `@/components/ui/*`, `@/integrations/supabase/client`, `@/hooks/*`, `@/lib/*`

## Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## TypeScript Configuration
- Loose mode enabled: `noImplicitAny: false`, `strictNullChecks: false`
- Project uses TypeScript references with separate configs for app and node environments
- Skip lib check enabled for faster builds

## Development Workflow
1. This project integrates with Lovable - changes pushed to Git are reflected in the Lovable editor
2. When making database changes, create migration files in `supabase/migrations/`
3. Supabase types are auto-generated in `src/integrations/supabase/types.ts`
4. Always use the Supabase client from `@/integrations/supabase/client`
5. Toast notifications via sonner are available globally for user feedback

## Component Patterns
- Use shadcn/ui components from `@/components/ui/` for consistent UI
- Forms use react-hook-form with zod validation
- Dialogs and modals use Radix UI primitives
- Always destructure auth context: `const { user, session, loading } = useAuth()`
- Use `useToast()` hook for displaying notifications

## Database Queries
- Always check for RLS errors and handle gracefully
- Use typed queries via the generated Database type
- Fetch patterns typically: `.from(table).select().eq(id, value).single()` or `.order().limit()`
- For relationships, use Supabase's query builder with explicit joins
- Task and board positions use integer-based ordering for drag-and-drop
