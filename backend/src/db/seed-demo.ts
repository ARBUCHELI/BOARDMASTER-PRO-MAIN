import { pool } from './index.js';
import bcrypt from 'bcrypt';

const DEMO_USERS = [
  {
    email: 'sarah.mitchell@example.com',
    password: 'Demo123!',
    fullName: 'Sarah Mitchell',
    jobTitle: 'Senior Full-Stack Developer',
    bio: 'Passionate about building scalable web applications with React and Node.js. 8+ years of experience in software development.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4&radius=50'
  },
  {
    email: 'james.rodriguez@example.com',
    password: 'Demo123!',
    fullName: 'James Rodriguez',
    jobTitle: 'Backend Engineer',
    bio: 'Specialized in microservices architecture and API design. Love working with databases and optimization.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede&radius=50'
  },
  {
    email: 'emily.zhang@example.com',
    password: 'Demo123!',
    fullName: 'Emily Zhang',
    jobTitle: 'Frontend Developer',
    bio: 'UI/UX enthusiast with a focus on creating beautiful, accessible interfaces. React and TypeScript expert.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffd5dc&radius=50'
  },
  {
    email: 'michael.oconnor@example.com',
    password: 'Demo123!',
    fullName: 'Michael O\'Connor',
    jobTitle: 'DevOps Engineer',
    bio: 'Infrastructure automation and CI/CD pipeline specialist. Making deployments smooth and reliable.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=d1d4f9&radius=50'
  },
  {
    email: 'priya.patel@example.com',
    password: 'Demo123!',
    fullName: 'Priya Patel',
    jobTitle: 'Product Manager',
    bio: 'Bridging the gap between business and technology. Agile advocate and user-centric product enthusiast.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffdfbf&radius=50'
  }
];

const PROJECTS = [
  {
    name: 'SmartGrocery',
    description: 'React + Node.js Shopping List App - A full-stack app that lets users create, share, and optimize grocery lists using AI-based suggestions.',
    boards: [
      { name: 'To Do', order: 0 },
      { name: 'In Progress', order: 1 },
      { name: 'Done', order: 2 }
    ],
    tasks: [
      // To Do
      { boardIndex: 0, title: 'Add authentication with JWT', description: 'Implement user login/signup using JWT in backend', priority: 'high', dueDate: '2024-11-06' },
      { boardIndex: 0, title: 'Create product search component', description: 'Add search bar with autocomplete for grocery items', priority: 'medium', dueDate: '2024-11-07' },
      { boardIndex: 0, title: 'Integrate OpenAI API for suggestions', description: 'Suggest missing grocery items based on user behavior', priority: 'high', dueDate: '2024-11-09' },
      { boardIndex: 0, title: 'Optimize bundle size', description: 'Configure Webpack and React.lazy for better load performance', priority: 'medium', dueDate: '2024-11-11' },
      // In Progress
      { boardIndex: 1, title: 'Implement MongoDB models with Prisma', description: 'Define User, Product, and List models', priority: 'high', dueDate: '2024-11-04' },
      { boardIndex: 1, title: 'Develop shopping list drag-and-drop board', description: 'Kanban-style list management using React Beautiful DnD', priority: 'medium', dueDate: '2024-11-05' },
      // Done
      { boardIndex: 2, title: 'Set up project structure', description: 'Create monorepo structure with frontend and backend folders', priority: 'medium', dueDate: '2024-10-25' },
      { boardIndex: 2, title: 'Initialize GitHub repository', description: 'Configure repository with CI/CD pipeline', priority: 'medium', dueDate: '2024-10-26' },
      { boardIndex: 2, title: 'Install and configure ESLint + Prettier', description: 'Code quality tools configured for both backend and frontend', priority: 'low', dueDate: '2024-10-27' }
    ],
    roles: [
      { name: 'Scrum Master', description: 'Facilitates team processes and removes blockers', permissionLevel: 'full', canManageMembers: true, canManageRoles: true, canAssignTasks: true, canDeleteTasks: true, canManageProject: true },
      { name: 'Frontend Developer', description: 'Works on React components and UI', permissionLevel: 'edit', canManageMembers: false, canManageRoles: false, canAssignTasks: false, canDeleteTasks: false, canManageProject: false },
      { name: 'Backend Developer', description: 'Works on Node.js API and database', permissionLevel: 'edit', canManageMembers: false, canManageRoles: false, canAssignTasks: false, canDeleteTasks: false, canManageProject: false }
    ],
    teamMembers: [
      { userIndex: 1, role: 'admin', projectRoleName: 'Scrum Master' },
      { userIndex: 2, role: 'member', projectRoleName: 'Frontend Developer' },
      { userIndex: 3, role: 'member', projectRoleName: 'Backend Developer' },
      { userIndex: 4, role: 'viewer', projectRoleName: null }
    ]
  },
  {
    name: 'DevTrack',
    description: 'Team Productivity Dashboard - A lightweight web dashboard that visualizes developer productivity metrics via GitHub API integration.',
    boards: [
      { name: 'To Do', order: 0 },
      { name: 'In Progress', order: 1 },
      { name: 'Done', order: 2 }
    ],
    tasks: [
      // To Do
      { boardIndex: 0, title: 'Add OAuth2 GitHub login', description: 'Let users connect GitHub accounts securely', priority: 'high', dueDate: '2024-11-10' },
      { boardIndex: 0, title: 'Implement user role management', description: 'Add Admin/Developer roles for dashboard visibility', priority: 'high', dueDate: '2024-11-11' },
      { boardIndex: 0, title: 'Create notification system', description: 'Email and in-app notifications for new commits', priority: 'medium', dueDate: '2024-11-13' },
      { boardIndex: 0, title: 'Deploy app to Vercel', description: 'Prepare production build and deployment scripts', priority: 'high', dueDate: '2024-11-15' },
      // In Progress
      { boardIndex: 1, title: 'Design dashboard layout', description: 'Use Mantine components for responsive analytics view', priority: 'medium', dueDate: '2024-11-05' },
      { boardIndex: 1, title: 'Connect backend to GitHub API', description: 'Fetch commits, PRs, and issues for analytics', priority: 'high', dueDate: '2024-11-06' },
      // Done
      { boardIndex: 2, title: 'Create backend service using Moleculer', description: 'Microservice setup for handling GitHub data', priority: 'high', dueDate: '2024-10-28' },
      { boardIndex: 2, title: 'Set up PostgreSQL database', description: 'Create schema for storing repository stats', priority: 'high', dueDate: '2024-10-29' },
      { boardIndex: 2, title: 'Configure CI/CD with GitHub Actions', description: 'Automated testing and deployment pipeline', priority: 'medium', dueDate: '2024-10-30' }
    ],
    roles: [
      { name: 'Tech Lead', description: 'Technical leadership and architecture decisions', permissionLevel: 'full', canManageMembers: true, canManageRoles: true, canAssignTasks: true, canDeleteTasks: true, canManageProject: true },
      { name: 'DevOps Engineer', description: 'Infrastructure and deployment management', permissionLevel: 'edit', canManageMembers: false, canManageRoles: false, canAssignTasks: false, canDeleteTasks: false, canManageProject: false },
      { name: 'Product Manager', description: 'Product strategy and requirements', permissionLevel: 'comment', canManageMembers: false, canManageRoles: false, canAssignTasks: true, canDeleteTasks: false, canManageProject: false }
    ],
    teamMembers: [
      { userIndex: 0, role: 'admin', projectRoleName: 'Tech Lead' },
      { userIndex: 3, role: 'member', projectRoleName: 'DevOps Engineer' },
      { userIndex: 4, role: 'member', projectRoleName: 'Product Manager' },
      { userIndex: 2, role: 'member', projectRoleName: null }
    ]
  }
];

async function seedDemoData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌱 Starting demo data seeding...\n');

    // 1. Create users
    console.log('👥 Creating 5 demo users...');
    const createdUsers = [];
    
    for (const user of DEMO_USERS) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const result = await client.query(
        `INSERT INTO users (email, password_hash, full_name, job_title, bio, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET
           password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           job_title = EXCLUDED.job_title,
           bio = EXCLUDED.bio,
           avatar_url = EXCLUDED.avatar_url
         RETURNING *`,
        [user.email, hashedPassword, user.fullName, user.jobTitle, user.bio, user.avatarUrl]
      );
      
      createdUsers.push(result.rows[0]);
      console.log(`   ✓ ${user.fullName} (${user.email})`);
    }
    console.log(`   ✅ Created ${createdUsers.length} users\n`);

    // 2. Create projects with boards, tasks, roles, and team members
    for (let projectIndex = 0; projectIndex < PROJECTS.length; projectIndex++) {
      const projectData = PROJECTS[projectIndex];
      const owner = createdUsers[projectIndex % createdUsers.length];

      console.log(`📁 Creating project: ${projectData.name}...`);
      
      // Create project
      const projectResult = await client.query(
        `INSERT INTO projects (name, description, owner_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [projectData.name, projectData.description, owner.id]
      );
      const project = projectResult.rows[0];
      console.log(`   ✓ Project created by ${owner.full_name}`);

      // Create boards
      const createdBoards = [];
      for (const boardData of projectData.boards) {
        const boardResult = await client.query(
          `INSERT INTO boards (project_id, name, "order")
           VALUES ($1, $2, $3)
           RETURNING *`,
          [project.id, boardData.name, boardData.order]
        );
        createdBoards.push(boardResult.rows[0]);
      }
      console.log(`   ✓ Created ${createdBoards.length} boards (${projectData.boards.map(b => b.name).join(', ')})`);

      // Create tasks
      let taskCount = 0;
      for (const taskData of projectData.tasks) {
        const board = createdBoards[taskData.boardIndex];
        await client.query(
          `INSERT INTO tasks (board_id, title, description, priority, due_date, created_by)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [board.id, taskData.title, taskData.description, taskData.priority, taskData.dueDate, owner.id]
        );
        taskCount++;
      }
      console.log(`   ✓ Created ${taskCount} tasks`);

      // Create custom roles
      const createdRoles = [];
      for (const roleData of projectData.roles) {
        const roleResult = await client.query(
          `INSERT INTO project_roles 
           (project_id, name, description, permission_level, can_manage_members, can_manage_roles, can_assign_tasks, can_delete_tasks, can_manage_project)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [
            project.id,
            roleData.name,
            roleData.description,
            roleData.permissionLevel,
            roleData.canManageMembers,
            roleData.canManageRoles,
            roleData.canAssignTasks,
            roleData.canDeleteTasks,
            roleData.canManageProject
          ]
        );
        createdRoles.push(roleResult.rows[0]);
      }
      console.log(`   ✓ Created ${createdRoles.length} custom roles (${projectData.roles.map(r => r.name).join(', ')})`);

      // Add team members
      for (const memberData of projectData.teamMembers) {
        const user = createdUsers[memberData.userIndex];
        
        // Find role ID if role name provided
        let projectRoleId = null;
        if (memberData.projectRoleName) {
          const role = createdRoles.find(r => r.name === memberData.projectRoleName);
          if (role) projectRoleId = role.id;
        }

        await client.query(
          `INSERT INTO project_members (project_id, user_id, role, project_role_id)
           VALUES ($1, $2, $3, $4)`,
          [project.id, user.id, memberData.role, projectRoleId]
        );
        
        const roleDisplay = memberData.projectRoleName ? ` as ${memberData.projectRoleName}` : '';
        console.log(`   ✓ Added ${user.full_name} (${memberData.role}${roleDisplay})`);
      }
      console.log(`   ✅ Project "${projectData.name}" completed!\n`);
    }

    await client.query('COMMIT');
    
    console.log('🎉 Demo data seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   • ${createdUsers.length} users created`);
    console.log(`   • ${PROJECTS.length} projects created`);
    console.log(`   • ${PROJECTS.reduce((sum, p) => sum + p.boards.length, 0)} boards created`);
    console.log(`   • ${PROJECTS.reduce((sum, p) => sum + p.tasks.length, 0)} tasks created`);
    console.log(`   • ${PROJECTS.reduce((sum, p) => sum + p.roles.length, 0)} custom roles created`);
    console.log(`   • ${PROJECTS.reduce((sum, p) => sum + p.teamMembers.length, 0)} team members assigned\n`);
    
    console.log('🔑 Login Credentials:');
    console.log('   All users have password: Demo123!\n');
    console.log('   Users:');
    DEMO_USERS.forEach(user => {
      console.log(`   • ${user.email} - ${user.fullName} (${user.jobTitle})`);
    });
    console.log('\n   Projects:');
    PROJECTS.forEach((proj, i) => {
      const owner = createdUsers[i % createdUsers.length];
      console.log(`   • ${proj.name} (Owner: ${owner.full_name})`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed
seedDemoData().catch(console.error);
