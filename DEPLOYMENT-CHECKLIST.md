# ✅ Deployment Checklist

Use this checklist to deploy BoardMaster Pro to Render:

## Before Deployment

- [ ] Code is working locally
- [ ] GitHub account created
- [ ] Render account created (https://render.com)
- [ ] Git installed

## Deployment Steps

### 1. Push to GitHub
- [ ] `git init` (if needed)
- [ ] `git add .`
- [ ] `git commit -m "Initial commit"`
- [ ] Create repo on GitHub
- [ ] `git remote add origin [YOUR_REPO_URL]`
- [ ] `git push -u origin main`

### 2. Deploy Database
- [ ] Create PostgreSQL on Render
- [ ] Name: `boardmaster-db`
- [ ] Copy Internal Database URL
- [ ] ✏️ Database URL: `____________________`

### 3. Deploy Backend
- [ ] Create Web Service
- [ ] Connect GitHub repo
- [ ] Root Directory: `backend`
- [ ] Build: `npm install && npm run build`
- [ ] Start: `npm start`
- [ ] Add Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL=[from step 2]`
  - [ ] `JWT_SECRET=[generate random]`
  - [ ] `PORT=3001`
- [ ] Wait for deployment (5-10 min)
- [ ] Copy backend URL
- [ ] ✏️ Backend URL: `____________________`

### 4. Run Migrations
- [ ] Go to backend Shell
- [ ] Run: `cd /opt/render/project/src && npm run db:migrate`
- [ ] Verify: "✅ Database migration completed successfully!"

### 5. Deploy Frontend
- [ ] Create Static Site
- [ ] Connect GitHub repo
- [ ] Root Directory: (leave empty)
- [ ] Build: `npm install && npm run build`
- [ ] Publish: `dist`
- [ ] Add Environment Variable:
  - [ ] `VITE_API_URL=[backend URL from step 3]`
- [ ] Wait for deployment (5-10 min)

### 6. Test
- [ ] Open frontend URL
- [ ] Register new account
- [ ] Verify Welcome Project appears
- [ ] Create a new project
- [ ] Create tasks and test drag-and-drop
- [ ] Edit task properties

## URLs

- Frontend: `____________________`
- Backend: `____________________`
- Database: (internal only)

## Troubleshooting

If something doesn't work:
1. Check service logs in Render dashboard
2. Verify all environment variables
3. Ensure migrations ran successfully
4. Check CORS settings if connection issues

---

**Time Estimate**: 20-30 minutes total

**Cost**: $0 (Free tier)
