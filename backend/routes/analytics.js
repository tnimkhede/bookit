const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get platform overview statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview data
 */
router.get('/overview', auth, async (req, res) => {
    try {
        // Get total counts
        const userStats = await pool.query(
            `SELECT 
                COUNT(*) as total_users,
                COUNT(*) FILTER (WHERE role = 'client') as total_clients,
                COUNT(*) FILTER (WHERE role = 'professional') as total_professionals,
                COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d
            FROM users`
        );

        const appointmentStats = await pool.query(
            `SELECT 
                COUNT(*) as total_appointments,
                COUNT(*) FILTER (WHERE status = 'booked') as booked,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_appointments_30d
            FROM appointments`
        );

        res.json({
            users: userStats.rows[0],
            appointments: appointmentStats.rows[0]
        });
    } catch (error) {
        console.error('Analytics overview error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
});

/**
 * @swagger
 * /api/analytics/appointments-trend:
 *   get:
 *     summary: Get appointment trends over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Appointment trend data
 */
router.get('/appointments-trend', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        const result = await pool.query(
            `SELECT 
                DATE(appointment_date) as date,
                COUNT(*) as count,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
            FROM appointments
            WHERE appointment_date >= NOW() - INTERVAL '${days} days'
            GROUP BY DATE(appointment_date)
            ORDER BY date ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Appointments trend error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments trend' });
    }
});

/**
 * @swagger
 * /api/analytics/user-growth:
 *   get:
 *     summary: Get user growth over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: User growth data
 */
router.get('/user-growth', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        const result = await pool.query(
            `SELECT 
                DATE(created_at) as date,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE role = 'client') as clients,
                COUNT(*) FILTER (WHERE role = 'professional') as professionals
            FROM users
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('User growth error:', error);
        res.status(500).json({ error: 'Failed to fetch user growth data' });
    }
});

/**
 * @swagger
 * /api/analytics/professional-performance:
 *   get:
 *     summary: Get professional performance metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Professional performance data
 */
router.get('/professional-performance', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                u.name,
                p.category,
                p.rating,
                COUNT(a.id) as total_appointments,
                COUNT(a.id) FILTER (WHERE a.status = 'completed') as completed_appointments,
                COUNT(a.id) FILTER (WHERE a.status = 'cancelled') as cancelled_appointments,
                ROUND(
                    COUNT(a.id) FILTER (WHERE a.status = 'completed')::numeric / 
                    NULLIF(COUNT(a.id), 0) * 100, 
                    2
                ) as completion_rate
            FROM professionals p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN appointments a ON p.id = a.professional_id
            GROUP BY u.name, p.category, p.rating
            ORDER BY total_appointments DESC
            LIMIT 20`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Professional performance error:', error);
        res.status(500).json({ error: 'Failed to fetch professional performance data' });
    }
});

/**
 * @swagger
 * /api/analytics/category-distribution:
 *   get:
 *     summary: Get distribution of professionals by category
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category distribution data
 */
router.get('/category-distribution', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                category,
                COUNT(*) as count,
                ROUND(AVG(rating), 2) as avg_rating
            FROM professionals
            GROUP BY category
            ORDER BY count DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Category distribution error:', error);
        res.status(500).json({ error: 'Failed to fetch category distribution' });
    }
});

module.exports = router;
