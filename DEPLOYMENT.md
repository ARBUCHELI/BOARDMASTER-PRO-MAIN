# 🚀 Deployment Guide - Render

This guide will help you deploy BoardMaster Pro to Render (free tier).

## 📋 Prerequisites

- GitHub account (to push your code)
- Render account (sign up at https://render.com)
- Git installed on your computer

## 🔄 Step 1: Push to GitHub

First, initialize a Git repository and push your code to GitHub:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - BoardMaster Pro"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/boardmaster-pro.git
git branch -M main
git push -u origin main
```

## 🗄️ Step 2: Deploy PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `boardmaster-db`
   - **Database**: `boardmaster`
   - **User**: `boardmaster`
   - **Region**: Choose closest to you
   - **Plan**: **Free** (0 GB)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **"Internal Database URL"** - you'll need this!

## 🔧 Step 3: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `boardmaster-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. **Environment Variables** - Click "Advanced" and add:
   ```
   NODE_ENV=production
   DATABASE_URL=[Paste your Internal Database URL from Step 2]
   JWT_SECRET=[Generate a random 32+ character string]
   PORT=3001
   ```

   To generate JWT_SECRET, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Click **"Create Web Service"**

6. **IMPORTANT**: Copy your backend URL (e.g., `https://boardmaster-backend.onrender.com`)

## 🎨 Step 4: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `boardmaster-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=[Your backend URL from Step 3]
   ```
   Example: `VITE_API_URL=https://boardmaster-backend.onrender.com`

5. Click **"Create Static Site"**

## 🔍 Step 5: Run Database Migrations

After the backend deploys:

1. Go to your backend service dashboard
2. Click **"Shell"** tab (bottom of page)
3. Run:
   ```bash
   cd /opt/render/project/src
   npm run db:migrate
   ```

This creates all the database tables.

## ✅ Step 6: Test Your App!

1. Open your frontend URL (e.g., `https://boardmaster-frontend.onrender.com`)
2. Click "Register" and create an account
3. You should get the Welcome Project automatically!
4. Start using your app! 🎉

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify DATABASE_URL is correct
- Ensure JWT_SECRET is set

### Frontend can't connect to backend
- Verify VITE_API_URL in frontend environment variables
- Make sure backend URL includes `https://`
- Check backend is running (green status)

### Database connection errors
- Verify you're using the **Internal Database URL**
- Check database is running
- Run migrations in backend shell

### CORS errors
- Backend already configured to accept all origins (`cors({ origin: '*' })`)
- If issues persist, update backend CORS to specific frontend URL

## 🔄 Making Updates

When you push changes to GitHub:

1. **Backend**: Auto-deploys on push to `main` branch
2. **Frontend**: Auto-deploys on push to `main` branch

To manually redeploy:
- Go to service dashboard → Click **"Manual Deploy"** → **"Deploy latest commit"**

## 💰 Render Free Tier Limits

- **Database**: 256 MB storage, 90 days retention
- **Backend**: Spins down after 15 min of inactivity (first request takes ~30s)
- **Frontend**: Always fast, served via CDN

## 🔐 Security Notes

For production:
1. Change JWT_SECRET to a strong random value
2. Set up proper CORS (specific frontend URL)
3. Enable HTTPS (Render does this automatically)
4. Consider upgrading database for persistence beyond 90 days

## 🎓 Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check your service logs in Render dashboard

---

**Congratulations!** 🎊 Your app is now live and accessible from anywhere!
