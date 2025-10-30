# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

BoardMaster Pro is a full-stack Kanban-style project management application (similar to Jira/Trello) with a **dual architecture**: it uses both a **custom Express.js backend with PostgreSQL** AND has legacy **Supabase integration** code. The primary data flow is through the Express backend, while the Supabase client exists as a dummy implementation to prevent import errors.

## Essential Commands

### Frontend Development
```powershell
npm i                    # Install dependencies
npm run dev              # Start dev server on port 8080 (not 5173)
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Backend Development
```powershell
cd backend
npm install              # Install backend dependencies
npm run dev              # Start backend dev server with tsx watch (port 3001)
npm run build            # Compile TypeScript to dist/
npm start                # Run production build
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data
```

### Testing
- **No test framework configured** - Check README or search codebase before assuming test commands
- Backend tests not currently implemented
- Frontend tests not currently implemented

## Architecture

### Dual Backend System
**IMPORTANT**: This project has evolved from Supabase to a custom backend:
1. **Primary Backend**: Express.js (TypeScript) + PostgreSQL
   - JWT-based authentication (bcrypt for passwords)
   - RESTful API on port 3001
   - Database migrations in `backend/src/db/migrate.ts`
2. **Legacy Supabase Code**: Dummy implementation in `src/integrations/supabase/client.ts`
   - Exists only to prevent import errors
   - DO NOT use for actual data operations
   - Frontend uses `src/lib/api.ts` ApiClient instead

### Frontend Stack
- **Framework**: React 18 + TypeScript + Vite (SWC compiler)
- **Routing**: React Router v6
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with @tailwindcss/typography
- **State Management**: React Context for auth, TanStack Query for server state
- **Drag & Drop**: react-beautiful-dnd for Kanban board
- **Forms**: react-hook-form with zod validation
- **Notifications**: sonner toast library
- **Dev Port**: 8080 (configured in vite.config.ts)

### Backend Stack (Express)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via `pg` library)
- **Auth**: JWT tokens (jsonwebtoken) + bcrypt
- **Validation**: Zod schemas
- **Dev Tool**: tsx for TypeScript execution with watch mode
- **CORS**: Enabled for all origins (`cors({ origin: '*' })`)

### Project Structure
```
boardmaster-pro-main/
├── backend/
│   ├── src/
│   │   ├── db/          # Database connection, migrations, seeding
│   │   ├── middleware/  # JWT authentication middleware
│   │   ├── routes/      # API routes (auth, projects, boards, tasks)
│   │   └── server.ts    # Express app entry point
│   └── package.json
├── src/                 # React frontend
│   ├── components/      # Reusable components + ui/ subdirectory (shadcn)
│   ├── contexts/        # AuthContext (uses Express backend)
│   ├── hooks/           # use-toast, use-mobile
│   ├── integrations/    # Dummy Supabase client (legacy)
│   ├── lib/             # api.ts (ApiClient for Express backend)
│   ├── pages/           # Dashboard, Projects, ProjectBoard, Auth
│   └── utils/           # Utility functions
├── supabase/migrations/ # Legacy migrations (may not be used)
└── docker-compose.yml   # PostgreSQL setup
```

### Database Schema (PostgreSQL)
- **users** - User accounts (id, email, password hash, full_name)
- **projects** - Project metadata with owner relationships
- **boards** - Kanban board columns within projects (position-based ordering)
- **tasks** - Individual tasks with priority, status, assignment, position
- Migrations located in `backend/src/db/migrate.ts`

### Authentication Flow
1. **Frontend**: AuthContext (`src/contexts/AuthContext.tsx`) manages JWT token in localStorage
2. **API Client**: `src/lib/api.ts` attaches `Authorization: Bearer <token>` header
3. **Backend**: JWT middleware validates token on protected routes
4. **Registration/Login**: Returns JWT token + user data
5. **Protected Routes**: Wrapped in Layout component, check auth state

### API Endpoints
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`, `GET /api/projects/:id`
- **Boards**: `GET /api/boards/project/:projectId`, `POST /api/boards`, `DELETE /api/boards/:id`
- **Tasks**: `GET /api/tasks/project/:projectId`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`

## Import Aliases
- `@/*` maps to `src/*` (configured in vite.config.ts and tsconfig.json)
- Common imports: `@/components/ui/*`, `@/lib/api`, `@/hooks/*`, `@/contexts/AuthContext`

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)
```env
PORT=3001
DATABASE_URL=postgresql://boardmaster:boardmaster123@localhost:5432/boardmaster
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## TypeScript Configuration
- Loose mode: `noImplicitAny: false`, `strictNullChecks: false`
- TypeScript references: separate configs for app (tsconfig.app.json) and node (tsconfig.node.json)
- Skip lib check enabled for faster builds

## Development Workflow
1. **Start PostgreSQL** (via Docker: `docker-compose up -d` or local installation)
2. **Terminal 1 - Backend**: `cd backend && npm run dev` (port 3001)
3. **Terminal 2 - Frontend**: `npm run dev` (port 8080)
4. **Database changes**: Create migrations in `backend/src/db/migrate.ts` and run `npm run db:migrate`
5. **API changes**: Update routes in `backend/src/routes/` and corresponding ApiClient methods in `src/lib/api.ts`
6. **Toast notifications**: Use `useToast()` hook from `@/hooks/use-toast` for user feedback

## Component Patterns
- Use shadcn/ui components from `@/components/ui/` for consistent UI
- Forms: react-hook-form with zod validation
- Dialogs/modals: Radix UI primitives
- Auth: `const { user, signIn, signOut, loading } = useAuth()`
- API calls: `import { api } from '@/lib/api'; await api.getProjects()`
- Notifications: `const { toast } = useToast(); toast({ title: "Success" })`

## Deployment (Render)
- **Database**: PostgreSQL on Render (free tier: 256 MB, 90 days retention)
- **Backend**: Web Service with build command `npm install && npm run build`, start `npm start`
- **Frontend**: Static Site with build command `npm install && npm run build`, publish dir `dist`
- See DEPLOYMENT.md for complete instructions
- **Note**: Free tier backend spins down after 15 min inactivity

## Known Issues & Solutions
1. **RLS Errors**: Legacy issue from Supabase migration - see TROUBLESHOOTING.md and TEST_INSTRUCTIONS.md
2. **Dual architecture**: Be aware that `src/integrations/supabase/` is dummy code
3. **Port conflicts**: Frontend uses 8080, backend uses 3001 (not standard 5173/3000)

## Color Palette
- Primary (Purple): `hsl(266, 100%, 65%)`
- Secondary (Teal): `hsl(174, 72%, 56%)`
- Accent (Coral): `hsl(14, 90%, 65%)`
