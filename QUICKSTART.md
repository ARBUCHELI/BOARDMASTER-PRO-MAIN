# 🚀 Quick Start Guide

Get BoardMaster Pro running in 5 minutes!

## Option 1: Automated Setup (Windows)

```powershell
# Run the setup script
./setup.ps1
```

Then start the servers:

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Option 2: Using Docker (All Platforms)

```bash
# Start PostgreSQL
docker-compose up -d

# Setup backend
cd backend
npm install
npm run db:migrate
npm run dev

# In another terminal - setup frontend
cd ..
npm install
npm run dev
```

## Option 3: Manual Setup

### 1. Database Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE boardmaster;
CREATE USER boardmaster WITH PASSWORD 'boardmaster123';
GRANT ALL PRIVILEGES ON DATABASE boardmaster TO boardmaster;
\q
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

### 3. Frontend Setup

```bash
cd ..
npm install
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```

## 🎉 Access the App

Open your browser and go to: **http://localhost:5173**

## 📝 First Steps

1. **Register**: Create your account at `/register`
2. **Create Project**: Click "New Project" button
3. **Add Tasks**: Navigate to your project board
4. **Organize**: Drag and drop tasks between columns

## 🆘 Having Issues?

### Backend won't start?
- Check if PostgreSQL is running
- Verify database credentials in `backend/.env`
- Ensure port 3001 is available

### Frontend won't start?
- Check if backend is running
- Verify `VITE_API_URL` in `.env`
- Ensure port 5173 is available

### Database errors?
- Drop and recreate database:
  ```sql
  DROP DATABASE IF EXISTS boardmaster;
  CREATE DATABASE boardmaster;
  ```
- Run migrations again: `npm run db:migrate`

## 💡 Tips

- Use different ports if 3001/5173 are taken
- Check browser console for errors
- Backend logs show all API requests
- Use PostgreSQL GUI tools like pgAdmin for easier database management

---

**Need more details?** Check the full [README.md](./README.md)
