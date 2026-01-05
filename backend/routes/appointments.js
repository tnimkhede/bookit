const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

// @route   GET /api/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { status } = req.query;

        let query;
        let params;

        if (req.user.role === 'professional') {
            // Get professional's appointments
            const profResult = await pool.query(
                'SELECT id FROM professionals WHERE user_id = $1',
                [req.user.id]
            );

            if (profResult.rows.length === 0) {
                return res.json({ success: true, count: 0, data: [] });
            }

            const professionalId = profResult.rows[0].id;

            query = `
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.duration, a.purpose, a.status,
          u.name as client_name, u.id as client_id,
          p.category as professional_category,
          pu.name as professional_name
        FROM appointments a
        JOIN users u ON a.client_id = u.id
        JOIN professionals p ON a.professional_id = p.id
        JOIN users pu ON p.user_id = pu.id
        WHERE a.professional_id = $1
      `;
            params = [professionalId];
        } else {
            // Get client's appointments
            query = `
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.duration, a.purpose, a.status,
          u.name as client_name, u.id as client_id,
          p.category as professional_category, p.id as professional_id,
          pu.name as professional_name
        FROM appointments a
        JOIN professionals p ON a.professional_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN users u ON a.client_id = u.id
        WHERE a.client_id = $1
      `;
            params = [req.user.id];
        }

        if (status) {
            query += ` AND a.status = $${params.length + 1}`;
            params.push(status);
        }

        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

        const result = await pool.query(query, params);

        const appointments = result.rows.map(row => ({
            id: row.id.toString(),
            professionalId: row.professional_id?.toString(),
            professionalName: row.professional_name,
            professionalCategory: row.professional_category,
            clientId: row.client_id.toString(),
            clientName: row.client_name,
            date: row.appointment_date,
            time: row.appointment_time,
            duration: row.duration,
            purpose: row.purpose,
            status: row.status,
        }));

        res.json({
            success: true,
            count: appointments.length,
            data: appointments,
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment details
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
        a.id, a.appointment_date, a.appointment_time, a.duration, a.purpose, a.status,
        u.name as client_name, u.id as client_id,
        p.category as professional_category, p.id as professional_id,
        pu.name as professional_name
      FROM appointments a
      JOIN professionals p ON a.professional_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const row = result.rows[0];

        // Check authorization
        if (req.user.role === 'client' && row.client_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to view this appointment' });
        }

        if (req.user.role === 'professional') {
            const profResult = await pool.query(
                'SELECT id FROM professionals WHERE user_id = $1',
                [req.user.id]
            );
            if (profResult.rows.length === 0 || profResult.rows[0].id !== row.professional_id) {
                return res.status(403).json({ error: 'Not authorized to view this appointment' });
            }
        }

        const appointment = {
            id: row.id.toString(),
            professionalId: row.professional_id.toString(),
            professionalName: row.professional_name,
            professionalCategory: row.professional_category,
            clientId: row.client_id.toString(),
            clientName: row.client_name,
            date: row.appointment_date,
            time: row.appointment_time,
            duration: row.duration,
            purpose: row.purpose,
            status: row.status,
        };

        res.json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post(
    '/',
    [
        auth,
        body('professionalId').notEmpty().withMessage('Professional ID is required'),
        body('date').isDate().withMessage('Valid date is required'),
        body('time').notEmpty().withMessage('Time is required'),
        body('purpose').notEmpty().withMessage('Purpose is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { professionalId, date, time, purpose } = req.body;

            // Get professional details
            const profResult = await pool.query(
                'SELECT appointment_duration, category FROM professionals WHERE id = $1',
                [professionalId]
            );

            if (profResult.rows.length === 0) {
                return res.status(404).json({ error: 'Professional not found' });
            }

            const duration = profResult.rows[0].appointment_duration;
            const category = profResult.rows[0].category;

            // Special handling for Lawns
            if (category === 'Lawns') {
                // Check if date is already booked (ignore time)
                const conflictResult = await pool.query(
                    `SELECT id FROM appointments 
                     WHERE professional_id = $1 AND appointment_date = $2 
                     AND status IN ('booked', 'pending')`,
                    [professionalId, date]
                );

                if (conflictResult.rows.length > 0) {
                    return res.status(400).json({ error: 'Date is already booked' });
                }

                // Create appointment (force time to 00:00:00)
                const result = await pool.query(
                    `INSERT INTO appointments (professional_id, client_id, appointment_date, appointment_time, duration, purpose, status) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                    [professionalId, req.user.id, date, '00:00:00', 24 * 60, purpose, 'booked']
                );

                const appointmentId = result.rows[0].id;

                // Create notification (same as below)
                // ... (we can reuse the notification logic below if we structure it right, but for now let's just let it fall through or duplicate if needed)
                // Actually, let's just modify the variables and let the flow continue if possible, but the conflict check is different.
                // So we return here to avoid double insertion.

                // Create notification for professional
                const profUserResult = await pool.query(
                    'SELECT user_id FROM professionals WHERE id = $1',
                    [professionalId]
                );

                if (profUserResult.rows.length > 0) {
                    await pool.query(
                        `INSERT INTO notifications (user_id, title, message, type) 
                         VALUES ($1, $2, $3, $4)`,
                        [
                            profUserResult.rows[0].user_id,
                            'New Booking',
                            `${req.user.name} has booked your Lawn on ${date}`,
                            'confirmation',
                        ]
                    );
                }

                return res.status(201).json({
                    success: true,
                    data: { id: appointmentId },
                });
            }

            // Check if slot is available
            const conflictResult = await pool.query(
                `SELECT id FROM appointments 
         WHERE professional_id = $1 AND appointment_date = $2 AND appointment_time = $3 
         AND status IN ('booked', 'pending')`,
                [professionalId, date, time]
            );

            if (conflictResult.rows.length > 0) {
                return res.status(400).json({ error: 'Time slot is not available' });
            }

            // Create appointment
            const result = await pool.query(
                `INSERT INTO appointments (professional_id, client_id, appointment_date, appointment_time, duration, purpose, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [professionalId, req.user.id, date, time, duration, purpose, 'booked']
            );

            const appointmentId = result.rows[0].id;

            // Create notification for professional
            const profUserResult = await pool.query(
                'SELECT user_id FROM professionals WHERE id = $1',
                [professionalId]
            );

            if (profUserResult.rows.length > 0) {
                await pool.query(
                    `INSERT INTO notifications (user_id, title, message, type) 
           VALUES ($1, $2, $3, $4)`,
                    [
                        profUserResult.rows[0].user_id,
                        'New Appointment',
                        `${req.user.name} has booked an appointment with you on ${date} at ${time}`,
                        'confirmation',
                    ]
                );
            }

            res.status(201).json({
                success: true,
                data: { id: appointmentId },
            });
        } catch (error) {
            console.error('Create appointment error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// @route   PUT /api/appointments/:id
// @desc    Update appointment (reschedule)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, status } = req.body;

        // Get appointment
        const appointmentResult = await pool.query(
            'SELECT * FROM appointments WHERE id = $1',
            [id]
        );

        if (appointmentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const appointment = appointmentResult.rows[0];

        // Check authorization
        if (req.user.role === 'client' && appointment.client_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Update appointment
        const updates = [];
        const params = [];
        let paramCount = 1;

        if (date) {
            updates.push(`appointment_date = $${paramCount}`);
            params.push(date);
            paramCount++;
        }

        if (time) {
            updates.push(`appointment_time = $${paramCount}`);
            params.push(time);
            paramCount++;
        }

        if (status) {
            updates.push(`status = $${paramCount}`);
            params.push(status);
            paramCount++;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        params.push(id);

        const query = `UPDATE appointments SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

        await pool.query(query, params);

        res.json({
            success: true,
            message: 'Appointment updated successfully',
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Get appointment
        const appointmentResult = await pool.query(
            'SELECT * FROM appointments WHERE id = $1',
            [id]
        );

        if (appointmentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const appointment = appointmentResult.rows[0];

        // Check authorization
        if (req.user.role === 'client' && appointment.client_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Update status to cancelled instead of deleting
        await pool.query(
            'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['cancelled', id]
        );

        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
        });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
