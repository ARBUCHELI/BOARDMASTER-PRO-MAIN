# BoardMaster Pro Setup Script for Windows

Write-Host "🚀 BoardMaster Pro Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL found" -ForegroundColor Green
} catch {
    Write-Host "⚠ PostgreSQL not found. You can:" -ForegroundColor Yellow
    Write-Host "  1. Install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "  2. Use Docker: docker-compose up -d" -ForegroundColor Yellow
    Write-Host ""
}

# Backend Setup
Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (!(Test-Path ".env")) {
    Copy-Item .env.example .env
    Write-Host "✓ Created backend/.env file" -ForegroundColor Green
    Write-Host "  Please edit backend/.env if you need to change database credentials" -ForegroundColor Cyan
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "⚠ Important: Make sure PostgreSQL is running and the database 'boardmaster' exists" -ForegroundColor Yellow
Write-Host "  You can create it with: psql -U postgres -c 'CREATE DATABASE boardmaster;'" -ForegroundColor Cyan
Write-Host ""
$confirm = Read-Host "Press 'y' when ready to run database migrations (y/n)"

if ($confirm -eq 'y') {
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    npm run db:migrate
}

Set-Location ..

# Frontend Setup
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Yellow

if (!(Test-Path ".env")) {
    "VITE_API_URL=http://localhost:3001" | Out-File -Encoding ASCII .env
    Write-Host "✓ Created .env file" -ForegroundColor Green
} else {
    Write-Host "✓ .env already exists" -ForegroundColor Green
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  1. Start the backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host "  2. Start the frontend: npm run dev (in a new terminal)" -ForegroundColor White
Write-Host ""
Write-Host "Then open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host ""
