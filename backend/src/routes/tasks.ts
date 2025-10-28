import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  boardId: z.string().uuid(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  dueDate: z.string().optional().nullable(),
  boardId: z.string().uuid().optional(),
  position: z.number().int().min(0).optional(),
});

// Get tasks for a project
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
      `SELECT t.* FROM tasks t
       JOIN boards b ON t.board_id = b.id
       WHERE b.project_id = $1
       ORDER BY t.position ASC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, description, boardId, priority, dueDate } = createTaskSchema.parse(req.body);

    // Verify user has access to board
    const boardCheck = await pool.query(
      `SELECT b.id FROM boards b
       JOIN projects p ON b.project_id = p.id
       WHERE b.id = $1 
       AND (p.owner_id = $2 OR EXISTS (
         SELECT 1 FROM project_members 
         WHERE project_id = p.id AND user_id = $2
       ))`,
      [boardId, req.userId]
    );

    if (boardCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to access this board' });
    }

    // Get next position
    const maxPos = await pool.query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM tasks WHERE board_id = $1',
      [boardId]
    );
    const position = maxPos.rows[0].next_pos;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, board_id, priority, due_date, position, created_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'todo')
       RETURNING *`,
      [title, description || null, boardId, priority || 'medium', dueDate || null, position, req.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = updateTaskSchema.parse(req.body);

    // Verify user has access to task
    const taskCheck = await pool.query(
      `SELECT t.id FROM tasks t
       JOIN boards b ON t.board_id = b.id
       JOIN projects p ON b.project_id = p.id
       WHERE t.id = $1 
       AND (p.owner_id = $2 OR EXISTS (
         SELECT 1 FROM project_members 
         WHERE project_id = p.id AND user_id = $2
       ))`,
      [id, req.userId]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(data.title);
      paramCount++;
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }
    if (data.priority !== undefined) {
      updates.push(`priority = $${paramCount}`);
      values.push(data.priority);
      paramCount++;
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(data.status);
      paramCount++;
    }
    if (data.dueDate !== undefined) {
      updates.push(`due_date = $${paramCount}`);
      values.push(data.dueDate);
      paramCount++;
    }
    if (data.boardId !== undefined) {
      updates.push(`board_id = $${paramCount}`);
      values.push(data.boardId);
      paramCount++;
    }
    if (data.position !== undefined) {
      updates.push(`position = $${paramCount}`);
      values.push(data.position);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Task update validation error:', error.errors);
      console.error('Request body:', req.body);
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify user has access to task
    const result = await pool.query(
      `DELETE FROM tasks 
       WHERE id = $1 
       AND EXISTS (
         SELECT 1 FROM boards b
         JOIN projects p ON b.project_id = p.id
         WHERE b.id = tasks.board_id
         AND (p.owner_id = $2 OR EXISTS (
           SELECT 1 FROM project_members 
           WHERE project_id = p.id AND user_id = $2
         ))
       )
       RETURNING id`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
