const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bookit_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const lawns = [
    {
        name: "Green Valley Lawns",
        email: "greenvalley@example.com",
        mobile: "9876543210",
        location: "123 Nature Road, Pune",
        about: "Beautiful lush green lawns perfect for weddings and parties. Capacity: 500 guests.",
        category: "Lawns",
        price: 15000
    },
    {
        name: "Sunset Garden Lawns",
        email: "sunset@example.com",
        mobile: "9876543211",
        location: "456 Hill Top, Pune",
        about: "Scenic view with sunset point. Ideal for evening events. Capacity: 300 guests.",
        category: "Lawns",
        price: 20000
    },
    {
        name: "Royal Palace Lawns",
        email: "royal@example.com",
        mobile: "9876543212",
        location: "789 Palace Road, Pune",
        about: "Grand royal experience for your special day. Capacity: 1000 guests.",
        category: "Lawns",
        price: 50000
    }
];

async function populateLawns() {
    const client = await pool.connect();

    try {
        console.log('Starting to populate Lawns...');
        await client.query('BEGIN');

        const hashedPassword = await bcrypt.hash('password123', 10);

        for (const lawn of lawns) {
            // Check if user exists
            const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [lawn.email]);

            if (userCheck.rows.length > 0) {
                console.log(`User ${lawn.name} already exists, skipping...`);
                continue;
            }

            // Create User
            const userResult = await client.query(
                'INSERT INTO users (email, password, name, mobile, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [lawn.email, hashedPassword, lawn.name, lawn.mobile, 'professional']
            );
            const userId = userResult.rows[0].id;

            // Create Professional Profile
            const profResult = await client.query(
                `INSERT INTO professionals (user_id, category, location, about, appointment_duration) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [userId, lawn.category, lawn.location, lawn.about, 24 * 60] // 24 hours duration for full day
            );
            const professionalId = profResult.rows[0].id;

            // Add default working hours (All days)
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (const day of days) {
                await client.query(
                    `INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time, is_working) 
           VALUES ($1, $2, $3, $4, $5)`,
                    [professionalId, day, '00:00', '23:59', true]
                );
            }

            console.log(`Created Lawn: ${lawn.name}`);
        }

        await client.query('COMMIT');
        console.log('Successfully populated Lawns!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error populating lawns:', error);
    } finally {
        client.release();
        pool.end();
    }
}

populateLawns();
