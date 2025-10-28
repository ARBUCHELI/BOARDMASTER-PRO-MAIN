import { pool } from './index.js';

export async function seedWelcomeProject(userId: string) {
  try {
    // Create Welcome Project
    const projectResult = await pool.query(
      `INSERT INTO projects (name, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [
        '🎉 Welcome to BoardMaster Pro!',
        'This is a sample project to help you get started. Feel free to explore, edit, or delete it!',
        userId
      ]
    );

    const projectId = projectResult.rows[0].id;

    // Create boards
    const boardsResult = await pool.query(
      `INSERT INTO boards (project_id, name, position) VALUES
       ($1, 'To Do', 0),
       ($1, 'In Progress', 1),
       ($1, 'Done', 2)
       RETURNING id, name`,
      [projectId]
    );

    const boards = boardsResult.rows;
    const todoBoard = boards.find(b => b.name === 'To Do')!;
    const inProgressBoard = boards.find(b => b.name === 'In Progress')!;
    const doneBoard = boards.find(b => b.name === 'Done')!;

    // Create sample tasks
    await pool.query(
      `INSERT INTO tasks (board_id, title, description, priority, status, position, created_by) VALUES
       ($1, 'Welcome! 👋', 'Click on this card to see how tasks work. You can edit the title, description, priority, and due date.', 'medium', 'todo', 0, $4),
       ($1, 'Try dragging tasks', 'Drag this card to the "In Progress" or "Done" column to move it between different stages.', 'high', 'todo', 1, $4),
       ($1, 'Create your first task', 'Click the "+ Add Task" button below to create your own task!', 'medium', 'todo', 2, $4),
       ($2, 'Organize your work', 'Use this board to organize your tasks and track progress on your projects.', 'medium', 'in_progress', 0, $4),
       ($3, 'Explore the features', 'You''ve completed the tour! Now create your own projects and start managing your tasks.', 'low', 'done', 0, $4)`,
      [todoBoard.id, inProgressBoard.id, doneBoard.id, userId]
    );

    console.log(`✅ Welcome project created for user ${userId}`);
    return projectId;
  } catch (error) {
    console.error('Error creating welcome project:', error);
    throw error;
  }
}
