/**
 * Format data as CSV
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of header names
 * @returns {string} CSV formatted string
 */
function formatCSV(data, headers) {
    if (!data || data.length === 0) {
        return headers.join(',') + '\n';
    }

    // Create header row
    const headerRow = headers.join(',');

    // Create data rows
    const dataRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];

            // Handle null/undefined
            if (value === null || value === undefined) {
                return '';
            }

            // Convert to string and escape quotes
            const stringValue = String(value).replace(/"/g, '""');

            // Wrap in quotes if contains comma, newline, or quote
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                return `"${stringValue}"`;
            }

            return stringValue;
        }).join(',');
    });

    return headerRow + '\n' + dataRows.join('\n');
}

/**
 * Escape CSV value
 * @param {any} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCSVValue(value) {
    if (value === null || value === undefined) {
        return '';
    }

    const stringValue = String(value).replace(/"/g, '""');

    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue}"`;
    }

    return stringValue;
}

module.exports = {
    formatCSV,
    escapeCSVValue
};
