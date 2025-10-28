import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const createBoardSchema = z.object({
  name: z.string().min(1),
  projectId: z.string().uuid(),
  position: z.number().int().min(0).optional(),
});

// Get boards for a project
router.get('/project/:projectId', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    // Verify user has access to project
    const projectCheck = await pool.query(
      `SELECT id FROM projects 
       WHERE id = $1 
       AND (owner_id = $2 OR EXISTS (
         SELECT 1 FROM project_members 
         WHERE project_id = $1 AND user_id = $2
       ))`,
      [projectId, req.userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to access this project' });
    }

    const result = await pool.query(
      'SELECT * FROM boards WHERE project_id = $1 ORDER BY position ASC',
      [projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create board
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, projectId, position } = createBoardSchema.parse(req.body);

    // Verify user has access to project
    const projectCheck = await pool.query(
      `SELECT id FROM projects 
       WHERE id = $1 
       AND (owner_id = $2 OR EXISTS (
         SELECT 1 FROM project_members 
         WHERE project_id = $1 AND user_id = $2
       ))`,
      [projectId, req.userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to access this project' });
    }

    // Get max position if not provided
    let boardPosition = position ?? 0;
    if (position === undefined) {
      const maxPos = await pool.query(
        'SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM boards WHERE project_id = $1',
        [projectId]
      );
      boardPosition = maxPos.rows[0].next_pos;
    }

    const result = await pool.query(
      'INSERT INTO boards (name, project_id, position) VALUES ($1, $2, $3) RETURNING *',
      [name, projectId, boardPosition]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create board error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete board
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify user owns the project
    const result = await pool.query(
      `DELETE FROM boards 
       WHERE id = $1 
       AND EXISTS (
         SELECT 1 FROM projects 
         WHERE projects.id = boards.project_id 
         AND projects.owner_id = $2
       )
       RETURNING id`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this board' });
    }

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
