# Swagger API Documentation

## Access the Documentation

Once the server is running, access the interactive API documentation at:

**http://localhost:5000/api-docs**

## Features

### Interactive API Testing
- Test all endpoints directly from the browser
- No need for external tools like Postman
- Real-time request/response examples

### Authentication
1. Click the **Authorize** button (🔒) at the top right
2. Enter your JWT token in the format: `Bearer YOUR_TOKEN`
3. Click **Authorize** to save
4. All protected endpoints will now include your token

### Getting a Token

1. Use the `/api/auth/login` endpoint
2. Enter credentials:
   - Email: `john@example.com`
   - Password: `password123`
3. Copy the `token` from the response
4. Use it in the Authorize dialog

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (🔒 Protected)

### Professionals
- `GET /api/professionals` - List all professionals
- `GET /api/professionals/{id}` - Get professional details
- `GET /api/professionals/{id}/availability` - Get available time slots

### Appointments
- `GET /api/appointments` - List user appointments (🔒 Protected)
- `POST /api/appointments` - Create appointment (🔒 Protected)
- `GET /api/appointments/{id}` - Get appointment details (🔒 Protected)
- `PUT /api/appointments/{id}` - Update appointment (🔒 Protected)
- `DELETE /api/appointments/{id}` - Cancel appointment (🔒 Protected)

### Notifications
- `GET /api/notifications` - List notifications (🔒 Protected)
- `PUT /api/notifications/{id}/read` - Mark as read (🔒 Protected)
- `DELETE /api/notifications/{id}` - Delete notification (🔒 Protected)

## Quick Test Flow

### 1. Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Authorize
Copy the token and click the Authorize button

### 3. Get Professionals
```
GET /api/professionals
```

### 4. Check Availability
```
GET /api/professionals/1/availability?date=2025-12-25
```

### 5. Book Appointment
```
POST /api/appointments
{
  "professionalId": 1,
  "date": "2025-12-25",
  "time": "10:00",
  "purpose": "Consultation"
}
```

## Schema Definitions

All request and response schemas are documented in the Swagger UI. Click on any endpoint to see:
- Required parameters
- Request body schema
- Response formats
- Example values

## Tips

- 🔒 Icon indicates protected endpoints requiring authentication
- Use the "Try it out" button to test endpoints
- Check the "Responses" section for status codes and examples
- Use query parameters for filtering (category, location, search, status)
