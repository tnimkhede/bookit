const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const result = await pool.query(
            'SELECT id, email, name, role FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = adminAuth;
