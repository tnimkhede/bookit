const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Appointment Booking API',
            version: '1.0.0',
            description: 'RESTful API for appointment booking application with authentication, professional management, and appointment scheduling',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        name: { type: 'string', example: 'John Smith' },
                        role: { type: 'string', enum: ['client', 'professional'], example: 'client' },
                    },
                },
                Professional: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Dr. Sarah Johnson' },
                        category: { type: 'string', example: 'Doctor' },
                        location: { type: 'string', example: 'New York, NY' },
                        rating: { type: 'number', format: 'float', example: 4.9 },
                        about: { type: 'string', example: 'Board-certified physician with 15 years of experience' },
                        appointment_duration: { type: 'integer', example: 30 },
                    },
                },
                Appointment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        professionalId: { type: 'string', example: '1' },
                        professionalName: { type: 'string', example: 'Dr. Sarah Johnson' },
                        professionalCategory: { type: 'string', example: 'Doctor' },
                        clientId: { type: 'string', example: '1' },
                        clientName: { type: 'string', example: 'John Smith' },
                        date: { type: 'string', format: 'date', example: '2025-12-25' },
                        time: { type: 'string', example: '10:00 AM' },
                        duration: { type: 'integer', example: 30 },
                        purpose: { type: 'string', example: 'Annual health checkup' },
                        status: { type: 'string', enum: ['booked', 'completed', 'cancelled', 'pending'], example: 'booked' },
                    },
                },
                Notification: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        title: { type: 'string', example: 'Appointment Reminder' },
                        message: { type: 'string', example: 'Your appointment is tomorrow at 10:00 AM' },
                        type: { type: 'string', enum: ['reminder', 'confirmation', 'cancellation', 'update'], example: 'reminder' },
                        read: { type: 'boolean', example: false },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                TimeSlot: {
                    type: 'object',
                    properties: {
                        time: { type: 'string', example: '10:00 AM' },
                        timeValue: { type: 'string', example: '10:00' },
                        available: { type: 'boolean', example: true },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string', example: 'Error message' },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation successful' },
                    },
                },
            },
        },
        tags: [
            { name: 'Authentication', description: 'User authentication endpoints' },
            { name: 'Professionals', description: 'Professional management endpoints' },
            { name: 'Appointments', description: 'Appointment booking and management' },
            { name: 'Notifications', description: 'User notification management' },
        ],
    },
    apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
