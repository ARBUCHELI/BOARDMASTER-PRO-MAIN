# 🌱 Seed Demo Data on Render (Free Tier)

Since Render's free tier doesn't have Shell access, we've created an API endpoint to seed the demo data!

---

## 🚀 Quick Steps

### 1. Set Environment Variable on Render

Go to your Render backend service → Environment:

Add a new environment variable:
- **Key:** `SEED_SECRET`
- **Value:** `my-super-secret-seed-key-2024` (or any secret you want)

Click **"Save Changes"** - Render will redeploy automatically.

### 2. Wait for Deployment

Wait for Render to finish deploying with the new environment variable.

### 3. Trigger the Seed via API

From your computer, run this command:

```powershell
# Replace YOUR_BACKEND_URL with your actual Render backend URL
# Replace YOUR_SECRET with the SEED_SECRET you set

$uri = "https://your-backend.onrender.com/api/seed/demo"
$headers = @{
    "Content-Type" = "application/json"
    "x-seed-secret" = "my-super-secret-seed-key-2024"
}

Invoke-RestMethod -Uri $uri -Method Post -Headers $headers
```

**Or use curl:**

```powershell
curl -X POST https://your-backend.onrender.com/api/seed/demo `
  -H "Content-Type: application/json" `
  -H "x-seed-secret: my-super-secret-seed-key-2024"
```

### 4. Check the Response

You should see:

```json
{
  "success": true,
  "message": "Demo data seeded successfully!",
  "output": "... seed output with created users and projects ..."
}
```

### 5. Login and Explore!

Go to your frontend and login with any demo user:
- **Email:** `sarah.mitchell@example.com`
- **Password:** `Demo123!`

---

## 🎯 What Gets Created

### 👥 5 Users (Password: `Demo123!`)
1. sarah.mitchell@example.com - Senior Full-Stack Developer
2. james.rodriguez@example.com - Backend Engineer  
3. emily.zhang@example.com - Frontend Developer
4. michael.oconnor@example.com - DevOps Engineer
5. priya.patel@example.com - Product Manager

### 📁 2 Complete Projects

**SmartGrocery**
- Owner: Sarah Mitchell
- 9 tasks in 3 boards (To Do, In Progress, Done)
- 3 custom roles (Scrum Master, Frontend Dev, Backend Dev)
- 4 team members

**DevTrack**
- Owner: James Rodriguez
- 9 tasks in 3 boards
- 3 custom roles (Tech Lead, DevOps, Product Manager)
- 4 team members

---

## 🔒 Security

The seed endpoint is protected by a secret key (`SEED_SECRET`):
- Only requests with the correct `x-seed-secret` header will work
- Set a strong secret in Render environment variables
- After seeding, you can remove the `SEED_SECRET` variable to disable the endpoint

---

## 🔄 Re-seeding

To re-seed the demo data:

1. **Reset database first** (optional, but recommended):
   - Change your build command on Render to: `npm install && npm run build && npm run db:setup`
   - This will migrate and seed in one command
   - After it deploys once, change it back to: `npm install && npm run build && npm run db:migrate`

2. **Or just seed again:**
   - Run the API call again
   - It will update existing demo users and create new projects

---

## 🐛 Troubleshooting

### Error: "Invalid seed secret"

**Solution:** Make sure:
- `SEED_SECRET` environment variable is set on Render
- The header `x-seed-secret` matches exactly
- Render has redeployed after adding the variable

### Error: "Cannot find module 'tsx'"

**Solution:** Make sure `tsx` is in `dependencies` (not `devDependencies`).
We already fixed this in `package.json`!

### Error: "Database connection failed"

**Solution:** Check that `DATABASE_URL` environment variable is set correctly:
- Go to your Render Database → Info & Credentials
- Copy the **Internal Database URL**
- Paste in Backend Service → Environment → `DATABASE_URL`

### No response / Timeout

**Solution:** 
- Check Render logs to see if the seed is running
- The seed might take 20-30 seconds on free tier (cold start)
- Try again after a minute

---

## 📊 Full Example with PowerShell

```powershell
# Set your variables
$backendUrl = "https://taskflow-backend.onrender.com"  # Replace with yours
$seedSecret = "my-super-secret-seed-key-2024"          # Replace with yours

# Trigger seed
$response = Invoke-RestMethod `
  -Uri "$backendUrl/api/seed/demo" `
  -Method Post `
  -Headers @{
    "Content-Type" = "application/json"
    "x-seed-secret" = $seedSecret
  }

# Show result
$response | ConvertTo-Json -Depth 5
```

---

## 📊 Full Example with curl

```bash
# Set your variables
BACKEND_URL="https://taskflow-backend.onrender.com"
SEED_SECRET="my-super-secret-seed-key-2024"

# Trigger seed
curl -X POST "$BACKEND_URL/api/seed/demo" \
  -H "Content-Type: application/json" \
  -H "x-seed-secret: $SEED_SECRET" \
  -w "\nHTTP Status: %{http_code}\n"
```

---

## 🎬 After Seeding

Perfect for taking screenshots and recording demos:

1. **Login** as any of the 5 users
2. **Explore projects** - SmartGrocery and DevTrack
3. **Test permissions** - Login as different users
4. **Move tasks** - Drag between boards
5. **Manage team** - Add/remove members (if you're owner/admin)

---

## 💡 Pro Tip: One-Time Setup

If you only want to seed once during initial deployment:

1. Add `SEED_SECRET` environment variable
2. Deploy and let it finish
3. Run the seed API call
4. **Remove `SEED_SECRET` variable** from Render
5. The endpoint will no longer work (secure!)

---

## 🚀 Summary

```
1. Add SEED_SECRET to Render environment
2. Wait for redeploy
3. POST to /api/seed/demo with x-seed-secret header
4. Login with sarah.mitchell@example.com / Demo123!
5. Enjoy your fully populated app! 🎉
```

---

**Time required:** ~5 minutes  
**Cost:** Free  
**Result:** 5 users, 2 projects, 18 tasks, ready for portfolio! ✨
