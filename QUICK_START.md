# 🚀 Quick Start Guide

## Prerequisites Checklist
- [ ] PostgreSQL installed and running
- [ ] Node.js (v18+) installed
- [ ] Git installed
- [ ] Two terminal windows ready

## ⚡ 5-Minute Setup

### Step 1: Database Setup (2 minutes)

```bash
# Create database (using psql or pgAdmin)
createdb boardmaster

# Or using psql:
psql postgres
CREATE DATABASE boardmaster;
\q
```

### Step 2: Backend Setup (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
echo "DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/boardmaster
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001" > .env

# Run migration
npm run db:migrate
```

**Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials!**

### Step 3: Frontend Setup (1 minute)

```bash
# Go back to root and install frontend dependencies
cd ..
npm install
```

### Step 4: Launch! (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

🎉 **Open http://localhost:5173 in your browser!**

## 🎯 Your First 5 Minutes in the App

### 1. Register an Account (30 seconds)
- Click "Sign Up"
- Enter email, password, and your name
- Click "Create Account"

### 2. Update Your Profile (1 minute)
- Click your avatar in the sidebar
- Select "Profile Settings"
- Add:
  - Job Title: "Full Stack Developer"
  - Bio: "Passionate about building great software"
  - Avatar URL: Any image URL (or leave blank)
- Click "Save Changes"

### 3. Create Your First Project (30 seconds)
- Go to "Projects" in sidebar
- Click "New Project"
- Name: "My Awesome App"
- Description: "Building the next big thing"
- Click "Create Project"
- **Notice**: 8 default roles are automatically created!

### 4. Explore Team Settings (1 minute)
- Click "Team & Settings" button
- Browse the "Team Members" tab - you'll see yourself as Owner
- Switch to "Roles & Permissions" tab
- See pre-configured roles:
  - Scrum Master
  - Product Owner  
  - Frontend Developer
  - Backend Developer
  - And more!

### 5. Create and Assign a Task (1 minute)
- Go back to your project board
- Click "+ Add Task" on any column
- Title: "Set up authentication"
- Assign To: Yourself
- Priority: High
- Click "Create Task"
- See your avatar on the task card!

## 🧪 Testing Multi-User Features

### Add a Second User
1. Open incognito/private browser window
2. Register another account (different email)
3. Note their email

### Invite to Your Project
1. Back in your main browser
2. Go to Project → Team & Settings
3. Click "Add Member"
4. Enter the second user's email
5. Select "Member" access level
6. Choose "Frontend Developer" role
7. Click "Add Member"

### Test Permissions
1. In the incognito window:
   - Login as the second user
   - Go to Projects
   - See your shared project!
   - Create a task
   - Try to add members (should be blocked - only owners/admins can)

## 🎓 Pro Tips

### Create a Demo Project
```
Project Name: "E-Commerce Platform"
Description: "Building a modern online store with React and Node.js"

Team Setup:
- You: Scrum Master
- Create tasks:
  - "Design product listing page" → Assign to Frontend Dev
  - "Implement payment API" → Assign to Backend Dev
  - "Set up CI/CD pipeline" → Assign to DevOps
```

### Custom Role Example
Create a "Mobile Developer" role:
- Permission Level: Edit
- Enable: Assign Tasks
- Disable: Delete Tasks, Manage Members
- Perfect for team members who work on mobile features

### Profile Pro Tips
- Use a professional avatar (Gravatar, LinkedIn photo, etc.)
- Write a compelling bio (employers read these!)
- Include your current tech stack in job title
- Example: "Senior Full Stack Developer | React, Node.js, TypeScript"

## 🐛 Troubleshooting

### "Connection refused" error
**Problem**: Backend not running
**Solution**: 
```bash
cd backend
npm run dev
```

### "Cannot connect to database"
**Problem**: PostgreSQL not running or wrong credentials
**Solution**:
- Windows: Open Services, start PostgreSQL
- Mac: `brew services start postgresql`
- Check `.env` DATABASE_URL

### "User not found" when adding member
**Problem**: The email hasn't registered yet
**Solution**: That user must create an account first, then you can add them

### No default roles appearing
**Problem**: Migration might have failed
**Solution**:
```bash
cd backend
npm run db:migrate
```

## 📱 Next Actions

### For Portfolio
1. Take screenshots of:
   - Project board with tasks
   - Team management page
   - Role creation dialog
   - Your profile page
2. Add to README
3. Deploy to production

### For Development
1. Read `RBAC_FEATURES.md` for detailed docs
2. Explore the code structure
3. Try creating custom roles
4. Test different permission levels

### For Interviews
Practice explaining:
- "How did you implement RBAC?"
- "What security measures did you take?"
- "How does the permission system work?"
- "Why these specific roles?"

Refer to `IMPLEMENTATION_SUMMARY.md` for talking points!

## 🚀 You're All Set!

Your professional Kanban board is ready to showcase to employers. The system demonstrates:
- Full-stack development skills
- Security best practices (RBAC, JWT)
- Database design expertise
- Modern React patterns
- Professional UI/UX design
- Agile methodology understanding

**Happy coding! 🎉**

---

**Need help?** Check the main documentation:
- `RBAC_FEATURES.md` - Complete feature guide
- `IMPLEMENTATION_SUMMARY.md` - What was built and why
