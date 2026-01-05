# Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE appointment_db;

# Exit psql
\q
```

Initialize the database schema:

```bash
# Run the schema SQL file
psql -U postgres -d appointment_db -f config/schema.sql

# Or use the init script
npm run init-db
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointment_db
DB_USER=postgres
DB_PASSWORD=your_actual_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Create Admin User

Run the initialization script to create an admin user:

```bash
npm run init-db
```

This will create an admin user with:
- Email: `admin@example.com`
- Password: `admin123`

**Important:** Change these credentials after first login!

## Running the Server

### Development Mode

```bash
npm run dev
```

The server will start with nodemon for auto-reloading on file changes.

### Production Mode

```bash
npm start
```

## API Documentation

Once the server is running, access the Swagger API documentation at:

```
http://localhost:5000/api-docs
```

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users (Admin)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Professionals
- `GET /api/professionals` - Get all professionals
- `GET /api/professionals/:id` - Get professional details
- `POST /api/professionals` - Create professional profile
- `PUT /api/professionals/:id` - Update professional

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Analytics (New)
- `GET /api/analytics/overview` - Platform statistics
- `GET /api/analytics/appointments-trend` - Appointment trends
- `GET /api/analytics/user-growth` - User growth data
- `GET /api/analytics/professional-performance` - Professional metrics
- `GET /api/analytics/category-distribution` - Category distribution

### Export (New)
- `GET /api/export/users` - Export users as CSV
- `GET /api/export/appointments` - Export appointments as CSV
- `GET /api/export/professionals` - Export professionals as CSV

## Security Features

### Helmet
Adds security headers to protect against common vulnerabilities.

### Rate Limiting
Limits API requests to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

### CORS
Configured to allow requests only from the admin panel origin.

### JWT Authentication
Secure token-based authentication with configurable expiration.

## Testing

Test the API health:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Appointment Booking API is running",
  "timestamp": "2026-01-02T16:21:14.000Z"
}
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Check database credentials in `.env`

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 5000 is already in use, change the `PORT` in `.env`:

```env
PORT=5001
```

### Module Not Found Errors

Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Environment Variables

Set `NODE_ENV=production` in your production environment.

### Database

Use a managed PostgreSQL service or secure your own instance:
- Enable SSL connections
- Use strong passwords
- Restrict network access
- Regular backups

### Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated

## Logging

The server uses Morgan for HTTP request logging:
- **Development**: Concise colored output
- **Production**: Combined Apache-style logs

## Support

For issues or questions, refer to:
- API Documentation: http://localhost:5000/api-docs
- Project README: ../README.md
