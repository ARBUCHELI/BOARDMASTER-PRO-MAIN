import { pool } from './index.js';

export async function seedDefaultRoles(projectId: string) {
  const defaultRoles = [
    {
      name: 'Scrum Master',
      description: 'Facilitates Agile ceremonies and removes blockers for the team',
      permission_level: 'full',
      can_manage_members: true,
      can_manage_roles: true,
      can_assign_tasks: true,
      can_delete_tasks: true,
      can_manage_project: true,
    },
    {
      name: 'Product Owner',
      description: 'Defines product vision and prioritizes backlog items',
      permission_level: 'full',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: true,
      can_delete_tasks: false,
      can_manage_project: true,
    },
    {
      name: 'Frontend Developer',
      description: 'Develops user interfaces and client-side functionality',
      permission_level: 'edit',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: false,
      can_delete_tasks: false,
      can_manage_project: false,
    },
    {
      name: 'Backend Developer',
      description: 'Develops server-side logic and database architecture',
      permission_level: 'edit',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: false,
      can_delete_tasks: false,
      can_manage_project: false,
    },
    {
      name: 'Full Stack Developer',
      description: 'Works on both frontend and backend development',
      permission_level: 'edit',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: false,
      can_delete_tasks: false,
      can_manage_project: false,
    },
    {
      name: 'QA Engineer',
      description: 'Tests and ensures quality of deliverables',
      permission_level: 'edit',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: false,
      can_delete_tasks: false,
      can_manage_project: false,
    },
    {
      name: 'DevOps Engineer',
      description: 'Manages deployment, infrastructure, and CI/CD pipelines',
      permission_level: 'edit',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: false,
      can_delete_tasks: false,
      can_manage_project: false,
    },
    {
      name: 'UI/UX Designer',
      description: 'Designs user interfaces and user experiences',
      permission_level: 'comment',
      can_manage_members: false,
      can_manage_roles: false,
      can_assign_tasks: false,
      can_delete_tasks: false,
      can_manage_project: false,
    },
  ];

  try {
    for (const role of defaultRoles) {
      await pool.query(
        `INSERT INTO project_roles 
          (project_id, name, description, permission_level, can_manage_members, can_manage_roles, can_assign_tasks, can_delete_tasks, can_manage_project)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (project_id, name) DO NOTHING`,
        [
          projectId,
          role.name,
          role.description,
          role.permission_level,
          role.can_manage_members,
          role.can_manage_roles,
          role.can_assign_tasks,
          role.can_delete_tasks,
          role.can_manage_project,
        ]
      );
    }
    console.log(`✅ Seeded default roles for project ${projectId}`);
  } catch (error) {
    console.error('Error seeding default roles:', error);
    throw error;
  }
}
