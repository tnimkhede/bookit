const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/admin/stats/overview
// @desc    Get platform overview statistics
// @access  Admin only
router.get('/stats/overview', adminAuth, async (req, res) => {
    try {
        // Get total users count
        const usersResult = await pool.query('SELECT COUNT(*) FROM users');
        const totalUsers = parseInt(usersResult.rows[0].count);

        // Get clients count
        const clientsResult = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'client'");
        const totalClients = parseInt(clientsResult.rows[0].count);

        // Get professionals count
        const professionalsResult = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'professional'");
        const totalProfessionals = parseInt(professionalsResult.rows[0].count);

        // Get total appointments count
        const appointmentsResult = await pool.query('SELECT COUNT(*) FROM appointments');
        const totalAppointments = parseInt(appointmentsResult.rows[0].count);

        // Get appointments by status
        const statusResult = await pool.query(
            `SELECT status, COUNT(*) as count FROM appointments GROUP BY status`
        );
        const appointmentsByStatus = statusResult.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                totalUsers,
                totalClients,
                totalProfessionals,
                totalAppointments,
                pendingAppointments: appointmentsByStatus.pending || 0,
                bookedAppointments: appointmentsByStatus.booked || 0,
                completedAppointments: appointmentsByStatus.completed || 0,
                cancelledAppointments: appointmentsByStatus.cancelled || 0,
            },
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users with optional filters
// @access  Admin only
router.get('/users', adminAuth, async (req, res) => {
    try {
        const { role, search } = req.query;

        let query = 'SELECT id, email, name, mobile, role, created_at FROM users WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (role && role !== 'all') {
            query += ` AND role = $${paramCount}`;
            params.push(role);
            paramCount++;
        }

        if (search) {
            query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(email) LIKE LOWER($${paramCount}))`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/admin/professionals
// @desc    Get all professionals with details
// @access  Admin only
router.get('/professionals', adminAuth, async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = `
      SELECT p.id, u.name, u.email, u.mobile, p.category, p.location, p.rating, p.about, 
             p.appointment_duration, p.created_at,
             (SELECT COUNT(*) FROM appointments WHERE professional_id = p.id) as total_appointments
      FROM professionals p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (category && category !== 'all') {
            query += ` AND LOWER(p.category) = LOWER($${paramCount})`;
            params.push(category);
            paramCount++;
        }

        if (search) {
            query += ` AND (LOWER(u.name) LIKE LOWER($${paramCount}) OR LOWER(p.category) LIKE LOWER($${paramCount}))`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY p.created_at DESC';

        const result = await pool.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error('Get professionals error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/admin/professionals
// @desc    Create a new professional (User + Profile)
// @access  Admin only
router.post('/professionals', adminAuth, async (req, res) => {
    const client = await pool.connect();
    try {
        const { email, password, name, mobile, category, location, about, appointmentDuration } = req.body;

        // Validation
        if (!email || !password || !name || !category || !location) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        await client.query('BEGIN');

        // 1. Check if user exists
        const userExists = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Create User
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await client.query(
            'INSERT INTO users (email, password, name, mobile, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [email, hashedPassword, name, mobile || null, 'professional']
        );
        const userId = userResult.rows[0].id;

        // 3. Create Professional Profile
        const profResult = await client.query(
            `INSERT INTO professionals (user_id, category, location, about, appointment_duration) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, category, location, about || '', appointmentDuration || 30]
        );
        const professionalId = profResult.rows[0].id;

        // 4. Add default working hours (Mon-Fri, 9-5)
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        for (const day of days) {
            await client.query(
                `INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time, is_working) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [professionalId, day, '09:00', '17:00', true]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Professional created successfully',
            data: {
                id: professionalId,
                userId,
                name,
                email,
                mobile,
                category
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create professional error:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// @route   GET /api/admin/clients
// @desc    Get all clients
// @access  Admin only
router.get('/clients', adminAuth, async (req, res) => {
    try {
        const { search } = req.query;

        let query = `
      SELECT u.id, u.name, u.email, u.mobile, u.created_at,
             (SELECT COUNT(*) FROM appointments WHERE client_id = u.id) as total_appointments,
             (SELECT MAX(appointment_date) FROM appointments WHERE client_id = u.id) as last_appointment
      FROM users u
      WHERE u.role = 'client'
    `;
        const params = [];
        let paramCount = 1;

        if (search) {
            query += ` AND (LOWER(u.name) LIKE LOWER($${paramCount}) OR LOWER(u.email) LIKE LOWER($${paramCount}))`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY u.created_at DESC';

        const result = await pool.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/admin/appointments
// @desc    Get all appointments
// @access  Admin only
router.get('/appointments', adminAuth, async (req, res) => {
    try {
        const { status, search } = req.query;

        let query = `
      SELECT a.id, a.appointment_date, a.appointment_time, a.duration, a.purpose, a.status, a.created_at,
             u1.name as client_name, u1.email as client_email, u1.mobile as client_mobile,
             u2.name as professional_name, u2.email as professional_email, u2.mobile as professional_mobile,
             p.category as professional_category
      FROM appointments a
      JOIN users u1 ON a.client_id = u1.id
      JOIN professionals prof ON a.professional_id = prof.id
      JOIN users u2 ON prof.user_id = u2.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (status && status !== 'all') {
            query += ` AND a.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (search) {
            query += ` AND (LOWER(u1.name) LIKE LOWER($${paramCount}) OR LOWER(u2.name) LIKE LOWER($${paramCount}))`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

        const result = await pool.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/admin/appointments/:id
// @desc    Update appointment status
// @access  Admin only
router.put('/appointments/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const result = await pool.query(
            'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/admin/appointments/:id
// @desc    Delete appointment
// @access  Admin only
router.delete('/appointments/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM appointments WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({
            success: true,
            message: 'Appointment deleted successfully',
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin only
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
