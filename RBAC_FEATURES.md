# BoardMaster Pro - Role-Based Access Control (RBAC) Features

## 🎯 Overview

BoardMaster Pro now includes a comprehensive Role-Based Access Control (RBAC) system that enables professional team management and task assignment capabilities, perfect for Agile software development teams.

## ✨ New Features

### 1. **User Profile Management**
- ✅ Editable user profiles with avatar support
- ✅ Job title and bio fields
- ✅ Professional user cards across the application
- 📍 **Route**: `/profile`

### 2. **Project-Level Team Management**
- ✅ Add team members by email
- ✅ Assign access levels (Owner, Admin, Member, Viewer)
- ✅ View all project members with their roles
- ✅ Remove members from projects
- 📍 **Route**: `/project/:id/settings`

### 3. **Custom Role System**
BoardMaster Pro comes with pre-configured Agile roles:
- **Scrum Master** - Full permissions, can manage team and roles
- **Product Owner** - Can manage project and assign tasks
- **Frontend Developer** - Edit permissions
- **Backend Developer** - Edit permissions
- **Full Stack Developer** - Edit permissions
- **QA Engineer** - Edit permissions
- **DevOps Engineer** - Edit permissions
- **UI/UX Designer** - Comment permissions

#### Create Custom Roles
You can create custom roles with granular permissions:
- **Permission Levels**: Full, Edit, Comment, View
- **Specific Permissions**:
  - Manage Team Members
  - Manage Roles
  - Assign Tasks
  - Delete Tasks
  - Manage Project

### 4. **Task Assignment**
- ✅ Assign tasks to specific team members
- ✅ View assignee on task cards
- ✅ Filter and track tasks by assignee
- ✅ Permission-based task management

### 5. **Permission Hierarchy**

#### Owner
- Full control over the project
- All permissions enabled
- Cannot be removed from project

#### Admin
- Can manage members and roles
- Can assign and delete tasks
- Can manage project settings
- Almost all permissions (except deleting the project)

#### Member
- Can create, edit, and comment on tasks
- View all project content
- Cannot manage team or roles

#### Viewer
- Read-only access
- Can view tasks and boards
- Cannot edit or create content

## 🚀 Getting Started

### Prerequisites
1. PostgreSQL database
2. Node.js (v18+)
3. npm or yarn

### Database Setup

1. **Run Database Migration**
```bash
cd backend
npm run db:migrate
```

This will create all necessary tables including:
- `project_roles` - Custom role definitions
- Updated `project_members` - Links members to custom roles
- Updated `users` - Profile fields (bio, job_title)
- Updated `tasks` - Assignment tracking

2. **Environment Variables**
Ensure your `.env` file in the backend directory has:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/boardmaster
JWT_SECRET=your-secret-key-here
PORT=3001
```

### Running the Application

1. **Start Backend**
```bash
cd backend
npm install
npm run dev
```

2. **Start Frontend**
```bash
npm install
npm run dev
```

3. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 📖 Usage Guide

### Setting Up a New Project Team

1. **Create a Project**
   - Go to Projects page
   - Click "New Project"
   - Fill in project details

2. **Add Team Members**
   - Open your project
   - Click "Team & Settings" button
   - Go to "Team Members" tab
   - Click "Add Member"
   - Enter user's email
   - Select access level
   - Optionally assign a project role (e.g., "Frontend Developer")

3. **Customize Roles**
   - Go to "Roles & Permissions" tab
   - Click "Create Role"
   - Define role name (e.g., "Mobile Developer")
   - Set permission level
   - Enable specific permissions
   - Save the role

4. **Assign Tasks**
   - Create or edit a task
   - Use the "Assign To" dropdown
   - Select a team member
   - The assignee will see their avatar on the task card

### Managing User Profiles

1. **Update Your Profile**
   - Click on your avatar in the sidebar
   - Select "Profile Settings"
   - Update your information:
     - Full Name
     - Job Title (e.g., "Senior Frontend Developer")
     - Bio (up to 500 characters)
     - Avatar URL
   - Click "Save Changes"

## 🏗️ Architecture

### Backend Structure

```
backend/src/
├── db/
│   ├── schema.sql              # Database schema with RBAC tables
│   ├── seedDefaultRoles.ts     # Default role seeding
│   └── migrate.ts              # Migration script
├── middleware/
│   ├── auth.ts                 # Authentication middleware
│   └── permissions.ts          # RBAC permission checking
├── routes/
│   ├── auth.ts                 # User authentication & profile
│   ├── team.ts                 # Team management endpoints
│   ├── projects.ts             # Project CRUD
│   └── tasks.ts                # Task management with assignments
```

### Frontend Structure

```
src/
├── pages/
│   ├── Profile.tsx             # User profile management
│   ├── ProjectSettings.tsx     # Team & role management
│   └── ProjectBoard.tsx        # Enhanced with assignments
├── components/
│   ├── TaskDialog.tsx          # Task form with assignee picker
│   └── Layout.tsx              # Enhanced with profile menu
├── contexts/
│   └── AuthContext.tsx         # Auth with profile support
└── lib/
    └── api.ts                  # API client with new endpoints
```

### API Endpoints

#### Profile Management
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

#### Team Management
- `GET /api/team/projects/:projectId/members` - List project members
- `POST /api/team/projects/:projectId/members` - Add member
- `PUT /api/team/projects/:projectId/members/:memberId` - Update member role
- `DELETE /api/team/projects/:projectId/members/:memberId` - Remove member

#### Role Management
- `GET /api/team/projects/:projectId/roles` - List custom roles
- `POST /api/team/projects/:projectId/roles` - Create role
- `PUT /api/team/projects/:projectId/roles/:roleId` - Update role
- `DELETE /api/team/projects/:projectId/roles/:roleId` - Delete role

#### Task Management
- Tasks now support `assigned_to` field
- Updated to include assignee information in responses

## 🔒 Security Features

1. **Permission Middleware**
   - `checkProjectAccess` - Verifies user has access to project
   - `requirePermission` - Checks specific permission requirements
   - Automatic role-based permission validation

2. **Token-Based Authentication**
   - JWT tokens with 7-day expiration
   - Secure password hashing with bcrypt
   - Protected API routes

3. **Data Isolation**
   - Users can only access their projects
   - Project-level permission enforcement
   - Secure member invitation system

## 🎨 UI/UX Enhancements

1. **Professional User Interface**
   - Avatar support throughout the app
   - Role badges with color coding
   - Dropdown menus for user actions
   - Clean, modern design with shadcn/ui

2. **Intuitive Team Management**
   - Tabbed interface for Members and Roles
   - Visual permission toggles
   - Inline member management
   - Quick role assignment

3. **Enhanced Task Cards**
   - Assignee avatars on tasks
   - Priority indicators
   - Due date visualization
   - Drag-and-drop support

## 📊 Database Schema Highlights

### New Tables

#### `project_roles`
- Custom role definitions per project
- Granular permission flags
- Used for Agile team roles (Scrum Master, Developers, etc.)

#### Updated `project_members`
- Links to `project_roles` for custom roles
- Maintains base `app_role` (owner, admin, member, viewer)
- Tracks join date

#### Updated `users`
- `bio` - User biography (500 chars)
- `job_title` - Professional title (100 chars)
- Enhanced profile information

#### Updated `tasks`
- `assigned_to` - References user ID
- Enhanced with assignee tracking

## 🤝 Contributing

When adding new features:
1. Update the database schema if needed
2. Add corresponding API endpoints
3. Implement permission checks
4. Update the frontend UI
5. Test with different user roles

## 📝 Best Practices

### For Scrum Masters
1. Create your project
2. Add default roles or customize them
3. Invite team members with appropriate roles
4. Assign tasks during sprint planning
5. Track progress on the Kanban board

### For Team Members
1. Complete your profile information
2. Check your assigned tasks regularly
3. Update task status as you progress
4. Communicate with your team

### For Product Owners
1. Define clear task descriptions
2. Set appropriate priorities
3. Assign tasks based on skills
4. Monitor sprint progress

## 🐛 Troubleshooting

### Common Issues

**Problem**: Can't add team members
- **Solution**: Make sure the user has registered an account first

**Problem**: Permission denied errors
- **Solution**: Check user's role and project permissions

**Problem**: Default roles not appearing
- **Solution**: Ensure database migration ran successfully

## 🔮 Future Enhancements

Potential features for future versions:
- Email notifications for task assignments
- Sprint planning tools
- Burndown charts
- Time tracking
- Comments on tasks
- File attachments
- Integration with Git repositories
- Slack/Teams notifications

## 📞 Support

For questions or issues:
- Check the database logs: `backend/logs`
- Review API responses in browser DevTools
- Ensure all environment variables are set

## 🎓 Learning Resources

This implementation follows industry best practices for:
- **Agile/Scrum methodology**
- **RBAC security patterns**
- **RESTful API design**
- **React with TypeScript**
- **PostgreSQL database design**

Perfect for showcasing to potential employers as a professional, production-ready project management system!
