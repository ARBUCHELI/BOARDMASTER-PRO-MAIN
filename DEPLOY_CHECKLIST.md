# ✅ TaskFlow Deployment Checklist

## Pre-Deployment
- [ ] Code is working locally
- [ ] Database migration runs successfully
- [ ] All tests pass (if any)
- [ ] GitHub account created
- [ ] Render account created (https://render.com)

## Push to GitHub
```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Render Setup (in order!)

### 1. Database (5 min)
- [ ] Create PostgreSQL database
- [ ] Name: `taskflow-db`
- [ ] Copy Internal Database URL

### 2. Backend (10 min)
- [ ] Create Web Service
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run build && npm run db:migrate`
- [ ] Start Command: `npm start`
- [ ] Add env vars:
  - [ ] `DATABASE_URL` = [from database]
  - [ ] `JWT_SECRET` = [generate secure string]
  - [ ] `PORT` = 3001
  - [ ] `NODE_ENV` = production
- [ ] Wait for deploy to finish
- [ ] Copy backend URL
- [ ] Test: `https://your-backend.onrender.com/health`

### 3. Frontend (5 min)
- [ ] Create Static Site
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Add env var:
  - [ ] `VITE_API_URL` = [your backend URL]
- [ ] Wait for deploy
- [ ] Copy frontend URL

## Test
- [ ] Open frontend URL
- [ ] Register new account
- [ ] Create project
- [ ] Check Team & Settings
- [ ] Upload profile picture
- [ ] Create and assign tasks

## ✅ Done!
Your app is live at: `https://taskflow.onrender.com`

---

**Time Required**: ~20 minutes
**Cost**: Free (90-day database trial)
