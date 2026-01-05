# Project Structure Overview

## AppointHub - Appointment Booking Platform

This project consists of two main components:
1. **Backend** - Node.js/Express REST API
2. **Admin Panel** - React.js admin dashboard

---

## Directory Structure

```
HardcodedStyling/
├── backend/                    # Node.js Backend
│   ├── config/                 # Configuration files
│   │   ├── database.js         # PostgreSQL connection
│   │   ├── schema.sql          # Database schema
│   │   └── swagger.js          # API documentation config
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── validate.js         # Request validation
│   ├── routes/                 # API routes
│   │   ├── admin.js            # Admin endpoints
│   │   ├── analytics.js        # Analytics endpoints (NEW)
│   │   ├── appointments.js     # Appointment management
│   │   ├── auth.js             # Authentication
│   │   ├── export.js           # Data export (NEW)
│   │   ├── notifications.js    # Notifications
│   │   └── professionals.js    # Professional management
│   ├── scripts/                # Utility scripts
│   │   └── initDb.js           # Database initialization
│   ├── utils/                  # Utility functions
│   │   └── exportHelpers.js    # CSV export helpers (NEW)
│   ├── .env.example            # Environment template (NEW)
│   ├── package.json            # Dependencies
│   ├── server.js               # Express server
│   ├── SETUP.md                # Setup instructions (NEW)
│   └── README.md               # Backend documentation
│
├── admin_panel/                # React Admin Panel
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Header.jsx      # Top navigation (NEW)
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.jsx     # Side navigation (UPDATED)
│   │   │   ├── Sidebar.css
│   │   │   ├── Layout.jsx      # Main layout (UPDATED)
│   │   │   ├── Layout.css
│   │   │   ├── StatsCard.jsx   # Stats component (NEW)
│   │   │   └── StatsCard.css
│   │   ├── contexts/           # React contexts
│   │   │   └── ThemeContext.jsx # Theme management (NEW)
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useTheme.js     # Theme hook (NEW)
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx   # Main dashboard (UPDATED)
│   │   │   ├── Dashboard.css
│   │   │   ├── Users.jsx       # User management
│   │   │   ├── Users.css
│   │   │   ├── Professionals.jsx # Professional management
│   │   │   ├── Appointments.jsx # Appointment management
│   │   │   ├── Analytics.jsx   # Analytics page (NEW)
│   │   │   ├── Analytics.css
│   │   │   ├── Settings.jsx    # Settings page (NEW)
│   │   │   ├── Settings.css
│   │   │   ├── Login.jsx       # Login page (UPDATED)
│   │   │   └── Login.css
│   │   ├── services/           # API services
│   │   │   ├── api.js          # Base API client
│   │   │   ├── index.js        # Service exports
│   │   │   └── analyticsService.js # Analytics API (NEW)
│   │   ├── App.jsx             # Main app (UPDATED)
│   │   ├── App.css
│   │   ├── index.css           # Global styles (UPDATED)
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Dependencies (UPDATED)
│   ├── vite.config.js          # Vite configuration
│   ├── SETUP.md                # Setup instructions (NEW)
│   └── README.md               # Admin panel docs
│
└── PROJECT_STRUCTURE.md        # This file (NEW)
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Logging**: Morgan
- **Compression**: compression middleware

### Admin Panel
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **Styling**: CSS with CSS Variables

---

## Key Features

### Backend Features
✅ User authentication (JWT)
✅ Role-based access control (client, professional, admin)
✅ Appointment booking and management
✅ Professional profiles with working hours
✅ Notification system
✅ Admin dashboard with statistics
✅ **Analytics endpoints** (NEW)
✅ **Data export (CSV)** (NEW)
✅ **Security enhancements** (NEW)
✅ **Rate limiting** (NEW)
✅ **Response compression** (NEW)
✅ API documentation (Swagger)

### Admin Panel Features
✅ Modern, responsive UI
✅ **Dark/Light theme toggle** (NEW)
✅ User management
✅ Professional approval workflow
✅ Appointment oversight
✅ **Interactive analytics dashboard** (NEW)
✅ **Data visualization with charts** (NEW)
✅ **Settings page** (NEW)
✅ **Export functionality** (NEW)
✅ **Smooth animations** (NEW)
✅ **Glassmorphism design** (NEW)

---

## Design System

### Color Palette
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Secondary**: Pink gradient (#f093fb → #f5576c)
- **Success**: Cyan gradient (#4facfe → #00f2fe)
- **Warning**: Yellow gradient (#fa709a → #fee140)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing Scale
- XS: 0.25rem
- SM: 0.5rem
- MD: 1rem
- LG: 1.5rem
- XL: 2rem
- 2XL: 3rem

### Border Radius
- SM: 0.375rem
- MD: 0.5rem
- LG: 0.75rem
- XL: 1rem
- 2XL: 1.5rem

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Analytics (NEW)
- `GET /api/analytics/overview` - Overview stats
- `GET /api/analytics/appointments-trend` - Appointment trends
- `GET /api/analytics/user-growth` - User growth data
- `GET /api/analytics/professional-performance` - Professional metrics
- `GET /api/analytics/category-distribution` - Category stats

### Export (NEW)
- `GET /api/export/users` - Export users CSV
- `GET /api/export/appointments` - Export appointments CSV
- `GET /api/export/professionals` - Export professionals CSV

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Professionals
- `GET /api/professionals` - Get professionals
- `GET /api/professionals/:id` - Get professional details
- `POST /api/professionals` - Create professional profile
- `PUT /api/professionals/:id` - Update professional

---

## Database Schema

### Tables
1. **users** - User accounts (clients, professionals, admins)
2. **professionals** - Extended professional profiles
3. **appointments** - Appointment bookings
4. **working_hours** - Professional availability
5. **blocked_dates** - Professional blocked dates
6. **notifications** - User notifications

### Relationships
- Users → Professionals (1:1)
- Professionals → Appointments (1:N)
- Users → Appointments (1:N as clients)
- Professionals → Working Hours (1:N)
- Professionals → Blocked Dates (1:N)
- Users → Notifications (1:N)

---

## Getting Started

### Quick Start

1. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run init-db
   npm run dev
   ```

2. **Setup Admin Panel**
   ```bash
   cd admin_panel
   npm install
   npm run dev
   ```

3. **Access Application**
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs
   - Admin Panel: http://localhost:5173
   - Default Login: admin@example.com / admin123

### Detailed Setup
- Backend: See `backend/SETUP.md`
- Admin Panel: See `admin_panel/SETUP.md`

---

## Development Workflow

1. **Backend Development**
   - Make changes to routes/controllers
   - Server auto-restarts with nodemon
   - Test endpoints via Swagger or Postman

2. **Frontend Development**
   - Make changes to components/pages
   - Hot module replacement with Vite
   - See changes instantly in browser

3. **Database Changes**
   - Update `config/schema.sql`
   - Run `npm run init-db` to reset database
   - Or use PostgreSQL migrations

---

## Deployment

### Backend Deployment
- Use services like Heroku, Railway, or DigitalOcean
- Set environment variables
- Use managed PostgreSQL database
- Enable HTTPS

### Admin Panel Deployment
- Build: `npm run build`
- Deploy to Netlify, Vercel, or any static host
- Update API URL for production backend

---

## Security Considerations

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection

---

## Future Enhancements

- [ ] Email notifications
- [ ] SMS reminders
- [ ] Payment integration
- [ ] Calendar sync (Google, Outlook)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Automated backups

---

## Support & Documentation

- Backend API Docs: http://localhost:5000/api-docs
- Backend Setup: `backend/SETUP.md`
- Admin Panel Setup: `admin_panel/SETUP.md`
- This Document: `PROJECT_STRUCTURE.md`
