const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // PostgreSQL unique constraint violation
    if (err.code === '23505') {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        error.message = 'Referenced resource not found';
        error.statusCode = 404;
    }

    // PostgreSQL invalid input syntax
    if (err.code === '22P02') {
        error.message = 'Invalid input format';
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
