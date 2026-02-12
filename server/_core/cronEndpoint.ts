import { Router } from 'express';
import { executeAllCronJobs } from '../cronJobs';

export const cronRouter = Router();

/**
 * Endpoint for Vercel Cron to trigger automated tasks
 * Called every hour via Vercel Cron configuration
 */
cronRouter.post('/execute', async (req, res) => {
  try {
    console.log('[Cron Endpoint] Received cron trigger');
    
    // Execute all cron jobs
    const results = await executeAllCronJobs();
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('[Cron Endpoint] Error executing cron jobs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Manual trigger endpoint for testing (protected)
 * Can be called manually from consultant dashboard
 */
cronRouter.get('/test', async (req, res) => {
  try {
    console.log('[Cron Endpoint] Manual test trigger');
    
    const results = await executeAllCronJobs();
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      note: 'This is a test execution. In production, this runs automatically every hour.',
    });
  } catch (error) {
    console.error('[Cron Endpoint] Error in test execution:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
