# 🎭 Demo Data Setup Guide

## What This Does

Automatically creates:
- **5 realistic users** with AI-generated avatars, names, emails, and job titles
- **2 complete projects** (SmartGrocery & DevTrack) with all tasks and boards
- **Custom roles** for each project (Scrum Master, Frontend Dev, Backend Dev, etc.)
- **Team member assignments** with appropriate roles

## 🚀 Quick Start

### Run the Seed Script

```powershell
cd backend
npm run db:seed-demo
```

That's it! The script will create everything for you.

## 👥 Created Users

All users have the password: **`Demo123!`**

| Name | Email | Job Title | Avatar |
|------|-------|-----------|--------|
| Sarah Mitchell | sarah.mitchell@example.com | Senior Full-Stack Developer | 🧑‍💻 |
| James Rodriguez | james.rodriguez@example.com | Backend Engineer | 👨‍💻 |
| Emily Zhang | emily.zhang@example.com | Frontend Developer | 👩‍💻 |
| Michael O'Connor | michael.oconnor@example.com | DevOps Engineer | 👨‍🔧 |
| Priya Patel | priya.patel@example.com | Product Manager | 👩‍💼 |

## 📁 Project 1: SmartGrocery

**Owner:** Sarah Mitchell  
**Description:** React + Node.js Shopping List App with AI suggestions

### Team Members:
- **James Rodriguez** - Admin / Scrum Master
- **Emily Zhang** - Member / Frontend Developer
- **Michael O'Connor** - Member / Backend Developer
- **Priya Patel** - Viewer

### Boards & Tasks:

#### 🟢 To Do (4 tasks)
- Add authentication with JWT (High priority, Due: Nov 6)
- Create product search component (Medium, Due: Nov 7)
- Integrate OpenAI API for suggestions (High, Due: Nov 9)
- Optimize bundle size (Medium, Due: Nov 11)

#### 🟡 In Progress (2 tasks)
- Implement MongoDB models with Prisma (High, Due: Nov 4)
- Develop shopping list drag-and-drop board (Medium, Due: Nov 5)

#### 🔵 Done (3 tasks)
- Set up project structure
- Initialize GitHub repository
- Install and configure ESLint + Prettier

### Custom Roles:
- **Scrum Master** - Full permissions (can manage team, assign tasks)
- **Frontend Developer** - Edit permission (work on tasks)
- **Backend Developer** - Edit permission (work on tasks)

---

## 📁 Project 2: DevTrack

**Owner:** James Rodriguez  
**Description:** Team Productivity Dashboard with GitHub API integration

### Team Members:
- **Sarah Mitchell** - Admin / Tech Lead
- **Michael O'Connor** - Member / DevOps Engineer
- **Priya Patel** - Member / Product Manager
- **Emily Zhang** - Member

### Boards & Tasks:

#### 🟢 To Do (4 tasks)
- Add OAuth2 GitHub login (High, Due: Nov 10)
- Implement user role management (High, Due: Nov 11)
- Create notification system (Medium, Due: Nov 13)
- Deploy app to Vercel (High, Due: Nov 15)

#### 🟡 In Progress (2 tasks)
- Design dashboard layout (Medium, Due: Nov 5)
- Connect backend to GitHub API (High, Due: Nov 6)

#### 🔵 Done (3 tasks)
- Create backend service using Moleculer
- Set up PostgreSQL database
- Configure CI/CD with GitHub Actions

### Custom Roles:
- **Tech Lead** - Full permissions (technical leadership)
- **DevOps Engineer** - Edit permission (infrastructure work)
- **Product Manager** - Comment permission + can assign tasks

---

## 🎨 Avatar Images

All users have unique, colorful AI-generated avatars using DiceBear API:
- Each avatar is generated based on the user's name
- Different background colors for easy identification
- Consistent style across all users

Example URLs:
```
https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4&radius=50
```

---

## 🧪 Testing Scenarios

### Scenario 1: Project Owner Actions
**Login as:** sarah.mitchell@example.com  
**Can do:**
- ✅ View SmartGrocery project (you're the owner)
- ✅ Add/remove team members
- ✅ Create new custom roles
- ✅ Delete the project
- ✅ View DevTrack project (you're an admin)

### Scenario 2: Admin with Custom Role
**Login as:** james.rodriguez@example.com  
**Can do:**
- ✅ Manage SmartGrocery team (Scrum Master role)
- ✅ Assign tasks to team members
- ✅ Create/edit/delete tasks
- ✅ View and manage DevTrack (you're the owner)

### Scenario 3: Developer Role
**Login as:** emily.zhang@example.com  
**Can do:**
- ✅ View SmartGrocery tasks
- ✅ Edit tasks (Frontend Developer role)
- ❌ Cannot add team members
- ❌ Cannot create roles

### Scenario 4: Product Manager
**Login as:** priya.patel@example.com  
**Can do:**
- ✅ View SmartGrocery as Viewer (read-only)
- ✅ Assign tasks in DevTrack (Product Manager role)
- ✅ Comment on tasks
- ❌ Cannot edit tasks in SmartGrocery

### Scenario 5: DevOps Engineer
**Login as:** michael.oconnor@example.com  
**Can do:**
- ✅ Work on backend tasks in SmartGrocery
- ✅ Manage infrastructure in DevTrack
- ✅ Edit and update tasks
- ❌ Cannot manage team members

---

## 📊 Script Output

When you run the seed script, you'll see:

```
🌱 Starting demo data seeding...

👥 Creating 5 demo users...
   ✓ Sarah Mitchell (sarah.mitchell@example.com)
   ✓ James Rodriguez (james.rodriguez@example.com)
   ✓ Emily Zhang (emily.zhang@example.com)
   ✓ Michael O'Connor (michael.oconnor@example.com)
   ✓ Priya Patel (priya.patel@example.com)
   ✅ Created 5 users

📁 Creating project: SmartGrocery...
   ✓ Project created by Sarah Mitchell
   ✓ Created 3 boards (To Do, In Progress, Done)
   ✓ Created 9 tasks
   ✓ Created 3 custom roles (Scrum Master, Frontend Developer, Backend Developer)
   ✓ Added James Rodriguez (admin as Scrum Master)
   ✓ Added Emily Zhang (member as Frontend Developer)
   ✓ Added Michael O'Connor (member as Backend Developer)
   ✓ Added Priya Patel (viewer)
   ✅ Project "SmartGrocery" completed!

📁 Creating project: DevTrack...
   ✓ Project created by James Rodriguez
   ✓ Created 3 boards (To Do, In Progress, Done)
   ✓ Created 9 tasks
   ✓ Created 3 custom roles (Tech Lead, DevOps Engineer, Product Manager)
   ✓ Added Sarah Mitchell (admin as Tech Lead)
   ✓ Added Michael O'Connor (member as DevOps Engineer)
   ✓ Added Priya Patel (member as Product Manager)
   ✓ Added Emily Zhang (member)
   ✅ Project "DevTrack" completed!

🎉 Demo data seeding completed successfully!

📋 Summary:
   • 5 users created
   • 2 projects created
   • 6 boards created
   • 18 tasks created
   • 6 custom roles created
   • 8 team members assigned

🔑 Login Credentials:
   All users have password: Demo123!

   Users:
   • sarah.mitchell@example.com - Sarah Mitchell (Senior Full-Stack Developer)
   • james.rodriguez@example.com - James Rodriguez (Backend Engineer)
   • emily.zhang@example.com - Emily Zhang (Frontend Developer)
   • michael.oconnor@example.com - Michael O'Connor (DevOps Engineer)
   • priya.patel@example.com - Priya Patel (Product Manager)

   Projects:
   • SmartGrocery (Owner: Sarah Mitchell)
   • DevTrack (Owner: James Rodriguez)
```

---

## 🔄 Running It Again

The script uses `ON CONFLICT` for users, so it's safe to run multiple times:
- Users will be **updated** if they already exist
- Projects will be **created fresh** each time

**Warning:** Each run creates **new** projects. If you want to start fresh completely:

```powershell
# Reset database
cd backend
npm run db:migrate

# Then seed demo data
npm run db:seed-demo
```

---

## 🎯 What to Do After Seeding

1. **Login to the app** with any of the demo users
2. **Explore the projects** - Click on SmartGrocery or DevTrack
3. **Try different roles** - Login as different users to see permission differences
4. **Move tasks around** - Drag tasks between To Do, In Progress, and Done
5. **Test team management** - As owner/admin, try adding/removing members
6. **Create custom roles** - Go to Project Settings → Roles & Permissions

---

## 💡 Tips

- Use **Sarah** or **James** to test admin/owner features
- Use **Emily** or **Michael** to test developer workflows
- Use **Priya** to test limited permissions (viewer/PM role)
- All avatars are unique and colorful for easy identification
- Tasks have realistic deadlines spread across November 2024

---

## 🆘 Troubleshooting

### Issue: "error: relation 'users' does not exist"
**Solution:** Run migrations first:
```powershell
cd backend
npm run db:migrate
npm run db:seed-demo
```

### Issue: "User already exists" errors
**Expected behavior.** The script updates existing users and creates new projects.

### Issue: Can't see the projects after login
**Solution:** Make sure you're logged in as one of the demo users, not your original account.

---

## 📸 Screenshots Worth Taking

After seeding, great screenshots to capture:
1. **Projects dashboard** showing both SmartGrocery and DevTrack
2. **SmartGrocery Kanban board** with tasks in different columns
3. **Team Members page** showing all 5 users with roles
4. **Custom Roles page** showing Scrum Master, Frontend Dev, etc.
5. **Task details** with assigned members and due dates

Perfect for your portfolio! 🎉

---

**Created by:** Demo Data Seed Script  
**Users:** 5 realistic team members  
**Projects:** 2 full-featured projects  
**Total Items:** 18 tasks, 6 boards, 6 custom roles  
**Password:** Demo123! (for all users)
