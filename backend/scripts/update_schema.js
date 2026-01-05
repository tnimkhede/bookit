const pool = require('../config/database');

async function updateSchema() {
    try {
        console.log('Adding mobile column to users table...');
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);');
        console.log('Successfully added mobile column.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
