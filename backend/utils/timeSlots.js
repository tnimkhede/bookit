/**
 * Generate time slots for a given date based on working hours
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {number} duration - Appointment duration in minutes
 * @returns {Array} Array of time slots
 */
function generateTimeSlots(startTime, endTime, duration) {
    const slots = [];

    if (!startTime || !endTime) {
        return slots;
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentTime = startHour * 60 + startMin; // Convert to minutes
    const endTimeMinutes = endHour * 60 + endMin;

    while (currentTime + duration <= endTimeMinutes) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        slots.push(timeString);
        currentTime += duration;
    }

    return slots;
}

/**
 * Format time from 24h to 12h format
 * @param {string} time - Time in HH:MM format
 * @returns {string} Time in 12h format
 */
function formatTime12Hour(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Check if a time slot is available
 * @param {Array} bookedSlots - Array of booked time slots
 * @param {string} slot - Time slot to check
 * @param {number} duration - Appointment duration
 * @returns {boolean} True if available
 */
function isSlotAvailable(bookedSlots, slot, duration) {
    const [slotHour, slotMin] = slot.split(':').map(Number);
    const slotStart = slotHour * 60 + slotMin;
    const slotEnd = slotStart + duration;

    for (const booked of bookedSlots) {
        const [bookedHour, bookedMin] = booked.time.split(':').map(Number);
        const bookedStart = bookedHour * 60 + bookedMin;
        const bookedEnd = bookedStart + booked.duration;

        // Check for overlap
        if (slotStart < bookedEnd && slotEnd > bookedStart) {
            return false;
        }
    }

    return true;
}

/**
 * Get day of week from date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {string} Day of week
 */
function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(date);
    return days[d.getDay()];
}

module.exports = {
    generateTimeSlots,
    formatTime12Hour,
    isSlotAvailable,
    getDayOfWeek,
};
