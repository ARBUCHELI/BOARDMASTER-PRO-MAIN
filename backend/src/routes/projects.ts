import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { seedDefaultRoles } from '../db/seedDefaultRoles.js';

const router = Router();
router.use(authenticate);

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Get all projects for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
              u.email as owner_email, 
              u.full_name as owner_name,
              (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) + 1 as member_count
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.owner_id = $1 
          OR EXISTS (
            SELECT 1 FROM project_members pm 
            WHERE pm.project_id = p.id AND pm.user_id = $1
          )
       ORDER BY p.created_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, 
              u.email as owner_email, 
              u.full_name as owner_name
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1 
         AND (p.owner_id = $2 OR EXISTS (
           SELECT 1 FROM project_members pm 
           WHERE pm.project_id = p.id AND pm.user_id = $2
         ))`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, description } = createProjectSchema.parse(req.body);

    const result = await pool.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, req.userId]
    );

    // Create default boards
    const project = result.rows[0];
    await pool.query(
      `INSERT INTO boards (project_id, name, position) VALUES 
       ($1, 'To Do', 0),
       ($1, 'In Progress', 1),
       ($1, 'Done', 2)`,
      [project.id]
    );

    // Seed default project roles
    try {
      await seedDefaultRoles(project.id);
    } catch (error) {
      console.error('Failed to seed default roles:', error);
      // Continue even if role seeding fails
    }

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = updateProjectSchema.parse(req.body);

    // Check if user is the owner
    const ownerCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND owner_id = $2',
      [id, req.userId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

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

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if user is the owner
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
