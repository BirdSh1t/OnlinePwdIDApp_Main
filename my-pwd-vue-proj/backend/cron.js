const cron = require('node-cron');
import { pool } from '../config/database.js';

// Schedule the cron job
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('🧹 Running daily cleanup task...');
    const [result] = await pool.promise().query(`
      DELETE FROM pending_applications
      WHERE expires_at IS NOT NULL
        AND expires_at < NOW()
    `);
    console.log(`✅ Cleanup complete. Deleted ${result.affectedRows} expired pending applications.`);
  } catch (error) {
    console.error('❌ Failed to run cleanup:', error.message);
  }
});
