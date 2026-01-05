# Admin Panel for Professionals

React-based admin panel for professionals to manage appointments, schedules, and profiles.

## 🚀 Quick Start

```bash
cd admin_panel
npm install
npm run dev
```

Access at: `http://localhost:5173`

## 📝 Default Login Credentials

- Email: `sarah.johnson@example.com`
- Password: `password123`

## ✅ What's Included

### Core Setup
- ✅ React 18 + Vite
- ✅ React Router v6 for navigation
- ✅ Axios for API calls
- ✅ React Toastify for notifications
- ✅ Date-fns for date handling
- ✅ React Icons for icons

### API Services
- ✅ Authentication service (login, logout)
- ✅ Professional service (profile, working hours, blocked dates)
- ✅ Appointment service (list, update, cancel)
- ✅ Axios interceptors for auth tokens

### Pages (To Be Completed)
- ⏳ Login Page
- ⏳ Dashboard
- ⏳ Appointments Management
- ⏳ Schedule Configuration
- ⏳ Profile Management

## 📂 Project Structure

```
admin_panel/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── common/             # Reusable components
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Dashboard.jsx       # Dashboard with stats
│   │   ├── Appointments.jsx    # Appointment management
│   │   ├── Schedule.jsx        # Schedule configuration
│   │   └── Profile.jsx         # Profile management
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   └── index.js            # API services
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints Used

### Authentication
- `POST /api/auth/login` - Professional login

### Professional
- `GET /api/professionals/:id` - Get profile
- `PUT /api/professionals/:id` - Update profile
- `PUT /api/professionals/:id/working-hours` - Update working hours
- `POST /api/professionals/:id/blocked-dates` - Add blocked date
- `DELETE /api/professionals/:id/blocked-dates/:dateId` - Remove blocked date

### Appointments
- `GET /api/appointments` - List appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🎨 Next Steps

### 1. Create Login Page (`src/pages/Login.jsx`)
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.user.role !== 'professional') {
        toast.error('Only professionals can access this panel');
        authService.logout();
        return;
      }
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Professional Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 2. Create Layout Component (`src/components/Layout.jsx`)
```jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
```

### 3. Create Sidebar Component (`src/components/Sidebar.jsx`)
```jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiClock, FiUser, FiLogOut } from 'react-icons/fi';
import { authService } from '../services';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>{user?.name}</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/appointments">
          <FiCalendar /> Appointments
        </NavLink>
        <NavLink to="/schedule">
          <FiClock /> Schedule
        </NavLink>
        <NavLink to="/profile">
          <FiUser /> Profile
        </NavLink>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut /> Logout
      </button>
    </aside>
  );
}
```

### 4. Create Dashboard (`src/pages/Dashboard.jsx`)
```jsx
import { useState, useEffect } from 'react';
import { appointmentService } from '../services';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    booked: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data.data);
      calculateStats(data.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    setStats({
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      booked: appointments.filter(a => a.status === 'booked').length,
      completed: appointments.filter(a => a.status === 'completed').length,
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Booked</h3>
          <p className="stat-number">{stats.booked}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
      </div>
      
      <h2>Today's Appointments</h2>
      <div className="appointments-list">
        {appointments.slice(0, 5).map(apt => (
          <div key={apt.id} className="appointment-card">
            <div>
              <strong>{apt.clientName}</strong>
              <p>{apt.purpose}</p>
            </div>
            <div>
              <span>{apt.time}</span>
              <span className={`status ${apt.status}`}>{apt.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Styling

Add basic CSS to `src/App.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f7fa;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar-header {
  margin-bottom: 30px;
}

.sidebar-header h2 {
  font-size: 20px;
  margin-bottom: 5px;
}

.sidebar-header p {
  font-size: 14px;
  opacity: 0.7;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
  background: #334155;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #3b82f6;
  margin-top: 8px;
}

.appointment-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.booked {
  background: #dbeafe;
  color: #1e40af;
}

.status.completed {
  background: #d1fae5;
  color: #065f46;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin-bottom: 24px;
  color: #1e293b;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.login-card button {
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-card button:hover {
  background: #2563eb;
}

.login-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## 🚀 Running the Admin Panel

1. Make sure backend is running: `cd backend && npm start`
2. Start admin panel: `cd admin_panel && npm run dev`
3. Login with professional credentials
4. Start managing appointments!

## 📝 TODO

- [ ] Complete all page components
- [ ] Add appointment filtering and search
- [ ] Implement schedule editor
- [ ] Add profile edit form
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Implement responsive design for mobile
- [ ] Add data export functionality
- [ ] Add analytics charts

## 🔗 Backend Integration

The admin panel connects to the backend at `http://localhost:5000/api`. Make sure the backend server is running before starting the admin panel.
