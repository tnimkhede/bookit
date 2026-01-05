# Appointment Booking Backend API

Node.js backend API for the appointment booking application with PostgreSQL database.

## Features

- 🔐 JWT-based authentication
- 👥 User management (clients and professionals)
- 📅 Appointment booking and management
- 🔔 Notifications system
- ⏰ Time slot availability checking
- 🏥 Professional profiles with working hours

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

Make sure PostgreSQL is installed and running on your system.

**Option 1: Using the setup script (Recommended)**

Run the provided setup script:
```bash
cd backend
./scripts/setup-db.sh
```

This will create the database and set the postgres user password.

**Option 2: Manual setup**

Create the database manually:
```bash
sudo -u postgres createdb appointement
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '123456';"
```

**Option 3: Using psql directly**

```bash
sudo -u postgres psql
CREATE DATABASE appointement;
ALTER USER postgres PASSWORD '123456';
\q
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Environment Configuration

The `.env` file is already configured with:
- Database name: `appointement`
- Database password: `123456`
- Local PostgreSQL connection

If you need to modify these settings, edit the `.env` file.

### 4. Initialize Database

Run the initialization script to create tables and seed sample data:

```bash
npm run init-db
```

This will create all necessary tables and add sample users:
- **Client**: `john@example.com` / `password123`
- **Professional**: `sarah.johnson@example.com` / `password123`

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Interactive API Documentation

Access the **Swagger UI** documentation at:

**http://localhost:5000/api-docs**

The Swagger documentation provides:
- Interactive API testing interface
- Complete endpoint documentation
- Request/response schemas
- Authentication support
- Try-it-out functionality

See [SWAGGER.md](./SWAGGER.md) for detailed usage instructions.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Professionals
- `GET /api/professionals` - List all professionals (with filters)
- `GET /api/professionals/:id` - Get professional details
- `GET /api/professionals/:id/availability` - Get available time slots
- `POST /api/professionals` - Create professional profile (protected)

### Appointments
- `GET /api/appointments` - List user appointments (protected)
- `GET /api/appointments/:id` - Get appointment details (protected)
- `POST /api/appointments` - Create new appointment (protected)
- `PUT /api/appointments/:id` - Update appointment (protected)
- `DELETE /api/appointments/:id` - Cancel appointment (protected)

### Notifications
- `GET /api/notifications` - List user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

## API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get professionals
```bash
curl http://localhost:5000/api/professionals
```

### Create appointment (requires authentication)
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "professionalId": "1",
    "date": "2025-12-25",
    "time": "10:00",
    "purpose": "Consultation"
  }'
```

## Database Schema

### Tables
- **users** - User accounts (clients and professionals)
- **professionals** - Professional profiles
- **working_hours** - Professional working schedules
- **blocked_dates** - Professional unavailable dates
- **appointments** - Appointment bookings
- **notifications** - User notifications

## Project Structure

```
backend/
├── config/
│   ├── database.js       # PostgreSQL connection
│   └── schema.sql        # Database schema
├── middleware/
│   ├── auth.js           # JWT authentication
│   └── errorHandler.js   # Error handling
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── professionals.js  # Professional routes
│   ├── appointments.js   # Appointment routes
│   └── notifications.js  # Notification routes
├── scripts/
│   └── initDb.js         # Database initialization
├── utils/
│   └── timeSlots.js      # Time slot utilities
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── server.js             # Main server file
└── README.md
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if the database `appointement` exists

### Port already in use
- Change the PORT in `.env` file
- Or kill the process using port 5000

### Authentication errors
- Make sure to include the JWT token in the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`

## License

ISC
