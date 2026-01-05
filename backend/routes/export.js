const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');
const { formatCSV } = require('../utils/exportHelpers');

/**
 * @swagger
 * /api/export/users:
 *   get:
 *     summary: Export users data as CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv]
 *           default: csv
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/users', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                id,
                name,
                email,
                role,
                TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
            FROM users
            ORDER BY created_at DESC`
        );

        const csv = formatCSV(result.rows, ['id', 'name', 'email', 'role', 'created_at']);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({ error: 'Failed to export users data' });
    }
});

/**
 * @swagger
 * /api/export/appointments:
 *   get:
 *     summary: Export appointments data as CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv]
 *           default: csv
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/appointments', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                a.id,
                u_client.name as client_name,
                u_client.email as client_email,
                u_prof.name as professional_name,
                p.category,
                TO_CHAR(a.appointment_date, 'YYYY-MM-DD') as date,
                TO_CHAR(a.appointment_time, 'HH24:MI') as time,
                a.duration,
                a.status,
                a.purpose,
                TO_CHAR(a.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
            FROM appointments a
            JOIN users u_client ON a.client_id = u_client.id
            JOIN professionals p ON a.professional_id = p.id
            JOIN users u_prof ON p.user_id = u_prof.id
            ORDER BY a.created_at DESC`
        );

        const csv = formatCSV(result.rows, [
            'id', 'client_name', 'client_email', 'professional_name',
            'category', 'date', 'time', 'duration', 'status', 'purpose', 'created_at'
        ]);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=appointments.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export appointments error:', error);
        res.status(500).json({ error: 'Failed to export appointments data' });
    }
});

/**
 * @swagger
 * /api/export/professionals:
 *   get:
 *     summary: Export professionals data as CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv]
 *           default: csv
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/professionals', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                p.id,
                u.name,
                u.email,
                p.category,
                p.location,
                p.rating,
                p.appointment_duration,
                TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
            FROM professionals p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC`
        );

        const csv = formatCSV(result.rows, [
            'id', 'name', 'email', 'category', 'location',
            'rating', 'appointment_duration', 'created_at'
        ]);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=professionals.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export professionals error:', error);
        res.status(500).json({ error: 'Failed to export professionals data' });
    }
});

module.exports = router;
