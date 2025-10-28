# 🚀 BoardMaster Pro

A modern, full-stack project management application similar to Jira and Trello. Built with React, TypeScript, Express.js, and PostgreSQL with a vibrant, professional UI perfect for showcasing on LinkedIn.

![BoardMaster Pro](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Project Management**: Create, edit, and delete projects with full CRUD operations
- **Kanban Boards**: Visual task management with drag-and-drop functionality
- **User Authentication**: Secure JWT-based authentication system
- **Modern UI**: Vibrant purple/teal color palette with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback for all operations
- **Task Management**: Create and organize tasks across multiple boards

## 🎨 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** for utility-first styling
- **Shadcn/UI** for beautiful, accessible components
- **React Query** for server state management
- **React Router** for navigation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** for robust data storage
- **JWT** for secure authentication
- **Bcrypt** for password hashing
- **Zod** for validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Install](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Install](https://www.postgresql.org/download/)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### Quick Start (5 minutes)

See [QUICKSTART.md](./QUICKSTART.md) for the fastest way to get started!

### Detailed Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd boardmaster-pro-main
```

#### 2. Set Up PostgreSQL Database

**Option A: Using pgAdmin or psql**

```sql
CREATE DATABASE boardmaster;
CREATE USER boardmaster WITH PASSWORD 'boardmaster123';
GRANT ALL PRIVILEGES ON DATABASE boardmaster TO boardmaster;
```

**Option B: Using Docker**

```bash
docker-compose up -d
```

#### 3. Set Up Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials if needed
npm run db:migrate
npm run dev
```

The backend will start on `http://localhost:3001`

#### 4. Set Up Frontend

```bash
cd .. # Back to root directory
npm install
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🚀 Running the Project

### Development Mode

1. **Start PostgreSQL** (if not already running)
2. **Start Backend**:
   ```bash
   cd backend && npm run dev
   ```
3. **Start Frontend** (new terminal):
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser

### Production Build

```bash
# Build frontend
npm run build

# Build backend
cd backend && npm run build && npm start
```

## 📁 Project Structure

```
boardmaster-pro-main/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── db/             # Database connection & migrations
│   │   ├── middleware/     # JWT authentication
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Server entry point
│   └── package.json
├── src/                     # React frontend
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities & API client
│   ├── pages/              # Page components
│   └── index.css           # Global styles
├── docker-compose.yml      # Docker setup for PostgreSQL
├── setup.ps1               # Windows setup script
└── README.md
```

## 🔐 Getting Started

1. Navigate to `http://localhost:5173/register`
2. Create your account
3. Start creating projects!

## 🎨 Color Palette

- **Primary (Purple)**: `hsl(266, 100%, 65%)` - Main brand color
- **Secondary (Teal)**: `hsl(174, 72%, 56%)` - Accent color
- **Accent (Coral)**: `hsl(14, 90%, 65%)` - Highlights

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🔧 Environment Variables

**Backend (.env)**
```env
PORT=3001
DATABASE_URL=postgresql://boardmaster:boardmaster123@localhost:5432/boardmaster
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify credentials in `backend/.env`
- Check database exists: `psql -U boardmaster -d boardmaster`

### Port Already in Use
- Change port in `.env` files
- Update `VITE_API_URL` accordingly

### Migration Errors
```sql
DROP DATABASE IF EXISTS boardmaster;
CREATE DATABASE boardmaster;
```
Then run: `npm run db:migrate`

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

## 📄 License

MIT License - feel free to use for learning and portfolio purposes.

## 👤 Author

**Andres R. Bucheli**

Connect on [LinkedIn](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Shadcn/UI for components
- React and TypeScript communities
- Tailwind CSS framework

---

Built with ❤️ to showcase full-stack development skills.
