# 📸 Visual Walkthrough Guide

## 🎯 Where to Find Everything

### 1. **Profile Settings** - Upload Your Picture

**Location**: Sidebar → Click your avatar → "Profile Settings"

**What You'll See**:
```
┌─────────────────────────────────────────┐
│ Profile Settings                        │
│ Manage your personal information       │
├─────────────────────────────────────────┤
│                                         │
│  [Avatar]    [ Upload Image ] Button   │
│              ─────── Or ──────          │
│              Avatar URL Field           │
│                                         │
│  Email: your@email.com (locked)        │
│  Full Name: [Your Name Here]           │
│  Job Title: [Frontend Developer]       │
│  Bio: [Tell us about yourself...]      │
│                                         │
│  [ Edit Profile ]                       │
└─────────────────────────────────────────┘
```

**Steps**:
1. Click "Edit Profile" button
2. Click "Upload Image" button
3. Select image from your computer (max 2MB)
4. OR paste URL in "Avatar URL" field
5. Click "Save Changes"

---

### 2. **Creating a Project** - Auto-Creates 8 Roles

**Location**: Sidebar → "Projects" → "New Project" button

**What Happens**:
```
Step 1: Create Project
┌─────────────────────────────────────┐
│ Create New Project                  │
├─────────────────────────────────────┤
│ Name: My Scrum Project              │
│ Description: Building great things  │
│                                     │
│ [ Create Project ]                  │
└─────────────────────────────────────┘

Step 2: Automatically Creates These Roles:
✅ Scrum Master
✅ Product Owner
✅ Frontend Developer
✅ Backend Developer
✅ Full Stack Developer
✅ QA Engineer
✅ DevOps Engineer
✅ UI/UX Designer
```

---

### 3. **Team & Settings Page** - The Control Center

**Location**: Open any project → Top right corner → "Team & Settings" button

**What You'll See**:
```
┌──────────────────────────────────────────────┐
│ Project Settings                              │
│ My Scrum Project                              │
├──────────────────────────────────────────────┤
│                                               │
│  [Team Members] [Roles & Permissions]  ← Tabs│
│                                               │
└──────────────────────────────────────────────┘
```

#### **Tab 1: Team Members**
```
┌──────────────────────────────────────────────┐
│ Team Members          [ + Add Member ]       │
├──────────────────────────────────────────────┤
│                                               │
│  [Avatar] Your Name (You)                    │
│           your@email.com                     │
│           [owner] [Project Owner]            │
│                                               │
│  [Avatar] John Doe                           │
│           john@example.com                   │
│           [admin] [Scrum Master]  [Remove]   │
│                                               │
│  [Avatar] Jane Smith                         │
│           jane@example.com                   │
│           [member] [Frontend Dev]  [Remove]  │
│                                               │
└──────────────────────────────────────────────┘
```

**How to Add Members**:
```
Click [ + Add Member ]
┌─────────────────────────────────┐
│ Add Team Member                 │
├─────────────────────────────────┤
│ Email: john@example.com         │
│ Access Level: [Admin ▼]        │
│ Project Role: [Scrum Master ▼] │
│                                 │
│ [ Add Member ]                  │
└─────────────────────────────────┘
```

#### **Tab 2: Roles & Permissions**
```
┌──────────────────────────────────────────────┐
│ Custom Roles              [ + Create Role ]  │
├──────────────────────────────────────────────┤
│                                               │
│  Scrum Master                    [full]      │
│  Facilitates Agile ceremonies...             │
│  [Manage Members] [Manage Roles] [Assign...] │
│                             [Delete]         │
│                                               │
│  Frontend Developer              [edit]      │
│  Develops user interfaces...                 │
│  (no special permissions)        [Delete]    │
│                                               │
└──────────────────────────────────────────────┘
```

**How to Create Custom Role**:
```
Click [ + Create Role ]
┌──────────────────────────────────────┐
│ Create Custom Role                   │
├──────────────────────────────────────┤
│ Role Name: Mobile Developer          │
│ Description: iOS and Android         │
│ Permission Level: [Edit ▼]          │
│                                      │
│ Specific Permissions:                │
│ ☐ Manage Team Members                │
│ ☐ Manage Roles                       │
│ ☑ Assign Tasks                       │
│ ☐ Delete Tasks                       │
│ ☐ Manage Project                     │
│                                      │
│ [ Create Role ]                      │
└──────────────────────────────────────┘
```

---

### 4. **Assigning Tasks** - On the Kanban Board

**Location**: Open project → See columns (To Do, In Progress, Done)

**What You'll See**:
```
┌────────────────────────────────────────────────────────┐
│ My Scrum Project      [ Team & Settings ]             │
├────────────────────────────────────────────────────────┤
│                                                         │
│  To Do         │  In Progress   │  Done                │
│  ─────────────────────────────────────────            │
│  [+ Add Task]  │  [+ Add Task]  │  [+ Add Task]       │
│                │                 │                      │
│  ┌──────────┐  │  ┌──────────┐  │                     │
│  │ Task 1   │  │  │ Task 2   │  │                     │
│  │ [Avatar] │  │  │ [Avatar] │  │                     │
│  └──────────┘  │  └──────────┘  │                     │
│                │                 │                      │
└────────────────────────────────────────────────────────┘
```

**How to Assign a Task**:
```
Click [+ Add Task] or click existing task
┌─────────────────────────────────────┐
│ Create New Task                     │
├─────────────────────────────────────┤
│ Title: Implement login page         │
│ Description: Create React component │
│                                     │
│ [Assign To ▼]  ← Click here!       │
│  ┌───────────────────────────────┐ │
│  │ Unassigned                    │ │
│  │ ─────────────────────────     │ │
│  │ [A] John Doe (Scrum Master)   │ │
│  │ [J] Jane Smith (Frontend Dev) │ │
│  │ [B] Bob Lee (Backend Dev)     │ │
│  └───────────────────────────────┘ │
│                                     │
│ Priority: [High ▼]                 │
│ Due Date: [Pick a date]            │
│                                     │
│ [ Create Task ]                     │
└─────────────────────────────────────┘
```

---

## 🔍 Finding the Buttons

### Main Sidebar (Left Side - Always Visible)
```
┌─────────────────┐
│ BoardMaster     │
├─────────────────┤
│ Dashboard       │
│ Projects   ← HERE
├─────────────────┤
│ [Your Avatar]   │  ← Click for Profile
│ Your Name       │
│ Sign Out        │
└─────────────────┘
```

### Project Card (On Projects Page)
```
┌──────────────────────┐
│ [Folder Icon]        │
│                      │
│ My Project Name      │  ← Click to Open
│ Project description  │
│                      │
│ Created: Jan 1, 2025 │
└──────────────────────┘
```

### Inside Project (Top Bar)
```
┌────────────────────────────────────────────────────┐
│ [←] My Project Name    [ Team & Settings ] ← HERE │
└────────────────────────────────────────────────────┘
```

---

## 🎬 Complete Demo Flow

### **Scenario: Setting Up Your First Scrum Team**

#### **Act 1: Setup (You as Owner)**

1. **Create Project**
   - Projects → New Project
   - Name: "E-Commerce Website"
   - Create → Roles auto-created! ✅

2. **Verify Roles**
   - Open project
   - Team & Settings
   - Roles & Permissions tab
   - See all 8 roles ✅

3. **Update Your Profile**
   - Avatar → Profile Settings
   - Upload your photo
   - Add job title: "Project Owner"
   - Save

#### **Act 2: Invite Team (Still You)**

4. **Register Test Accounts**
   - Open incognito window
   - Register: scrum@test.com
   - Register: dev@test.com
   - Register: qa@test.com

5. **Add to Project**
   - Back to main window
   - Team & Settings → Team Members
   - Add Member:
     - scrum@test.com → Admin + Scrum Master
     - dev@test.com → Member + Frontend Developer
     - qa@test.com → Member + QA Engineer

#### **Act 3: Create Tasks (You or Scrum Master)**

6. **Add Tasks**
   - Back to board
   - Add Task in "To Do":
     - "Design homepage"
     - Assign to: dev@test.com
     - Priority: High
   
   - Add Task in "To Do":
     - "Test user flows"
     - Assign to: qa@test.com
     - Priority: Medium

7. **Verify**
   - See tasks with avatars ✅
   - Login as dev@test.com → See assigned task ✅

#### **Act 4: Test Permissions**

8. **As Scrum Master** (scrum@test.com)
   - Can add members ✅
   - Can assign tasks ✅
   - Can manage roles ✅

9. **As Developer** (dev@test.com)
   - Can see project ✅
   - Can edit tasks ✅
   - CANNOT add members ❌ (correct!)

---

## 🎨 Visual Cues to Look For

### **Success Indicators**:
- ✅ Green badges = Role assigned
- ✅ Avatar circles = User assigned to task
- ✅ "Team & Settings" button visible = You're in project
- ✅ Two tabs visible = Settings page loaded correctly

### **Error Indicators**:
- ❌ Red error message = Check console (F12)
- ❌ No "Team & Settings" button = Not in project, go back and click project card
- ❌ "User not found" = They must register first
- ❌ Empty roles list = Database not migrated, run `npm run db:migrate`

---

## 🔧 Quick Fixes

### "I don't see the Team & Settings button"
➡️ You're on the Projects LIST page, not INSIDE a project
➡️ **Fix**: Click on a project card to open it

### "I can't add members"
➡️ You're not Owner or Admin
➡️ **Fix**: Login as the project owner

### "Roles tab is empty"
➡️ Database not migrated
➡️ **Fix**: 
```powershell
cd backend
npm run db:migrate
```
Then create a NEW project

### "Task dialog doesn't show team members"
➡️ No members added yet
➡️ **Fix**: Add members first in Team & Settings

---

## 📱 Where Things Are (Quick Reference)

| What | Where |
|------|-------|
| Upload Picture | Avatar → Profile Settings → Upload Image button |
| View Roles | Project → Team & Settings → Roles & Permissions tab |
| Add Members | Project → Team & Settings → Team Members → Add Member |
| Assign Task | Project board → Add/Edit Task → Assign To dropdown |
| Create Custom Role | Team & Settings → Roles & Permissions → Create Role |
| Change Member Role | Team & Settings → Team Members → Remove & Re-add |

---

## ✅ Verification Checklist

Test each feature:
- [ ] Can upload profile picture
- [ ] Can create a project
- [ ] Can see 8 default roles in project
- [ ] Can add a team member
- [ ] Can assign Scrum Master role
- [ ] Can create a task
- [ ] Can assign task to team member
- [ ] Can see avatar on task card
- [ ] Member can login and see project
- [ ] Member CANNOT add other members (permission test)

**If all checked ✅ = Everything works!**
