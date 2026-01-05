const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');
const { generateTimeSlots, isSlotAvailable, getDayOfWeek, formatTime12Hour } = require('../utils/timeSlots');

// @route   GET /api/professionals
// @desc    Get all professionals (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, location, search } = req.query;

        let query = `
      SELECT p.id, u.name, p.category, p.location, p.rating, p.about, p.appointment_duration
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

        if (location) {
            query += ` AND LOWER(p.location) LIKE LOWER($${paramCount})`;
            params.push(`%${location}%`);
            paramCount++;
        }

        if (search) {
            query += ` AND (LOWER(u.name) LIKE LOWER($${paramCount}) OR LOWER(p.category) LIKE LOWER($${paramCount}))`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY p.rating DESC';

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

// @route   GET /api/professionals/me
// @desc    Get current professional's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        if (req.user.role !== 'professional') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Get professional details
        const profResult = await pool.query(
            `SELECT p.id, u.name, p.category, p.location, p.rating, p.about, p.appointment_duration
       FROM professionals p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1`,
            [req.user.id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional profile not found' });
        }

        const professional = profResult.rows[0];
        const id = professional.id;

        // Get working hours
        const hoursResult = await pool.query(
            'SELECT day_of_week, start_time, end_time, is_working FROM working_hours WHERE professional_id = $1',
            [id]
        );

        professional.workingHours = hoursResult.rows.map(row => ({
            day: row.day_of_week,
            start: row.start_time,
            end: row.end_time,
            isWorking: row.is_working,
        }));

        // Get blocked dates
        const blockedResult = await pool.query(
            'SELECT blocked_date FROM blocked_dates WHERE professional_id = $1',
            [id]
        );

        professional.blockedDates = blockedResult.rows.map(row => row.blocked_date);

        res.json({
            success: true,
            data: professional,
        });
    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/professionals/:id
// @desc    Get professional details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get professional details
        const profResult = await pool.query(
            `SELECT p.id, u.name, p.category, p.location, p.rating, p.about, p.appointment_duration
       FROM professionals p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
            [id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        const professional = profResult.rows[0];

        // Get working hours
        const hoursResult = await pool.query(
            'SELECT day_of_week, start_time, end_time, is_working FROM working_hours WHERE professional_id = $1',
            [id]
        );

        professional.workingHours = hoursResult.rows.map(row => ({
            day: row.day_of_week,
            start: row.start_time,
            end: row.end_time,
            isWorking: row.is_working,
        }));

        // Get blocked dates
        const blockedResult = await pool.query(
            'SELECT blocked_date FROM blocked_dates WHERE professional_id = $1',
            [id]
        );

        professional.blockedDates = blockedResult.rows.map(row => row.blocked_date);

        res.json({
            success: true,
            data: professional,
        });
    } catch (error) {
        console.error('Get professional error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/professionals/:id/availability
// @desc    Get available time slots for a professional on a specific date
// @access  Public
router.get('/:id/availability', async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Get professional details
        const profResult = await pool.query(
            'SELECT appointment_duration, category FROM professionals WHERE id = $1',
            [id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        const duration = profResult.rows[0].appointment_duration;
        const category = profResult.rows[0].category; // Get category

        // Check if date is blocked
        const blockedResult = await pool.query(
            'SELECT id FROM blocked_dates WHERE professional_id = $1 AND blocked_date = $2',
            [id, date]
        );

        if (blockedResult.rows.length > 0) {
            return res.json({
                success: true,
                data: [],
                message: 'Professional is not available on this date',
            });
        }

        // Get working hours for the day
        const dayOfWeek = getDayOfWeek(date);
        const hoursResult = await pool.query(
            'SELECT start_time, end_time, is_working FROM working_hours WHERE professional_id = $1 AND day_of_week = $2',
            [id, dayOfWeek]
        );

        if (hoursResult.rows.length === 0 || !hoursResult.rows[0].is_working) {
            return res.json({
                success: true,
                data: [],
                message: 'Professional is not working on this day',
            });
        }

        const { start_time, end_time } = hoursResult.rows[0];

        // Generate all possible time slots
        const allSlots = generateTimeSlots(start_time, end_time, duration);

        // Get booked appointments for this date
        const bookedResult = await pool.query(
            `SELECT appointment_time, duration FROM appointments 
       WHERE professional_id = $1 AND appointment_date = $2 AND status IN ('booked', 'pending')`,
            [id, date]
        );

        const bookedSlots = bookedResult.rows.map(row => ({
            time: row.appointment_time,
            duration: row.duration,
        }));

        // Special handling for Lawns (Day-wise booking)
        if (category === 'Lawns') {
            const bookedResult = await pool.query(
                `SELECT id FROM appointments 
                 WHERE professional_id = $1 AND appointment_date = $2 AND status IN ('booked', 'pending')`,
                [id, date]
            );

            const isBooked = bookedResult.rows.length > 0;

            return res.json({
                success: true,
                data: [{
                    time: "Full Day",
                    timeValue: "00:00:00",
                    available: !isBooked
                }]
            });
        }

        // Filter available slots
        const availableSlots = allSlots.map(slot => ({
            time: formatTime12Hour(slot),
            timeValue: slot,
            available: isSlotAvailable(bookedSlots, slot, duration),
        }));

        res.json({
            success: true,
            data: availableSlots,
        });
    } catch (error) {
        console.error('Get availability error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/professionals
// @desc    Create professional profile (for professional users)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'professional') {
            return res.status(403).json({ error: 'Only professional users can create profiles' });
        }

        const { category, location, about, appointmentDuration, workingHours } = req.body;

        // Check if professional profile already exists
        const existingProf = await pool.query(
            'SELECT id FROM professionals WHERE user_id = $1',
            [req.user.id]
        );

        if (existingProf.rows.length > 0) {
            return res.status(400).json({ error: 'Professional profile already exists' });
        }

        // Create professional profile
        const profResult = await pool.query(
            `INSERT INTO professionals (user_id, category, location, about, appointment_duration) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [req.user.id, category, location, about, appointmentDuration || 30]
        );

        const professionalId = profResult.rows[0].id;

        // Add working hours
        if (workingHours && Array.isArray(workingHours)) {
            for (const wh of workingHours) {
                await pool.query(
                    `INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time, is_working) 
           VALUES ($1, $2, $3, $4, $5)`,
                    [professionalId, wh.day, wh.start, wh.end, wh.isWorking]
                );
            }
        }

        res.status(201).json({
            success: true,
            data: { id: professionalId },
        });
    } catch (error) {
        console.error('Create professional error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/professionals/:id
// @desc    Update professional profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { category, location, about, appointmentDuration } = req.body;

        // Verify ownership
        const profResult = await pool.query(
            'SELECT user_id FROM professionals WHERE id = $1',
            [id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        if (profResult.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this profile' });
        }

        // Update professional profile
        const updates = [];
        const params = [];
        let paramCount = 1;

        if (category) {
            updates.push(`category = $${paramCount}`);
            params.push(category);
            paramCount++;
        }

        if (location) {
            updates.push(`location = $${paramCount}`);
            params.push(location);
            paramCount++;
        }

        if (about) {
            updates.push(`about = $${paramCount}`);
            params.push(about);
            paramCount++;
        }

        if (appointmentDuration) {
            updates.push(`appointment_duration = $${paramCount}`);
            params.push(appointmentDuration);
            paramCount++;
        }

        if (updates.length > 0) {
            updates.push(`updated_at = CURRENT_TIMESTAMP`);
            params.push(id);

            const query = `UPDATE professionals SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
            await pool.query(query, params);
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Update professional error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/professionals/:id/working-hours
// @desc    Update working hours
// @access  Private
router.put('/:id/working-hours', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { workingHours } = req.body;

        // Verify ownership
        const profResult = await pool.query(
            'SELECT user_id FROM professionals WHERE id = $1',
            [id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        if (profResult.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (!workingHours || !Array.isArray(workingHours)) {
            return res.status(400).json({ error: 'Working hours array is required' });
        }

        // Delete existing working hours
        await pool.query('DELETE FROM working_hours WHERE professional_id = $1', [id]);

        // Insert new working hours
        for (const wh of workingHours) {
            await pool.query(
                `INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time, is_working) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, wh.day, wh.start, wh.end, wh.isWorking]
            );
        }

        res.json({
            success: true,
            message: 'Working hours updated successfully',
        });
    } catch (error) {
        console.error('Update working hours error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/professionals/:id/blocked-dates
// @desc    Add blocked date
// @access  Private
router.post('/:id/blocked-dates', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;

        // Verify ownership
        const profResult = await pool.query(
            'SELECT user_id FROM professionals WHERE id = $1',
            [id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        if (profResult.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Check if date is already blocked
        const existing = await pool.query(
            'SELECT id FROM blocked_dates WHERE professional_id = $1 AND blocked_date = $2',
            [id, date]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Date is already blocked' });
        }

        // Add blocked date
        const result = await pool.query(
            'INSERT INTO blocked_dates (professional_id, blocked_date) VALUES ($1, $2) RETURNING id',
            [id, date]
        );

        res.status(201).json({
            success: true,
            data: { id: result.rows[0].id },
        });
    } catch (error) {
        console.error('Add blocked date error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/professionals/:id/blocked-dates/:dateId
// @desc    Remove blocked date
// @access  Private
router.delete('/:id/blocked-dates/:dateId', auth, async (req, res) => {
    try {
        const { id, dateId } = req.params;

        // Verify ownership
        const profResult = await pool.query(
            'SELECT user_id FROM professionals WHERE id = $1',
            [id]
        );

        if (profResult.rows.length === 0) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        if (profResult.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Delete blocked date
        const result = await pool.query(
            'DELETE FROM blocked_dates WHERE id = $1 AND professional_id = $2',
            [dateId, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Blocked date not found' });
        }

        res.json({
            success: true,
            message: 'Blocked date removed successfully',
        });
    } catch (error) {
        console.error('Remove blocked date error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
