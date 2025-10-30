import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = Router();

// Secret key for seeding (change this!)
const SEED_SECRET = process.env.SEED_SECRET || 'your-secret-key-change-me';

// POST /api/seed/demo
// Trigger demo data seeding
router.post('/demo', async (req, res) => {
  try {
    // Check secret key
    const providedSecret = req.headers['x-seed-secret'];
    
    if (providedSecret !== SEED_SECRET) {
      return res.status(403).json({ error: 'Invalid seed secret' });
    }

    console.log('🌱 Demo seed triggered via API...');

    // Run the seed script
    const { stdout, stderr } = await execAsync('npm run db:seed-demo');
    
    console.log('Seed output:', stdout);
    if (stderr) console.error('Seed errors:', stderr);

    res.json({
      success: true,
      message: 'Demo data seeded successfully!',
      output: stdout
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({
      error: 'Failed to seed demo data',
      message: error.message
    });
  }
});

export default router;
