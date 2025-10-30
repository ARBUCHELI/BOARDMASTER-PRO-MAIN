# 🌱 Seeding Demo Data on Render

## Overview

Since your local Windows npm has issues, we'll seed the demo data **directly on Render** after deployment. This is actually better because it ensures the production environment has the demo data!

---

## 🚀 Method 1: Run Seed Command on Render (Recommended)

### Step 1: Deploy to Render First

Make sure all your changes are committed and pushed:

```powershell
git add .
git commit -m "Add demo data seed script and fix admin permissions"
git push origin main
```

Render will automatically build and deploy.

### Step 2: Run Seed via Render Shell

Once deployed, Render provides a shell to run commands:

1. Go to https://dashboard.render.com
2. Click on your **backend service**
3. Click **"Shell"** tab in the left sidebar
4. Run the seed command:

```bash
npm run db:seed-demo
```

You'll see the full output with all 5 users and 2 projects being created!

### Step 3: Verify

Login to your frontend with any demo user:
- Email: `sarah.mitchell@example.com`
- Password: `Demo123!`

---

## 🔧 Method 2: One-Time Job on Render

Create a one-time job to seed the data:

### Step 1: Create a One-Off Job

1. In Render Dashboard, click **"New +"**
2. Select **"Job"**
3. Connect your repository
4. Configure:
   - **Name**: `seed-demo-data`
   - **Environment**: Same as your backend service
   - **Build Command**: `npm install`
   - **Start Command**: `npm run db:seed-demo`

5. Click **"Create Job"**

### Step 2: Run the Job

1. Go to the Job page
2. Click **"Run Job"**
3. Wait for it to complete
4. Check the logs to see the output

---

## 📝 Method 3: Add to Build Command (Auto-seed on deploy)

**Warning:** This will recreate demo users/projects on every deployment!

Edit your Render backend service settings:

**Current Build Command:**
```bash
npm install && npm run build && npm run db:migrate
```

**New Build Command (with auto-seed):**
```bash
npm install && npm run build && npm run db:migrate && npm run db:seed-demo
```

This automatically seeds demo data after each deployment.

---

## 🎯 Recommended Approach

**Use Method 1 (Shell)** because:
- ✅ You control when to seed
- ✅ Won't recreate data on every deploy
- ✅ Easy to re-run if needed
- ✅ See output in real-time

---

## 📋 What Gets Created

When you run `npm run db:seed-demo`, you get:

### 👥 5 Users (Password: `Demo123!`)
1. sarah.mitchell@example.com - Senior Full-Stack Developer
2. james.rodriguez@example.com - Backend Engineer
3. emily.zhang@example.com - Frontend Developer
4. michael.oconnor@example.com - DevOps Engineer
5. priya.patel@example.com - Product Manager

### 📁 2 Projects

**SmartGrocery** (Owner: Sarah)
- 9 tasks across 3 boards
- 3 custom roles
- 4 team members

**DevTrack** (Owner: James)
- 9 tasks across 3 boards  
- 3 custom roles
- 4 team members

---

## ✅ Verification Steps

After seeding on Render:

### 1. Test Login
```bash
# From your computer, test the API
curl https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.mitchell@example.com","password":"Demo123!"}'
```

Should return a JWT token!

### 2. Check Projects
```bash
# Get the token from step 1, then:
curl https://your-backend.onrender.com/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Should show SmartGrocery and DevTrack!

### 3. Login to Frontend

Go to your frontend URL and login with:
- Email: `sarah.mitchell@example.com`
- Password: `Demo123!`

You should see both projects!

---

## 🔄 Re-seeding Data

If you want to re-create the demo data:

### Option A: Via Shell (Clean slate)

```bash
# Connect to Render Shell for your backend

# Drop and recreate tables (WARNING: Deletes ALL data!)
npm run db:migrate

# Re-seed demo data
npm run db:seed-demo
```

### Option B: Just add new demo data

The seed script uses `ON CONFLICT` for users, so running it again will:
- Update existing demo users
- Create NEW projects (doesn't delete old ones)

---

## 🐛 Troubleshooting on Render

### Issue: "Cannot find module 'tsx'"

**Solution:** Make sure `tsx` is in `dependencies` (not `devDependencies`) in `backend/package.json`.

We already fixed this! It's in dependencies now.

### Issue: "Database connection failed"

**Solution:** Check environment variables:
- `DATABASE_URL` should be the **Internal Database URL** from Render
- Go to Database → Info & Credentials → Copy **Internal Database URL**
- Paste in Backend → Environment → `DATABASE_URL`

### Issue: "User already exists"

**Expected behavior!** The script updates existing users. If you want fresh data, run migrations first:

```bash
npm run db:migrate && npm run db:seed-demo
```

---

## 📸 Perfect for Portfolio Screenshots!

After seeding on production:

1. **Dashboard** - Shows 2 active projects
2. **Kanban Board** - SmartGrocery with tasks in columns
3. **Team Page** - 5 diverse team members with avatars
4. **Custom Roles** - Scrum Master, Frontend Dev, etc.
5. **Task Details** - Assigned members and due dates

These screenshots prove your app works in production! 🎉

---

## 🎬 Demo Video Script

After seeding, you can record a demo:

1. **Login** as Sarah (Project Owner)
2. **Show projects** - SmartGrocery & DevTrack
3. **Open SmartGrocery** - Show Kanban board with tasks
4. **Drag task** - Move from "To Do" to "In Progress"
5. **Go to Team** - Show 5 members with roles
6. **Create a role** - Add "QA Engineer" role
7. **Assign task** - Assign to Emily (Frontend Dev)
8. **Logout and login** as Emily - Show limited permissions
9. **Try to add member** - Show "Insufficient permissions"
10. **Back to Sarah** - Can do everything

Perfect 2-minute demo! 🎥

---

## 💡 Pro Tips

1. **Seed AFTER first deploy** - Make sure migrations run first
2. **Use Shell for manual control** - Better than auto-seeding
3. **Test with different users** - Shows RBAC working
4. **Take screenshots** - Perfect for portfolio/resume
5. **Save credentials** - Password: `Demo123!` for all users

---

## 🚀 Next Steps

1. ✅ Commit and push all changes
2. ✅ Wait for Render to deploy
3. ✅ Open Render Shell for backend
4. ✅ Run `npm run db:seed-demo`
5. ✅ Login and explore!

---

**Ready to deploy?** Your seed script is ready to run on Render! 🎉

Just push your code, wait for deployment, then run the seed command in Render's Shell.

The demo data will make your portfolio project look **amazing**! ✨
