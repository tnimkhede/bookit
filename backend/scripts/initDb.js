const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting database initialization...\n');

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../config/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('📋 Creating tables...');
        await client.query(schema);
        console.log('✓ Tables created successfully\n');

        // Seed initial data
        console.log('🌱 Seeding initial data...\n');

        // Create sample users
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Insert client users
        const clientResult = await client.query(
            `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
            ['john@example.com', hashedPassword, 'John Smith', 'client']
        );
        console.log('✓ Created client user: john@example.com');

        // Insert admin user
        const adminResult = await client.query(
            `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
            ['admin@appointmentapp.com', hashedPassword, 'Super Admin', 'admin']
        );
        console.log('✓ Created admin user: admin@appointmentapp.com');

        // Insert professional users
        const professionals = [
            { email: 'sarah.johnson@example.com', name: 'Dr. Sarah Johnson', category: 'Doctor', location: 'New York, NY', about: 'Board-certified physician with 15 years of experience in general medicine and preventive care.', duration: 30 },
            { email: 'michael.chen@example.com', name: 'Michael Chen', category: 'Salon', location: 'Los Angeles, CA', about: 'Celebrity hairstylist specializing in modern cuts and color treatments.', duration: 45 },
            { email: 'jennifer.williams@example.com', name: 'Jennifer Williams', category: 'Lawyer', location: 'Chicago, IL', about: 'Corporate attorney with expertise in business law, contracts, and intellectual property.', duration: 60 },
            { email: 'david.park@example.com', name: 'David Park', category: 'Consultant', location: 'San Francisco, CA', about: 'Business strategy consultant helping startups scale and enterprise companies innovate.', duration: 60 },
            { email: 'emily.rodriguez@example.com', name: 'Emily Rodriguez', category: 'Tutor', location: 'Boston, MA', about: 'Mathematics and science tutor with PhD in Physics. Specializing in SAT/ACT prep.', duration: 60 },
        ];

        for (const prof of professionals) {
            const userResult = await client.query(
                `INSERT INTO users (email, password, name, role) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
                [prof.email, hashedPassword, prof.name, 'professional']
            );

            const userId = userResult.rows[0].id;

            const profResult = await client.query(
                `INSERT INTO professionals (user_id, category, location, rating, about, appointment_duration) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [userId, prof.category, prof.location, 4.8, prof.about, prof.duration]
            );

            const profId = profResult.rows[0].id;

            // Add working hours (Monday to Friday 9-5 for simplicity)
            const workingHours = [
                { day: 'Monday', start: '09:00', end: '17:00', working: true },
                { day: 'Tuesday', start: '09:00', end: '17:00', working: true },
                { day: 'Wednesday', start: '09:00', end: '17:00', working: true },
                { day: 'Thursday', start: '09:00', end: '17:00', working: true },
                { day: 'Friday', start: '09:00', end: '17:00', working: true },
                { day: 'Saturday', start: '10:00', end: '14:00', working: true },
                { day: 'Sunday', start: null, end: null, working: false },
            ];

            for (const wh of workingHours) {
                await client.query(
                    `INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time, is_working) 
           VALUES ($1, $2, $3, $4, $5)`,
                    [profId, wh.day, wh.start, wh.end, wh.working]
                );
            }

            console.log(`✓ Created professional: ${prof.name}`);
        }

        // Create sample appointments
        const appointmentsData = [
            { profEmail: 'sarah.johnson@example.com', date: '2025-12-20', time: '10:00', duration: 30, purpose: 'Annual health checkup', status: 'booked' },
            { profEmail: 'michael.chen@example.com', date: '2025-12-22', time: '14:00', duration: 45, purpose: 'Haircut and styling', status: 'booked' },
            { profEmail: 'david.park@example.com', date: '2025-12-15', time: '15:00', duration: 60, purpose: 'Business strategy consultation', status: 'completed' },
        ];

        for (const apt of appointmentsData) {
            const profUser = await client.query(
                'SELECT p.id FROM professionals p JOIN users u ON p.user_id = u.id WHERE u.email = $1',
                [apt.profEmail]
            );

            if (profUser.rows.length > 0) {
                await client.query(
                    `INSERT INTO appointments (professional_id, client_id, appointment_date, appointment_time, duration, purpose, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [profUser.rows[0].id, clientResult.rows[0].id, apt.date, apt.time, apt.duration, apt.purpose, apt.status]
                );
            }
        }
        console.log('✓ Created sample appointments\n');

        // Create sample notifications
        await client.query(
            `INSERT INTO notifications (user_id, title, message, type, read) 
       VALUES ($1, $2, $3, $4, $5)`,
            [clientResult.rows[0].id, 'Appointment Reminder', 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM', 'reminder', false]
        );
        console.log('✓ Created sample notifications\n');

        console.log('✅ Database initialization completed successfully!');
        console.log('\n📝 Sample credentials:');
        console.log('   Client: john@example.com / password123');
        console.log('   Professional: sarah.johnson@example.com / password123');
        console.log('   Admin: admin@appointmentapp.com / password123\n');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run initialization
initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
