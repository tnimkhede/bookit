const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, message, type, read, created_at 
       FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        const notifications = result.rows.map(row => ({
            id: row.id.toString(),
            title: row.title,
            message: row.message,
            type: row.type,
            read: row.read,
            timestamp: row.created_at,
        }));

        res.json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if notification belongs to user
        const checkResult = await pool.query(
            'SELECT id FROM notifications WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Mark as read
        await pool.query(
            'UPDATE notifications SET read = true WHERE id = $1',
            [id]
        );

        res.json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if notification belongs to user
        const checkResult = await pool.query(
            'SELECT id FROM notifications WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Delete notification
        await pool.query('DELETE FROM notifications WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
