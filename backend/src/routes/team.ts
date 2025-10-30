import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess, requirePermission, PermissionRequest } from '../middleware/permissions.js';

const router = Router();
router.use(authenticate);

// Schema definitions
const createRoleSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  permissionLevel: z.enum(['full', 'edit', 'comment', 'view']),
  canManageMembers: z.boolean().default(false),
  canManageRoles: z.boolean().default(false),
  canAssignTasks: z.boolean().default(false),
  canDeleteTasks: z.boolean().default(false),
  canManageProject: z.boolean().default(false),
});

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
  projectRoleId: z.string().uuid().optional(),
});

const updateMemberSchema = z.object({
  role: z.enum(['admin', 'member', 'viewer']).optional(),
  projectRoleId: z.string().uuid().optional().nullable(),
});

// Get project members with their roles
router.get('/projects/:projectId/members', checkProjectAccess, async (req: PermissionRequest, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT 
        pm.id as membership_id,
        u.id,
        u.email,
        u.full_name,
        u.avatar_url,
        u.job_title,
        pm.role,
        pm.created_at as joined_at,
        pr.id as project_role_id,
        pr.name as project_role_name,
        pr.description as project_role_description
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      LEFT JOIN project_roles pr ON pm.project_role_id = pr.id
      WHERE pm.project_id = $1
      
      UNION
      
      SELECT 
        NULL as membership_id,
        u.id,
        u.email,
        u.full_name,
        u.avatar_url,
        u.job_title,
        'owner' as role,
        p.created_at as joined_at,
        NULL as project_role_id,
        'Project Owner' as project_role_name,
        'Full control over the project' as project_role_description
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
      
      ORDER BY joined_at ASC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project roles
router.get('/projects/:projectId/roles', checkProjectAccess, async (req: PermissionRequest, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT * FROM project_roles WHERE project_id = $1 ORDER BY created_at ASC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a project role
router.post('/projects/:projectId/roles', checkProjectAccess, requirePermission('canManageRoles'), async (req: PermissionRequest, res) => {
  try {
    const { projectId } = req.params;
    const data = createRoleSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO project_roles 
        (project_id, name, description, permission_level, can_manage_members, can_manage_roles, can_assign_tasks, can_delete_tasks, can_manage_project)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        projectId,
        data.name,
        data.description || null,
        data.permissionLevel,
        data.canManageMembers,
        data.canManageRoles,
        data.canAssignTasks,
        data.canDeleteTasks,
        data.canManageProject,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error.code === '23505') {
      return res.status(400).json({ error: 'A role with this name already exists in this project' });
    }
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project role
router.put('/projects/:projectId/roles/:roleId', checkProjectAccess, requirePermission('canManageRoles'), async (req: PermissionRequest, res) => {
  try {
    const { projectId, roleId } = req.params;
    const data = createRoleSchema.partial().parse(req.body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }
    if (data.permissionLevel !== undefined) {
      updates.push(`permission_level = $${paramCount}`);
      values.push(data.permissionLevel);
      paramCount++;
    }
    if (data.canManageMembers !== undefined) {
      updates.push(`can_manage_members = $${paramCount}`);
      values.push(data.canManageMembers);
      paramCount++;
    }
    if (data.canManageRoles !== undefined) {
      updates.push(`can_manage_roles = $${paramCount}`);
      values.push(data.canManageRoles);
      paramCount++;
    }
    if (data.canAssignTasks !== undefined) {
      updates.push(`can_assign_tasks = $${paramCount}`);
      values.push(data.canAssignTasks);
      paramCount++;
    }
    if (data.canDeleteTasks !== undefined) {
      updates.push(`can_delete_tasks = $${paramCount}`);
      values.push(data.canDeleteTasks);
      paramCount++;
    }
    if (data.canManageProject !== undefined) {
      updates.push(`can_manage_project = $${paramCount}`);
      values.push(data.canManageProject);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(roleId, projectId);
    const result = await pool.query(
      `UPDATE project_roles SET ${updates.join(', ')} 
       WHERE id = $${paramCount} AND project_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project role
router.delete('/projects/:projectId/roles/:roleId', checkProjectAccess, requirePermission('canManageRoles'), async (req: PermissionRequest, res) => {
  try {
    const { projectId, roleId } = req.params;

    const result = await pool.query(
      'DELETE FROM project_roles WHERE id = $1 AND project_id = $2 RETURNING id',
      [roleId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a member to project
router.post('/projects/:projectId/members', checkProjectAccess, requirePermission('canManageMembers'), async (req: PermissionRequest, res) => {
  try {
    const { projectId } = req.params;
    const data = addMemberSchema.parse(req.body);

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, email, full_name, avatar_url FROM users WHERE email = $1',
      [data.email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    const user = userResult.rows[0];

    // Check if user is already a member
    const memberCheck = await pool.query(
      'SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, user.id]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User is already a member of this project' });
    }

    // Check if user is the owner
    const ownerCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND owner_id = $2',
      [projectId, user.id]
    );

    if (ownerCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User is the project owner' });
    }

    // Add member
    const result = await pool.query(
      `INSERT INTO project_members (project_id, user_id, role, project_role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [projectId, user.id, data.role, data.projectRoleId || null]
    );

    res.status(201).json({
      ...result.rows[0],
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a member's role
router.put('/projects/:projectId/members/:memberId', checkProjectAccess, requirePermission('canManageMembers'), async (req: PermissionRequest, res) => {
  try {
    const { projectId, memberId } = req.params;
    const data = updateMemberSchema.parse(req.body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.role !== undefined) {
      updates.push(`role = $${paramCount}`);
      values.push(data.role);
      paramCount++;
    }

    if (data.projectRoleId !== undefined) {
      updates.push(`project_role_id = $${paramCount}`);
      values.push(data.projectRoleId);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(memberId, projectId);
    const result = await pool.query(
      `UPDATE project_members SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND project_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a member from project
router.delete('/projects/:projectId/members/:memberId', checkProjectAccess, requirePermission('canManageMembers'), async (req: PermissionRequest, res) => {
  try {
    const { projectId, memberId } = req.params;

    const result = await pool.query(
      'DELETE FROM project_members WHERE id = $1 AND project_id = $2 RETURNING id',
      [memberId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
