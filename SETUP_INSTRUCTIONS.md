# 🔧 Complete Setup Instructions

## IMPORTANT: Follow These Steps Exactly

### Step 1: Stop All Running Processes
If you have the app running, press `Ctrl+C` in both terminals to stop them.

### Step 2: Database Migration (MUST DO THIS FIRST!)

Open **PowerShell** and run:

```powershell
cd "C:\Users\Andres R. Bucheli\Desktop\SOFTWARE ENGINEER\AI-FULL-STACK-APPS-PORTFOLIO\FULL-STACK-APPS\boardmaster-pro-main\backend"
npm run db:migrate
```

**You should see**: `✅ Database migration completed successfully!`

**If you see errors**, it means:
- PostgreSQL is not running, OR
- The `.env` file in `backend` folder is missing or incorrect

### Step 3: Verify .env File

Check that `backend\.env` exists and contains:

```env
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/boardmaster
JWT_SECRET=your-secret-key-here
PORT=3001
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual PostgreSQL credentials.

### Step 4: Start Backend

```powershell
cd "C:\Users\Andres R. Bucheli\Desktop\SOFTWARE ENGINEER\AI-FULL-STACK-APPS-PORTFOLIO\FULL-STACK-APPS\boardmaster-pro-main\backend"
npm run dev
```

**Leave this terminal open!** You should see:
```
Backend running on http://localhost:3001
```

### Step 5: Start Frontend (New Terminal)

Open a **second PowerShell window** and run:

```powershell
cd "C:\Users\Andres R. Bucheli\Desktop\SOFTWARE ENGINEER\AI-FULL-STACK-APPS-PORTFOLIO\FULL-STACK-APPS\boardmaster-pro-main"
npm run dev
```

**Leave this terminal open!** You should see:
```
Local: http://localhost:5173
```

### Step 6: Open the App

Go to: **http://localhost:5173**

---

## 📝 How to Use the Features

### 1️⃣ Create Your First Project

1. **Login or Register** if you haven't
2. Click **"Projects"** in the sidebar
3. Click **"New Project"** button
4. Fill in:
   - Name: "My Scrum Project"
   - Description: "Testing role assignments"
5. Click **"Create Project"**

✅ **8 default roles are now created automatically** (Scrum Master, Developers, etc.)

### 2️⃣ View Your Project Roles

1. Click on your project card to open it
2. Click the **"Team & Settings"** button (top right)
3. Click the **"Roles & Permissions"** tab

You should see:
- ✅ Scrum Master
- ✅ Product Owner
- ✅ Frontend Developer
- ✅ Backend Developer
- ✅ Full Stack Developer
- ✅ QA Engineer
- ✅ DevOps Engineer
- ✅ UI/UX Designer

### 3️⃣ Add Team Members

**First, other users must register accounts!**

#### Test with Multiple Accounts:

**Option A - Two Browsers:**
1. Main browser: You're logged in as Owner
2. Open **Incognito/Private** window
3. Go to http://localhost:5173
4. **Register a new account** with different email
5. Note this email address

**Option B - Ask a Friend:**
1. Have them go to your computer
2. Register an account
3. Note their email

#### Now Add Them to Your Project:

1. Back in your **main browser** (as Owner)
2. Go to your project
3. Click **"Team & Settings"**
4. Stay on **"Team Members"** tab
5. Click **"Add Member"** button
6. Enter the **other user's email**
7. Select **Access Level**:
   - **Admin** = Can manage everything except delete project
   - **Member** = Can work on tasks
   - **Viewer** = Read-only
8. Select **Project Role** (optional):
   - Choose "Scrum Master" for someone who manages the team
   - Choose "Frontend Developer", etc. for developers
9. Click **"Add Member"**

✅ **They can now see the project when they login!**

### 4️⃣ Assign Scrum Master Role

1. Go to **"Team & Settings"** → **"Team Members"** tab
2. Find the member you want to make Scrum Master
3. You'll see their current role
4. To change: Add them again with the new role, or:
   - Remove them
   - Re-add with "Admin" access + "Scrum Master" project role

**Scrum Master Permissions:**
- ✅ Manage team members
- ✅ Manage roles
- ✅ Assign tasks
- ✅ Delete tasks
- ✅ Manage project settings

### 5️⃣ Assign Tasks to Team Members

1. Go back to your **project board** (click project name)
2. Click **"+ Add Task"** in any column (To Do, In Progress, Done)
3. Fill in:
   - **Title**: "Implement login page"
   - **Description**: "Create React component for user authentication"
   - **Assign To**: Click dropdown and **select a team member**
   - **Priority**: High
   - **Due Date**: (optional)
4. Click **"Create Task"**

✅ **You'll see the member's avatar on the task card!**

### 6️⃣ Create Custom Roles

1. Go to **"Team & Settings"** → **"Roles & Permissions"** tab
2. Click **"Create Role"** button
3. Fill in:
   - **Role Name**: "Mobile Developer"
   - **Description**: "Develops iOS and Android apps"
   - **Permission Level**: "Edit"
   - **Toggle permissions**:
     - ✅ Assign Tasks (if they should assign work)
     - ❌ Manage Team Members (usually only for Scrum Master)
     - ❌ Delete Tasks
4. Click **"Create Role"**

✅ **This role is now available when adding team members!**

---

## 🖼️ Upload Profile Picture

### Current Method (Using URL):
1. Click your **avatar** in sidebar
2. Select **"Profile Settings"**
3. Paste image URL in **"Avatar URL"** field
4. Click **"Save Changes"**

### Where to Get Image URLs:
- **Upload to Imgur**: https://imgur.com/upload
- **Use Gravatar**: https://gravatar.com
- **Upload to Cloudinary**: https://cloudinary.com
- **Direct link** from any website

**Quick Test URL:**
```
https://api.dicebear.com/7.x/avataaars/svg?seed=YourName
```

---

## 🎯 Testing the Complete Flow

### Scenario: Creating a Scrum Team

#### As Project Owner (You):

1. **Create project** "Website Redesign"
2. **Add team members**:
   - john@example.com → Admin + Scrum Master role
   - jane@example.com → Member + Frontend Developer role
   - bob@example.com → Member + Backend Developer role
3. **Create tasks**:
   - "Design homepage" → Assign to jane@example.com
   - "Create API endpoints" → Assign to bob@example.com
   - "Setup sprint planning" → Assign to john@example.com

#### As Scrum Master (john@example.com):

1. Login as john@example.com
2. See the "Website Redesign" project
3. Can **add more team members**
4. Can **assign tasks** to team
5. Can **manage roles**

#### As Developer (jane@example.com):

1. Login as jane@example.com
2. See the "Website Redesign" project
3. See task "Design homepage" **assigned to me**
4. Can create and edit tasks
5. **Cannot** add team members (not allowed)

---

## ❌ Common Errors & Fixes

### Error: "Cannot read properties of undefined"
**Fix**: Run the database migration:
```powershell
cd backend
npm run db:migrate
```

### Error: "Project not found" when opening project
**Fix**: 
1. Make sure backend is running
2. Check browser console (F12) for errors
3. Verify you ran the migration

### Error: "User not found with this email"
**Fix**: That person must **register first**, then you can add them

### Can't see "Team & Settings" button
**Fix**: 
1. Make sure you're **inside a project** (click on project card)
2. Button is in the top-right corner of the project board

### Default roles not appearing
**Fix**:
1. Stop backend
2. Run migration again: `npm run db:migrate`
3. Create a **new project** (old projects won't have roles)

---

## 📊 Permission Matrix

| Action | Owner | Admin (Scrum Master) | Member (Developer) | Viewer |
|--------|-------|---------------------|-------------------|--------|
| View project | ✅ | ✅ | ✅ | ✅ |
| Create tasks | ✅ | ✅ | ✅ | ❌ |
| Edit tasks | ✅ | ✅ | ✅ | ❌ |
| Assign tasks | ✅ | ✅ (if role allows) | ❌ | ❌ |
| Delete tasks | ✅ | ✅ (if role allows) | ❌ | ❌ |
| Add members | ✅ | ✅ | ❌ | ❌ |
| Remove members | ✅ | ✅ | ❌ | ❌ |
| Create roles | ✅ | ✅ (if role allows) | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ | ❌ |

---

## 🆘 Still Having Issues?

1. **Check both terminals** are running (backend + frontend)
2. **Check browser console** (Press F12, look for red errors)
3. **Check backend terminal** for error messages
4. **Verify PostgreSQL** is running:
   - Windows: Open Services, look for "postgresql"
5. **Verify .env file** has correct database credentials

### Debug Checklist:
- [ ] PostgreSQL is running
- [ ] `.env` file exists in `backend` folder
- [ ] Database credentials are correct in `.env`
- [ ] Ran `npm run db:migrate` successfully
- [ ] Backend is running on port 3001
- [ ] Frontend is running on port 5173
- [ ] Created a NEW project after migration
- [ ] Other users have registered accounts

---

## 🎉 Success Indicators

You'll know everything works when:
- ✅ Can create a project
- ✅ Can open project without errors
- ✅ See "Team & Settings" button
- ✅ See 8 default roles in Roles & Permissions tab
- ✅ Can add a team member by email
- ✅ Can assign tasks to team members
- ✅ See avatars on assigned tasks

**Once you see these, your app is working perfectly!**
