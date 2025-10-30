# 🚀 TaskFlow - Render Deployment Guide

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Render account (free - sign up at https://render.com)
- [ ] Your code pushed to a GitHub repository

---

## 📦 Step 1: Prepare Your Code for Deployment

### 1.1 Push to GitHub

If you haven't already, push your code to GitHub:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment - TaskFlow v1.0"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Required Files

Make sure these files exist in your repo:
- ✅ `backend/package.json`
- ✅ `backend/tsconfig.json`
- ✅ `backend/src/db/schema.sql`
- ✅ `package.json` (root)
- ✅ `index.html`
- ✅ `vite.config.ts`

---

## 🗄️ Step 2: Deploy PostgreSQL Database

### 2.1 Create Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `taskflow-db`
   - **Database**: `taskflow`
   - **User**: `taskflow_user`
   - **Region**: Choose closest to you
   - **Plan**: **Free** (or paid if you prefer)
4. Click **"Create Database"**
5. **Wait 2-3 minutes** for database to be ready

### 2.2 Save Database Connection Info

Once ready, you'll see:
- **Internal Database URL** (starts with `postgresql://`)
- **External Database URL** (for local testing)

**Copy the Internal Database URL** - you'll need it in Step 3!

---

## 🔧 Step 3: Deploy Backend API

### 3.1 Create Backend Web Service

1. Click **"New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. Configure:
   - **Name**: `taskflow-backend`
   - **Region**: Same as database
   - **Root Directory**: `backend`
   - **Environment**: **Node**
   - **Build Command**: `npm install && npm run build && npm run db:migrate`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

### 3.2 Add Environment Variables

Click **"Add Environment Variable"** for each:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | [Paste Internal Database URL from Step 2] | From your database |
| `JWT_SECRET` | `your-super-secret-key-change-this-to-random-string` | Use strong random string |
| `PORT` | `3010` | Backend port |
| `NODE_ENV` | `production` | Environment |

**Important**: Click **"Generate"** button next to JWT_SECRET to get a secure random value!

### 3.3 Deploy

1. Click **"Create Web Service"**
2. **Wait 5-10 minutes** for first deploy
3. Watch the logs for:
   ```
   ✅ Database migration completed successfully!
   Backend running on http://localhost:3001
   ```
4. Once deployed, **copy your backend URL**:
   - Example: `https://taskflow-backend.onrender.com`

### 3.4 Test Backend

Open in browser: `https://taskflow-backend.onrender.com/health`

Should see: `{"ok":true}` ✅

---

## 🎨 Step 4: Deploy Frontend

### 4.1 Create Frontend Static Site

1. Click **"New +"** → **"Static Site"**
2. **Connect your GitHub repository** (same repo)
3. Configure:
   - **Name**: `taskflow`
   - **Region**: Same as backend
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 4.2 Add Environment Variable

Click **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://taskflow-backend.onrender.com` |

**Replace** with YOUR actual backend URL from Step 3.3!

### 4.3 Deploy

1. Click **"Create Static Site"**
2. **Wait 3-5 minutes**
3. Once deployed, you'll get a URL like:
   - `https://taskflow.onrender.com`

---

## ✅ Step 5: Test Your Deployed App

### 5.1 Open Your App

Go to: `https://taskflow.onrender.com` (your actual URL)

### 5.2 Test Functionality

1. ✅ **Register** a new account
2. ✅ **Login**
3. ✅ **Create a project**
4. ✅ **View roles** in Team & Settings
5. ✅ **Create tasks**
6. ✅ **Upload profile picture**

If everything works - **you're live!** 🎉

---

## 🔧 Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain

1. Go to your **frontend service** on Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `taskflow.yourdomain.com`)
4. Follow DNS instructions
5. Wait for SSL certificate (automatic, ~5 minutes)

### 6.2 Update Environment Variables

Go to **backend service**:
- Update `FRONTEND_URL` to your custom domain

Go to **frontend service**:
- No changes needed, but rebuild if you want

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check logs** in Render dashboard:

**Issue**: "Cannot connect to database"
**Fix**: Verify `DATABASE_URL` is correct (Internal URL, not External)

**Issue**: "Migration failed"
**Fix**: 
1. Connect to database using External URL
2. Run migration manually: `npm run db:migrate`

### Frontend Shows "Failed to fetch"

**Issue**: CORS error
**Fix**: 
1. Check `VITE_API_URL` is correct
2. Rebuild frontend service

### App is Slow

**Cause**: Free tier services "sleep" after 15 min of inactivity
**Fix**: 
- Upgrade to paid plan ($7/month per service)
- Or accept 30-second cold start on first request

---

## 📊 Monitor Your App

### Render Dashboard

- **Logs**: See real-time logs for debugging
- **Metrics**: CPU, memory usage
- **Events**: Deploy history

### Health Check

Set up health checks:
- Backend: `/health` endpoint (already configured)
- Render will restart service if unhealthy

---

## 🔄 Deploy Updates

### When You Make Changes:

```powershell
# Make your changes locally
# Test them

# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main
```

**Render will automatically deploy** when you push to `main` branch!

---

## 💰 Pricing

### Free Tier (What You're Using):

**PostgreSQL Database:**
- 1 GB storage
- Expires after 90 days (then need to upgrade)

**Backend Web Service:**
- 750 hours/month free
- Sleeps after 15 min inactivity
- Automatic SSL

**Frontend Static Site:**
- 100 GB bandwidth/month
- Custom domain support
- Automatic SSL

### Upgrade Options:

If you need always-on services:
- **Database**: $7/month (1 GB)
- **Backend**: $7/month
- **Total**: ~$14/month for production-ready app

---

## 🎯 Next Steps

### 1. Custom Domain
Get a domain from:
- Namecheap (~$10/year)
- Google Domains
- GoDaddy

### 2. Monitoring
Set up:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Uptime monitoring (UptimeRobot)

### 3. Backups
- Database: Enable automatic backups on Render
- Code: Already backed up on GitHub

### 4. SEO
- Update meta tags in `index.html`
- Add `robots.txt`
- Submit to Google Search Console

---

## 📝 Environment Variables Reference

### Backend (`taskflow-backend`):
```
DATABASE_URL=postgresql://... (from Render DB)
JWT_SECRET=<generate random string>
PORT=3001
NODE_ENV=production
```

### Frontend (`taskflow`):
```
VITE_API_URL=https://taskflow-backend.onrender.com
```

---

## 🎓 What You've Built

Congratulations! You now have:

✅ **Production-ready app** deployed to the cloud
✅ **PostgreSQL database** with your data
✅ **REST API** serving your backend
✅ **Static frontend** with React + Vite
✅ **HTTPS** enabled automatically
✅ **Professional portfolio piece** to show employers
✅ **Auto-deployment** from GitHub

**Share your live app:**
- Add URL to your resume
- Link in LinkedIn
- Show in interviews
- Add to portfolio

---

## 🆘 Need Help?

### Check These First:
1. Render dashboard logs
2. Browser console (F12)
3. Network tab (F12 → Network)

### Common URLs:
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs
- Status: https://status.render.com

---

## 🎉 You're Live!

Your TaskFlow app is now:
- ✅ Deployed to production
- ✅ Accessible worldwide
- ✅ Running 24/7 (with cold starts on free tier)
- ✅ Ready to show employers
- ✅ Available at: `https://taskflow.onrender.com`

**Congratulations on deploying your full-stack application!** 🚀

---

**Built with**: React, TypeScript, Node.js, Express, PostgreSQL
**Deployed on**: Render
**Created by**: Andres R. Bucheli
